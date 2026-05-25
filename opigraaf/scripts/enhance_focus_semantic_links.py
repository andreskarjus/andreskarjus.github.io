from __future__ import annotations

import csv
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl
from build_v2_unified_graph import xml_safe


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"


def norm(text: str | None) -> str:
    text = (text or "").lower()
    text = text.replace("?", "õ")
    text = re.sub(r"[^a-zõäöüšž0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def edge_id(source: str, target: str, edge_type: str) -> str:
    return "edge:" + sha1_text(f"{source}|{target}|{edge_type}", 20)


def add_edge(edges: dict[str, dict[str, Any]], source: str, target: str, edge_type: str, method: str, confidence: float, reason: str) -> bool:
    eid = edge_id(source, target, edge_type)
    if eid in edges:
        return False
    edges[eid] = {
        "id": eid,
        "source": source,
        "target": target,
        "type": edge_type,
        "confidence": confidence,
        "method": method,
        "evidence": [],
        "source_url": None,
        "source_authority": "llm_semantic_repair",
        "graph_version": "v2_curriculum_focus_2026-05-21",
        "schema_version": "kg_schema_v2_2026-05-20",
        "review_status": "llm_semantic_repair",
        "created_at": now_iso(),
        "reason": reason,
    }
    return True


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fields = []
    seen = set()
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
    edges = {edge["id"]: edge for edge in read_jsonl(FOCUS / "edges.jsonl")}
    by_type: dict[str, list[dict[str, Any]]] = {}
    for node in nodes:
        by_type.setdefault(node["type"], []).append(node)

    units = [node for node in nodes if node["type"] in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"}]
    criteria = [node for node in nodes if node["type"] in {"AssessmentCriterion", "CriterionDimension"}]
    tasks = [node for node in nodes if node["type"] == "TaskSubtype"]

    semantic_groups = {
        "writing_content": {
            "criterion_terms": ["sisu", "teema", "pealkiri", "sissejuhatus", "probleem", "järeld", "lopetus", "lõpetus", "terviklik"],
            "unit_terms": ["kirjutab", "loob", "koostab", "tekst", "kirjand", "arutleb", "avaldab", "kommenteerib"],
            "reason": "Writing-content criteria assess creation of coherent text content and topic development.",
        },
        "argumentation": {
            "criterion_terms": ["argument", "väide", "põhjend", "näide", "vastuväide", "alaväide"],
            "unit_terms": ["põhjendab", "arvamus", "seisukoht", "väide", "argument", "vastuväide", "näide", "arutleb"],
            "reason": "Argumentation criteria assess claims, reasons, examples, and counterargument handling.",
        },
        "source_use": {
            "criterion_terms": ["allika", "alustekst", "tsiteer", "refereer", "viitam", "usaldusväär"],
            "unit_terms": ["allika", "alustekst", "tsiteer", "refereer", "viit", "teavet", "internet", "raamatukogu"],
            "reason": "Source-use criteria assess finding, evaluating, integrating, and referencing source material.",
        },
        "structure": {
            "criterion_terms": ["struktuur", "ülesehitus", "liigendus", "lõigu", "loigu", "sidusus", "loogiline", "žanri", "zanri", "vormist"],
            "unit_terms": ["ülesehitus", "vormistus", "tekst", "lõik", "loik", "sidus", "žanr", "zanr", "terviklik"],
            "reason": "Structure criteria assess text organization, paragraphing, genre fit, and coherence.",
        },
        "style": {
            "criterion_terms": ["sõnastus", "sonastus", "sõnavara", "sonavara", "stiil", "lauseehitus", "kujundlik", "sõnakord"],
            "unit_terms": ["sõnastus", "sonastus", "sõnavara", "sonavara", "stiil", "lause", "kujund", "keelend"],
            "reason": "Style criteria assess vocabulary, sentence construction, register, and expressive precision.",
        },
        "orthography": {
            "criterion_terms": ["õigekiri", "oigekiri", "ortograafia", "algustäht", "algustahe", "kokku", "lahku", "vormimoodustus", "rektsioon", "lühendid", "kirjavahem", "komakasutus", "otsekõne", "jutumärk", "koolon"],
            "unit_terms": ["õigekiri", "oigekiri", "ortograafia", "algustäht", "algustahe", "lausemärk", "kirjavahem", "komakasutus", "vormimoodustus", "rektsioon", "lühend", "võõrnimi"],
            "reason": "Orthography criteria assess spelling, punctuation, capitalization, morphology, and norm use.",
        },
        "oral": {
            "criterion_terms": ["suuline", "diktsioon", "kuulaja", "kehakeel", "näitlikustamine", "ajakasutus", "ladusus"],
            "unit_terms": ["suuliselt", "suuline", "esineb", "esitab", "kõne", "kuulaja", "diskussioon", "väitlus"],
            "reason": "Oral-presentation criteria assess spoken delivery and interaction skills.",
        },
    }

    added_rows: list[dict[str, Any]] = []
    for criterion in criteria:
        clabel = norm(criterion.get("label_et"))
        for group_name, group in semantic_groups.items():
            if not any(term in clabel for term in group["criterion_terms"]):
                continue
            candidates = []
            for unit in units:
                ulabel = norm((unit.get("label_et") or "") + " " + (unit.get("description") or ""))
                if any(term in ulabel for term in group["unit_terms"]):
                    candidates.append(unit)
            # Keep the links useful rather than making a hairball.
            for unit in candidates[:12]:
                if add_edge(edges, criterion["id"], unit["id"], "criterion_measures_unit", "llm_semantic_assessment_unit_repair", 0.64, group["reason"]):
                    added_rows.append({"source": criterion["id"], "source_label": criterion.get("label_et"), "target": unit["id"], "target_label": unit.get("label_et"), "type": "criterion_measures_unit", "group": group_name})

    task_groups = {
        "argument_text": {
            "task_terms": ["arutlev", "essee", "arvamuslugu", "veebikommentaar"],
            "unit_terms": ["kirjutab", "loob", "arvamus", "seisukoht", "põhjendab", "kommenteerib", "arutleb"],
            "reason": "Argumentative/media writing tasks practice opinion, commentary, argument, and text creation skills.",
        },
        "narrative_descriptive": {
            "task_terms": ["jutustav", "kirjeldav", "omalooming"],
            "unit_terms": ["jutustab", "kirjeldab", "loob", "kirjutab", "tegelase", "miljöö"],
            "reason": "Narrative/descriptive tasks practice narrative and descriptive text creation.",
        },
        "source_research": {
            "task_terms": ["referaat", "uurimistöö", "tekstianalüüs", "konspekt", "arvustus"],
            "unit_terms": ["allika", "teavet", "analüüs", "refereer", "viit", "loetu", "teksti"],
            "reason": "Research and analysis tasks practice source use, analysis, and synthesis skills.",
        },
        "language_practice": {
            "task_terms": ["õigekirja", "grammatika", "etteütlus", "toimetamine", "sõnavara"],
            "unit_terms": ["õigekiri", "oigekiri", "keelend", "lause", "vormimoodustus", "kirjavahem", "sõnavara", "algustäht"],
            "reason": "Language-practice tasks assess and practice grammar, spelling, punctuation, and vocabulary units.",
        },
        "oral": {
            "task_terms": ["ettekanne", "kõne", "väitlus", "diskussioon", "esitamine"],
            "unit_terms": ["suuliselt", "esineb", "esitab", "põhjendab", "arvamus", "diskussioon", "suhtlus"],
            "reason": "Oral tasks practice spoken presentation, discussion, and argumentation.",
        },
    }
    for task in tasks:
        tlabel = norm(task.get("label_et"))
        for group_name, group in task_groups.items():
            if not any(term in tlabel for term in group["task_terms"]):
                continue
            candidates = []
            for unit in units:
                ulabel = norm((unit.get("label_et") or "") + " " + (unit.get("description") or ""))
                if any(term in ulabel for term in group["unit_terms"]):
                    candidates.append(unit)
            for unit in candidates[:10]:
                if add_edge(edges, task["id"], unit["id"], "assesses", "llm_semantic_task_unit_repair", 0.6, group["reason"]):
                    added_rows.append({"source": task["id"], "source_label": task.get("label_et"), "target": unit["id"], "target_label": unit.get("label_et"), "type": "assesses", "group": group_name})

    edge_rows = list(edges.values())
    export(nodes, edge_rows)
    write_csv(REPORTS / "focus_semantic_repair_edges.csv", added_rows)
    report = [
        "# Focus Semantic Repair",
        "",
        f"- Added semantic repair edges: {len(added_rows):,}",
        "",
        "## Added Edge Types",
        "",
    ]
    for key, value in Counter(row["type"] for row in added_rows).most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Semantic Groups", ""])
    for key, value in Counter(row["group"] for row in added_rows).most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(
        [
            "",
            "## Interpretation",
            "",
            "These links are an LLM-guided semantic repair layer encoded as deterministic rules for repeatability. They connect task subtypes and assessment criteria to the skills/knowledge they practice or measure, reducing the isolated assessment island problem. They should be reviewed and refined after the legacy backlog pass adds missing units.",
        ]
    )
    (REPORTS / "focus_semantic_repair_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"added_edges": len(added_rows), "edge_counts": dict(Counter(row["type"] for row in added_rows))}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
