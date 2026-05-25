from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl
from build_v2_unified_graph import xml_safe


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fields = []
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


def export(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> None:
    write_jsonl(FOCUS / "nodes.jsonl", nodes)
    write_jsonl(FOCUS / "edges.jsonl", edges)
    g = nx.MultiDiGraph()
    for node in nodes:
        g.add_node(node["id"], **{k: xml_safe(v) for k, v in node.items() if k != "id"})
    for edge in edges:
        g.add_edge(edge["source"], edge["target"], key=edge["id"], **{k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}})
    nx.write_graphml(g, FOCUS / "graph.graphml")
    nx.write_gexf(g, FOCUS / "graph.gexf")
    nx.read_graphml(FOCUS / "graph.graphml")
    nx.read_gexf(FOCUS / "graph.gexf")
    (FOCUS / "cytoscape_elements.json").write_text(json.dumps({"nodes": [{"data": n} for n in nodes], "edges": [{"data": e} for e in edges]}, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    in_edges = Counter(edge["target"] for edge in edges)
    out_edges = Counter(edge["source"] for edge in edges)
    topic_lo = Counter(edge["source"] for edge in edges if edge["type"] == "has_learning_outcome")
    remove_ids = set()
    parked = []
    for node in nodes:
        if node["type"] != "Topic":
            continue
        if topic_lo[node["id"]] > 0:
            continue
        # Keep official topic inventory. Prune only backlog/projection topics
        # that are currently just domain-attached labels.
        if str(node.get("source_system") or "").startswith("legacy_backlog") or str(node["id"]).startswith("legacy_canonical:topic"):
            remove_ids.add(node["id"])
            parked.append(node)
    kept_nodes = [node for node in nodes if node["id"] not in remove_ids]
    kept_edges = [edge for edge in edges if edge["source"] not in remove_ids and edge["target"] not in remove_ids]
    export(kept_nodes, kept_edges)
    write_csv(REPORTS / "focus_pruned_topic_only_backlog.csv", parked)
    report = [
        "# Focus Topic-Only Prune",
        "",
        f"- Topic-only backlog nodes parked outside focus graph: {len(parked):,}",
        f"- Nodes after prune: {len(kept_nodes):,}",
        f"- Edges after prune: {len(kept_edges):,}",
        "",
        "Only non-official backlog topics with no learning-outcome links were removed from the focus graph. They remain in the audit CSV for future adjudication.",
    ]
    (REPORTS / "focus_pruned_topic_only_backlog_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"parked_topics": len(parked), "nodes": len(kept_nodes), "edges": len(kept_edges)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
