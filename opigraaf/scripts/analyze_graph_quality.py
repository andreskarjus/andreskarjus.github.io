from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl


LEGACY = PROJECT_ROOT / "graph"
NEW = PROJECT_ROOT / "graph" / "snapshots" / "v2_canonical_pilot"
REPORTS = PROJECT_ROOT / "reports"


def norm(text: str | None) -> str:
    text = (text or "").lower()
    text = re.sub(r"\([^)]*estcore[^)]*\)", "", text, flags=re.I)
    text = re.sub(r"[^a-zõäöüšž0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def load_graph(path: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, dict[str, Any]]]:
    nodes = read_jsonl(path / "nodes.jsonl")
    edges = read_jsonl(path / "edges.jsonl")
    return nodes, edges, {node["id"]: node for node in nodes}


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


def degrees(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> dict[str, dict[str, int]]:
    deg = {node["id"]: {"in": 0, "out": 0, "total": 0} for node in nodes}
    for edge in edges:
        if edge["source"] in deg:
            deg[edge["source"]]["out"] += 1
            deg[edge["source"]]["total"] += 1
        if edge["target"] in deg:
            deg[edge["target"]]["in"] += 1
            deg[edge["target"]]["total"] += 1
    return deg


def component_sizes(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> list[int]:
    adj: dict[str, set[str]] = {node["id"]: set() for node in nodes}
    for edge in edges:
        if edge["source"] in adj and edge["target"] in adj:
            adj[edge["source"]].add(edge["target"])
            adj[edge["target"]].add(edge["source"])
    seen: set[str] = set()
    sizes = []
    for node_id in adj:
        if node_id in seen:
            continue
        q = deque([node_id])
        seen.add(node_id)
        size = 0
        while q:
            cur = q.popleft()
            size += 1
            for nxt in adj[cur]:
                if nxt not in seen:
                    seen.add(nxt)
                    q.append(nxt)
        sizes.append(size)
    return sorted(sizes, reverse=True)


def paths_to_competence(new_nodes_by_id: dict[str, dict[str, Any]], new_edges: list[dict[str, Any]]) -> tuple[set[str], dict[str, list[str]]]:
    # Undirected reachability to any competence overlay node through the graph.
    competence_types = {"GeneralCompetence", "TransversalTheme", "DomainCompetence", "StageCompetenceExpectation", "CompetenceUnit"}
    comp_ids = {node_id for node_id, node in new_nodes_by_id.items() if node["type"] in competence_types}
    adj: dict[str, set[str]] = defaultdict(set)
    for edge in new_edges:
        adj[edge["source"]].add(edge["target"])
        adj[edge["target"]].add(edge["source"])
    reachable_los: set[str] = set()
    nearest: dict[str, list[str]] = {}
    for node_id, node in new_nodes_by_id.items():
        if node["type"] != "LearningOutcome":
            continue
        q = deque([(node_id, [node_id])])
        seen = {node_id}
        found = []
        while q and not found:
            cur, path = q.popleft()
            if cur in comp_ids and cur != node_id:
                found = path
                break
            if len(path) >= 6:
                continue
            for nxt in adj.get(cur, []):
                if nxt not in seen:
                    seen.add(nxt)
                    q.append((nxt, path + [nxt]))
        if found:
            reachable_los.add(node_id)
            nearest[node_id] = found
    return reachable_los, nearest


def competence_coverage_by_distance(new_nodes_by_id: dict[str, dict[str, Any]], new_edges: list[dict[str, Any]]) -> dict[int, set[str]]:
    competence_types = {"GeneralCompetence", "TransversalTheme", "DomainCompetence", "StageCompetenceExpectation"}
    comp_ids = {node_id for node_id, node in new_nodes_by_id.items() if node["type"] in competence_types}
    adj: dict[str, set[str]] = defaultdict(set)
    for edge in new_edges:
        adj[edge["source"]].add(edge["target"])
        adj[edge["target"]].add(edge["source"])
    coverage: dict[int, set[str]] = {1: set(), 2: set(), 3: set()}
    for node_id, node in new_nodes_by_id.items():
        if node["type"] != "LearningOutcome":
            continue
        q = deque([(node_id, 0)])
        seen = {node_id}
        min_dist = None
        while q:
            cur, dist = q.popleft()
            if dist > 3:
                continue
            if cur in comp_ids and dist > 0:
                min_dist = dist
                break
            for nxt in adj.get(cur, []):
                if nxt not in seen:
                    seen.add(nxt)
                    q.append((nxt, dist + 1))
        if min_dist:
            for distance in range(min_dist, 4):
                coverage[distance].add(node_id)
    return coverage


def main() -> None:
    legacy_nodes, legacy_edges, legacy_by_id = load_graph(LEGACY)
    new_nodes, new_edges, new_by_id = load_graph(NEW)
    legacy_deg = degrees(legacy_nodes, legacy_edges)
    new_deg = degrees(new_nodes, new_edges)

    legacy_node_counts = Counter(node["type"] for node in legacy_nodes)
    new_node_counts = Counter(node["type"] for node in new_nodes)
    legacy_edge_counts = Counter(edge["type"] for edge in legacy_edges)
    new_edge_counts = Counter(edge["type"] for edge in new_edges)

    legacy_labels = defaultdict(set)
    for node in legacy_nodes:
        legacy_labels[node["type"]].add(norm(node.get("label_et") or node.get("label")))
    new_labels = defaultdict(set)
    for node in new_nodes:
        new_labels[node["type"]].add(norm(node.get("label_et") or node.get("label")))

    legacy_lo_labels = legacy_labels["LearningOutcome"]
    new_lo_labels = new_labels["LearningOutcome"]
    legacy_topic_labels = legacy_labels["Topic"]
    new_topic_labels = new_labels["Topic"]

    new_lo_ids = [node["id"] for node in new_nodes if node["type"] == "LearningOutcome"]
    lo_unit_counts = Counter()
    lo_type_counts: dict[str, Counter] = defaultdict(Counter)
    for edge in new_edges:
        if edge["source"] in new_by_id and new_by_id[edge["source"]]["type"] == "LearningOutcome":
            if edge["type"] in {"has_skill_unit", "has_knowledge_unit", "has_competence_unit", "has_attitude_unit"}:
                lo_unit_counts[edge["source"]] += 1
                lo_type_counts[edge["source"]][edge["type"]] += 1

    uncovered_los = []
    for lo_id in new_lo_ids:
        if lo_unit_counts[lo_id] == 0:
            node = new_by_id[lo_id]
            uncovered_los.append(
                {
                    "id": lo_id,
                    "label_et": node.get("label_et"),
                    "subject": node.get("subject"),
                    "grades": node.get("grades"),
                    "school_stages": node.get("school_stages"),
                    "source_url": node.get("source_url"),
                }
            )

    connected = {edge["source"] for edge in new_edges} | {edge["target"] for edge in new_edges}
    isolated_rows = []
    for node in new_nodes:
        if node["id"] not in connected:
            isolated_rows.append(
                {
                    "id": node["id"],
                    "type": node["type"],
                    "label_et": node.get("label_et"),
                    "source_url": node.get("source_url"),
                    "source_authority": node.get("source_authority"),
                }
            )

    reachable_comp_los, nearest_comp_paths = paths_to_competence(new_by_id, new_edges)
    strict_comp_coverage = competence_coverage_by_distance(new_by_id, new_edges)
    direct_comp_los = set()
    competence_unit_los = set()
    for edge in new_edges:
        if edge["source"] in new_by_id and new_by_id[edge["source"]]["type"] == "LearningOutcome":
            if edge["type"] == "has_competence_unit":
                competence_unit_los.add(edge["source"])
        if edge["target"] in new_by_id and new_by_id[edge["target"]]["type"] in {"GeneralCompetence", "TransversalTheme", "DomainCompetence", "StageCompetenceExpectation"}:
            if edge["source"] in new_by_id and new_by_id[edge["source"]]["type"] == "LearningOutcome":
                direct_comp_los.add(edge["source"])

    missing_comp_rows = []
    for lo_id in new_lo_ids:
        if lo_id not in strict_comp_coverage[3] and lo_id not in competence_unit_los:
            node = new_by_id[lo_id]
            missing_comp_rows.append(
                {
                    "id": lo_id,
                    "label_et": node.get("label_et"),
                    "subject": node.get("subject"),
                    "grades": node.get("grades"),
                    "school_stages": node.get("school_stages"),
                    "unit_edges": lo_unit_counts[lo_id],
                }
            )

    deg_rows = []
    for node in new_nodes:
        if node["type"] in {"LearningOutcome", "KnowledgeUnit", "SkillUnit", "CompetenceUnit", "TaskSubtype", "AssessmentCriterion", "CriterionDimension", "GeneralCompetence", "TransversalTheme"}:
            d = new_deg[node["id"]]
            deg_rows.append({"id": node["id"], "type": node["type"], "label_et": node.get("label_et"), "degree": d["total"], "in_degree": d["in"], "out_degree": d["out"]})
    deg_rows.sort(key=lambda row: (row["degree"], row["type"], row["label_et"] or ""))

    legacy_components = component_sizes(legacy_nodes, legacy_edges)
    new_components = component_sizes(new_nodes, new_edges)
    new_core_nodes = [node for node in new_nodes if node["type"] not in {"Material", "SourceDocument", "EvidenceSpan"}]
    new_core_ids = {node["id"] for node in new_core_nodes}
    new_core_edges = [edge for edge in new_edges if edge["source"] in new_core_ids and edge["target"] in new_core_ids]
    new_core_components = component_sizes(new_core_nodes, new_core_edges)

    write_csv(REPORTS / "graph_quality_uncovered_learning_outcomes.csv", uncovered_los)
    write_csv(REPORTS / "graph_quality_learning_outcomes_missing_competence_path.csv", missing_comp_rows)
    write_csv(REPORTS / "graph_quality_low_degree_core_nodes.csv", deg_rows[:300])
    write_csv(REPORTS / "graph_quality_isolated_nodes.csv", isolated_rows)

    edge_node_ratio = len(new_edges) / max(len(new_nodes), 1)
    core_edge_node_ratio = len(new_core_edges) / max(len(new_core_nodes), 1)
    legacy_ratio = len(legacy_edges) / max(len(legacy_nodes), 1)
    report = [
        "# V2 Canonical Graph Quality Analysis",
        "",
        "## Summary",
        "",
        f"- New graph: {len(new_nodes):,} nodes, {len(new_edges):,} edges, edge/node ratio {edge_node_ratio:.2f}.",
        f"- New core graph without `Material`/`SourceDocument`/`EvidenceSpan`: {len(new_core_nodes):,} nodes, {len(new_core_edges):,} edges, edge/node ratio {core_edge_node_ratio:.2f}.",
        f"- Legacy graph: {len(legacy_nodes):,} nodes, {len(legacy_edges):,} edges, edge/node ratio {legacy_ratio:.2f}.",
        f"- New graph has {new_node_counts['LearningOutcome']:,} learning outcomes vs {legacy_node_counts['LearningOutcome']:,} in legacy.",
        f"- New graph has {new_node_counts['KnowledgeUnit'] + new_node_counts['SkillUnit'] + new_node_counts['CompetenceUnit']:,} canonical learning units vs {legacy_node_counts['Knowledge'] + legacy_node_counts['Skill'] + legacy_node_counts['Competence']:,} fuzzy legacy learning nodes.",
        f"- Official learning outcome coverage by canonical units: {len(new_lo_ids) - len(uncovered_los):,}/{len(new_lo_ids):,} ({(len(new_lo_ids) - len(uncovered_los)) / max(len(new_lo_ids), 1):.1%}).",
        f"- Learning outcomes with an explicit `has_competence_unit`: {len(competence_unit_los):,}/{len(new_lo_ids):,} ({len(competence_unit_los) / max(len(new_lo_ids), 1):.1%}).",
        f"- Learning outcomes with an explicit/direct competence overlay edge: {len(direct_comp_los):,}/{len(new_lo_ids):,} ({len(direct_comp_los) / max(len(new_lo_ids), 1):.1%}).",
        f"- Learning outcomes within 2 graph hops of a competence/theme overlay node: {len(strict_comp_coverage[2]):,}/{len(new_lo_ids):,} ({len(strict_comp_coverage[2]) / max(len(new_lo_ids), 1):.1%}).",
        f"- Learning outcomes within 3 graph hops of a competence/theme overlay node: {len(strict_comp_coverage[3]):,}/{len(new_lo_ids):,} ({len(strict_comp_coverage[3]) / max(len(new_lo_ids), 1):.1%}).",
        "",
        "## Oppekava Basis Change",
        "",
        f"- Learning outcome labels carried/covered from legacy by normalized label: {len(legacy_lo_labels & new_lo_labels):,}/{len(legacy_lo_labels):,}.",
        f"- New learning outcome labels not in legacy: {len(new_lo_labels - legacy_lo_labels):,}.",
        f"- Topic labels carried/covered from legacy by normalized label: {len(legacy_topic_labels & new_topic_labels):,}/{len(legacy_topic_labels):,}.",
        f"- New topic labels not in legacy: {len(new_topic_labels - legacy_topic_labels):,}.",
        "- Link model changed substantially: legacy used fuzzy `has_skill`, `has_knowledge`, `mentions`, `aligned_to`; v2 separates canonical unit, task, assessment, level, competence, material, source, and evidence relations.",
        "",
        "## Density And Integration",
        "",
        f"- Full graph largest connected component: {new_components[0]:,} nodes ({new_components[0] / max(len(new_nodes), 1):.1%}).",
        f"- Core graph largest connected component: {new_core_components[0]:,} nodes ({new_core_components[0] / max(len(new_core_nodes), 1):.1%}).",
        f"- Isolated full-graph nodes: {len(isolated_rows):,}; most are source/provenance leftovers and isolated assessment/task/competence nodes.",
        "- The edge/node ratio is not automatically bad: curriculum KGs are hierarchical and evidence-heavy, not social networks. But the core ratio is still too low for a mature instructional graph because tasks, criteria, units, and competences should be more cross-linked.",
        "",
        "## General Competence Integration",
        "",
        f"- General/cross-curricular overlay nodes: {new_node_counts['GeneralCompetence'] + new_node_counts['TransversalTheme'] + new_node_counts['DomainCompetence'] + new_node_counts['StageCompetenceExpectation']:,}.",
        f"- CompetenceUnit nodes: {new_node_counts['CompetenceUnit']:,}.",
        f"- Edges to curriculum competence/theme layer: `has_general_competence` {new_edge_counts['has_general_competence']}, `has_transversal_theme` {new_edge_counts['has_transversal_theme']}, `has_domain_competence` {new_edge_counts['has_domain_competence']}, `has_stage_competence_expectation` {new_edge_counts['has_stage_competence_expectation']}.",
        f"- Learning outcomes are not yet directly mapped to general competences. Only {len(competence_unit_los):,} outcomes have competence-unit children, and {len(direct_comp_los):,} have direct `LearningOutcome -> GeneralCompetence/TransversalTheme/DomainCompetence/StageCompetenceExpectation` edges.",
        "- Conclusion: the general competences are present as a taxonomy layer, but integration is shallow. For the intended use, every LearningOutcome should get 1-3 LLM-adjudicated competence/theme alignments with confidence and evidence/rationale.",
        "",
        "## Quality Judgment",
        "",
        "- Improved over legacy: broader official coverage, cleaner canonical unit layer, far fewer duplicate core labels, explicit task/assessment/level/competence types, and better source inventory.",
        "- Still weak: competence integration, task/criterion-to-unit links, material-to-unit coverage, isolated assessment/task nodes, and lack of direct exercise/test affordance paths for many units.",
        "- Recommended next graph iteration: LLM-adjudicate `LearningOutcome -> GeneralCompetence/TransversalTheme/DomainCompetence` alignments, then add `TaskSubtype -> SkillUnit` and `CriterionDimension -> SkillUnit/KnowledgeUnit` links.",
        "",
        "## Audit CSVs",
        "",
        "- `reports/graph_quality_uncovered_learning_outcomes.csv`",
        "- `reports/graph_quality_learning_outcomes_missing_competence_path.csv`",
        "- `reports/graph_quality_low_degree_core_nodes.csv`",
        "- `reports/graph_quality_isolated_nodes.csv`",
    ]
    (REPORTS / "v2_canonical_graph_quality_analysis.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"report": str(REPORTS / "v2_canonical_graph_quality_analysis.md"), "uncovered_learning_outcomes": len(uncovered_los), "missing_competence_path_3hop": len(missing_comp_rows), "direct_competence_los": len(direct_comp_los), "edge_node_ratio": edge_node_ratio, "core_edge_node_ratio": core_edge_node_ratio}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
