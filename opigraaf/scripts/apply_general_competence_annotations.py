from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import networkx as nx

from build_v2_unified_graph import xml_safe
from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
DECISION_DIR = PROJECT_ROOT / "data" / "processed" / "semantic_decisions" / "general_competence"
REPORTS = PROJECT_ROOT / "reports"

UNIT_TYPES = {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"}
TASK_TYPES = {"TaskSubtype"}
GENERAL_COMPETENCE = "GeneralCompetence"


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


def load_definitions() -> dict[str, dict[str, Any]]:
    path = DECISION_DIR / "general_competence_definitions.json"
    rows = json.loads(path.read_text(encoding="utf-8"))
    return {row["id"]: row for row in rows}


def load_decisions() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for path in sorted(DECISION_DIR.glob("general_competence_batch_*.decisions.jsonl")):
        for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            if not line.strip():
                continue
            row = json.loads(line)
            row["_file"] = path.name
            row["_line"] = i
            rows.append(row)
    return rows


def validate(row: dict[str, Any], nodes: dict[str, dict[str, Any]]) -> str | None:
    if row.get("decision") != "link":
        return "unsupported_decision"
    source_id = str(row.get("source_id") or "")
    target_id = str(row.get("target_id") or "")
    edge_type = str(row.get("edge_type") or "")
    if source_id not in nodes:
        return "unknown_source_id"
    if target_id not in nodes:
        return "unknown_target_id"
    source_type = nodes[source_id].get("type")
    target_type = nodes[target_id].get("type")
    if source_type != GENERAL_COMPETENCE:
        return "source_not_general_competence"
    if edge_type == "has_supporting_unit" and target_type not in UNIT_TYPES:
        return "supporting_unit_target_not_unit"
    if edge_type == "has_supporting_task" and target_type not in TASK_TYPES:
        return "supporting_task_target_not_task"
    if edge_type not in {"has_supporting_unit", "has_supporting_task"}:
        return "unsupported_edge_type"
    return None


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    node_by_id = {node["id"]: node for node in nodes}
    edge_by_id = {edge["id"]: edge for edge in edges}
    definitions = load_definitions()

    updated_competence_nodes: list[dict[str, Any]] = []
    for comp_id, definition in definitions.items():
        node = node_by_id.get(comp_id)
        if not node:
            continue
        node["label_et"] = definition["label_et"]
        node["description"] = definition.get("short_definition")
        node["typical_language_literature_signals"] = definition.get("typical_language_literature_signals", [])
        node["kg_layer"] = "competence_overlay"
        node["default_view"] = True
        node["provenance_mode"] = "metadata"
        updated_competence_nodes.append(node)

    decisions = load_decisions()
    invalid: list[dict[str, Any]] = []
    accepted: list[dict[str, Any]] = []
    added_edges: list[dict[str, Any]] = []
    duplicate_edges = 0

    for row in decisions:
        error = validate(row, node_by_id)
        if error:
            invalid.append({**row, "error": error})
            continue
        source_id = row["source_id"]
        target_id = row["target_id"]
        edge_type = row["edge_type"]
        eid = edge_id(source_id, target_id, edge_type)
        try:
            confidence = float(row.get("confidence", 0.74))
        except (TypeError, ValueError):
            confidence = 0.74
        confidence = max(0.0, min(1.0, confidence))
        if eid in edge_by_id:
            duplicate_edges += 1
            edge_by_id[eid]["confidence"] = max(float(edge_by_id[eid].get("confidence") or 0), confidence)
            edge_by_id[eid]["method"] = "explicit_general_competence_adjudication"
            edge_by_id[eid]["source_authority"] = "llm_semantic_decision"
            edge_by_id[eid]["review_status"] = "accepted_semantic_decision"
            edge_by_id[eid]["kg_layer"] = "competence_overlay"
            edge_by_id[eid]["default_view"] = True
            edge_by_id[eid]["provenance_mode"] = "metadata"
            accepted.append(row)
            continue
        edge = {
            "id": eid,
            "source": source_id,
            "target": target_id,
            "type": edge_type,
            "confidence": confidence,
            "method": "explicit_general_competence_adjudication",
            "evidence": [],
            "source_url": node_by_id[source_id].get("source_url"),
            "source_authority": "llm_semantic_decision",
            "graph_version": "v2_curriculum_focus_2026-05-21",
            "schema_version": "kg_schema_v2_2026-05-20",
            "review_status": "accepted_semantic_decision",
            "created_at": now_iso(),
            "decision_file": row.get("_file"),
            "decision_line": row.get("_line"),
            "reason": row.get("rationale") or "",
            "kg_layer": "competence_overlay",
            "default_view": True,
            "provenance_mode": "metadata",
        }
        edge_by_id[eid] = edge
        added_edges.append(edge)
        accepted.append(row)

    edges = list(edge_by_id.values())
    export(nodes, edges)

    unit_or_task_ids = {node["id"] for node in nodes if node.get("type") in UNIT_TYPES | TASK_TYPES}
    covered_target_ids = {
        edge["target"]
        for edge in edges
        if edge.get("type") in {"has_supporting_unit", "has_supporting_task"}
        and node_by_id.get(edge.get("source"), {}).get("type") == GENERAL_COMPETENCE
        and edge.get("target") in unit_or_task_ids
    }
    uncovered = [node_by_id[node_id] for node_id in sorted(unit_or_task_ids - covered_target_ids)]

    competence_edge_counts = Counter()
    competence_target_counts: dict[str, Counter[str]] = defaultdict(Counter)
    for edge in edges:
        if edge.get("type") not in {"has_supporting_unit", "has_supporting_task"}:
            continue
        source = node_by_id.get(edge.get("source"), {})
        target = node_by_id.get(edge.get("target"), {})
        if source.get("type") != GENERAL_COMPETENCE:
            continue
        competence_edge_counts[edge["source"]] += 1
        competence_target_counts[edge["source"]][target.get("type") or ""] += 1

    write_csv(REPORTS / "general_competence_annotation_edges.csv", added_edges)
    write_csv(REPORTS / "general_competence_annotation_invalid.csv", invalid)
    write_csv(
        REPORTS / "general_competence_annotation_uncovered_targets.csv",
        [{"id": node["id"], "type": node["type"], "label_et": node.get("label_et")} for node in uncovered],
    )
    write_csv(
        REPORTS / "general_competence_annotation_nodes.csv",
        [
            {
                "id": node["id"],
                "label_et": node.get("label_et"),
                "description": node.get("description"),
                "edge_count": competence_edge_counts[node["id"]],
            }
            for node in updated_competence_nodes
        ],
    )

    report = [
        "# General Competence Annotation",
        "",
        "- `GeneralCompetence` nodes remain directly below `Riiklik õppekava` through `has_general_competence`.",
        "- Relevant curriculum units and task subtypes are linked below them with explicit semantic edges.",
        "- These edges are part of the same KG and marked `kg_layer=competence_overlay`; provenance stays as metadata.",
        "",
        f"- Decision rows read: {len(decisions):,}",
        f"- Accepted rows: {len(accepted):,}",
        f"- Invalid rows: {len(invalid):,}",
        f"- New competence support edges: {len(added_edges):,}",
        f"- Duplicate support edges updated/skipped: {duplicate_edges:,}",
        f"- Updated GeneralCompetence labels/descriptions: {len(updated_competence_nodes):,}",
        f"- Skill/knowledge/competence/task targets without general competence: {len(uncovered):,}",
        "",
        "## Edges By General Competence",
        "",
    ]
    for comp_id in sorted(definitions):
        definition = definitions[comp_id]
        counts = competence_target_counts[comp_id]
        report.append(
            f"- {definition['label_et']}: {competence_edge_counts[comp_id]:,} "
            f"(units {counts['SkillUnit'] + counts['KnowledgeUnit'] + counts['CompetenceUnit']:,}, tasks {counts['TaskSubtype']:,})"
        )
    (REPORTS / "general_competence_annotation_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "decision_rows": len(decisions),
                "accepted_rows": len(accepted),
                "invalid_rows": len(invalid),
                "added_edges": len(added_edges),
                "duplicates": duplicate_edges,
                "uncovered_targets": len(uncovered),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
