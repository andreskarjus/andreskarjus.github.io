from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Any

import networkx as nx

from build_v2_unified_graph import xml_safe
from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
DECISIONS = PROJECT_ROOT / "data" / "processed" / "semantic_decisions"
REPORTS = PROJECT_ROOT / "reports"

ALLOWED_LINK_EDGE_TYPES = {
    "has_learning_outcome",
    "has_skill_unit",
    "has_knowledge_unit",
    "has_competence_unit",
    "criterion_measures_unit",
    "assesses",
    "practices",
    "same_as",
    "narrower_than",
    "broader_than",
    "related_to",
}

LINK_DECISIONS = {"link", "same_as", "narrower_than", "broader_than", "related_to"}
NON_LINK_DECISIONS = {"no_focus_edge", "remove_from_focus"}


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fields: list[str] = []
    seen: set[str] = set()
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


def edge_id(source: str, target: str, edge_type: str) -> str:
    return "edge:" + sha1_text(f"{source}|{target}|{edge_type}", 20)


def repair_mojibake(text: Any) -> Any:
    if not isinstance(text, str):
        return text
    if "Ã" not in text and "Â" not in text:
        return text
    try:
        return text.encode("latin1").decode("utf-8")
    except UnicodeError:
        return text


def normalize_decision_text(row: dict[str, Any], nodes: dict[str, dict[str, Any]]) -> dict[str, Any]:
    row = {key: repair_mojibake(value) for key, value in row.items()}
    source_id = row.get("source_id")
    target_id = row.get("target_id")
    if source_id in nodes:
        row["source_label"] = nodes[source_id].get("label_et") or row.get("source_label") or ""
    if target_id in nodes:
        row["target_label"] = nodes[target_id].get("label_et") or row.get("target_label") or ""
    adjudicated_id = row.get("adjudicated_id")
    if adjudicated_id in nodes:
        row["adjudicated_label"] = nodes[adjudicated_id].get("label_et") or row.get("adjudicated_label") or ""
    return row


def export(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> None:
    write_jsonl(FOCUS / "nodes.jsonl", nodes)
    write_jsonl(FOCUS / "edges.jsonl", edges)
    write_csv(FOCUS / "nodes.csv", nodes)
    write_csv(FOCUS / "edges.csv", edges)

    graph = nx.MultiDiGraph()
    for node in nodes:
        graph.add_node(node["id"], **{k: xml_safe(v) for k, v in node.items() if k != "id"})
    for edge in edges:
        graph.add_edge(edge["source"], edge["target"], key=edge["id"], **{k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}})

    nx.write_graphml(graph, FOCUS / "graph.graphml")
    nx.write_gexf(graph, FOCUS / "graph.gexf")
    nx.read_graphml(FOCUS / "graph.graphml")
    nx.read_gexf(FOCUS / "graph.gexf")
    (FOCUS / "cytoscape_elements.json").write_text(
        json.dumps({"nodes": [{"data": n} for n in nodes], "edges": [{"data": e} for e in edges]}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_decisions() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for path in sorted(DECISIONS.glob("*.decisions.jsonl")):
        for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            if not line.strip():
                continue
            row = json.loads(line)
            row["_file"] = path.name
            row["_line"] = i
            rows.append(row)
    return rows


def validate_row(row: dict[str, Any], nodes: dict[str, dict[str, Any]]) -> str | None:
    decision = (row.get("decision") or "").strip()
    source_id = (row.get("source_id") or "").strip()
    target_id = (row.get("target_id") or "").strip()
    edge_type = (row.get("edge_type") or "").strip()
    if decision not in LINK_DECISIONS | NON_LINK_DECISIONS:
        return "unknown_decision"
    if not source_id:
        return "missing_source_id"
    if source_id not in nodes and decision != "link":
        return "unknown_source_id"
    if decision in LINK_DECISIONS:
        if source_id not in nodes:
            return "unknown_source_id"
        if target_id not in nodes:
            return "unknown_target_id"
        if edge_type not in ALLOWED_LINK_EDGE_TYPES:
            return "bad_edge_type"
        source_type = nodes[source_id]["type"]
        target_type = nodes[target_id]["type"]
        if edge_type == "has_learning_outcome" and (source_type != "Topic" or target_type != "LearningOutcome"):
            return "bad_topic_outcome_direction_or_type"
        if edge_type == "has_skill_unit" and (source_type != "LearningOutcome" or target_type != "SkillUnit"):
            return "bad_learning_outcome_skill_direction_or_type"
        if edge_type == "has_knowledge_unit" and (source_type != "LearningOutcome" or target_type != "KnowledgeUnit"):
            return "bad_learning_outcome_knowledge_direction_or_type"
        if edge_type == "has_competence_unit" and (source_type != "LearningOutcome" or target_type != "CompetenceUnit"):
            return "bad_learning_outcome_competence_direction_or_type"
        if edge_type == "criterion_measures_unit" and (source_type not in {"AssessmentCriterion", "CriterionDimension"} or target_type not in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"}):
            return "bad_criterion_unit_direction_or_type"
        if edge_type in {"assesses", "practices"} and (source_type != "TaskSubtype" or target_type not in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"}):
            return "bad_task_unit_direction_or_type"
        if edge_type in {"same_as", "narrower_than", "broader_than"} and source_type != target_type:
            return "cross_type_equivalence_or_hierarchy"
    return None


def main() -> None:
    nodes_list = read_jsonl(FOCUS / "nodes.jsonl")
    edges_list = read_jsonl(FOCUS / "edges.jsonl")
    nodes = {node["id"]: node for node in nodes_list}
    edges = {edge["id"]: edge for edge in edges_list}
    decisions = [normalize_decision_text(row, nodes) for row in load_decisions()]

    invalid: list[dict[str, Any]] = []
    invalid_keys: set[tuple[str | None, int | None]] = set()
    remove_nodes: set[str] = set()
    no_focus_rows: list[dict[str, Any]] = []
    accepted_rows: list[dict[str, Any]] = []

    for row in decisions:
        error = validate_row(row, nodes)
        if error:
            invalid.append({**row, "error": error})
            invalid_keys.add((row.get("_file"), row.get("_line")))
            continue
        decision = row["decision"]
        if decision == "remove_from_focus":
            remove_nodes.add(row["source_id"])
            accepted_rows.append(row)
        elif decision == "no_focus_edge":
            no_focus_rows.append(row)
            accepted_rows.append(row)

    added_edges: list[dict[str, Any]] = []
    duplicate_edges = 0
    skipped_removed = 0
    for row in decisions:
        if (row.get("_file"), row.get("_line")) in invalid_keys:
            continue
        decision = row.get("decision")
        if decision not in LINK_DECISIONS:
            continue
        source_id = row["source_id"]
        target_id = row["target_id"]
        if source_id in remove_nodes or target_id in remove_nodes:
            skipped_removed += 1
            continue
        edge_type = row["edge_type"]
        eid = edge_id(source_id, target_id, edge_type)
        if eid in edges:
            duplicate_edges += 1
            accepted_rows.append(row)
            continue
        try:
            confidence = float(row.get("confidence", 0.62))
        except (TypeError, ValueError):
            confidence = 0.62
        edges[eid] = {
            "id": eid,
            "source": source_id,
            "target": target_id,
            "type": edge_type,
            "confidence": max(0.0, min(1.0, confidence)),
            "method": "explicit_semantic_adjudication",
            "evidence": [],
            "source_url": None,
            "source_authority": "llm_semantic_decision",
            "graph_version": "v2_curriculum_focus_2026-05-21",
            "schema_version": "kg_schema_v2_2026-05-20",
            "review_status": "accepted_semantic_decision",
            "created_at": now_iso(),
            "decision_file": row.get("_file"),
            "decision_line": row.get("_line"),
            "reason": row.get("rationale") or "",
        }
        added_edges.append(edges[eid])
        accepted_rows.append(row)

    if remove_nodes:
        nodes_list = [node for node in nodes_list if node["id"] not in remove_nodes]
        edges = {eid: edge for eid, edge in edges.items() if edge["source"] not in remove_nodes and edge["target"] not in remove_nodes}

    edge_rows = list(edges.values())
    export(nodes_list, edge_rows)

    write_csv(REPORTS / "semantic_decisions_accepted.csv", accepted_rows)
    write_csv(REPORTS / "semantic_decisions_invalid.csv", invalid)
    write_csv(REPORTS / "semantic_decisions_removed_nodes.csv", [{"id": node_id, "label_et": nodes.get(node_id, {}).get("label_et"), "type": nodes.get(node_id, {}).get("type")} for node_id in sorted(remove_nodes)])
    write_csv(REPORTS / "semantic_decisions_added_edges.csv", added_edges)

    decision_counts = Counter(row.get("decision") for row in accepted_rows)
    edge_counts = Counter(edge["type"] for edge in added_edges)
    source_counts = Counter(row.get("_file") for row in decisions)
    report = [
        "# Explicit Semantic Decisions Applied",
        "",
        f"- Decision rows read: {len(decisions):,}",
        f"- Accepted decision rows: {len(accepted_rows):,}",
        f"- Invalid decision rows: {len(invalid):,}",
        f"- Added edges: {len(added_edges):,}",
        f"- Duplicate edges skipped: {duplicate_edges:,}",
        f"- Nodes removed from focus graph: {len(remove_nodes):,}",
        f"- Link rows skipped because source/target was removed: {skipped_removed:,}",
        "",
        "## Decisions By File",
        "",
    ]
    for key, count in source_counts.most_common():
        report.append(f"- `{key}`: {count:,}")
    report.extend(["", "## Accepted Decisions", ""])
    for key, count in decision_counts.most_common():
        report.append(f"- `{key}`: {count:,}")
    report.extend(["", "## Added Edge Types", ""])
    for key, count in edge_counts.most_common():
        report.append(f"- `{key}`: {count:,}")
    report.extend(
        [
            "",
            "These edges come from explicit semantic adjudication records. Candidate generation may use lexical cues to reduce work, but edge acceptance is recorded as a curriculum-semantic decision with a rationale.",
        ]
    )
    (REPORTS / "semantic_decisions_applied.md").write_text("\n".join(report) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "decisions": len(decisions),
                "accepted": len(accepted_rows),
                "invalid": len(invalid),
                "added_edges": len(added_edges),
                "removed_nodes": len(remove_nodes),
                "edge_counts": dict(edge_counts),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
