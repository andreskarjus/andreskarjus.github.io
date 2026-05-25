from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl
from build_v2_unified_graph import xml_safe


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"

STOP = {
    "ja",
    "ning",
    "või",
    "kui",
    "ka",
    "eri",
    "eesti",
    "keel",
    "tekst",
    "teksti",
    "tekstid",
    "kooliaste",
    "klass",
    "õpitav",
    "õpitud",
    "kasutab",
    "tunneb",
    "teab",
    "oskab",
}


def norm(text: str | None) -> str:
    text = (text or "").lower()
    text = re.sub(r"\([^)]*\)", " ", text)
    text = re.sub(r"[^a-zõäöüšž0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def toks(text: str | None) -> set[str]:
    return {tok for tok in norm(text).split() if len(tok) >= 4 and tok not in STOP}


def edge_id(source: str, target: str, edge_type: str) -> str:
    return "edge:" + sha1_text(f"{source}|{target}|{edge_type}", 20)


def add_edge(edges: dict[str, dict[str, Any]], source: str, target: str, edge_type: str, confidence: float, reason: str) -> None:
    eid = edge_id(source, target, edge_type)
    if eid in edges:
        return
    edges[eid] = {
        "id": eid,
        "source": source,
        "target": target,
        "type": edge_type,
        "confidence": confidence,
        "method": "semantic_topic_outcome_repair",
        "evidence": [],
        "source_url": None,
        "source_authority": "semantic_repair",
        "graph_version": "v2_curriculum_focus_2026-05-21",
        "schema_version": "kg_schema_v2_2026-05-20",
        "review_status": "semantic_repair",
        "created_at": now_iso(),
        "reason": reason,
    }


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


def export(nodes: list[dict[str, Any]], edges: dict[str, dict[str, Any]]) -> None:
    edge_rows = list(edges.values())
    write_jsonl(FOCUS / "nodes.jsonl", nodes)
    write_jsonl(FOCUS / "edges.jsonl", edge_rows)
    g = nx.MultiDiGraph()
    for node in nodes:
        g.add_node(node["id"], **{k: xml_safe(v) for k, v in node.items() if k != "id"})
    for edge in edge_rows:
        g.add_edge(edge["source"], edge["target"], key=edge["id"], **{k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}})
    nx.write_graphml(g, FOCUS / "graph.graphml")
    nx.write_gexf(g, FOCUS / "graph.gexf")
    nx.read_graphml(FOCUS / "graph.graphml")
    nx.read_gexf(FOCUS / "graph.gexf")
    (FOCUS / "cytoscape_elements.json").write_text(json.dumps({"nodes": [{"data": n} for n in nodes], "edges": [{"data": e} for e in edge_rows]}, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = {edge["id"]: edge for edge in read_jsonl(FOCUS / "edges.jsonl")}
    by_id = {node["id"]: node for node in nodes}
    outgoing = defaultdict(list)
    incoming = defaultdict(list)
    for edge in edges.values():
        outgoing[edge["source"]].append(edge)
        incoming[edge["target"]].append(edge)

    lo_text: dict[str, str] = {}
    for node in nodes:
        if node["type"] != "LearningOutcome":
            continue
        bits = [node.get("label_et") or "", node.get("description") or ""]
        for edge in outgoing[node["id"]]:
            if edge["type"] in {"has_skill_unit", "has_knowledge_unit", "has_competence_unit"} and edge["target"] in by_id:
                target = by_id[edge["target"]]
                bits.extend([target.get("label_et") or "", target.get("description") or ""])
        lo_text[node["id"]] = " ".join(bits)

    existing_topic_lo = {
        (edge["source"], edge["target"])
        for edge in edges.values()
        if edge["type"] == "has_learning_outcome" and by_id.get(edge["source"], {}).get("type") == "Topic"
    }
    additions = []
    for topic in [node for node in nodes if node["type"] == "Topic"]:
        if sum(1 for edge in outgoing[topic["id"]] if edge["type"] == "has_learning_outcome") > 0:
            continue
        topic_label = topic.get("label_et") or ""
        topic_tokens = toks(topic_label)
        if not topic_tokens:
            continue
        candidates = []
        for lo_id, text in lo_text.items():
            lo_tokens = toks(text)
            if not lo_tokens:
                continue
            overlap = topic_tokens & lo_tokens
            if not overlap:
                continue
            phrase_hit = norm(topic_label) and norm(topic_label) in norm(text)
            score = len(overlap) / len(topic_tokens)
            if phrase_hit:
                score = max(score, 0.9)
            # Broad topics can match with fewer terms; narrow grammar topics need
            # a direct term hit.
            if score >= 0.5 or (len(topic_tokens) == 1 and score >= 1.0):
                candidates.append((score, len(overlap), lo_id, sorted(overlap)))
        candidates.sort(key=lambda item: (-item[0], -item[1], by_id[item[2]].get("label_et") or ""))
        for score, overlap_count, lo_id, overlap in candidates[:5]:
            if (topic["id"], lo_id) not in existing_topic_lo:
                reason = f"Topic label terms overlap learning outcome/unit text: {', '.join(overlap)}"
                add_edge(edges, topic["id"], lo_id, "has_learning_outcome", min(0.82, 0.55 + score * 0.25), reason)
                additions.append({"topic_id": topic["id"], "topic_label": topic_label, "learning_outcome_id": lo_id, "learning_outcome_label": by_id[lo_id].get("label_et"), "score": round(score, 3), "overlap": overlap})

    export(nodes, edges)
    write_csv(REPORTS / "topic_outcome_semantic_repair_edges.csv", additions)
    report = [
        "# Topic Outcome Semantic Repair",
        "",
        f"- Added Topic -> LearningOutcome edges: {len(additions):,}",
        f"- Topics touched: {len(set(row['topic_id'] for row in additions)):,}",
        "",
        "This repair links previously subject-only topics to outcomes when topic terms overlap official outcome text or attached unit labels. It is deliberately capped to five outcomes per topic.",
    ]
    (REPORTS / "topic_outcome_semantic_repair_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"added_edges": len(additions), "topics_touched": len(set(row["topic_id"] for row in additions))}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
