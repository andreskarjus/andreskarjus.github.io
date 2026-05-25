from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from typing import Any

import networkx as nx

from build_v2_unified_graph import xml_safe
from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"
GRAPH_VERSION = "v2_curriculum_focus_2026-05-21"
SCHEMA_VERSION = "kg_schema_v2_2026-05-20"


def edge_id(source: str, target: str, edge_type: str) -> str:
    return "edge:" + sha1_text(f"{source}|{target}|{edge_type}", 20)


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


def make_node(node_id: str, node_type: str, label: str, **extra: Any) -> dict[str, Any]:
    row = {
        "id": node_id,
        "type": node_type,
        "label_et": label,
        "status": "controlled",
        "confidence": 0.9,
        "evidence": [],
        "evidence_count": 0,
        "source_system": "level_backbone_cleanup",
        "source_authority": "internal_modeling",
        "source_url": None,
        "graph_version": GRAPH_VERSION,
        "schema_version": SCHEMA_VERSION,
        "review_status": "accepted_controlled",
        "kg_layer": "curriculum_backbone",
        "default_view": True,
        "provenance_mode": "metadata",
    }
    row.update(extra)
    return row


def make_edge(source: str, target: str, edge_type: str, method: str, confidence: float = 0.86, **extra: Any) -> dict[str, Any]:
    row = {
        "id": edge_id(source, target, edge_type),
        "source": source,
        "target": target,
        "type": edge_type,
        "confidence": confidence,
        "method": method,
        "evidence": [],
        "source_url": None,
        "source_authority": "internal_modeling",
        "graph_version": GRAPH_VERSION,
        "schema_version": SCHEMA_VERSION,
        "review_status": "accepted_controlled",
        "created_at": now_iso(),
        "kg_layer": "curriculum_backbone",
        "default_view": True,
        "provenance_mode": "metadata",
    }
    row.update(extra)
    return row


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    node_by_id = {node["id"]: node for node in nodes}
    edge_by_id = {edge["id"]: edge for edge in edges}

    added_nodes: list[dict[str, Any]] = []
    changed_nodes: list[dict[str, Any]] = []
    added_edges: list[dict[str, Any]] = []

    controlled_nodes = [
        make_node("stage:pohikool", "SchoolStage", "Põhikool", education_level_kind="school_level", grade_span="1.-9. klass"),
        make_node("stage:gumnaasium", "SchoolStage", "Gümnaasium", education_level_kind="school_level", grade_span="10.-12. klass"),
        make_node("grade:12_klass", "Grade", "12. klass", education_level_kind="exam_exit_grade", school_stage="Gümnaasium"),
    ]
    for node in controlled_nodes:
        existing = node_by_id.get(node["id"])
        if existing:
            old_label = existing.get("label_et")
            existing.update({k: v for k, v in node.items() if k not in {"id", "type"}})
            if old_label != existing.get("label_et"):
                changed_nodes.append({"id": node["id"], "type": node["type"], "old_label": old_label, "new_label": existing.get("label_et")})
        else:
            node_by_id[node["id"]] = node
            nodes.append(node)
            added_nodes.append(node)

    for node_id, label, kind, stage in [
        ("stage:iii_kooliaste", "III kooliaste", "pohikool_kooliaste", "Põhikool"),
        ("grade:7_klass", "7. klass", "grade", "III kooliaste"),
        ("grade:8_klass", "8. klass", "grade", "III kooliaste"),
        ("grade:9_klass", "9. klass", "exam_exit_grade", "III kooliaste"),
    ]:
        node = node_by_id.get(node_id)
        if not node:
            continue
        old = {"label_et": node.get("label_et"), "education_level_kind": node.get("education_level_kind")}
        node["label_et"] = label
        node["education_level_kind"] = kind
        node["school_stage"] = stage
        if node_id == "grade:9_klass":
            node["exam_focus"] = "põhikooli lõpueksam"
        if old["label_et"] != node.get("label_et") or old["education_level_kind"] != node.get("education_level_kind"):
            changed_nodes.append({"id": node_id, "type": node.get("type"), "old_label": old["label_et"], "new_label": node.get("label_et")})

    for node_id, label, exit_kind, stage_id, grade_id in [
        ("level:9_klass", "9. klass / põhikooli lõpueksami ootustase", "põhikooli_lõpueksam", "stage:iii_kooliaste", "grade:9_klass"),
        ("level:12_klass", "12. klass / gümnaasiumi riigieksami ootustase", "gümnaasiumi_riigieksam", "stage:gumnaasium", "grade:12_klass"),
    ]:
        node = node_by_id.get(node_id)
        if not node:
            continue
        old_label = node.get("label_et")
        node["label_et"] = label
        node["exit_level_kind"] = exit_kind
        node["exam_focus"] = True
        node["school_stage"] = node_by_id[stage_id]["label_et"]
        node["grade"] = node_by_id[grade_id]["label_et"]
        if old_label != label:
            changed_nodes.append({"id": node_id, "type": node.get("type"), "old_label": old_label, "new_label": label})

    edge_specs = [
        ("curriculum_domain:keel_ja_kirjandus", "stage:pohikool", "has_stage", "level_backbone_cleanup"),
        ("curriculum_domain:keel_ja_kirjandus", "stage:gumnaasium", "has_stage", "level_backbone_cleanup"),
        ("stage:pohikool", "stage:iii_kooliaste", "contains", "level_backbone_cleanup"),
        ("stage:gumnaasium", "grade:12_klass", "contains", "level_backbone_cleanup"),
        ("subject:eesti_keel", "stage:pohikool", "has_stage", "level_backbone_cleanup"),
        ("subject:eesti_keel", "stage:gumnaasium", "has_stage", "level_backbone_cleanup"),
        ("subject:kirjandus", "stage:pohikool", "has_stage", "level_backbone_cleanup"),
        ("subject:kirjandus", "stage:gumnaasium", "has_stage", "level_backbone_cleanup"),
        ("subject:eesti_keel", "grade:12_klass", "has_grade", "level_backbone_cleanup"),
        ("subject:kirjandus", "grade:12_klass", "has_grade", "level_backbone_cleanup"),
        ("level:12_klass", "stage:gumnaasium", "has_stage", "level_exit_alignment"),
        ("level:12_klass", "grade:12_klass", "has_grade", "level_exit_alignment"),
    ]
    for source, target, edge_type, method in edge_specs:
        if source not in node_by_id or target not in node_by_id:
            continue
        edge = make_edge(source, target, edge_type, method)
        if edge["id"] not in edge_by_id:
            edge_by_id[edge["id"]] = edge
            added_edges.append(edge)

    for node in nodes:
        if node.get("type") != "LevelExpectation":
            continue
        label = str(node.get("label_et") or "")
        if re.search(r"\bGümnaasium\b|12\.\s*klass|riigieksam", label, flags=re.I):
            old_stage = node.get("school_stage")
            old_grade = node.get("grade")
            node["school_stage"] = "Gümnaasium"
            node["grade"] = node.get("grade") or "12. klass"
            for target, edge_type in [("stage:gumnaasium", "has_stage"), ("grade:12_klass", "has_grade")]:
                edge = make_edge(node["id"], target, edge_type, "level_exit_alignment", confidence=0.74)
                if edge["id"] not in edge_by_id:
                    edge_by_id[edge["id"]] = edge
                    added_edges.append(edge)
            if old_stage != node.get("school_stage") or old_grade != node.get("grade"):
                changed_nodes.append({"id": node["id"], "type": node.get("type"), "old_label": label, "new_label": label})

    edges = list(edge_by_id.values())
    export(nodes, edges)

    write_csv(REPORTS / "level_backbone_cleanup_added_nodes.csv", added_nodes)
    write_csv(REPORTS / "level_backbone_cleanup_changed_nodes.csv", changed_nodes)
    write_csv(REPORTS / "level_backbone_cleanup_added_edges.csv", added_edges)
    report = [
        "# Level Backbone Cleanup",
        "",
        "- Clarified that `III kooliaste` is part of `Põhikool`, not the whole graph scope.",
        "- Added a `Gümnaasium` backbone node and a 12th-grade exit node for exam-focused visualization.",
        "- Kept level modeling intentionally coarse: this is an exam/exit-level layer, not a complete year-by-year progression model.",
        "- Existing `LevelExpectation` nodes for gümnaasium/12th-grade writing criteria are aligned to `Gümnaasium` and `12. klass`.",
        "",
        f"- Added nodes: {len(added_nodes):,}",
        f"- Changed node metadata/labels: {len(changed_nodes):,}",
        f"- Added edges: {len(added_edges):,}",
    ]
    (REPORTS / "level_backbone_cleanup_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"added_nodes": len(added_nodes), "changed_nodes": len(changed_nodes), "added_edges": len(added_edges)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
