from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
OUT = PROJECT_ROOT / "data" / "processed" / "semantic_decisions" / "queues"

UNIT_TYPES = {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"}
UNIT_EDGE_TYPES = {"has_skill_unit", "has_knowledge_unit", "has_competence_unit"}


def compact_node(node: dict[str, Any]) -> dict[str, Any]:
    keep = [
        "id",
        "type",
        "label_et",
        "description",
        "subject",
        "grades",
        "school_stages",
        "linked_material_topics",
        "source_authority",
        "source_system",
        "review_status",
        "confidence",
    ]
    return {key: node[key] for key in keep if key in node and node[key] not in (None, "", [], {})}


def edge_index(edges: list[dict[str, Any]]) -> tuple[dict[str, list[dict[str, Any]]], dict[str, list[dict[str, Any]]]]:
    outgoing: dict[str, list[dict[str, Any]]] = defaultdict(list)
    incoming: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for edge in edges:
        outgoing[edge["source"]].append(edge)
        incoming[edge["target"]].append(edge)
    return outgoing, incoming


def node_label(nodes: dict[str, dict[str, Any]], node_id: str) -> str:
    return nodes.get(node_id, {}).get("label_et") or node_id


def linked_units_for_lo(nodes: dict[str, dict[str, Any]], outgoing: dict[str, list[dict[str, Any]]], lo_id: str) -> list[dict[str, str]]:
    rows = []
    for edge in outgoing.get(lo_id, []):
        if edge.get("type") in UNIT_EDGE_TYPES and edge["target"] in nodes:
            target = nodes[edge["target"]]
            rows.append({"id": target["id"], "type": target["type"], "label_et": target.get("label_et") or ""})
    return rows


def attached_outcomes_for_unit(nodes: dict[str, dict[str, Any]], incoming: dict[str, list[dict[str, Any]]], unit_id: str) -> list[dict[str, str]]:
    rows = []
    for edge in incoming.get(unit_id, []):
        if edge.get("type") in UNIT_EDGE_TYPES and nodes.get(edge["source"], {}).get("type") == "LearningOutcome":
            source = nodes[edge["source"]]
            rows.append({"id": source["id"], "label_et": source.get("label_et") or "", "subject": source.get("subject") or ""})
    return rows


def context_edges(nodes: dict[str, dict[str, Any]], outgoing: dict[str, list[dict[str, Any]]], incoming: dict[str, list[dict[str, Any]]], node_id: str) -> list[dict[str, str]]:
    rows = []
    for edge in outgoing.get(node_id, []):
        rows.append({"direction": "out", "type": edge.get("type") or "", "other_id": edge["target"], "other_label": node_label(nodes, edge["target"]), "method": edge.get("method") or ""})
    for edge in incoming.get(node_id, []):
        rows.append({"direction": "in", "type": edge.get("type") or "", "other_id": edge["source"], "other_label": node_label(nodes, edge["source"]), "method": edge.get("method") or ""})
    return rows


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    nodes_list = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    nodes = {node["id"]: node for node in nodes_list}
    outgoing, incoming = edge_index(edges)

    learning_outcomes = []
    for node in nodes_list:
        if node["type"] == "LearningOutcome":
            row = compact_node(node)
            row["current_units"] = linked_units_for_lo(nodes, outgoing, node["id"])
            learning_outcomes.append(row)

    units = []
    for node in nodes_list:
        if node["type"] in UNIT_TYPES:
            row = compact_node(node)
            row["attached_learning_outcomes"] = attached_outcomes_for_unit(nodes, incoming, node["id"])
            units.append(row)

    unresolved_topics = []
    for node in nodes_list:
        if node["type"] != "Topic":
            continue
        has_lo = any(edge.get("type") == "has_learning_outcome" and nodes.get(edge["target"], {}).get("type") == "LearningOutcome" for edge in outgoing.get(node["id"], []))
        if not has_lo:
            row = compact_node(node)
            row["context_edges"] = context_edges(nodes, outgoing, incoming, node["id"])
            unresolved_topics.append(row)

    unresolved_criteria = []
    for node in nodes_list:
        if node["type"] not in {"AssessmentCriterion", "CriterionDimension"}:
            continue
        has_unit = any(edge.get("type") == "criterion_measures_unit" and nodes.get(edge["target"], {}).get("type") in UNIT_TYPES for edge in outgoing.get(node["id"], []))
        if not has_unit:
            row = compact_node(node)
            row["context_edges"] = context_edges(nodes, outgoing, incoming, node["id"])
            unresolved_criteria.append(row)

    unresolved_tasks = []
    for node in nodes_list:
        if node["type"] != "TaskSubtype":
            continue
        has_unit = any(edge.get("type") in {"assesses", "practices"} and nodes.get(edge["target"], {}).get("type") in UNIT_TYPES for edge in outgoing.get(node["id"], []))
        if not has_unit:
            row = compact_node(node)
            row["context_edges"] = context_edges(nodes, outgoing, incoming, node["id"])
            unresolved_tasks.append(row)

    unlinked_units = []
    for node in nodes_list:
        if node["type"] not in UNIT_TYPES:
            continue
        has_lo = any(edge.get("type") in UNIT_EDGE_TYPES and nodes.get(edge["source"], {}).get("type") == "LearningOutcome" for edge in incoming.get(node["id"], []))
        if not has_lo:
            row = compact_node(node)
            row["context_edges"] = context_edges(nodes, outgoing, incoming, node["id"])
            unlinked_units.append(row)

    common = {
        "decision_schema": {
            "source_id": "node id being adjudicated",
            "source_label": "human label",
            "decision": "link | no_focus_edge | remove_from_focus | same_as | narrower_than | broader_than",
            "target_id": "target node id for link/same_as/narrower/broader decisions",
            "target_label": "target label",
            "edge_type": "has_learning_outcome | has_skill_unit | has_knowledge_unit | has_competence_unit | criterion_measures_unit | assesses | practices | same_as | narrower_than | broader_than",
            "confidence": "0.0-1.0",
            "rationale": "short semantic reason; no keyword-only rationales",
        },
        "instructions": [
            "Do not decide links by keyword overlap or embedding similarity. Use curriculum semantics: what a teacher would say this topic/task/criterion actually develops or assesses.",
            "Prefer fewer, meaningful edges over many weak edges.",
            "If a node is a full prompt, rubric explanation, truncation, or source artifact rather than a reusable curriculum category, mark remove_from_focus.",
            "If a link would only say 'belongs to the subject' or 'is vaguely related to text', mark no_focus_edge.",
            "Use confidence 0.55-0.69 for plausible mappings, 0.70-0.84 for strong curriculum-semantic mappings, and 0.85+ for near-direct mappings.",
        ],
    }

    write_json(OUT / "topic_learning_outcome_queue.json", {**common, "unresolved_topics": unresolved_topics, "learning_outcomes": learning_outcomes})
    write_json(OUT / "assessment_unit_queue.json", {**common, "unresolved_criteria": unresolved_criteria, "target_units": units})
    write_json(OUT / "task_unit_queue.json", {**common, "unresolved_tasks": unresolved_tasks, "target_units": units})
    write_json(OUT / "unit_learning_outcome_queue.json", {**common, "unlinked_units": unlinked_units, "learning_outcomes": learning_outcomes})

    print(
        json.dumps(
            {
                "topics": len(unresolved_topics),
                "criteria": len(unresolved_criteria),
                "tasks": len(unresolved_tasks),
                "unlinked_units": len(unlinked_units),
                "learning_outcomes": len(learning_outcomes),
                "units": len(units),
                "out": str(OUT),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
