from __future__ import annotations

import csv
import json
import re
from collections import Counter, deque
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl
from build_v2_unified_graph import xml_safe


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
BACKLOG = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "legacy_backlog"
REPORTS = PROJECT_ROOT / "reports"
DOMAIN_ID = "curriculum_domain:keel_ja_kirjandus"


VALID_TYPES = {
    "KnowledgeUnit",
    "SkillUnit",
    "CompetenceUnit",
    "Topic",
    "TaskSubtype",
    "AssessmentCriterion",
    "CriterionDimension",
}
UNIT_EDGE = {
    "KnowledgeUnit": "has_knowledge_unit",
    "SkillUnit": "has_skill_unit",
    "CompetenceUnit": "has_competence_unit",
}
REL_TYPES = {"same_as", "broader_than", "narrower_than", "related_to", "supports_progression_to"}


def repair_text(value: Any) -> Any:
    if isinstance(value, str):
        replacements = {
            "Ãµ": "õ",
            "Ã•": "Õ",
            "Ã¤": "ä",
            "Ã„": "Ä",
            "Ã¶": "ö",
            "Ã–": "Ö",
            "Ã¼": "ü",
            "Ãœ": "Ü",
            "Å¡": "š",
            "Å¾": "ž",
            "?pilane": "Õpilane",
            "?ppija": "Õppija",
            "t??": "töö",
            "t?": "tõ",
            "s?": "sõ",
            "p?": "põ",
            "v?": "võ",
            "?ig": "õig",
            "?pit": "õpit",
        }
        for bad, good in replacements.items():
            value = value.replace(bad, good)
        return value
    if isinstance(value, list):
        return [repair_text(item) for item in value]
    if isinstance(value, dict):
        return {key: repair_text(item) for key, item in value.items()}
    return value


def slug(text: str, max_len: int = 72) -> str:
    text = text.lower()
    for src, dst in {"õ": "o", "ä": "a", "ö": "o", "ü": "u", "š": "s", "ž": "z"}.items():
        text = text.replace(src, dst)
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    return text[:max_len].strip("_") or "unit"


def edge_id(source: str, target: str, edge_type: str) -> str:
    return "edge:" + sha1_text(f"{source}|{target}|{edge_type}", 20)


def node_id(public_type: str, label: str, legacy_id: str) -> str:
    kind = public_type.lower().replace("unit", "")
    return f"legacy_canonical:{kind}:{slug(label)}:{sha1_text(legacy_id + label, 8)}"


def label_ok(label: str) -> bool:
    label = (label or "").strip()
    if len(label) < 8:
        return False
    if label.endswith((" ja", " ning", " või", ",", ":")):
        return False
    if "..." in label or "................" in label:
        return False
    if "?" in label:
        return False
    return True


def add_edge(edges: dict[str, dict[str, Any]], source: str, target: str, edge_type: str, method: str, confidence: float, reason: str | None = None) -> None:
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
        "source_authority": "llm_legacy_backlog",
        "graph_version": "v2_curriculum_focus_2026-05-21",
        "schema_version": "kg_schema_v2_2026-05-20",
        "review_status": "llm_backlog_integrated",
        "created_at": now_iso(),
    }
    if reason:
        edges[eid]["reason"] = reason


def connected_to_root(node_ids: set[str], edges: dict[str, dict[str, Any]]) -> set[str]:
    root = "curriculum:riiklik_oppekava"
    adj = {node_id: set() for node_id in node_ids}
    for edge in edges.values():
        if edge["source"] in adj and edge["target"] in adj:
            adj[edge["source"]].add(edge["target"])
            adj[edge["target"]].add(edge["source"])
    if root not in adj:
        return set()
    seen = {root}
    q = deque([root])
    while q:
        cur = q.popleft()
        for nxt in adj[cur]:
            if nxt not in seen:
                seen.add(nxt)
                q.append(nxt)
    return seen


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


def export(nodes: list[dict[str, Any]], edges: dict[str, dict[str, Any]]) -> None:
    edge_rows = list(edges.values())
    write_jsonl(FOCUS / "nodes.jsonl", nodes)
    write_jsonl(FOCUS / "edges.jsonl", edge_rows)
    write_csv(FOCUS / "nodes.csv", nodes)
    write_csv(FOCUS / "edges.csv", edge_rows)
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


def read_decisions() -> list[dict[str, Any]]:
    rows = []
    for path in sorted(BACKLOG.glob("legacy_backlog_batch_*.decisions.jsonl")):
        for row in read_jsonl(path):
            rows.append(repair_text(row))
    return rows


def main() -> None:
    nodes = [repair_text(node) for node in read_jsonl(FOCUS / "nodes.jsonl")]
    edges = {edge["id"]: edge for edge in read_jsonl(FOCUS / "edges.jsonl")}
    node_by_id = {node["id"]: node for node in nodes}
    decisions = read_decisions()
    accepted = []
    quarantined = []

    for row in decisions:
        decision = row.get("decision")
        confidence = float(row.get("confidence") or 0)
        label = (row.get("new_label_et") or "").strip()
        public_type = row.get("new_public_type")
        target = row.get("target_canonical_id")
        reason = row.get("reason")
        if decision in {"map_to_existing", "merge_into_broader"}:
            if target in node_by_id and confidence >= 0.65:
                relation = row.get("relation_to_target") if row.get("relation_to_target") in REL_TYPES else "related_to"
                add_edge(edges, row["legacy_id"], target, relation, "llm_legacy_backlog_mapping", confidence, reason)
                # If the legacy source node does not exist in focus graph, keep the mapping as report-only.
                if row["legacy_id"] not in node_by_id:
                    quarantined.append({**row, "quarantine_reason": "mapping_source_not_focus_node_report_only"})
                else:
                    accepted.append({**row, "integrated_as": "mapping_edge"})
            else:
                quarantined.append({**row, "quarantine_reason": "missing_target_or_low_confidence"})
            continue
        if decision not in {"add_new_canonical", "demote_to_topic", "demote_to_task", "demote_to_criterion"}:
            continue
        if decision == "demote_to_topic":
            public_type = "Topic"
        elif decision == "demote_to_task":
            public_type = "TaskSubtype"
        elif decision == "demote_to_criterion" and public_type not in {"AssessmentCriterion", "CriterionDimension"}:
            public_type = "CriterionDimension"
        if confidence < 0.7 or public_type not in VALID_TYPES or not label_ok(label):
            quarantined.append({**row, "quarantine_reason": "failed_quality_gate"})
            continue
        nid = node_id(public_type, label, row["legacy_id"])
        if nid not in node_by_id:
            node = {
                "id": nid,
                "type": public_type,
                "label_et": label,
                "source_system": "legacy_backlog_llm",
                "source_url": None,
                "source_authority": "legacy_backlog_llm",
                "status": "canonical_candidate",
                "confidence": confidence,
                "evidence": [],
                "graph_version": "v2_curriculum_focus_2026-05-21",
                "schema_version": "kg_schema_v2_2026-05-20",
                "review_status": "llm_backlog_integrated",
                "description": row.get("definition_et"),
                "legacy_id": row.get("legacy_id"),
                "integration_reason": reason,
            }
            nodes.append(node)
            node_by_id[nid] = node
        # Attach to explicit outcomes where the adjudicator supplied them.
        linked = False
        for lo_id in row.get("link_to_learning_outcome_ids") or []:
            if lo_id in node_by_id and public_type in UNIT_EDGE:
                add_edge(edges, lo_id, nid, UNIT_EDGE[public_type], "llm_legacy_backlog_outcome_link", confidence, reason)
                linked = True
        if public_type == "Topic":
            add_edge(edges, DOMAIN_ID, nid, "has_topic", "llm_legacy_backlog_domain_topic", max(0.5, confidence - 0.1), reason)
            linked = True
        elif public_type == "TaskSubtype":
            add_edge(edges, nid, DOMAIN_ID, "part_of", "llm_legacy_backlog_task_domain_backlink", max(0.45, confidence - 0.2), reason)
            linked = True
        elif public_type in {"AssessmentCriterion", "CriterionDimension"}:
            add_edge(edges, nid, DOMAIN_ID, "part_of", "llm_legacy_backlog_assessment_domain_backlink", max(0.45, confidence - 0.2), reason)
            linked = True
        if not linked:
            add_edge(edges, nid, DOMAIN_ID, "part_of", "llm_legacy_backlog_domain_backlink", max(0.45, confidence - 0.25), reason)
        if target in node_by_id and row.get("relation_to_target") in REL_TYPES:
            add_edge(edges, nid, target, row["relation_to_target"], "llm_legacy_backlog_relation", confidence, reason)
        accepted.append({**row, "integrated_as": "new_node", "new_node_id": nid})

    # Explicit correction for the wrongly rejected comment-writing skill.
    comment_label = "Kirjutab päevakajalisele tekstile kommentaari"
    comment_id = node_id("SkillUnit", comment_label, "manual:kirjutab_paevakajalisele_tekstile_kommentaari")
    if comment_id not in node_by_id:
        node = {
            "id": comment_id,
            "type": "SkillUnit",
            "label_et": comment_label,
            "source_system": "manual_llm_correction",
            "source_url": None,
            "source_authority": "manual_llm_correction",
            "status": "canonical_candidate",
            "confidence": 0.86,
            "evidence": [],
            "graph_version": "v2_curriculum_focus_2026-05-21",
            "schema_version": "kg_schema_v2_2026-05-20",
            "review_status": "manual_llm_correction",
            "description": "Õpilane kirjutab päevakajalise teksti kohta asjakohase kommentaari.",
            "legacy_id": "canonical:kirjutab-paevakajalisele-tekstile-kommentaari-eesti-keel:8705703e94",
            "integration_reason": "Previously rejected legacy row is semantically valid and should exist under commenting/opinion-writing skills.",
        }
        nodes.append(node)
        node_by_id[comment_id] = node
    for lo_id in ["official:learning_outcomes:71d73d0c847da5d17d9f", "official:learning_outcomes:42d5efe16b5ed3b2914e"]:
        if lo_id in node_by_id:
            add_edge(edges, lo_id, comment_id, "has_skill_unit", "manual_comment_skill_correction", 0.86, "Comment-writing is a specific written form of commenting on / responding to a text.")
    broader = "canonical:skill:kommenteerib_teksti:7057654d"
    if broader in node_by_id:
        add_edge(edges, comment_id, broader, "narrower_than", "manual_comment_skill_correction", 0.86, "Writing a topical comment is a narrower written form of commenting on a text.")
    task = "task_subtype:veebikommentaar"
    if task in node_by_id:
        add_edge(edges, task, comment_id, "assesses", "manual_comment_skill_correction", 0.78, "A web/comment task can assess writing an appropriate comment on a topical text.")
    accepted.append({"legacy_id": "canonical:kirjutab-paevakajalisele-tekstile-kommentaari-eesti-keel:8705703e94", "decision": "manual_correction", "integrated_as": "new_node", "new_node_id": comment_id})

    # Ensure no focus node is disconnected from the curriculum root.
    node_ids = {node["id"] for node in nodes}
    connected = connected_to_root(node_ids, edges)
    for node in nodes:
        if node["id"] not in connected and node["id"] != "curriculum:riiklik_oppekava":
            add_edge(edges, node["id"], DOMAIN_ID, "part_of", "llm_legacy_backlog_no_singletons_backlink", 0.45, "Projection invariant: all curriculum nodes trace back to the domain/root.")

    export(nodes, edges)
    write_csv(REPORTS / "legacy_backlog_integrated_rows.csv", accepted)
    write_csv(REPORTS / "legacy_backlog_quarantined_rows.csv", quarantined)

    edge_rows = list(edges.values())
    connected_final = connected_to_root({node["id"] for node in nodes}, edges)
    report = [
        "# Legacy Backlog Integration",
        "",
        f"- Decisions read: {len(decisions):,}",
        f"- Integrated rows: {len(accepted):,}",
        f"- Quarantined rows: {len(quarantined):,}",
        f"- Focus graph nodes after integration: {len(nodes):,}",
        f"- Focus graph edges after integration: {len(edge_rows):,}",
        f"- Nodes not connected to curriculum root: {len(nodes) - len(connected_final):,}",
        "",
        "## Integrated Decision Counts",
        "",
    ]
    for key, value in Counter(row.get("decision") for row in accepted).most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Quarantine Reasons", ""])
    for key, value in Counter(row.get("quarantine_reason") for row in quarantined).most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(
        [
            "",
            "## Manual Correction",
            "",
            "- Added `Kirjutab päevakajalisele tekstile kommentaari` as a valid `SkillUnit`, linked to `Kommenteerib teksti` and relevant learning outcomes.",
        ]
    )
    (REPORTS / "legacy_backlog_integration_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"integrated": len(accepted), "quarantined": len(quarantined), "nodes": len(nodes), "edges": len(edge_rows), "not_connected_to_root": len(nodes) - len(connected_final)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
