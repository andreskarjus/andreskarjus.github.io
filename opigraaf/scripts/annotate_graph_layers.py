from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any

import networkx as nx

from build_v2_unified_graph import xml_safe
from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"


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


def content_layer_for_node(node: dict[str, Any]) -> str:
    if node["type"] in {"NationalCurriculum", "CurriculumDomain", "Subject", "SchoolStage", "Grade"}:
        return "curriculum_backbone"
    if node["type"] in {"LearningOutcome", "Topic", "KnowledgeUnit", "SkillUnit", "CompetenceUnit"}:
        return "curriculum_content"
    if node["type"] in {"AssessmentCriterion", "CriterionDimension", "TaskType", "TaskSubtype", "LevelExpectation"}:
        return "assessment_task"
    if node["type"] in {"GeneralCompetence", "TransversalTheme", "StageCompetenceExpectation", "DomainCompetence"}:
        return "competence_overlay"
    return "other"


def content_layer_for_edge(edge: dict[str, Any]) -> str:
    if edge["type"] in {"contains", "has_subject", "has_stage", "has_grade", "part_of"}:
        return "curriculum_backbone"
    if edge["type"] in {"has_learning_outcome", "has_topic", "has_skill_unit", "has_knowledge_unit", "has_competence_unit"}:
        return "curriculum_content"
    if edge["type"] in {"criterion_measures_unit", "criterion_applies_to_task", "assesses", "practices", "has_dimension", "has_criterion", "has_task_subtype", "has_task_type"}:
        return "assessment_task"
    if edge["type"] in {"has_general_competence", "has_transversal_theme", "has_stage_competence_expectation", "has_domain_competence", "has_supporting_unit", "has_supporting_task"}:
        return "competence_overlay"
    if edge["type"] in {"same_as", "narrower_than", "broader_than", "related_to", "supports_progression_to"}:
        return "canonicalization"
    return "other"


def provenance_mode(row: dict[str, Any]) -> str:
    has_source = bool(row.get("source_url") or row.get("source_authority") or row.get("source_system"))
    has_evidence = bool(row.get("evidence"))
    if has_evidence:
        return "metadata_with_evidence"
    if has_source:
        return "metadata"
    return "none"


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


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    for node in nodes:
        node["kg_layer"] = content_layer_for_node(node)
        node["default_view"] = True
        node["provenance_mode"] = provenance_mode(node)
    for edge in edges:
        edge["kg_layer"] = content_layer_for_edge(edge)
        edge["default_view"] = True
        edge["provenance_mode"] = provenance_mode(edge)
    export(nodes, edges)
    report = [
        "# Graph Layer Annotation",
        "",
        "- Annotated current KG exports with `kg_layer`, `default_view`, and `provenance_mode`.",
        "- This keeps one KG: provenance is metadata/source-layer information over the same nodes and edges, not a separate graph product.",
        "- Visualizers should use `kg_layer` for curriculum/assessment/competence toggles and `provenance_mode` for source/evidence affordances.",
    ]
    (REPORTS / "graph_layer_annotation.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"nodes": len(nodes), "edges": len(edges)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
