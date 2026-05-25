from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import read_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"
ROOT_ID = "curriculum:riiklik_oppekava"


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


def reachable_from_root(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> set[str]:
    adj = {node["id"]: set() for node in nodes}
    for edge in edges:
        if edge["source"] in adj and edge["target"] in adj:
            adj[edge["source"]].add(edge["target"])
            adj[edge["target"]].add(edge["source"])
    seen = {ROOT_ID}
    q = deque([ROOT_ID])
    while q:
        cur = q.popleft()
        for nxt in adj.get(cur, []):
            if nxt not in seen:
                seen.add(nxt)
                q.append(nxt)
    return seen


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    by_id = {node["id"]: node for node in nodes}
    node_counts = Counter(node["type"] for node in nodes)
    edge_counts = Counter(edge["type"] for edge in edges)
    connected = {edge["source"] for edge in edges} | {edge["target"] for edge in edges}
    isolated = [node for node in nodes if node["id"] not in connected]
    reachable = reachable_from_root(nodes, edges)
    not_root = [node for node in nodes if node["id"] not in reachable]
    bad_labels = [node for node in nodes if "?" in str(node.get("label_et") or "")]

    lo_unit_counts = Counter()
    unit_lo_counts = Counter()
    topic_lo_counts = Counter()
    criterion_unit_counts = Counter()
    task_unit_counts = Counter()
    general_competence_unit_counts = Counter()
    general_competence_task_counts = Counter()
    unit_general_competence_counts = Counter()
    task_general_competence_counts = Counter()
    malformed_general_competence_edges: list[dict[str, Any]] = []
    method_counts = Counter(edge.get("method") or "" for edge in edges)
    for edge in edges:
        st = by_id.get(edge["source"], {}).get("type")
        tt = by_id.get(edge["target"], {}).get("type")
        if st == "LearningOutcome" and edge["type"] in {"has_skill_unit", "has_knowledge_unit", "has_competence_unit"}:
            lo_unit_counts[edge["source"]] += 1
            if tt in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"}:
                unit_lo_counts[edge["target"]] += 1
        if st == "Topic" and edge["type"] == "has_learning_outcome":
            topic_lo_counts[edge["source"]] += 1
        if st in {"AssessmentCriterion", "CriterionDimension"} and edge["type"] == "criterion_measures_unit":
            criterion_unit_counts[edge["source"]] += 1
        if st == "TaskSubtype" and edge["type"] in {"assesses", "practices"}:
            task_unit_counts[edge["source"]] += 1
        if edge["type"] in {"has_supporting_unit", "has_supporting_task"}:
            if st != "GeneralCompetence":
                malformed_general_competence_edges.append({**edge, "error": "source_not_general_competence", "source_type": st, "target_type": tt})
            elif edge["type"] == "has_supporting_unit" and tt in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"}:
                general_competence_unit_counts[edge["source"]] += 1
                unit_general_competence_counts[edge["target"]] += 1
            elif edge["type"] == "has_supporting_task" and tt == "TaskSubtype":
                general_competence_task_counts[edge["source"]] += 1
                task_general_competence_counts[edge["target"]] += 1
            else:
                malformed_general_competence_edges.append({**edge, "error": "bad_target_type", "source_type": st, "target_type": tt})

    uncovered_lo = [node for node in nodes if node["type"] == "LearningOutcome" and lo_unit_counts[node["id"]] == 0]
    unit_no_lo = [node for node in nodes if node["type"] in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"} and unit_lo_counts[node["id"]] == 0]
    topic_no_lo = [node for node in nodes if node["type"] == "Topic" and topic_lo_counts[node["id"]] == 0]
    criterion_no_unit = [node for node in nodes if node["type"] in {"AssessmentCriterion", "CriterionDimension"} and criterion_unit_counts[node["id"]] == 0]
    task_no_unit = [node for node in nodes if node["type"] == "TaskSubtype" and task_unit_counts[node["id"]] == 0]
    unit_no_general_competence = [
        node
        for node in nodes
        if node["type"] in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit"} and unit_general_competence_counts[node["id"]] == 0
    ]
    task_no_general_competence = [node for node in nodes if node["type"] == "TaskSubtype" and task_general_competence_counts[node["id"]] == 0]

    nx.read_graphml(FOCUS / "graph.graphml")
    nx.read_gexf(FOCUS / "graph.gexf")

    write_csv(REPORTS / "focus_qc_bad_labels.csv", [{"id": n["id"], "type": n["type"], "label_et": n.get("label_et")} for n in bad_labels])
    write_csv(REPORTS / "focus_qc_uncovered_learning_outcomes.csv", [{"id": n["id"], "label_et": n.get("label_et"), "subject": n.get("subject")} for n in uncovered_lo])
    write_csv(REPORTS / "focus_qc_units_without_learning_outcomes.csv", [{"id": n["id"], "type": n["type"], "label_et": n.get("label_et"), "source_authority": n.get("source_authority")} for n in unit_no_lo])
    write_csv(REPORTS / "focus_qc_topics_without_outcomes.csv", [{"id": n["id"], "label_et": n.get("label_et")} for n in topic_no_lo])
    write_csv(REPORTS / "focus_qc_criteria_without_units.csv", [{"id": n["id"], "type": n["type"], "label_et": n.get("label_et")} for n in criterion_no_unit])
    write_csv(REPORTS / "focus_qc_tasks_without_units.csv", [{"id": n["id"], "label_et": n.get("label_et")} for n in task_no_unit])
    write_csv(REPORTS / "focus_qc_units_without_general_competence.csv", [{"id": n["id"], "type": n["type"], "label_et": n.get("label_et")} for n in unit_no_general_competence])
    write_csv(REPORTS / "focus_qc_tasks_without_general_competence.csv", [{"id": n["id"], "label_et": n.get("label_et")} for n in task_no_general_competence])
    write_csv(REPORTS / "focus_qc_malformed_general_competence_edges.csv", malformed_general_competence_edges)

    report = [
        "# Final Focus Graph QC",
        "",
        f"- Nodes: {len(nodes):,}",
        f"- Edges: {len(edges):,}",
        f"- Edge/node ratio: {len(edges) / max(len(nodes), 1):.2f}",
        f"- Isolated nodes: {len(isolated):,}",
        f"- Nodes not connected to curriculum root: {len(not_root):,}",
        f"- Labels still containing `?`: {len(bad_labels):,}",
        f"- Learning outcomes without unit: {len(uncovered_lo):,}/{node_counts['LearningOutcome']:,}",
        f"- Unit nodes without direct learning outcome: {len(unit_no_lo):,}/{node_counts['SkillUnit'] + node_counts['KnowledgeUnit'] + node_counts['CompetenceUnit']:,}",
        f"- Topics without learning outcome: {len(topic_no_lo):,}/{node_counts['Topic']:,}",
        f"- Criteria/dimensions without measured unit: {len(criterion_no_unit):,}/{node_counts['AssessmentCriterion'] + node_counts['CriterionDimension']:,}",
        f"- Task subtypes without assessed/practiced unit: {len(task_no_unit):,}/{node_counts['TaskSubtype']:,}",
        f"- Unit nodes without general competence: {len(unit_no_general_competence):,}/{node_counts['SkillUnit'] + node_counts['KnowledgeUnit'] + node_counts['CompetenceUnit']:,}",
        f"- Task subtypes without general competence: {len(task_no_general_competence):,}/{node_counts['TaskSubtype']:,}",
        f"- Malformed general competence support edges: {len(malformed_general_competence_edges):,}",
        "- GraphML/GEXF load: yes",
        "",
        "## Node Counts",
        "",
    ]
    for key, value in node_counts.most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Edge Counts", ""])
    for key, value in edge_counts.most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Edge Methods", ""])
    for key, value in method_counts.most_common():
        report.append(f"- {key or '(missing)'}: {value:,}")
    report.extend(["", "## General Competence Support Links", ""])
    general_competences = sorted((node for node in nodes if node["type"] == "GeneralCompetence"), key=lambda n: n.get("label_et") or n["id"])
    for node in general_competences:
        report.append(
            f"- {node.get('label_et') or node['id']}: "
            f"{general_competence_unit_counts[node['id']]:,} unit links; "
            f"{general_competence_task_counts[node['id']]:,} task links"
        )
    report.extend(
        [
            "",
            "## Interpretation",
            "",
            "This is the current default curriculum view of one KG. Source/evidence information is retained as metadata or optional provenance-layer information over the same node/edge identity space, not as a competing parallel KG. Repair and competence-support edges are accepted only from explicit semantic decision records rather than keyword-derived matching.",
        ]
    )
    (REPORTS / "final_focus_graph_qc.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"nodes": len(nodes), "edges": len(edges), "isolated": len(isolated), "not_root": len(not_root), "bad_labels": len(bad_labels), "uncovered_lo": len(uncovered_lo), "units_without_lo": len(unit_no_lo), "topics_without_outcomes": len(topic_no_lo), "criteria_without_units": len(criterion_no_unit), "tasks_without_units": len(task_no_unit), "units_without_general_competence": len(unit_no_general_competence), "tasks_without_general_competence": len(task_no_general_competence), "malformed_general_competence_edges": len(malformed_general_competence_edges)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
