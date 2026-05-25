from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl, sha1_text, write_jsonl


BASE = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "canonicalization"
ADJUDICATED = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "llm_adjudication" / "adjudicated_candidates.public.jsonl"


def slug(text: str, max_len: int = 72) -> str:
    text = (text or "").lower()
    repl = {"õ": "o", "ä": "a", "ö": "o", "ü": "u", "š": "s", "ž": "z"}
    for src, dst in repl.items():
        text = text.replace(src, dst)
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    return text[:max_len].strip("_") or "unit"


def canonical_id(public_type: str, label: str, member_ids: list[str]) -> str:
    kind = re.sub(r"unit$", "", public_type.lower())
    key = "|".join(sorted(member_ids)) + "|" + label
    return f"canonical:{kind}:{slug(label)}:{sha1_text(key, 8)}"


def read_manifest() -> dict[str, Any]:
    return json.loads((BASE / "manifest.json").read_text(encoding="utf-8"))


def read_decisions(manifest: dict[str, Any]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for batch in manifest.get("batches", []):
        path = Path(batch["expected_output_path"])
        rows.extend(read_jsonl(path))
    return rows


def flatten_singletons(neighborhoods: list[dict[str, Any]], complex_ids: set[str]) -> list[dict[str, Any]]:
    nodes = []
    for neighborhood in neighborhoods:
        if neighborhood["neighborhood_id"] in complex_ids or neighborhood.get("size") != 1:
            continue
        member = neighborhood["candidate_records"][0]
        nodes.append(
            {
                "canonical_id": canonical_id(member["public_type"], member["label_et"], [member["id"]]),
                "public_type": member["public_type"],
                "label_et": member["label_et"],
                "definition_et": member.get("definition_et"),
                "grade_scope": member.get("grade_scope") or [],
                "member_ids": [member["id"]],
                "source_support": member.get("source_support") or "medium",
                "reason": "Singleton adjudicated candidate carried into canonical layer.",
                "canonicalization_method": "singleton_pass_through",
            }
        )
    return nodes


def normalize_agent_node(node: dict[str, Any]) -> dict[str, Any]:
    member_ids = node.get("member_ids") or []
    label = node.get("label_et") or node.get("canonical_label_et") or ""
    public_type = node.get("public_type") or "KnowledgeUnit"
    cid = node.get("canonical_id") or canonical_id(public_type, label, member_ids)
    if not str(cid).startswith("canonical:"):
        cid = canonical_id(public_type, label, member_ids)
    return {
        "canonical_id": cid,
        "public_type": public_type,
        "label_et": label,
        "definition_et": node.get("definition_et") or node.get("definition"),
        "grade_scope": node.get("grade_scope") or [],
        "member_ids": member_ids,
        "source_support": node.get("source_support") or "medium",
        "reason": node.get("reason"),
        "canonicalization_method": "llm_neighborhood_adjudication",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--allow-missing-decisions", action="store_true")
    args = parser.parse_args()

    manifest = read_manifest()
    neighborhoods = read_jsonl(BASE / "canonicalization_neighborhoods.all.jsonl")
    expected = {batch["batch"]: Path(batch["expected_output_path"]) for batch in manifest.get("batches", [])}
    missing = [str(path) for path in expected.values() if not path.exists()]
    if missing and not args.allow_missing_decisions:
        raise SystemExit("Missing canonicalization decision files: " + "; ".join(missing))

    decisions = read_decisions(manifest)
    complex_ids = {row.get("neighborhood_id") for row in decisions}
    canonical_nodes = flatten_singletons(neighborhoods, complex_ids)
    relations: list[dict[str, Any]] = []
    rejected_members: list[dict[str, Any]] = []

    for decision in decisions:
        neighborhood_id = decision.get("neighborhood_id")
        for node in decision.get("canonical_nodes") or []:
            row = normalize_agent_node(node)
            row["neighborhood_id"] = neighborhood_id
            row["decision"] = decision.get("decision")
            canonical_nodes.append(row)
        for rel in decision.get("relations") or []:
            rel = dict(rel)
            rel["neighborhood_id"] = neighborhood_id
            relations.append(rel)
        for member_id in decision.get("rejected_member_ids") or []:
            rejected_members.append({"neighborhood_id": neighborhood_id, "member_id": member_id, "reason": decision.get("notes")})

    adjudicated_by_id = {row["id"]: row for row in read_jsonl(ADJUDICATED)}
    enriched_nodes = []
    for node in canonical_nodes:
        evidence_ids = set()
        aligned_outcomes = set()
        source_urls = set()
        subjects = set()
        member_records = []
        for member_id in node.get("member_ids") or []:
            member = adjudicated_by_id.get(member_id)
            if not member:
                continue
            member_records.append(member)
            evidence_ids.update(member.get("evidence_ids") or [])
            source = member.get("source_candidate") or {}
            aligned_outcomes.update(source.get("aligned_learning_outcomes") or [])
            if source.get("source_url"):
                source_urls.add(source["source_url"])
            if source.get("subject"):
                subjects.add(source["subject"])
        node["evidence_ids"] = sorted(evidence_ids)
        node["aligned_learning_outcomes"] = sorted(aligned_outcomes)
        node["source_urls"] = sorted(source_urls)
        node["subjects"] = sorted(subjects)
        node["member_count"] = len(node.get("member_ids") or [])
        node["member_source_ids"] = [member.get("source_id") for member in member_records if member.get("source_id")]
        enriched_nodes.append(node)

    # Deduplicate canonical ids if an agent reused a label/id.
    seen = Counter()
    for node in enriched_nodes:
        seen[node["canonical_id"]] += 1
        if seen[node["canonical_id"]] > 1:
            node["canonical_id"] = node["canonical_id"] + f":{seen[node['canonical_id']]}"

    write_jsonl(BASE / "canonical_candidates.nodes.jsonl", enriched_nodes)
    write_jsonl(BASE / "canonical_candidates.relations.jsonl", relations)
    write_jsonl(BASE / "canonical_candidates.rejected_members.jsonl", rejected_members)

    report = [
        "# Canonical Candidate Layer",
        "",
        f"- Canonical nodes: {len(enriched_nodes):,}",
        f"- Relations: {len(relations):,}",
        f"- Rejected members: {len(rejected_members):,}",
        f"- Source adjudicated records: {len(adjudicated_by_id):,}",
        "",
        "## Canonical Nodes By Type",
        "",
    ]
    for key, value in Counter(node.get("public_type") for node in enriched_nodes).most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Methods", ""])
    for key, value in Counter(node.get("canonicalization_method") for node in enriched_nodes).most_common():
        report.append(f"- {key}: {value:,}")
    (PROJECT_ROOT / "reports" / "canonical_candidate_layer_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"canonical_nodes": len(enriched_nodes), "relations": len(relations), "rejected_members": len(rejected_members)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
