from __future__ import annotations

import csv
import json
from collections import Counter, deque
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl
from build_v2_unified_graph import xml_safe


SOURCE = PROJECT_ROOT / "graph" / "snapshots" / "v2_canonical_pilot"
OUT = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"
EXCLUDED = {"Material", "SourceDocument", "EvidenceSpan"}
ROOT_ID = "curriculum:riiklik_oppekava"
DOMAIN_ID = "curriculum_domain:keel_ja_kirjandus"


def edge_id(source: str, target: str, edge_type: str) -> str:
    return "edge:" + sha1_text(f"{source}|{target}|{edge_type}", 20)


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fields: list[str] = []
    seen = set()
    for row in rows:
        for key in row:
            if key not in seen:
                seen.add(key)
                fields.append(key)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})


def connected_to_root(node_ids: set[str], edges: list[dict[str, Any]]) -> set[str]:
    adj = {node_id: set() for node_id in node_ids}
    for edge in edges:
        if edge["source"] in adj and edge["target"] in adj:
            adj[edge["source"]].add(edge["target"])
            adj[edge["target"]].add(edge["source"])
    if ROOT_ID not in adj:
        return set()
    seen = {ROOT_ID}
    q = deque([ROOT_ID])
    while q:
        cur = q.popleft()
        for nxt in adj[cur]:
            if nxt not in seen:
                seen.add(nxt)
                q.append(nxt)
    return seen


def add_edge(edges: dict[str, dict[str, Any]], source: str, target: str, edge_type: str, method: str, confidence: float = 0.66) -> None:
    eid = edge_id(source, target, edge_type)
    if eid in edges:
        return
    edges[eid] = {
        "id": eid,
        "source": source,
        "target": target,
        "type": edge_type,
        "confidence": confidence,
        "method": method,
        "evidence": [],
        "source_url": None,
        "source_authority": "internal_graph_projection",
        "graph_version": "v2_curriculum_focus_2026-05-21",
        "schema_version": "kg_schema_v2_2026-05-20",
        "review_status": "projection_link",
        "created_at": now_iso(),
    }


def backfill_official_topic_outcome_edges(nodes: list[dict[str, Any]], edges: dict[str, dict[str, Any]]) -> None:
    node_by_id = {node["id"]: node for node in nodes}
    topic_by_url = {node.get("source_url"): node["id"] for node in nodes if node["type"] == "Topic" and node.get("source_url")}
    topic_by_label = {node.get("label_et"): node["id"] for node in nodes if node["type"] == "Topic" and node.get("label_et")}
    official = read_jsonl(PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "official_backbone.jsonl")
    for rec in official:
        if rec.get("record_type") != "learning_outcomes" or rec.get("id") not in node_by_id:
            continue
        for topic in rec.get("topics") or []:
            topic_id = None
            if isinstance(topic, dict):
                topic_id = topic_by_url.get(topic.get("url")) or topic_by_label.get(topic.get("label"))
            elif isinstance(topic, str):
                topic_id = topic if topic in node_by_id else topic_by_label.get(topic)
            if topic_id and topic_id in node_by_id:
                add_edge(edges, topic_id, rec["id"], "has_learning_outcome", "official_topic_outcome_backfill", 0.86)


def add_root_subject_shortcuts(nodes: list[dict[str, Any]], edges: dict[str, dict[str, Any]]) -> None:
    node_by_id = {node["id"]: node for node in nodes}
    if ROOT_ID not in node_by_id:
        return
    for node in nodes:
        if node["type"] == "Subject":
            add_edge(edges, ROOT_ID, node["id"], "has_subject", "focus_projection_root_subject_shortcut", 0.82)


def export_networkx(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> None:
    g = nx.MultiDiGraph()
    for node in nodes:
        g.add_node(node["id"], **{k: xml_safe(v) for k, v in node.items() if k != "id"})
    for edge in edges:
        g.add_edge(edge["source"], edge["target"], key=edge["id"], **{k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}})
    nx.write_graphml(g, OUT / "graph.graphml")
    nx.write_gexf(g, OUT / "graph.gexf")
    nx.read_graphml(OUT / "graph.graphml")
    nx.read_gexf(OUT / "graph.gexf")


def main() -> None:
    source_nodes = read_jsonl(SOURCE / "nodes.jsonl")
    source_edges = read_jsonl(SOURCE / "edges.jsonl")
    source_by_id = {node["id"]: node for node in source_nodes}

    nodes = []
    for node in source_nodes:
        if node["type"] in EXCLUDED:
            continue
        row = dict(node)
        row["graph_version"] = "v2_curriculum_focus_2026-05-21"
        # Keep provenance as attributes, not visualization nodes.
        row["evidence_count"] = len(row.get("evidence") or [])
        nodes.append(row)
    node_ids = {node["id"] for node in nodes}
    edges = {
        edge["id"]: {**edge, "graph_version": "v2_curriculum_focus_2026-05-21"}
        for edge in source_edges
        if edge["source"] in node_ids and edge["target"] in node_ids
    }

    backfill_official_topic_outcome_edges(nodes, edges)
    add_root_subject_shortcuts(nodes, edges)

    # Connect taxonomy-like orphan categories back to the curriculum domain.
    for node in nodes:
        node_id = node["id"]
        node_type = node["type"]
        if node_id in {ROOT_ID, DOMAIN_ID}:
            continue
        if node_type == "TaskType":
            add_edge(edges, DOMAIN_ID, node_id, "has_task_type", "focus_projection_domain_task_type", 0.72)
        elif node_type == "AssessmentCriterion":
            add_edge(edges, DOMAIN_ID, node_id, "has_criterion", "focus_projection_domain_criterion", 0.72)
        elif node_type in {"TaskSubtype", "CriterionDimension", "LevelExpectation", "CompetenceUnit"}:
            # These may be canonical but not yet aligned. Keep them visible,
            # explicitly marked as weak domain members instead of singletons.
            add_edge(edges, node_id, DOMAIN_ID, "part_of", "focus_projection_orphan_backlink", 0.5)

    connected = connected_to_root(node_ids, list(edges.values()))
    for node in nodes:
        if node["id"] not in connected and node["id"] != ROOT_ID:
            add_edge(edges, node["id"], DOMAIN_ID, "part_of", "focus_projection_no_singletons_backlink", 0.45)

    edge_rows = list(edges.values())
    OUT.mkdir(parents=True, exist_ok=True)
    write_jsonl(OUT / "nodes.jsonl", nodes)
    write_jsonl(OUT / "edges.jsonl", edge_rows)
    write_csv(OUT / "nodes.csv", nodes)
    write_csv(OUT / "edges.csv", edge_rows)
    export_networkx(nodes, edge_rows)
    cytoscape = {
        "nodes": [{"data": node} for node in nodes],
        "edges": [{"data": edge} for edge in edge_rows],
    }
    (OUT / "cytoscape_elements.json").write_text(json.dumps(cytoscape, ensure_ascii=False, indent=2), encoding="utf-8")

    connected_final = connected_to_root(node_ids, edge_rows)
    isolated = [node for node in nodes if node["id"] not in connected_final]
    report = [
        "# V2 Curriculum Focus Graph",
        "",
        f"- Source snapshot: `{SOURCE}`",
        f"- Output snapshot: `{OUT}`",
        f"- Nodes: {len(nodes):,}",
        f"- Edges: {len(edge_rows):,}",
        f"- Edge/node ratio: {len(edge_rows) / max(len(nodes), 1):.2f}",
        f"- Nodes not connected to curriculum root: {len(isolated):,}",
        "",
        "## Node Counts",
        "",
    ]
    for key, value in Counter(node["type"] for node in nodes).most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Edge Counts", ""])
    for key, value in Counter(edge["type"] for edge in edge_rows).most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(
        [
            "",
            "## Interpretation",
            "",
            "This is the visualization/default curriculum KG projection. It removes provenance/resource nodes from the node set and keeps evidence as attributes. Any otherwise disconnected curriculum node is explicitly linked back to the language-and-literature curriculum domain with a low-confidence projection edge, so there are no unconnected islands in the focus graph.",
        ]
    )
    (REPORTS / "v2_curriculum_focus_graph_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"nodes": len(nodes), "edges": len(edge_rows), "not_connected_to_root": len(isolated), "out": str(OUT)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
