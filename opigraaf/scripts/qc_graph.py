from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from pathlib import Path

import networkx as nx
from rapidfuzz import fuzz

from common import ROOT, normalize_for_match, read_jsonl, write_csv


def graph_dir(stage: str) -> Path:
    return ROOT / ("graph" if stage == "final" else f"graph/snapshots/{stage}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stage", choices=["pilot", "v0_oppekava", "v1_curriculum_steered", "final"], default="pilot")
    args = parser.parse_args()
    gdir = graph_dir(args.stage)
    nodes = read_jsonl(gdir / "nodes.jsonl")
    edges = read_jsonl(gdir / "edges.jsonl")
    if not nodes:
        raise SystemExit(f"No graph nodes found for stage {args.stage}")

    node_by_id = {n["id"]: n for n in nodes}
    graph = nx.DiGraph()
    graph.add_nodes_from(node_by_id)
    graph.add_edges_from((e["source"], e["target"]) for e in edges)

    node_counts = Counter(n["type"] for n in nodes)
    edge_counts = Counter(e["type"] for e in edges)
    isolated = list(nx.isolates(graph))
    labels = defaultdict(list)
    for node in nodes:
        labels[normalize_for_match(node["label_et"])].append(node["id"])
    duplicates = [{"label_norm": k, "count": len(v), "node_ids": v} for k, v in labels.items() if k and len(v) > 1]

    candidate_labels = [n for n in nodes if n["type"] in {"Skill", "Knowledge", "Competence", "CandidateUnit"}]
    near_duplicates = []
    for i, a in enumerate(candidate_labels[:2000]):
        for b in candidate_labels[i + 1 : min(len(candidate_labels), i + 150)]:
            if a.get("subject") != b.get("subject"):
                continue
            score = fuzz.token_set_ratio(a["label_et"], b["label_et"]) / 100
            if score >= 0.92 and a["id"] != b["id"]:
                near_duplicates.append({"a": a["id"], "b": b["id"], "label_a": a["label_et"], "label_b": b["label_et"], "score": round(score, 3)})
                if len(near_duplicates) >= 500:
                    break
        if len(near_duplicates) >= 500:
            break

    outcome_unit_counts = Counter()
    for edge in edges:
        if edge["type"] in {"has_skill", "has_knowledge", "has_competence"}:
            outcome_unit_counts[edge["source"]] += 1
    coverage_rows = [
        {
            "outcome_id": oid,
            "outcome_label": node_by_id.get(oid, {}).get("label_et"),
            "unit_count": count,
        }
        for oid, count in outcome_unit_counts.items()
    ]
    write_csv(ROOT / "reports" / (f"{args.stage}_possible_duplicates.csv" if args.stage != "final" else "possible_duplicates.csv"), near_duplicates)
    write_csv(ROOT / "reports" / (f"{args.stage}_coverage_by_learning_outcome.csv" if args.stage != "final" else "coverage_by_learning_outcome.csv"), coverage_rows)

    review_rows = []
    for edge in sorted(edges, key=lambda e: e.get("confidence", 1.0))[:100]:
        review_rows.append(
            {
                "edge_id": edge["id"],
                "edge_type": edge["type"],
                "confidence": edge.get("confidence"),
                "source_label": node_by_id.get(edge["source"], {}).get("label_et"),
                "target_label": node_by_id.get(edge["target"], {}).get("label_et"),
                "source_url": edge.get("source_url"),
                "evidence": ";".join(edge.get("evidence", [])),
            }
        )
    write_csv(ROOT / "reports" / (f"{args.stage}_human_review_sample.csv" if args.stage != "final" else "human_review_sample.csv"), review_rows)

    md = [
        f"# QC Report ({args.stage})",
        "",
        "## Counts",
        "",
        f"- Nodes: {len(nodes)}",
        f"- Edges: {len(edges)}",
        f"- Average degree: {round(sum(dict(graph.degree()).values()) / max(1, graph.number_of_nodes()), 3)}",
        f"- Isolated nodes: {len(isolated)} ({round(len(isolated) / max(1, len(nodes)), 3)})",
        f"- Duplicate normalized labels: {len(duplicates)}",
        f"- Near-duplicate candidate pairs sampled: {len(near_duplicates)}",
        "",
        "## Node Counts",
        "",
    ]
    md.extend(f"- {k}: {v}" for k, v in node_counts.most_common())
    md.extend(["", "## Edge Counts", ""])
    md.extend(f"- {k}: {v}" for k, v in edge_counts.most_common())
    md.extend(
        [
            "",
            "## Gate Notes",
            "",
            "- GraphML and GEXF readability is checked by the build step.",
            "- Low-confidence edges and uncertain mappings are sampled into the human review CSV.",
        ]
    )
    out = ROOT / "reports" / (f"{args.stage}_qc_report.md" if args.stage != "final" else "qc_report.md")
    out.write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"QC {args.stage}: {len(nodes)} nodes, {len(edges)} edges, {len(isolated)} isolated")


if __name__ == "__main__":
    main()
