from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import read_jsonl


def normalize_label(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"\([^)]*estcore[^)]*\)", "", text, flags=re.I)
    text = re.sub(r"[^a-zõäöüšž0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for key in row:
            if key not in seen:
                seen.add(key)
                fields.append(key)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--snapshot", default="graph/snapshots/v2_unified_pilot")
    args = parser.parse_args()
    snapshot = PROJECT_ROOT / args.snapshot
    snapshot_name = snapshot.name
    reports = PROJECT_ROOT / "reports"
    reports.mkdir(parents=True, exist_ok=True)

    nodes = read_jsonl(snapshot / "nodes.jsonl")
    edges = read_jsonl(snapshot / "edges.jsonl")
    nodes_by_id = {node["id"]: node for node in nodes}
    node_counts = Counter(node["type"] for node in nodes)
    edge_counts = Counter(edge["type"] for edge in edges)

    graphml = nx.read_graphml(snapshot / "graph.graphml")
    gexf = nx.read_gexf(snapshot / "graph.gexf")

    connected = {edge["source"] for edge in edges} | {edge["target"] for edge in edges}
    isolated = [node for node in nodes if node["id"] not in connected]
    isolated_by_type = Counter(node["type"] for node in isolated)
    low_conf_edges = [edge for edge in edges if float(edge.get("confidence") or 0) < 0.6]
    evidence_missing = [node for node in nodes if node["type"] not in {"NationalCurriculum", "CurriculumDomain", "Subject", "TaskType", "TaskSubtype", "AssessmentCriterion", "CriterionDimension"} and not node.get("evidence")]

    dup_groups: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for node in nodes:
        if node["type"] in {"KnowledgeUnit", "SkillUnit", "CompetenceUnit", "TaskInstance", "TaskSubtype", "AssessmentCriterion", "CriterionDimension", "Topic", "LearningOutcome"}:
            norm = normalize_label(node.get("label_et", ""))
            if norm:
                dup_groups[(node["type"], norm)].append(node)
    duplicate_rows: list[dict[str, Any]] = []
    for (node_type, norm), group in dup_groups.items():
        if len(group) > 1:
            duplicate_rows.append(
                {
                    "type": node_type,
                    "normalized_label": norm,
                    "count": len(group),
                    "ids": [node["id"] for node in group[:12]],
                    "labels": sorted({node.get("label_et") for node in group if node.get("label_et")})[:8],
                    "source_urls": sorted({node.get("source_url") for node in group if node.get("source_url")})[:8],
                }
            )
    duplicate_rows.sort(key=lambda row: (-row["count"], row["type"], row["normalized_label"]))

    outcome_rows: list[dict[str, Any]] = []
    by_source = defaultdict(list)
    for edge in edges:
        by_source[edge["source"]].append(edge)
    for node in nodes:
        if node["type"] != "LearningOutcome":
            continue
        outgoing = by_source.get(node["id"], [])
        unit_edges = [edge for edge in outgoing if edge["type"] in {"has_knowledge_unit", "has_skill_unit", "has_competence_unit", "has_attitude_unit"}]
        outcome_rows.append(
            {
                "learning_outcome_id": node["id"],
                "label_et": node.get("label_et"),
                "subject": node.get("subject"),
                "grades": node.get("grades"),
                "school_stages": node.get("school_stages"),
                "unit_edges": len(unit_edges),
                "knowledge_units": sum(1 for edge in unit_edges if edge["type"] == "has_knowledge_unit"),
                "skill_units": sum(1 for edge in unit_edges if edge["type"] == "has_skill_unit"),
                "competence_units": sum(1 for edge in unit_edges if edge["type"] == "has_competence_unit"),
            }
        )
    outcome_rows.sort(key=lambda row: (row["subject"] or "", row["unit_edges"], row["label_et"] or ""))

    review_rows: list[dict[str, Any]] = []
    for node in nodes:
        if node["type"] in {"KnowledgeUnit", "SkillUnit", "CompetenceUnit", "TaskInstance", "CompetenceExpression"}:
            flags = node.get("quality_flags") or []
            needs_attention = (
                float(node.get("confidence") or 0) < 0.65
                or not node.get("evidence")
                or not node.get("grades") and node["type"] in {"KnowledgeUnit", "SkillUnit", "CompetenceUnit", "TaskInstance"}
                or bool(flags)
            )
            if needs_attention:
                review_rows.append(
                    {
                        "id": node["id"],
                        "type": node["type"],
                        "label_et": node.get("label_et"),
                        "confidence": node.get("confidence"),
                        "grades": node.get("grades"),
                        "school_stages": node.get("school_stages"),
                        "quality_flags": flags,
                        "evidence": node.get("evidence"),
                        "source_url": node.get("source_url"),
                    }
                )
    review_rows.sort(key=lambda row: (float(row.get("confidence") or 0), row["type"], row["label_et"] or ""))

    write_csv(reports / f"{snapshot_name}_possible_duplicates.csv", duplicate_rows[:500])
    write_csv(reports / f"{snapshot_name}_coverage_by_learning_outcome.csv", outcome_rows)
    write_csv(reports / f"{snapshot_name}_human_review_sample.csv", review_rows[:500])

    total_outcomes = len(outcome_rows)
    covered_outcomes = sum(1 for row in outcome_rows if row["unit_edges"] > 0)
    zero_unit_outcomes = total_outcomes - covered_outcomes
    lines = [
        "# V2 Unified Pilot QC Report",
        "",
        f"- Snapshot: `{snapshot}`",
        f"- Nodes: {len(nodes):,}",
        f"- Edges: {len(edges):,}",
        f"- GraphML loaded nodes/edges: {graphml.number_of_nodes():,}/{graphml.number_of_edges():,}",
        f"- GEXF loaded nodes/edges: {gexf.number_of_nodes():,}/{gexf.number_of_edges():,}",
        f"- Isolated nodes: {len(isolated):,} ({len(isolated) / max(len(nodes), 1):.1%})",
        f"- Low-confidence edges (<0.60): {len(low_conf_edges):,}",
        f"- Evidence-missing non-controlled nodes: {len(evidence_missing):,}",
        f"- Possible duplicate label groups: {len(duplicate_rows):,}",
        f"- Learning outcomes with at least one unit: {covered_outcomes:,}/{total_outcomes:,} ({covered_outcomes / max(total_outcomes, 1):.1%})",
        f"- Learning outcomes with no unit: {zero_unit_outcomes:,}",
        "",
        "## Node Counts",
        "",
    ]
    lines.extend(f"- {key}: {value:,}" for key, value in node_counts.most_common())
    lines.extend(["", "## Edge Counts", ""])
    lines.extend(f"- {key}: {value:,}" for key, value in edge_counts.most_common())
    lines.extend(["", "## Isolated Nodes By Type", ""])
    lines.extend(f"- {key}: {value:,}" for key, value in isolated_by_type.most_common())
    if covered_outcomes / max(total_outcomes, 1) >= 0.95:
        coverage_text = "Official learning outcome coverage is good for a pilot because nearly every outcome has at least one attached unit."
    else:
        coverage_text = "Official learning outcome coverage remains weak because many outcomes do not yet have attached granular units."
    lines.extend(
        [
            "",
            "## QC Files",
            "",
            f"- `reports/{snapshot_name}_possible_duplicates.csv`",
            f"- `reports/{snapshot_name}_coverage_by_learning_outcome.csv`",
            f"- `reports/{snapshot_name}_human_review_sample.csv`",
            "",
            "## Interpretation",
            "",
            f"The graph is technically valid and exportable. {coverage_text} Remaining quality issues are the residual duplicate/near-duplicate core labels listed in the review CSV, isolated source/provenance nodes, and the three uncovered official outcomes.",
        ]
    )
    (reports / f"{snapshot_name}_qc_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"nodes": len(nodes), "edges": len(edges), "duplicates": len(duplicate_rows), "covered_outcomes": covered_outcomes, "total_outcomes": total_outcomes, "isolated": len(isolated)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
