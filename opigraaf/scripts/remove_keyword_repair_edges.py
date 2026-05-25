from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from typing import Any

import networkx as nx

from build_v2_unified_graph import xml_safe
from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"

KEYWORD_REPAIR_METHODS = {
    "llm_semantic_assessment_unit_repair",
    "llm_semantic_task_unit_repair",
    "semantic_topic_outcome_repair",
}


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


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    kept: list[dict[str, Any]] = []
    removed: list[dict[str, Any]] = []
    for edge in edges:
        if edge.get("method") in KEYWORD_REPAIR_METHODS:
            removed.append(edge)
        else:
            kept.append(edge)

    export(nodes, kept)

    write_csv(REPORTS / "removed_keyword_repair_edges.csv", removed)
    removed_counts = Counter((edge.get("method"), edge.get("type")) for edge in removed)
    report = [
        "# Removed Keyword-Derived Repair Edges",
        "",
        f"- Removed edges: {len(removed):,}",
        f"- Kept edges: {len(kept):,}",
        "",
        "These edges came from deterministic lexical/keyword repair passes. They were useful for diagnosing graph shape, but they are not accepted as graph truth. New repair edges must come from explicit semantic decision records with rationales.",
        "",
        "## Removed Counts",
        "",
    ]
    for (method, edge_type), count in removed_counts.most_common():
        report.append(f"- `{method}` / `{edge_type}`: {count:,}")
    (REPORTS / "removed_keyword_repair_edges.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"removed": len(removed), "kept": len(kept), "removed_counts": {f"{m}|{t}": c for (m, t), c in removed_counts.items()}}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
