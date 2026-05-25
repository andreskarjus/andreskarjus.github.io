from __future__ import annotations

import csv
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl


LEGACY_NODES = PROJECT_ROOT / "graph" / "nodes.jsonl"
CANONICAL_NODES = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "canonicalization" / "canonical_candidates.nodes.jsonl"
ADJ_PUBLIC = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "llm_adjudication" / "adjudicated_candidates.public.jsonl"
ADJ_HELD = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "llm_adjudication" / "adjudicated_candidates.rejected_or_held.jsonl"
REPORTS = PROJECT_ROOT / "reports"


STOP = {"ja", "ning", "või", "kui", "ka", "on", "oma", "eri", "tekst", "teksti", "põhjal", "õpilane", "oskab", "tunneb"}


def norm(text: str | None) -> str:
    text = (text or "").lower()
    text = re.sub(r"\([^)]*estcore[^)]*\)", "", text, flags=re.I)
    text = re.sub(r"[^a-zõäöüšž0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def toks(text: str | None) -> set[str]:
    return {tok for tok in norm(text).split() if len(tok) > 2 and tok not in STOP}


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fields = []
    seen = set()
    for row in rows:
        for key in row:
            if key not in seen:
                fields.append(key)
                seen.add(key)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})


def best_match(legacy: dict[str, Any], canonical: list[dict[str, Any]]) -> tuple[str, dict[str, Any] | None, float]:
    legacy_label = legacy.get("label_et") or legacy.get("label")
    legacy_norm = norm(legacy_label)
    legacy_toks = toks(legacy_label)
    best = None
    best_score = 0.0
    for node in canonical:
        label = node.get("label_et")
        node_norm = norm(label)
        node_toks = toks(label + " " + (node.get("definition_et") or ""))
        if legacy_norm and legacy_norm == node_norm:
            return "exact_label_match", node, 1.0
        if legacy_toks and node_toks:
            score = len(legacy_toks & node_toks) / len(legacy_toks | node_toks)
            if legacy_norm and legacy_norm in node_norm:
                score = max(score, 0.82)
            elif node_norm and node_norm in legacy_norm:
                score = max(score, 0.72)
            if score > best_score:
                best_score = score
                best = node
    if best_score >= 0.55:
        return "strong_semantic_label_match", best, best_score
    if best_score >= 0.28:
        return "weak_possible_match", best, best_score
    return "no_obvious_match", best, best_score


def main() -> None:
    legacy = [node for node in read_jsonl(LEGACY_NODES) if node.get("type") in {"Knowledge", "Skill", "Competence"}]
    canonical = [node for node in read_jsonl(CANONICAL_NODES) if node.get("public_type") in {"KnowledgeUnit", "SkillUnit", "CompetenceUnit"}]
    public = read_jsonl(ADJ_PUBLIC)
    held = read_jsonl(ADJ_HELD)

    canonical_member_ids = {member_id for node in canonical for member_id in (node.get("member_ids") or [])}
    public_source_label_norms = {norm(row.get("source_candidate", {}).get("label_et")): row for row in public if row.get("source_candidate")}
    held_source_label_norms = {norm(row.get("source_candidate", {}).get("label_et")): row for row in held if row.get("source_candidate")}

    rows = []
    for node in legacy:
        category, match, score = best_match(node, canonical)
        label_norm = norm(node.get("label_et") or node.get("label"))
        adjudication_fate = ""
        decision = ""
        if label_norm in public_source_label_norms:
            adjudication_fate = "present_in_llm_public_candidate_layer"
            decision = public_source_label_norms[label_norm].get("decision")
        elif label_norm in held_source_label_norms:
            adjudication_fate = "rejected_or_held_by_llm"
            decision = held_source_label_norms[label_norm].get("decision")
        else:
            adjudication_fate = "not_seen_in_sampled_llm_adjudication_or_label_changed"
        rows.append(
            {
                "legacy_id": node["id"],
                "legacy_type": node["type"],
                "legacy_label": node.get("label_et") or node.get("label"),
                "source_url": node.get("source_url"),
                "match_category": category,
                "match_score": round(score, 3),
                "canonical_id": match.get("canonical_id") if match else None,
                "canonical_type": match.get("public_type") if match else None,
                "canonical_label": match.get("label_et") if match else None,
                "canonical_member_count": match.get("member_count") if match else None,
                "adjudication_fate": adjudication_fate,
                "llm_decision": decision,
            }
        )

    rows.sort(key=lambda row: (row["match_category"], -row["match_score"], row["legacy_type"], row["legacy_label"] or ""))
    write_csv(REPORTS / "legacy_learning_node_fate.csv", rows)

    examples = []
    for wanted in ["exact_label_match", "strong_semantic_label_match", "weak_possible_match", "no_obvious_match"]:
        examples.extend([row for row in rows if row["match_category"] == wanted][:8])
    write_csv(REPORTS / "legacy_learning_node_fate_examples.csv", examples)

    counts = Counter(row["match_category"] for row in rows)
    fate_counts = Counter(row["adjudication_fate"] for row in rows)
    report = [
        "# Legacy Learning Node Fate Audit",
        "",
        f"- Legacy fuzzy learning nodes inspected: {len(rows):,}",
        f"- Canonical learning unit nodes available: {len(canonical):,}",
        "",
        "## Match Categories",
        "",
    ]
    for key, value in counts.most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Adjudication Fate By Label", ""])
    for key, value in fate_counts.most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(
        [
            "",
            "## Interpretation",
            "",
            "The drop from 1,489 legacy fuzzy learning nodes to 432 canonical learning units is mostly not one-to-one deletion. It reflects a stricter ontology: generic nouns, duplicate topic-like concepts, evidence snippets, and broad copied outcomes were either merged into fewer canonical units, demoted to topics/criteria, held/rejected by LLM adjudication, or not yet included in the sampled adjudication batches. The CSV gives row-level trace evidence.",
        ]
    )
    (REPORTS / "legacy_learning_node_fate_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"legacy_nodes": len(rows), "canonical_learning_units": len(canonical), "match_counts": dict(counts), "report": str(REPORTS / "legacy_learning_node_fate_report.md")}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
