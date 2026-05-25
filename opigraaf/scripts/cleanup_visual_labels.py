from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from typing import Any

import networkx as nx

from build_v2_unified_graph import xml_safe
from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"


TRANSVERSAL_THEMES = {
    "transversal_theme:elukestev_ope_ja_karjaari_kujundamine": "Läbiv teema: elukestev õpe ja karjääri kujundamine",
    "transversal_theme:keskkond_ja_jatkusuutlik_areng": "Läbiv teema: keskkond ja jätkusuutlik areng",
    "transversal_theme:kodanikualgatus_ja_ettevotlikkus": "Läbiv teema: kodanikualgatus ja ettevõtlikkus",
    "transversal_theme:kultuuriline_identiteet": "Läbiv teema: kultuuriline identiteet",
    "transversal_theme:teabekeskkond_ja_meediakasutus": "Läbiv teema: teabekeskkond ja meediakasutus",
    "transversal_theme:tehnoloogia_ja_innovatsioon": "Läbiv teema: tehnoloogia ja innovatsioon",
    "transversal_theme:tervis_ja_ohutus": "Läbiv teema: tervis ja ohutus",
    "transversal_theme:vaartused_ja_kolblus": "Läbiv teema: väärtused ja kõlblus",
}

STAGE_EXPECTATIONS = {
    "stage_competence_expectation:i_kooliaste": "I kooliastme pädevusootus",
    "stage_competence_expectation:ii_kooliaste": "II kooliastme pädevusootus",
    "stage_competence_expectation:iii_kooliaste": "III kooliastme pädevusootus",
}

DOMAIN_COMPETENCES = {
    "domain_competence:keel_ja_kirjandus": "Valdkonnapädevus: keel ja kirjandus",
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


def clean_topic_label(node: dict[str, Any]) -> str | None:
    label = str(node.get("label_et") or "")
    match = re.match(r"^(.*?)\s+\(EstCORE:([^)]+)\)$", label)
    if not match:
        return None
    clean = re.sub(r"\s+", " ", match.group(1)).strip()
    node.setdefault("raw_label_et", label)
    node["estcore_code"] = match.group(2)
    return clean


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    changes: list[dict[str, Any]] = []

    for node in nodes:
        old_label = node.get("label_et")
        new_label: str | None = None
        node_id = node["id"]
        if node_id in TRANSVERSAL_THEMES:
            new_label = TRANSVERSAL_THEMES[node_id]
            node["controlled_term_kind"] = "läbiv_teema"
        elif node_id in STAGE_EXPECTATIONS:
            new_label = STAGE_EXPECTATIONS[node_id]
            node["controlled_term_kind"] = "kooliastme_pädevusootus"
        elif node_id in DOMAIN_COMPETENCES:
            new_label = DOMAIN_COMPETENCES[node_id]
            node["controlled_term_kind"] = "valdkonnapädevus"
        elif node.get("type") == "Topic":
            new_label = clean_topic_label(node)

        if new_label and new_label != old_label:
            node.setdefault("raw_label_et", old_label)
            node["label_et"] = new_label
            changes.append({"id": node_id, "type": node.get("type"), "old_label": old_label, "new_label": new_label})

    export(nodes, edges)

    remaining = []
    for node in nodes:
        label = str(node.get("label_et") or "")
        if label == node["id"] or re.match(r"^[a-z_]+:", label) or "EstCORE:" in label:
            remaining.append({"id": node["id"], "type": node["type"], "label_et": label})

    write_csv(REPORTS / "visual_label_cleanup_changes.csv", changes)
    write_csv(REPORTS / "visual_label_cleanup_remaining_raw.csv", remaining)
    report = [
        "# Visual Label Cleanup",
        "",
        "- Cleaned human-facing `label_et` values while preserving stable IDs.",
        "- Raw labels and EstCORE codes are retained as metadata in `raw_label_et` and `estcore_code` where applicable.",
        f"- Nodes relabeled: {len(changes):,}",
        f"- Remaining raw-looking labels: {len(remaining):,}",
        "",
        "This pass mainly removes raw controlled-taxonomy IDs from the competence overlay and moves EstCORE topic codes out of visible labels.",
    ]
    (REPORTS / "visual_label_cleanup_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"changed": len(changes), "remaining_raw": len(remaining)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
