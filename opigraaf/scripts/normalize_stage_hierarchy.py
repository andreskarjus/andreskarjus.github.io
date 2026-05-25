from __future__ import annotations

import csv
import json
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

DROP_NODES = {"stage:pohikool"}
REWIRE_NODE_IDS = {"stage:gumnaasium": "stage:iv_kooliaste"}


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


def make_edge(source: str, target: str, edge_type: str, method: str, confidence: float = 0.86) -> dict[str, Any]:
    return {
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


def normalize_edge_endpoint(node_id: str) -> str:
    return REWIRE_NODE_IDS.get(node_id, node_id)


def main() -> None:
    old_nodes = read_jsonl(FOCUS / "nodes.jsonl")
    old_edges = read_jsonl(FOCUS / "edges.jsonl")

    changed_nodes: list[dict[str, Any]] = []
    removed_nodes: list[dict[str, Any]] = []
    nodes: list[dict[str, Any]] = []
    for node in old_nodes:
        if node["id"] in DROP_NODES:
            removed_nodes.append(node)
            continue
        old_id = node["id"]
        if old_id in REWIRE_NODE_IDS:
            node = dict(node)
            node["id"] = REWIRE_NODE_IDS[old_id]
            node["label_et"] = "IV kooliaste"
            node["raw_label_et"] = old_id
            node["education_level_kind"] = "kooliaste"
            node["grade_span"] = "10.-12. klass"
            node["school_stage"] = "Gümnaasium"
            node["source_system"] = "stage_hierarchy_normalization"
            node["source_authority"] = "internal_modeling"
            node["review_status"] = "accepted_controlled"
            changed_nodes.append({"old_id": old_id, "new_id": node["id"], "old_label": old_nodes[[n["id"] for n in old_nodes].index(old_id)].get("label_et"), "new_label": node["label_et"]})
        elif old_id == "stage:iii_kooliaste":
            node = dict(node)
            old_label = node.get("label_et")
            node["label_et"] = "III kooliaste"
            node["education_level_kind"] = "kooliaste"
            node["grade_span"] = "7.-9. klass"
            node["school_stage"] = "Põhikool"
            node["review_status"] = "accepted_controlled"
            changed_nodes.append({"old_id": old_id, "new_id": old_id, "old_label": old_label, "new_label": node["label_et"]})
        elif old_id in {"grade:7_klass", "grade:8_klass", "grade:9_klass"}:
            node = dict(node)
            node["school_stage"] = "III kooliaste"
            if old_id == "grade:9_klass":
                node["education_level_kind"] = "exam_exit_grade"
                node["exam_focus"] = "põhikooli lõpueksam"
        elif old_id == "grade:12_klass":
            node = dict(node)
            node["school_stage"] = "IV kooliaste"
            node["education_level_kind"] = "exam_exit_grade"
            node["exam_focus"] = "gümnaasiumi riigieksam"
        elif old_id == "level:12_klass":
            node = dict(node)
            node["school_stage"] = "IV kooliaste"
            node["grade"] = "12. klass"
            node["label_et"] = "12. klass / gümnaasiumi riigieksami ootustase"
            node["exit_level_kind"] = "gümnaasiumi_riigieksam"
            node["exam_focus"] = True
        elif old_id == "level:9_klass":
            node = dict(node)
            node["school_stage"] = "III kooliaste"
            node["grade"] = "9. klass"
            node["label_et"] = "9. klass / põhikooli lõpueksami ootustase"
            node["exit_level_kind"] = "põhikooli_lõpueksam"
            node["exam_focus"] = True
        else:
            node = dict(node)
            if node.get("type") == "LevelExpectation" and str(node.get("school_stage")) == "Gümnaasium":
                node["school_stage"] = "IV kooliaste"
        nodes.append(node)

    node_ids = {node["id"] for node in nodes}
    edge_by_id: dict[str, dict[str, Any]] = {}
    removed_edges: list[dict[str, Any]] = []
    for old_edge in old_edges:
        source = normalize_edge_endpoint(old_edge["source"])
        target = normalize_edge_endpoint(old_edge["target"])
        if source in DROP_NODES or target in DROP_NODES:
            removed_edges.append(old_edge)
            continue
        if source not in node_ids or target not in node_ids:
            removed_edges.append(old_edge)
            continue
        edge = dict(old_edge)
        edge["source"] = source
        edge["target"] = target
        edge["id"] = edge_id(source, target, edge["type"])
        if old_edge["source"] != source or old_edge["target"] != target:
            edge["method"] = "stage_hierarchy_normalization"
            edge["review_status"] = "accepted_controlled"
            edge["source_authority"] = "internal_modeling"
        edge_by_id[edge["id"]] = edge

    required_edges = [
        ("curriculum_domain:keel_ja_kirjandus", "stage:iii_kooliaste", "has_stage"),
        ("curriculum_domain:keel_ja_kirjandus", "stage:iv_kooliaste", "has_stage"),
        ("subject:eesti_keel", "stage:iii_kooliaste", "has_stage"),
        ("subject:eesti_keel", "stage:iv_kooliaste", "has_stage"),
        ("subject:kirjandus", "stage:iii_kooliaste", "has_stage"),
        ("subject:kirjandus", "stage:iv_kooliaste", "has_stage"),
        ("stage:iii_kooliaste", "grade:7_klass", "contains"),
        ("stage:iii_kooliaste", "grade:8_klass", "contains"),
        ("stage:iii_kooliaste", "grade:9_klass", "contains"),
        ("stage:iv_kooliaste", "grade:12_klass", "contains"),
        ("level:9_klass", "stage:iii_kooliaste", "has_stage"),
        ("level:9_klass", "grade:9_klass", "has_grade"),
        ("level:12_klass", "stage:iv_kooliaste", "has_stage"),
        ("level:12_klass", "grade:12_klass", "has_grade"),
    ]
    added_edges: list[dict[str, Any]] = []
    for source, target, edge_type in required_edges:
        if source not in node_ids or target not in node_ids:
            continue
        edge = make_edge(source, target, edge_type, "stage_hierarchy_normalization")
        if edge["id"] not in edge_by_id:
            edge_by_id[edge["id"]] = edge
            added_edges.append(edge)

    export(nodes, list(edge_by_id.values()))

    write_csv(REPORTS / "stage_hierarchy_normalization_removed_nodes.csv", removed_nodes)
    write_csv(REPORTS / "stage_hierarchy_normalization_changed_nodes.csv", changed_nodes)
    write_csv(REPORTS / "stage_hierarchy_normalization_removed_edges.csv", removed_edges)
    write_csv(REPORTS / "stage_hierarchy_normalization_added_edges.csv", added_edges)
    report = [
        "# Stage Hierarchy Normalization",
        "",
        "- Removed the extra `Põhikool` school-level node from the default hierarchy.",
        "- Replaced `Gümnaasium` as a same-level backbone node with `IV kooliaste`.",
        "- Current hierarchy is `III kooliaste -> 7./8./9. klass` and `IV kooliaste -> 12. klass`.",
        "- `9. klass` and `12. klass` remain exam-exit grade nodes under their stages, not sibling stages.",
        "",
        f"- Removed nodes: {len(removed_nodes):,}",
        f"- Changed/rewired nodes: {len(changed_nodes):,}",
        f"- Removed edges: {len(removed_edges):,}",
        f"- Added required hierarchy edges: {len(added_edges):,}",
    ]
    (REPORTS / "stage_hierarchy_normalization_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"removed_nodes": len(removed_nodes), "changed_nodes": len(changed_nodes), "removed_edges": len(removed_edges), "added_edges": len(added_edges)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
