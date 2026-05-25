from __future__ import annotations

import argparse
import math
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

import numpy as np
from rapidfuzz import fuzz

from common import (
    ROOT,
    evidence_id,
    graph_edge,
    normalize_for_match,
    read_jsonl,
    stable_id,
    tokenize_et,
    write_csv,
    write_jsonl,
)


SKILL_VERBS = {
    "analüüsib",
    "arutleb",
    "kasutab",
    "kirjutab",
    "loeb",
    "mõistab",
    "võrdleb",
    "selgitab",
    "koostab",
    "esitab",
    "hindab",
    "leiab",
    "eristab",
    "tõlgendab",
    "sõnastab",
    "põhjendab",
    "rakendab",
    "märgib",
    "parandab",
    "toimetab",
}


def classify_unit(label: str, verbs: list[str], concepts: list[dict[str, Any]]) -> str:
    first = normalize_for_match(label).split(" ")[:1]
    verb_values = {normalize_for_match(v).split(" ")[0] for v in verbs if normalize_for_match(v)}
    if first and first[0] in SKILL_VERBS:
        return "Skill"
    if verb_values & SKILL_VERBS:
        return "Skill"
    if len(concepts) >= 2 and not verbs:
        return "Knowledge"
    return "Skill"


def load_fasttext_subset(path: Path, vocab: set[str]) -> dict[str, np.ndarray]:
    vectors: dict[str, np.ndarray] = {}
    if not path.exists() or not vocab:
        return vectors
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        header = next(f, "")
        for line in f:
            if not vocab:
                break
            parts = line.rstrip().split(" ")
            if len(parts) < 301:
                continue
            word = parts[0]
            if word in vocab:
                try:
                    vectors[word] = np.asarray(parts[1:], dtype=np.float32)
                    vocab.remove(word)
                except ValueError:
                    continue
    return vectors


def mean_vector(tokens: list[str], vectors: dict[str, np.ndarray]) -> np.ndarray | None:
    rows = [vectors[t] for t in tokens if t in vectors]
    if not rows:
        return None
    vec = np.mean(rows, axis=0)
    norm = np.linalg.norm(vec)
    if norm == 0:
        return None
    return vec / norm


def cosine(a: np.ndarray | None, b: np.ndarray | None) -> float:
    if a is None or b is None:
        return 0.0
    return float(np.dot(a, b))


def make_candidates() -> list[dict[str, Any]]:
    outcomes = read_jsonl(ROOT / "data/interim/oppekava/learning_outcomes.jsonl")
    if not outcomes:
        outcomes = read_jsonl(ROOT / "data/interim/oppekava/pilot_learning_outcomes.jsonl")
    candidates = []
    for outcome in outcomes:
        ev = evidence_id(outcome.get("url") or outcome.get("ask_url", ""), outcome["label"])
        outcome_id = stable_id("outcome", outcome.get("url") or outcome["label"])
        unit_type = classify_unit(outcome["label"], outcome.get("verbs", []), outcome.get("concepts", []))
        candidates.append(
            {
                "id": stable_id("candidate", outcome["label"] + "|" + outcome.get("subject", "")),
                "label": outcome["label"],
                "type": unit_type,
                "subject": outcome.get("subject"),
                "grade": ", ".join(outcome.get("grades", [])) or None,
                "school_stage": ", ".join(outcome.get("school_stages", [])) or None,
                "source_url": outcome.get("url"),
                "source_label": outcome["label"],
                "aligned_outcomes": [outcome_id],
                "knowledge_ids": [stable_id("knowledge", c.get("url") or c["label"]) for c in outcome.get("concepts", []) if c.get("label")],
                "tokens": tokenize_et(outcome["label"]),
                "verbs": outcome.get("verbs", []),
                "topics": [t.get("label") for t in outcome.get("topics", []) if t.get("label")],
                "status": "candidate",
                "confidence": 0.76,
                "alignment_confidence": 0.82,
                "method": "rule",
                "evidence": [ev],
            }
        )
        for concept in outcome.get("concepts", []):
            if not concept.get("label"):
                continue
            candidates.append(
                {
                    "id": stable_id("candidate", "knowledge|" + concept["label"] + "|" + outcome.get("subject", "")),
                    "label": concept["label"],
                    "type": "Knowledge",
                    "subject": outcome.get("subject"),
                    "grade": ", ".join(outcome.get("grades", [])) or None,
                    "school_stage": ", ".join(outcome.get("school_stages", [])) or None,
                    "source_url": concept.get("url") or outcome.get("url"),
                    "source_label": outcome["label"],
                    "aligned_outcomes": [outcome_id],
                    "knowledge_ids": [],
                    "tokens": tokenize_et(concept["label"]),
                    "verbs": [],
                    "topics": [t.get("label") for t in outcome.get("topics", []) if t.get("label")],
                    "status": "candidate",
                    "confidence": 0.7,
                    "alignment_confidence": 0.74,
                    "method": "rule",
                    "evidence": [ev],
                }
            )
    return candidates


def extract_candidates_from_chunks(existing: list[dict[str, Any]]) -> list[dict[str, Any]]:
    chunks = []
    chunks.extend(read_jsonl(ROOT / "data/interim/curriculum/previous_chunks.jsonl"))
    chunks.extend(read_jsonl(ROOT / "data/interim/materials/previous_material_chunks.jsonl"))
    chunks.extend(read_jsonl(ROOT / "data/interim/materials/web_source_chunks.jsonl"))
    chunks.extend(read_jsonl(ROOT / "data/interim/materials/direct_source_chunks.jsonl"))
    chunks.extend(read_jsonl(ROOT / "data/interim/curriculum/chunks.jsonl"))
    chunks.extend(read_jsonl(ROOT / "data/interim/curriculum/direct_source_chunks.jsonl"))
    out = []
    seen = {normalize_for_match(c["label"]) + "|" + str(c.get("subject")) for c in existing}
    verb_re = re.compile(
        r"\b(analüüsib|arutleb|kasutab|kirjutab|loeb|mõistab|võrdleb|selgitab|koostab|esitab|hindab|leiab|eristab|tõlgendab|sõnastab|põhjendab|rakendab|toimetab|väärtustab|tunneb|teab|oskab)\b",
        re.I,
    )
    noun_signal_re = re.compile(
        r"\b(õigekiri|kirjavahemärgistus|teksti sidusus|tekstiliik|sõnavara|lauseehitus|vormimoodustus|argumentatsioon|allikakasutus|lugemisoskus|kirjutamisoskus)\b",
        re.I,
    )
    for chunk in chunks:
        text = chunk.get("text", "")
        parts = re.split(r"[\n;•]+|(?<=\.)\s+(?=[A-ZÕÄÖÜŠŽ])", text)
        for part in parts:
            label = clean = re.sub(r"^\s*[-*\d.)]+\s*", "", part).strip()
            label = re.sub(r"\s+", " ", label)
            if not (18 <= len(label) <= 220):
                continue
            if not (verb_re.search(label) or noun_signal_re.search(label)):
                continue
            # Avoid swallowing whole explanatory paragraphs as units.
            if len(label.split()) > 24:
                continue
            subject = (chunk.get("subjects") or [chunk.get("subject") or "Eesti keel"])[0]
            key = normalize_for_match(label) + "|" + subject
            if key in seen:
                continue
            seen.add(key)
            unit_type = "Knowledge" if noun_signal_re.search(label) and not verb_re.search(label) else "Skill"
            ev = evidence_id(chunk.get("source_url", ""), label)
            out.append(
                {
                    "id": stable_id("candidate", label + "|" + subject),
                    "label": label,
                    "type": unit_type,
                    "subject": subject,
                    "grade": None,
                    "school_stage": chunk.get("school_stage"),
                    "source_url": chunk.get("source_url"),
                    "source_label": chunk.get("source_file") or chunk.get("source_url"),
                    "aligned_outcomes": [],
                    "knowledge_ids": [],
                    "tokens": tokenize_et(label),
                    "verbs": [],
                    "topics": [],
                    "status": "candidate",
                    "confidence": 0.58,
                    "alignment_confidence": 0.0,
                    "method": "chunk_rule",
                    "evidence": [ev],
                }
            )
            if len(out) >= 2500:
                return out
    return out


def canonicalize(candidates: list[dict[str, Any]], use_fasttext: bool, fasttext_path: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    vocab = {tok for c in candidates for tok in c.get("tokens", [])}
    vectors = load_fasttext_subset(fasttext_path, set(vocab)) if use_fasttext else {}
    for cand in candidates:
        cand["_vector"] = mean_vector(cand.get("tokens", []), vectors) if vectors else None

    clusters: list[list[dict[str, Any]]] = []
    decisions = []
    by_block = defaultdict(list)
    for cand in candidates:
        topic = cand.get("topics", [""])[0] if cand.get("topics") else ""
        verb = normalize_for_match(cand["label"]).split(" ")[0] if normalize_for_match(cand["label"]) else ""
        block = (cand.get("subject"), cand.get("type"), topic, verb[:5])
        by_block[block].append(cand)

    for block_items in by_block.values():
        for cand in block_items:
            best_cluster = None
            best_score = 0.0
            for cluster in clusters:
                rep = cluster[0]
                if rep.get("subject") != cand.get("subject") or rep.get("type") != cand.get("type"):
                    continue
                lexical = fuzz.token_set_ratio(rep["label"], cand["label"]) / 100
                semantic = cosine(rep.get("_vector"), cand.get("_vector"))
                score = max(lexical, semantic)
                if score > best_score:
                    best_score = score
                    best_cluster = cluster
            if best_cluster is not None and best_score >= 0.9:
                best_cluster.append(cand)
                decisions.append({"candidate_id": cand["id"], "decision": "merged_into_cluster", "score": round(best_score, 3), "representative": best_cluster[0]["id"]})
            else:
                clusters.append([cand])
                decisions.append({"candidate_id": cand["id"], "decision": "new_cluster", "score": round(best_score, 3)})

    canonical = []
    for idx, cluster in enumerate(clusters, start=1):
        # Prefer the longest action/object label as the canonical wording.
        rep = sorted(cluster, key=lambda c: (len(c.get("tokens", [])), len(c["label"])), reverse=True)[0]
        cid = stable_id("canonical", rep["label"] + "|" + (rep.get("subject") or ""))
        evs = sorted({ev for c in cluster for ev in c.get("evidence", [])})
        aligned = sorted({oid for c in cluster for oid in c.get("aligned_outcomes", [])})
        knowledge_ids = sorted({kid for c in cluster for kid in c.get("knowledge_ids", [])})
        canonical.append(
            {
                "canonical_id": cid,
                "cluster_id": f"cluster:{idx}",
                "label": rep["label"],
                "type": rep["type"],
                "subject": rep.get("subject"),
                "grade": rep.get("grade"),
                "school_stage": rep.get("school_stage"),
                "source_url": rep.get("source_url"),
                "status": "canonical" if len(cluster) > 1 else "candidate",
                "confidence": min(0.92, 0.7 + 0.04 * len(cluster)),
                "alignment_confidence": min(0.9, 0.74 + 0.02 * len(aligned)),
                "method": "embedding" if use_fasttext and vectors else "heuristic",
                "evidence": evs,
                "aligned_outcomes": aligned,
                "knowledge_ids": knowledge_ids,
                "member_count": len(cluster),
                "member_ids": [c["id"] for c in cluster],
            }
        )
    for cand in candidates:
        cand.pop("_vector", None)
    return canonical, decisions


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--use-fasttext", action="store_true")
    parser.add_argument("--fasttext-path", default=r"C:\Users\andres.karjus\Downloads\cc.et.300.vec\cc.et.300.vec")
    args = parser.parse_args()

    candidates = make_candidates()
    candidates.extend(extract_candidates_from_chunks(candidates))
    canonical, decisions = canonicalize(candidates, args.use_fasttext, Path(args.fasttext_path))
    write_jsonl(ROOT / "data/interim/candidates/candidate_units.jsonl", candidates)
    write_jsonl(ROOT / "data/processed/canonical_units.jsonl", canonical)
    write_jsonl(ROOT / "data/processed/canonicalization_decisions.jsonl", decisions)

    review = [d for d in decisions if 0.82 <= d.get("score", 0) < 0.9][:500]
    write_csv(ROOT / "reports/merge_review_queue.csv", review)
    report = [
        "# Candidate Extraction And Canonicalization Report",
        "",
        f"- Candidate units: {len(candidates)}",
        f"- Canonical units/clusters: {len(canonical)}",
        f"- Decisions: {len(decisions)}",
        f"- FastText requested: {args.use_fasttext}",
        f"- FastText path: {args.fasttext_path}",
        "",
        "The first pass treats oppekava outcomes as skill-like candidates and their semantic-relation concepts as knowledge candidates.",
    ]
    (ROOT / "reports/candidate_extraction_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    (ROOT / "reports/canonicalization_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"Extracted {len(candidates)} candidates and {len(canonical)} canonical units")


if __name__ == "__main__":
    main()
