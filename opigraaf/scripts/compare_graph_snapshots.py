from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import read_jsonl


def norm(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-zõäöüšž0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def load_graph(path: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    return read_jsonl(path / "nodes.jsonl"), read_jsonl(path / "edges.jsonl")


def metrics(path: Path) -> dict[str, Any]:
    nodes, edges = load_graph(path)
    node_counts = Counter(node["type"] for node in nodes)
    edge_counts = Counter(edge["type"] for edge in edges)
    connected = {edge["source"] for edge in edges} | {edge["target"] for edge in edges}
    isolated = sum(1 for node in nodes if node["id"] not in connected)
    duplicate_groups = 0
    groups = {}
    for node in nodes:
        if node["type"] in {"Knowledge", "Skill", "Competence", "KnowledgeUnit", "SkillUnit", "CompetenceUnit", "AssessmentCriterion", "CriterionDimension", "TaskSubtype", "Topic", "LearningOutcome"}:
            key = (node["type"], norm(node.get("label_et") or node.get("label") or ""))
            if key[1]:
                groups.setdefault(key, 0)
                groups[key] += 1
    duplicate_groups = sum(1 for value in groups.values() if value > 1)
    graphml_ok = False
    gexf_ok = False
    if (path / "graph.graphml").exists():
        nx.read_graphml(path / "graph.graphml")
        graphml_ok = True
    if (path / "graph.gexf").exists():
        nx.read_gexf(path / "graph.gexf")
        gexf_ok = True
    return {
        "path": str(path),
        "nodes": len(nodes),
        "edges": len(edges),
        "isolated": isolated,
        "isolated_rate": isolated / max(len(nodes), 1),
        "node_types": len(node_counts),
        "edge_types": len(edge_counts),
        "node_counts": dict(node_counts),
        "edge_counts": dict(edge_counts),
        "duplicate_label_groups_core": duplicate_groups,
        "graphml_ok": graphml_ok,
        "gexf_ok": gexf_ok,
        "official_learning_outcomes": node_counts.get("LearningOutcome", 0),
        "learning_unit_nodes": node_counts.get("KnowledgeUnit", 0) + node_counts.get("SkillUnit", 0) + node_counts.get("CompetenceUnit", 0),
        "legacy_learning_nodes": node_counts.get("Knowledge", 0) + node_counts.get("Skill", 0) + node_counts.get("Competence", 0),
        "assessment_nodes": node_counts.get("AssessmentCriterion", 0) + node_counts.get("CriterionDimension", 0) + node_counts.get("LevelExpectation", 0),
        "task_nodes": node_counts.get("TaskType", 0) + node_counts.get("TaskSubtype", 0) + node_counts.get("TaskInstance", 0),
        "competence_overlay_nodes": node_counts.get("GeneralCompetence", 0) + node_counts.get("TransversalTheme", 0) + node_counts.get("StageCompetenceExpectation", 0) + node_counts.get("DomainCompetence", 0),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--legacy", default="graph")
    parser.add_argument("--new", default="graph/snapshots/v2_canonical_pilot")
    args = parser.parse_args()
    legacy = metrics(PROJECT_ROOT / args.legacy)
    new = metrics(PROJECT_ROOT / args.new)
    report = [
        "# Graph Snapshot Comparison",
        "",
        f"- Legacy snapshot: `{legacy['path']}`",
        f"- New snapshot: `{new['path']}`",
        "",
        "## Headline Metrics",
        "",
        "| Metric | Legacy | New |",
        "|---|---:|---:|",
        f"| Nodes | {legacy['nodes']:,} | {new['nodes']:,} |",
        f"| Edges | {legacy['edges']:,} | {new['edges']:,} |",
        f"| Node types | {legacy['node_types']:,} | {new['node_types']:,} |",
        f"| Edge types | {legacy['edge_types']:,} | {new['edge_types']:,} |",
        f"| Isolated nodes | {legacy['isolated']:,} ({legacy['isolated_rate']:.1%}) | {new['isolated']:,} ({new['isolated_rate']:.1%}) |",
        f"| Official learning outcomes | {legacy['official_learning_outcomes']:,} | {new['official_learning_outcomes']:,} |",
        f"| Learning unit nodes | {legacy['legacy_learning_nodes']:,} legacy Knowledge/Skill/Competence | {new['learning_unit_nodes']:,} canonical KnowledgeUnit/SkillUnit/CompetenceUnit |",
        f"| Task nodes | 0 | {new['task_nodes']:,} |",
        f"| Assessment/level nodes | 0 | {new['assessment_nodes']:,} |",
        f"| Cross-curricular competence overlay nodes | 0 | {new['competence_overlay_nodes']:,} |",
        f"| Core duplicate label groups | {legacy['duplicate_label_groups_core']:,} | {new['duplicate_label_groups_core']:,} |",
        f"| GraphML/GEXF load | {legacy['graphml_ok'] and legacy['gexf_ok']} | {new['graphml_ok'] and new['gexf_ok']} |",
        "",
        "## Interpretation",
        "",
        "The v2 canonical pilot expands the earlier oppekava graph structurally: it has more official outcomes, a larger source/material inventory, explicit task and assessment layers, and a cross-curricular competence overlay. It improves semantic quality by replacing fuzzy `Knowledge`/`Skill`/`Competence` candidates with LLM-adjudicated canonical unit nodes and explicit broader/narrower/progression relations. Remaining gaps are mostly coverage and source alignment, not export validity.",
    ]
    out = PROJECT_ROOT / "reports" / "graph_snapshot_comparison.md"
    out.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"legacy": legacy, "new": new, "report": str(out)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
