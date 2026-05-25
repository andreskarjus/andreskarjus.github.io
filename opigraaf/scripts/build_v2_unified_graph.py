from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Iterable

import networkx as nx
import yaml

from common import ROOT as PROJECT_ROOT
from common import now_iso, read_jsonl, sha1_text, write_jsonl


GRAPH_VERSION_DEFAULT = "v2_unified_pilot_2026-05-21"
SCHEMA_VERSION_DEFAULT = "kg_schema_v2_2026-05-20"
REFINED_READY = {"candidate", "candidate_refined"}
CONTROL_SOURCE = "architecture_v2_controlled_taxonomy"


def xml_safe(value: Any) -> Any:
    if value is None:
        return ""
    if isinstance(value, (int, float, bool)):
        return value
    text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False, sort_keys=True)
    text = "".join(ch if ch in "\t\n\r" or ord(ch) >= 32 else " " for ch in text)
    return text[:32000]


def repair_mojibake(text: str) -> str:
    if not any(marker in text for marker in ("Ã", "Å", "Â")):
        return text
    try:
        repaired = text.encode("latin1").decode("utf-8")
    except UnicodeError:
        return text
    bad_before = sum(text.count(marker) for marker in ("Ã", "Å", "Â"))
    bad_after = sum(repaired.count(marker) for marker in ("Ã", "Å", "Â"))
    return repaired if bad_after < bad_before else text


def short_label(value: Any, fallback: str = "") -> str:
    text = repair_mojibake(str(value or fallback).strip())
    text = re.sub(r"\s+", " ", text)
    return text


def stable_id(prefix: str, value: Any) -> str:
    base = short_label(value, prefix).lower()
    base = (
        base.replace("õ", "o")
        .replace("ä", "a")
        .replace("ö", "o")
        .replace("ü", "u")
        .replace("š", "s")
        .replace("ž", "z")
    )
    base = re.sub(r"[^a-z0-9]+", "_", base).strip("_")
    if not base:
        base = sha1_text(str(value))[:12]
    return f"{prefix}:{base[:96]}"


def source_doc_id(source_url: str | None, source_file: str | None = None) -> str:
    key = source_url or source_file or "unknown_source"
    return f"source_document:{sha1_text(key)[:16]}"


def evidence_ids(value: Any) -> list[str]:
    if not value:
        return []
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        ids: list[str] = []
        for item in value:
            if isinstance(item, str):
                ids.append(item)
            elif isinstance(item, dict) and item.get("id"):
                ids.append(str(item["id"]))
        return sorted(set(ids))
    return []


def id_values(value: Any) -> list[str]:
    if not value:
        return []
    if isinstance(value, str):
        return [value]
    if isinstance(value, dict):
        for key in ("id", "target_id", "learning_outcome_id", "url", "fullurl"):
            if value.get(key):
                return [str(value[key])]
        return []
    if isinstance(value, list):
        ids: list[str] = []
        for item in value:
            ids.extend(id_values(item))
        return sorted(set(ids))
    return []


def public_unit_ready(record: dict[str, Any]) -> bool:
    if record.get("graph_ready_status") not in REFINED_READY:
        return False
    if record.get("comparison_ready") is not True:
        return False
    flags = set(record.get("quality_flags") or [])
    if flags & {"long_teacher_label", "truncated"}:
        return False
    if float(record.get("confidence") or 0) < 0.5:
        return False
    return True


def public_task_ready(record: dict[str, Any]) -> bool:
    if record.get("graph_ready_status") not in REFINED_READY:
        return False
    if record.get("generation_ready") is not True:
        return False
    if float(record.get("confidence") or 0) < 0.55:
        return False
    return True


def infer_authority(record: dict[str, Any]) -> str:
    authority = record.get("source_authority")
    if authority:
        return str(authority)
    url = str(record.get("source_url") or "")
    source_system = str(record.get("source_system") or "")
    if "riigiteataja.ee" in url:
        return "legal"
    if "oppekava.edu.ee" in url or source_system.startswith("oppekava"):
        return "official"
    if "ekk.edu.ee" in url or "harno" in url:
        return "official"
    if source_system in {"controlled_taxonomy", "architecture_v2"}:
        return "internal_taxonomy"
    return "supporting"


class GraphBuilder:
    def __init__(self, graph_version: str, schema_version: str) -> None:
        self.graph_version = graph_version
        self.schema_version = schema_version
        self.nodes: dict[str, dict[str, Any]] = {}
        self.edges: dict[str, dict[str, Any]] = {}
        self.edge_index: set[tuple[str, str, str]] = set()
        self.node_evidence: dict[str, set[str]] = defaultdict(set)
        self.now = now_iso()

    def add_node(
        self,
        node_id: str,
        node_type: str,
        label: str,
        *,
        source_system: str = "structured_v2",
        source_url: str | None = None,
        source_authority: str = "supporting",
        status: str = "candidate",
        confidence: float = 0.7,
        evidence: Iterable[str] | None = None,
        review_status: str = "unreviewed",
        **attrs: Any,
    ) -> dict[str, Any]:
        label = short_label(label, node_id)
        ev = set(evidence or [])
        if node_id in self.nodes:
            node = self.nodes[node_id]
            node["confidence"] = max(float(node.get("confidence", 0)), float(confidence))
            if source_url and not node.get("source_url"):
                node["source_url"] = source_url
            if source_authority == "official" and node.get("source_authority") != "legal":
                node["source_authority"] = source_authority
            if label and (not node.get("label_et") or len(label) > len(str(node["label_et"]))):
                node["label_et"] = label
            for key, value in attrs.items():
                if value in (None, "", [], {}):
                    continue
                if isinstance(value, str):
                    value = repair_mojibake(value)
                if key not in node or node[key] in (None, "", [], {}):
                    node[key] = value
            self.node_evidence[node_id].update(ev)
            node["evidence"] = sorted(self.node_evidence[node_id])
            return node

        node = {
            "id": node_id,
            "type": node_type,
            "label_et": label,
            "source_system": source_system,
            "source_url": source_url,
            "source_authority": source_authority,
            "status": status,
            "confidence": round(float(confidence), 4),
            "evidence": sorted(ev),
            "graph_version": self.graph_version,
            "schema_version": self.schema_version,
            "review_status": review_status,
        }
        for key, value in attrs.items():
            if value not in (None, "", [], {}):
                if isinstance(value, str):
                    value = repair_mojibake(value)
                node[key] = value
        self.nodes[node_id] = node
        self.node_evidence[node_id].update(ev)
        return node

    def add_edge(
        self,
        source: str,
        target: str,
        edge_type: str,
        *,
        confidence: float = 0.7,
        method: str = "structured_extraction",
        evidence: Iterable[str] | None = None,
        source_url: str | None = None,
        source_authority: str = "supporting",
        review_status: str = "unreviewed",
        **attrs: Any,
    ) -> dict[str, Any] | None:
        if source not in self.nodes or target not in self.nodes:
            return None
        key = (source, target, edge_type)
        if key in self.edge_index:
            edge_id = f"edge:{sha1_text(source + '|' + target + '|' + edge_type)[:20]}"
            edge = self.edges[edge_id]
            edge["confidence"] = max(float(edge.get("confidence", 0)), float(confidence))
            merged = sorted(set(edge.get("evidence", [])) | set(evidence or []))
            edge["evidence"] = merged
            return edge
        self.edge_index.add(key)
        edge_id = f"edge:{sha1_text(source + '|' + target + '|' + edge_type)[:20]}"
        edge = {
            "id": edge_id,
            "source": source,
            "target": target,
            "type": edge_type,
            "confidence": round(float(confidence), 4),
            "method": method,
            "evidence": sorted(set(evidence or [])),
            "source_url": source_url,
            "source_authority": source_authority,
            "graph_version": self.graph_version,
            "schema_version": self.schema_version,
            "review_status": review_status,
            "created_at": self.now,
        }
        for key_attr, value in attrs.items():
            if value not in (None, "", [], {}):
                edge[key_attr] = value
        self.edges[edge_id] = edge
        return edge


def read_refined(project_root: Path) -> dict[str, list[dict[str, Any]]]:
    base = project_root / "data" / "processed" / "structured" / "v2"
    refined = base / "refined"
    return {
        "official": read_jsonl(base / "official_backbone.jsonl"),
        "evidence_spans": read_jsonl(base / "evidence_spans.jsonl"),
        "general_competence_taxonomy": read_jsonl(base / "general_competence_taxonomy.jsonl"),
        "task_taxonomy": read_jsonl(base / "task_taxonomy.jsonl"),
        "criterion_taxonomy": read_jsonl(base / "criterion_taxonomy.jsonl"),
        "level_expectations": read_jsonl(base / "level_expectations.jsonl"),
        "rubric_scale_points": read_jsonl(base / "rubric_scale_points.jsonl"),
        "material_signals": read_jsonl(base / "material_signals.jsonl"),
        "learning_units": read_jsonl(refined / "learning_unit_candidates.refined.jsonl"),
        "task_signals": read_jsonl(refined / "task_signals.refined.jsonl"),
        "criterion_evidence": read_jsonl(refined / "criterion_evidence.refined.jsonl"),
        "competence_expressions": read_jsonl(refined / "competence_expressions.refined.jsonl"),
    }


def add_source_documents(g: GraphBuilder, records: Iterable[dict[str, Any]]) -> None:
    for rec in records:
        source_url = rec.get("source_url")
        source_file = rec.get("source_file")
        if not source_url and not source_file:
            continue
        node_id = source_doc_id(source_url, source_file)
        label = source_url or source_file or node_id
        g.add_node(
            node_id,
            "SourceDocument",
            label,
            source_system=rec.get("source_system") or "structured_v2",
            source_url=source_url,
            source_authority=infer_authority(rec),
            status="observed",
            confidence=0.9,
            source_file=source_file,
            document_title=rec.get("source_title") or rec.get("title"),
        )


def add_evidence_spans(g: GraphBuilder, spans: list[dict[str, Any]]) -> None:
    for rec in spans:
        node_id = rec.get("id")
        if not node_id:
            continue
        doc_id = source_doc_id(rec.get("source_url"), rec.get("source_file"))
        if doc_id not in g.nodes:
            add_source_documents(g, [rec])
        g.add_node(
            str(node_id),
            "EvidenceSpan",
            short_label(rec.get("label") or rec.get("context_snippet") or node_id)[:180],
            source_system=rec.get("source_system") or "structured_v2",
            source_url=rec.get("source_url"),
            source_authority=infer_authority(rec),
            status="observed",
            confidence=float(rec.get("confidence") or 0.85),
            context_snippet=rec.get("context_snippet"),
            chunk_role=rec.get("chunk_role"),
            grade=rec.get("grade"),
            school_stage=rec.get("school_stage"),
            subject=rec.get("subject"),
        )
        g.add_edge(
            str(node_id),
            doc_id,
            "extracted_from",
            confidence=0.95,
            method="source_document_link",
            source_url=rec.get("source_url"),
            source_authority=infer_authority(rec),
        )


def add_backbone(g: GraphBuilder, official: list[dict[str, Any]]) -> None:
    curriculum_id = "curriculum:riiklik_oppekava"
    domain_id = "curriculum_domain:keel_ja_kirjandus"
    g.add_node(
        curriculum_id,
        "NationalCurriculum",
        "Riiklik õppekava",
        source_system="riiklik_oppekava",
        source_url="https://www.riigiteataja.ee/",
        source_authority="legal",
        status="controlled",
        confidence=0.95,
        review_status="accepted_controlled",
    )
    g.add_node(
        domain_id,
        "CurriculumDomain",
        "Keel ja kirjandus",
        source_system="riiklik_oppekava",
        source_url="https://www.riigiteataja.ee/",
        source_authority="legal",
        status="controlled",
        confidence=0.95,
        review_status="accepted_controlled",
    )
    g.add_edge(curriculum_id, domain_id, "contains", confidence=0.95, method="controlled_backbone", source_authority="legal")

    for subject_id, subject_label in [("subject:eesti_keel", "Eesti keel"), ("subject:kirjandus", "Kirjandus")]:
        g.add_node(
            subject_id,
            "Subject",
            subject_label,
            source_system="controlled_backbone",
            source_url=None,
            source_authority="internal_taxonomy",
            status="controlled",
            confidence=0.72,
            review_status="accepted_controlled",
        )
        g.add_edge(domain_id, subject_id, "contains", confidence=0.72, method="controlled_subject_backbone", source_authority="internal_taxonomy")

    seen_stages: set[str] = set()
    seen_grades: set[str] = set()
    topic_by_url: dict[str, str] = {}
    topic_by_label: dict[str, str] = {}
    for rec in official:
        if rec.get("record_type") == "topics" and rec.get("id"):
            topic_id = str(rec["id"])
            if rec.get("source_url"):
                topic_by_url[str(rec["source_url"])] = topic_id
            label = short_label(rec.get("label_et") or rec.get("label") or rec.get("title"))
            if label:
                topic_by_label[label.lower()] = topic_id

    def subject_node_id(subject: Any) -> str:
        if subject == "Eesti keel":
            return "subject:eesti_keel"
        if subject == "Kirjandus":
            return "subject:kirjandus"
        return stable_id("subject", subject or "unknown_subject")

    for rec in official:
        rec_type = rec.get("record_type")
        rec_id = rec.get("id")
        ev = evidence_ids(rec.get("evidence_ids"))
        authority = infer_authority(rec)
        if rec_type == "subject_pages" and rec_id:
            subject_id = subject_node_id(rec.get("subject") or rec.get("label_et") or rec.get("label"))
            g.add_node(
                subject_id,
                "Subject",
                rec.get("label_et") or rec.get("label") or rec.get("subject") or subject_id,
                source_system=rec.get("source_system") or "oppekava",
                source_url=rec.get("source_url"),
                source_authority=authority,
                status="observed",
                confidence=float(rec.get("confidence") or 0.9),
                evidence=ev,
                subject_key=rec.get("subject"),
                source_record_id=str(rec_id),
                review_status="accepted_official",
            )
            g.add_edge(domain_id, subject_id, "contains", confidence=0.9, method="official_subject_page", evidence=ev, source_url=rec.get("source_url"), source_authority=authority)

        elif rec_type == "topics" and rec_id:
            subject = rec.get("subject")
            subject_id = subject_node_id(subject)
            g.add_node(
                str(rec_id),
                "Topic",
                rec.get("label_et") or rec.get("label") or rec.get("title") or rec_id,
                source_system=rec.get("source_system") or "oppekava",
                source_url=rec.get("source_url"),
                source_authority=authority,
                status="observed",
                confidence=float(rec.get("confidence") or 0.82),
                evidence=ev,
                subject=subject,
                topic_code=rec.get("topic_code"),
                parent_topic=rec.get("parent_topic"),
            )
            if subject_id in g.nodes:
                g.add_edge(subject_id, str(rec_id), "has_topic", confidence=0.8, method="official_topic_subject", evidence=ev, source_url=rec.get("source_url"), source_authority=authority)

        elif rec_type == "learning_outcomes" and rec_id:
            subject = rec.get("subject")
            subject_id = subject_node_id(subject)
            g.add_node(
                str(rec_id),
                "LearningOutcome",
                rec.get("label_et") or rec.get("label") or rec.get("title") or rec_id,
                source_system=rec.get("source_system") or "oppekava",
                source_url=rec.get("source_url"),
                source_authority=authority,
                status="observed",
                confidence=float(rec.get("confidence") or 0.86),
                evidence=ev,
                subject=subject,
                grades=rec.get("grades"),
                school_stages=rec.get("school_stages"),
                topics=rec.get("topics"),
                linked_material_topics=rec.get("linked_material_topics"),
                concepts=rec.get("concepts"),
                review_status="accepted_official",
            )
            if subject_id in g.nodes:
                g.add_edge(subject_id, str(rec_id), "has_learning_outcome", confidence=0.84, method="official_outcome_subject", evidence=ev, source_url=rec.get("source_url"), source_authority=authority)
            for stage in rec.get("school_stages") or []:
                stage_id = stable_id("stage", stage)
                if stage_id not in seen_stages:
                    g.add_node(stage_id, "SchoolStage", stage, source_system="official_backbone", source_url=rec.get("source_url"), source_authority=authority, status="observed", confidence=0.86, evidence=ev)
                    seen_stages.add(stage_id)
                if subject_id in g.nodes:
                    g.add_edge(subject_id, stage_id, "has_stage", confidence=0.75, method="official_outcome_stage", evidence=ev, source_url=rec.get("source_url"), source_authority=authority)
            for grade in rec.get("grades") or []:
                grade_id = stable_id("grade", grade)
                if grade_id not in seen_grades:
                    g.add_node(grade_id, "Grade", grade, source_system="official_backbone", source_url=rec.get("source_url"), source_authority=authority, status="observed", confidence=0.86, evidence=ev)
                    seen_grades.add(grade_id)
                if subject_id in g.nodes:
                    g.add_edge(subject_id, grade_id, "has_grade", confidence=0.75, method="official_outcome_grade", evidence=ev, source_url=rec.get("source_url"), source_authority=authority)
                for stage in rec.get("school_stages") or []:
                    stage_id = stable_id("stage", stage)
                    if stage_id in g.nodes:
                        g.add_edge(stage_id, grade_id, "contains", confidence=0.72, method="official_grade_stage_cooccurrence", evidence=ev, source_url=rec.get("source_url"), source_authority=authority)
            for topic in rec.get("topics") or []:
                topic_id = None
                if isinstance(topic, str) and topic.startswith("official:"):
                    topic_id = topic
                elif isinstance(topic, dict):
                    if topic.get("id"):
                        topic_id = str(topic["id"])
                    elif topic.get("url"):
                        topic_id = topic_by_url.get(str(topic["url"]))
                    if not topic_id and topic.get("label"):
                        topic_id = topic_by_label.get(short_label(topic["label"]).lower())
                if topic_id and topic_id in g.nodes:
                    g.add_edge(topic_id, str(rec_id), "has_learning_outcome", confidence=0.82, method="official_topic_outcome", evidence=ev, source_url=rec.get("source_url"), source_authority=authority)



def add_general_competence_taxonomy(g: GraphBuilder, records: list[dict[str, Any]]) -> None:
    curriculum_id = "curriculum:riiklik_oppekava"
    domain_id = "curriculum_domain:keel_ja_kirjandus"
    for rec in records:
        rec_id = rec.get("id")
        if not rec_id:
            continue
        rec_type = rec.get("candidate_class") or rec.get("type")
        node_type = str(rec_type)
        ev = evidence_ids(rec.get("evidence_ids"))
        g.add_node(
            str(rec_id),
            node_type,
            rec.get("label") or rec_id,
            source_system=rec.get("source_system") or CONTROL_SOURCE,
            source_url=rec.get("source_url"),
            source_authority=infer_authority(rec),
            status="controlled" if rec.get("source_authority") in {"legal", "official"} else "candidate",
            confidence=float(rec.get("confidence") or 0.82),
            evidence=ev,
            definition=rec.get("definition"),
            school_stage=rec.get("school_stage"),
            review_status="accepted_controlled" if rec.get("source_authority") in {"legal", "official"} else "unreviewed",
        )
        if node_type == "GeneralCompetence":
            g.add_edge(curriculum_id, str(rec_id), "has_general_competence", confidence=0.9, method="curriculum_competence_taxonomy", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))
        elif node_type == "TransversalTheme":
            g.add_edge(curriculum_id, str(rec_id), "has_transversal_theme", confidence=0.88, method="curriculum_theme_taxonomy", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))
        elif node_type == "StageCompetenceExpectation":
            g.add_edge(curriculum_id, str(rec_id), "has_stage_competence_expectation", confidence=0.86, method="curriculum_stage_competence_taxonomy", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))
            stage = rec.get("school_stage")
            if stage:
                stage_id = stable_id("stage", stage)
                if stage_id in g.nodes:
                    g.add_edge(str(rec_id), stage_id, "has_stage", confidence=0.78, method="stage_expectation_stage", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))
        elif node_type == "DomainCompetence":
            g.add_edge(domain_id, str(rec_id), "has_domain_competence", confidence=0.88, method="domain_competence_taxonomy", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))


def add_task_and_criterion_taxonomies(g: GraphBuilder, tasks: list[dict[str, Any]], criteria: list[dict[str, Any]]) -> None:
    for rec in tasks:
        rec_id = rec.get("id")
        if not rec_id:
            continue
        node_type = "TaskType" if str(rec_id).startswith("task_type:") else "TaskSubtype"
        g.add_node(
            str(rec_id),
            node_type,
            rec.get("label_et") or rec.get("label") or rec_id,
            source_system=rec.get("source_system") or CONTROL_SOURCE,
            source_url=rec.get("source_url") or "config/assessment_taxonomy_eesti_keel_kirjandus.yaml",
            source_authority="internal_taxonomy",
            status="controlled",
            confidence=float(rec.get("confidence") or 0.9),
            review_status="accepted_controlled",
            description=rec.get("description"),
            aliases=rec.get("aliases"),
        )
        parent = rec.get("parent_task_type") or rec.get("parent_id")
        if parent and parent in g.nodes:
            g.add_edge(parent, str(rec_id), "has_task_subtype", confidence=0.9, method="controlled_task_taxonomy", source_authority="internal_taxonomy")

    for rec in criteria:
        rec_id = rec.get("id")
        if not rec_id:
            continue
        candidate_class = rec.get("candidate_class")
        node_type = "AssessmentCriterion" if candidate_class == "AssessmentCriterion" else "CriterionDimension"
        g.add_node(
            str(rec_id),
            node_type,
            rec.get("label_et") or rec.get("label") or rec_id,
            source_system=rec.get("source_system") or CONTROL_SOURCE,
            source_url=rec.get("source_url") or "config/assessment_taxonomy_eesti_keel_kirjandus.yaml",
            source_authority=infer_authority(rec) if rec.get("source_authority") else "internal_taxonomy",
            status="controlled",
            confidence=float(rec.get("confidence") or 0.9),
            review_status="accepted_controlled",
            description=rec.get("description"),
        )
        parent = rec.get("parent_criterion") or rec.get("parent_id")
        if parent and parent in g.nodes:
            g.add_edge(parent, str(rec_id), "has_dimension", confidence=0.9, method="controlled_criterion_taxonomy", source_authority="internal_taxonomy")
        for subtype in rec.get("applies_to_task_subtypes") or rec.get("applies_to") or []:
            if subtype in g.nodes:
                g.add_edge(str(rec_id), subtype, "criterion_applies_to_task", confidence=0.82, method="controlled_criterion_task_alignment", source_authority="internal_taxonomy")


def add_materials(g: GraphBuilder, material_signals: list[dict[str, Any]], official: list[dict[str, Any]]) -> dict[str, str]:
    by_url: dict[str, str] = {}
    all_materials = []
    all_materials.extend(material_signals)
    all_materials.extend([rec for rec in official if rec.get("record_type") == "materials"])
    for rec in all_materials:
        url = rec.get("source_url") or rec.get("url")
        if not url:
            continue
        material_id = rec.get("id") or f"material:{sha1_text(url)[:16]}"
        by_url[str(url)] = str(material_id)
        ev = evidence_ids(rec.get("evidence_ids"))
        g.add_node(
            str(material_id),
            "Material",
            rec.get("label_et") or rec.get("label") or rec.get("title") or url,
            source_system=rec.get("source_system") or "material_signal",
            source_url=url,
            source_authority=infer_authority(rec),
            status=str(rec.get("graph_ready_status") or "candidate"),
            confidence=float(rec.get("confidence") or 0.68),
            evidence=ev,
            material_type=rec.get("material_type") or rec.get("type"),
            subject=rec.get("subject"),
            grades=rec.get("grades") or rec.get("grade"),
            school_stages=rec.get("school_stages") or rec.get("school_stage"),
        )
        doc_id = source_doc_id(str(url), rec.get("source_file"))
        if doc_id in g.nodes:
            g.add_edge(str(material_id), doc_id, "extracted_from", confidence=0.88, method="material_source_document", evidence=ev, source_url=url, source_authority=infer_authority(rec))
        subject = rec.get("subject")
        subject_id = "subject:eesti_keel" if subject == "Eesti keel" else "subject:kirjandus" if subject == "Kirjandus" else None
        if subject_id in g.nodes:
            g.add_edge(str(material_id), subject_id, "has_subject", confidence=0.74, method="material_subject_metadata", evidence=ev, source_url=url, source_authority=infer_authority(rec))
        for outcome_id in id_values(rec.get("linked_outcomes") or rec.get("aligned_learning_outcomes")):
            if outcome_id in g.nodes:
                g.add_edge(str(material_id), outcome_id, "aligned_to", confidence=0.72, method="material_outcome_alignment", evidence=ev, source_url=url, source_authority=infer_authority(rec))
    return by_url


def learning_unit_type(candidate_class: str | None) -> str:
    allowed = {"KnowledgeUnit", "SkillUnit", "CompetenceUnit", "AttitudeUnit"}
    return candidate_class if candidate_class in allowed else "KnowledgeUnit"


def add_learning_units(g: GraphBuilder, records: list[dict[str, Any]], material_by_url: dict[str, str]) -> None:
    for rec in records:
        if not public_unit_ready(rec):
            continue
        rec_id = rec.get("id")
        if not rec_id:
            continue
        node_type = learning_unit_type(rec.get("candidate_class"))
        ev = evidence_ids(rec.get("evidence_ids")) or evidence_ids(rec.get("evidence"))
        g.add_node(
            str(rec_id),
            node_type,
            rec.get("refined_label_et") or rec.get("label") or rec_id,
            source_system=rec.get("source_system") or "refined_structured_v2",
            source_url=rec.get("source_url"),
            source_authority=infer_authority(rec),
            status=str(rec.get("graph_ready_status")),
            confidence=float(rec.get("confidence") or 0.64),
            evidence=ev,
            review_status="unreviewed",
            description=rec.get("refined_description_et") or rec.get("description"),
            subject=rec.get("subject"),
            grades=rec.get("grades"),
            school_stages=rec.get("school_stages"),
            prerequisites=rec.get("prerequisites"),
            learning_context=rec.get("learning_context"),
            generation_ready=rec.get("generation_ready"),
            comparison_ready=rec.get("comparison_ready"),
            quality_flags=rec.get("quality_flags"),
            original_label=rec.get("original_label"),
        )
        edge_type = {
            "KnowledgeUnit": "has_knowledge_unit",
            "SkillUnit": "has_skill_unit",
            "CompetenceUnit": "has_competence_unit",
            "AttitudeUnit": "has_attitude_unit",
        }[node_type]
        for outcome_id in id_values(rec.get("aligned_learning_outcomes")):
            if outcome_id in g.nodes:
                g.add_edge(outcome_id, str(rec_id), edge_type, confidence=0.78, method="refined_unit_outcome_alignment", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))
        url = rec.get("source_url")
        material_id = material_by_url.get(str(url)) if url else None
        if material_id and material_id in g.nodes:
            material_edge = "teaches" if node_type == "KnowledgeUnit" else "practices" if node_type == "SkillUnit" else None
            if material_edge:
                g.add_edge(material_id, str(rec_id), material_edge, confidence=0.58, method="same_source_material_unit", evidence=ev, source_url=url, source_authority=infer_authority(rec))


def add_tasks(g: GraphBuilder, records: list[dict[str, Any]]) -> None:
    for rec in records:
        if not public_task_ready(rec):
            continue
        rec_id = rec.get("id")
        if not rec_id:
            continue
        ev = evidence_ids(rec.get("evidence_ids"))
        subtype = rec.get("aligned_task_subtype") or rec.get("task_subtype_id") or rec.get("candidate_subtype_id")
        if subtype and subtype not in g.nodes:
            g.add_node(
                str(subtype),
                "TaskSubtype",
                rec.get("candidate_subtype_label") or str(subtype).split(":")[-1].replace("_", " "),
                source_system="refined_structured_v2",
                source_url=rec.get("source_url"),
                source_authority=infer_authority(rec),
                status="candidate",
                confidence=0.55,
                evidence=ev,
                review_status="needs_review",
            )
        g.add_node(
            str(rec_id),
            "TaskInstance",
            rec.get("refined_label_et") or rec.get("label") or rec_id,
            source_system=rec.get("source_system") or "refined_structured_v2",
            source_url=rec.get("source_url"),
            source_authority=infer_authority(rec),
            status=str(rec.get("graph_ready_status")),
            confidence=float(rec.get("confidence") or 0.62),
            evidence=ev,
            review_status="unreviewed",
            description=rec.get("refined_description_et") or rec.get("description"),
            subject=rec.get("subject"),
            grades=rec.get("grades"),
            school_stages=rec.get("school_stages"),
            primary_operation=rec.get("primary_operation"),
            task_object=rec.get("task_object"),
            task_context=rec.get("task_context"),
            genre=rec.get("genre"),
            evidence_role=rec.get("evidence_role"),
            original_label=rec.get("original_label"),
        )
        if subtype and subtype in g.nodes:
            g.add_edge(str(rec_id), str(subtype), "instantiates", confidence=0.75, method="refined_task_subtype_alignment", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))


def add_level_expectations(g: GraphBuilder, records: list[dict[str, Any]]) -> None:
    for rec in records:
        rec_id = rec.get("id")
        if not rec_id:
            continue
        ev = evidence_ids(rec.get("evidence_ids"))
        g.add_node(
            str(rec_id),
            "LevelExpectation",
            rec.get("label_et") or rec.get("label") or rec_id,
            source_system=rec.get("source_system") or "level_expectation_extraction",
            source_url=rec.get("source_url"),
            source_authority=infer_authority(rec),
            status=str(rec.get("graph_ready_status") or "candidate"),
            confidence=float(rec.get("confidence") or 0.7),
            evidence=ev,
            review_status="unreviewed",
            description=rec.get("description"),
            benchmark_level=rec.get("benchmark_level"),
            subject=rec.get("subject"),
        )
        for grade in rec.get("grades") or ([rec.get("grade")] if rec.get("grade") else []):
            grade_id = stable_id("grade", grade)
            if grade_id in g.nodes:
                g.add_edge(str(rec_id), grade_id, "has_grade", confidence=0.76, method="level_expectation_grade", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))
        for stage in rec.get("school_stages") or ([rec.get("school_stage")] if rec.get("school_stage") else []):
            stage_id = stable_id("stage", stage)
            if stage_id in g.nodes:
                g.add_edge(str(rec_id), stage_id, "has_stage", confidence=0.76, method="level_expectation_stage", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))
        criterion_id = rec.get("criterion_id")
        if criterion_id in g.nodes:
            g.add_edge(str(rec_id), criterion_id, "has_criterion", confidence=0.74, method="level_expectation_criterion", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))


def add_competence_expressions(g: GraphBuilder, records: list[dict[str, Any]]) -> None:
    for rec in records:
        if rec.get("graph_ready_status") not in REFINED_READY:
            continue
        rec_id = rec.get("id")
        if not rec_id:
            continue
        ev = evidence_ids(rec.get("evidence_ids"))
        g.add_node(
            str(rec_id),
            "CompetenceExpression",
            rec.get("refined_label_et") or rec.get("label") or rec_id,
            source_system=rec.get("source_system") or "refined_structured_v2",
            source_url=rec.get("source_url"),
            source_authority=infer_authority(rec),
            status=str(rec.get("graph_ready_status")),
            confidence=float(rec.get("confidence") or 0.62),
            evidence=ev,
            review_status="unreviewed",
            description=rec.get("refined_description_et") or rec.get("description"),
            subject=rec.get("subject"),
            grades=rec.get("grades"),
            school_stages=rec.get("school_stages"),
            expression_context=rec.get("expression_context"),
            generation_ready=rec.get("generation_ready"),
            comparison_ready=rec.get("comparison_ready"),
        )
        target_id = rec.get("aligned_competence_id") or rec.get("target_id")
        target_class = rec.get("aligned_competence_class") or rec.get("target_class")
        if target_id in g.nodes:
            edge_type = "addresses_transversal_theme" if target_class == "TransversalTheme" else "aligned_to"
            g.add_edge(str(rec_id), str(target_id), edge_type, confidence=0.72, method="refined_competence_alignment", evidence=ev, source_url=rec.get("source_url"), source_authority=infer_authority(rec))


def add_adjudicated_candidates(g: GraphBuilder, records: list[dict[str, Any]], material_by_url: dict[str, str]) -> None:
    type_edge = {
        "KnowledgeUnit": "has_knowledge_unit",
        "SkillUnit": "has_skill_unit",
        "CompetenceUnit": "has_competence_unit",
        "AttitudeUnit": "has_attitude_unit",
    }
    for rec in records:
        node_type = rec.get("public_type")
        if node_type not in {
            "KnowledgeUnit",
            "SkillUnit",
            "CompetenceUnit",
            "AttitudeUnit",
            "TaskInstance",
            "TaskSubtype",
            "AssessmentCriterion",
            "CriterionDimension",
            "LevelExpectation",
            "Topic",
        }:
            continue
        source = rec.get("source_candidate") or {}
        ev = evidence_ids(rec.get("evidence_ids"))
        source_url = source.get("source_url")
        authority_record = {"source_url": source_url, "source_system": source.get("source_system"), "source_authority": source.get("source_authority")}
        confidence_by_support = {"strong": 0.82, "medium": 0.68, "weak": 0.52, "none": 0.35}
        confidence = confidence_by_support.get(rec.get("source_support"), 0.62)
        g.add_node(
            str(rec["id"]),
            str(node_type),
            rec.get("canonical_label_et") or rec["id"],
            source_system="llm_adjudication_v1",
            source_url=source_url,
            source_authority=infer_authority(authority_record),
            status="llm_adjudicated_candidate",
            confidence=confidence,
            evidence=ev,
            review_status="llm_adjudicated",
            description=rec.get("definition_et"),
            source_id=rec.get("source_id"),
            decision=rec.get("decision"),
            reason=rec.get("reason"),
            grade_scope=rec.get("grade_scope"),
            merge_key_et=rec.get("merge_key_et"),
            same_as_candidates=rec.get("same_as_candidates"),
            broader_than_candidates=rec.get("broader_than_candidates"),
            narrower_than_candidates=rec.get("narrower_than_candidates"),
            original_label=source.get("label_et"),
            subject=source.get("subject"),
            grades=source.get("grades"),
            school_stages=source.get("school_stages"),
        )
        if node_type in type_edge:
            for outcome_id in id_values(source.get("aligned_learning_outcomes")):
                if outcome_id in g.nodes:
                    g.add_edge(outcome_id, str(rec["id"]), type_edge[str(node_type)], confidence=confidence, method="llm_adjudicated_outcome_unit", evidence=ev, source_url=source_url, source_authority=infer_authority(authority_record), review_status="llm_adjudicated")
            material_id = material_by_url.get(str(source_url)) if source_url else None
            if material_id in g.nodes:
                material_edge = "teaches" if node_type == "KnowledgeUnit" else "practices" if node_type == "SkillUnit" else None
                if material_edge:
                    g.add_edge(material_id, str(rec["id"]), material_edge, confidence=min(confidence, 0.65), method="llm_adjudicated_same_source_material_unit", evidence=ev, source_url=source_url, source_authority=infer_authority(authority_record), review_status="llm_adjudicated")
        elif node_type == "TaskInstance":
            subtype = source.get("aligned_task_subtype")
            if subtype in g.nodes:
                g.add_edge(str(rec["id"]), subtype, "instantiates", confidence=confidence, method="llm_adjudicated_task_subtype", evidence=ev, source_url=source_url, source_authority=infer_authority(authority_record), review_status="llm_adjudicated")
        elif node_type == "Topic":
            subject = source.get("subject")
            subject_id = "subject:eesti_keel" if subject == "Eesti keel" else "subject:kirjandus" if subject == "Kirjandus" else None
            if subject_id in g.nodes:
                g.add_edge(subject_id, str(rec["id"]), "has_topic", confidence=confidence, method="llm_adjudicated_topic_subject", evidence=ev, source_url=source_url, source_authority=infer_authority(authority_record), review_status="llm_adjudicated")


def add_canonical_candidates(
    g: GraphBuilder,
    nodes: list[dict[str, Any]],
    relations: list[dict[str, Any]],
    material_by_url: dict[str, str],
) -> None:
    type_edge = {
        "KnowledgeUnit": "has_knowledge_unit",
        "SkillUnit": "has_skill_unit",
        "CompetenceUnit": "has_competence_unit",
        "AttitudeUnit": "has_attitude_unit",
    }
    confidence_by_support = {"strong": 0.88, "medium": 0.74, "weak": 0.58, "none": 0.4}
    for rec in nodes:
        node_type = rec.get("public_type")
        if node_type not in {
            "KnowledgeUnit",
            "SkillUnit",
            "CompetenceUnit",
            "AttitudeUnit",
            "TaskInstance",
            "TaskSubtype",
            "AssessmentCriterion",
            "CriterionDimension",
            "LevelExpectation",
            "Topic",
        }:
            continue
        source_urls = rec.get("source_urls") or []
        source_url = source_urls[0] if source_urls else None
        authority_record = {"source_url": source_url, "source_system": "llm_canonicalization_v1"}
        confidence = confidence_by_support.get(rec.get("source_support"), 0.7)
        g.add_node(
            str(rec["canonical_id"]),
            str(node_type),
            rec.get("label_et") or rec["canonical_id"],
            source_system="llm_canonicalization_v1",
            source_url=source_url,
            source_authority=infer_authority(authority_record),
            status="canonical_candidate",
            confidence=confidence,
            evidence=evidence_ids(rec.get("evidence_ids")),
            review_status="llm_canonicalized",
            description=rec.get("definition_et"),
            grade_scope=rec.get("grade_scope"),
            subjects=rec.get("subjects"),
            member_ids=rec.get("member_ids"),
            member_count=rec.get("member_count"),
            source_urls=source_urls,
            canonicalization_method=rec.get("canonicalization_method"),
            canonicalization_reason=rec.get("reason"),
        )
        if node_type in type_edge:
            for outcome_id in id_values(rec.get("aligned_learning_outcomes")):
                if outcome_id in g.nodes:
                    g.add_edge(outcome_id, str(rec["canonical_id"]), type_edge[str(node_type)], confidence=confidence, method="llm_canonicalized_outcome_unit", evidence=evidence_ids(rec.get("evidence_ids")), source_url=source_url, source_authority=infer_authority(authority_record), review_status="llm_canonicalized")
            for url in source_urls:
                material_id = material_by_url.get(str(url))
                if material_id and material_id in g.nodes:
                    material_edge = "teaches" if node_type == "KnowledgeUnit" else "practices" if node_type == "SkillUnit" else None
                    if material_edge:
                        g.add_edge(material_id, str(rec["canonical_id"]), material_edge, confidence=min(confidence, 0.68), method="llm_canonicalized_material_unit", evidence=evidence_ids(rec.get("evidence_ids")), source_url=url, source_authority=infer_authority({"source_url": url}), review_status="llm_canonicalized")
        elif node_type == "Topic":
            for subject in rec.get("subjects") or []:
                subject_id = "subject:eesti_keel" if subject == "Eesti keel" else "subject:kirjandus" if subject == "Kirjandus" else None
                if subject_id in g.nodes:
                    g.add_edge(subject_id, str(rec["canonical_id"]), "has_topic", confidence=confidence, method="llm_canonicalized_topic_subject", evidence=evidence_ids(rec.get("evidence_ids")), source_url=source_url, source_authority=infer_authority(authority_record), review_status="llm_canonicalized")

    valid_relation_types = {"same_as", "broader_than", "narrower_than", "related_to", "supports_progression_to"}
    for rel in relations:
        source = rel.get("source_canonical_id")
        target = rel.get("target_canonical_id")
        edge_type = rel.get("type")
        if source in g.nodes and target in g.nodes and edge_type in valid_relation_types:
            g.add_edge(
                str(source),
                str(target),
                str(edge_type),
                confidence=0.78,
                method="llm_canonicalization_relation",
                evidence=[],
                source_url=None,
                source_authority="llm_adjudicated",
                review_status="llm_canonicalized",
                reason=rel.get("reason"),
                neighborhood_id=rel.get("neighborhood_id"),
            )


def validate_graph(g: GraphBuilder, schema: dict[str, Any]) -> list[dict[str, Any]]:
    errors: list[dict[str, Any]] = []
    required_node = schema["node_required_fields"]
    required_edge = schema["edge_required_fields"]
    valid_node_types: set[str] = set()
    for values in schema["node_types"].values():
        valid_node_types.update(values)
    valid_edge_types: set[str] = set()
    for values in schema["edge_types"].values():
        valid_edge_types.update(values)

    for node in g.nodes.values():
        for field in required_node:
            if field not in node:
                errors.append({"kind": "node_missing_field", "id": node.get("id"), "field": field})
        if node.get("type") not in valid_node_types:
            errors.append({"kind": "node_invalid_type", "id": node.get("id"), "type": node.get("type")})

    for edge in g.edges.values():
        for field in required_edge:
            if field not in edge:
                errors.append({"kind": "edge_missing_field", "id": edge.get("id"), "field": field})
        if edge.get("source") not in g.nodes or edge.get("target") not in g.nodes:
            errors.append({"kind": "edge_missing_endpoint", "id": edge.get("id"), "source": edge.get("source"), "target": edge.get("target")})
            continue
        if edge.get("type") not in valid_edge_types:
            errors.append({"kind": "edge_invalid_type", "id": edge.get("id"), "type": edge.get("type")})
    return errors


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for key in row:
            if key not in seen:
                seen.add(key)
                fields.append(key)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            cleaned = {}
            for key in fields:
                value = row.get(key)
                if isinstance(value, (list, dict)):
                    cleaned[key] = json.dumps(value, ensure_ascii=False, sort_keys=True)
                else:
                    cleaned[key] = value
            writer.writerow(cleaned)


def export_networkx(g: GraphBuilder, out_dir: Path) -> None:
    graph = nx.MultiDiGraph()
    for node_id, attrs in g.nodes.items():
        graph.add_node(node_id, **{k: xml_safe(v) for k, v in attrs.items() if k != "id"})
    for edge in g.edges.values():
        graph.add_edge(
            edge["source"],
            edge["target"],
            key=edge["id"],
            **{k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}},
        )
    nx.write_graphml(graph, out_dir / "graph.graphml")
    nx.write_gexf(graph, out_dir / "graph.gexf")
    nx.read_graphml(out_dir / "graph.graphml")
    nx.read_gexf(out_dir / "graph.gexf")


def write_cytoscape(g: GraphBuilder, path: Path) -> None:
    elements = {
        "nodes": [{"data": {"id": node_id, **attrs}} for node_id, attrs in g.nodes.items()],
        "edges": [{"data": {"id": edge_id, **attrs}} for edge_id, attrs in g.edges.items()],
    }
    path.write_text(json.dumps(elements, ensure_ascii=False, indent=2), encoding="utf-8")


def build_report(g: GraphBuilder, data: dict[str, list[dict[str, Any]]], errors: list[dict[str, Any]], out_path: Path) -> None:
    node_counts = Counter(node["type"] for node in g.nodes.values())
    edge_counts = Counter(edge["type"] for edge in g.edges.values())
    isolated = 0
    connected_ids = {edge["source"] for edge in g.edges.values()} | {edge["target"] for edge in g.edges.values()}
    for node_id in g.nodes:
        if node_id not in connected_ids:
            isolated += 1
    omitted_units = Counter(rec.get("graph_ready_status") for rec in data["learning_units"] if rec.get("graph_ready_status") not in REFINED_READY)
    omitted_tasks = Counter(rec.get("graph_ready_status") for rec in data["task_signals"] if rec.get("graph_ready_status") not in REFINED_READY)
    lines = [
        "# V2 Unified Pilot Graph Build Report",
        "",
        f"- Graph version: `{g.graph_version}`",
        f"- Schema version: `{g.schema_version}`",
        f"- Nodes: {len(g.nodes):,}",
        f"- Edges: {len(g.edges):,}",
        f"- Isolated nodes: {isolated:,} ({isolated / max(len(g.nodes), 1):.1%})",
        f"- Validation errors: {len(errors):,}",
        "",
        "## Node Counts",
        "",
    ]
    lines.extend(f"- {key}: {value:,}" for key, value in node_counts.most_common())
    lines.extend(["", "## Edge Counts", ""])
    lines.extend(f"- {key}: {value:,}" for key, value in edge_counts.most_common())
    lines.extend(["", "## Input Gate", ""])
    if data.get("adjudicated_candidates"):
        decision_counts = Counter(row.get("decision") for row in data["adjudicated_candidates"])
        type_counts = Counter(row.get("public_type") for row in data["adjudicated_candidates"])
        lines.extend(
            [
                f"- LLM-adjudicated public rows: {len(data['adjudicated_candidates']):,}",
                f"- Decisions: {dict(decision_counts)}",
                f"- Public types: {dict(type_counts)}",
                "",
                "## Interpretation",
                "",
                "This is a v2 pilot graph from official/control layers plus the LLM-adjudicated candidate layer. It is not a label-only or embedding-only merge result: adjudication decisions were made from labels, source metadata, snippets, and level context. Final canonical merge/split/equivalence still needs a second adjudication pass over candidate neighborhoods.",
            ]
        )
    elif data.get("canonical_candidates"):
        type_counts = Counter(row.get("public_type") for row in data["canonical_candidates"])
        method_counts = Counter(row.get("canonicalization_method") for row in data["canonical_candidates"])
        lines.extend(
            [
                f"- LLM-canonicalized nodes: {len(data['canonical_candidates']):,}",
                f"- Canonical relation decisions: {len(data.get('canonical_relations', [])):,}",
                f"- Public types: {dict(type_counts)}",
                f"- Canonicalization methods: {dict(method_counts)}",
                "",
                "## Interpretation",
                "",
                "This is a v2 canonical pilot graph from official/control layers plus LLM-canonicalized units. Embeddings or lexical matching were used only to form candidate neighborhoods; merge/split/broader/narrower/progression decisions were made by LLM judgment over evidence-bearing neighborhoods.",
            ]
        )
    else:
        lines.extend(
            [
                f"- Included learning units: {sum(1 for rec in data['learning_units'] if public_unit_ready(rec)):,}",
                f"- Omitted learning units by status: {dict(omitted_units)}",
                f"- Included task instances: {sum(1 for rec in data['task_signals'] if public_task_ready(rec)):,}",
                f"- Omitted task signals by status: {dict(omitted_tasks)}",
                "",
                "## Interpretation",
                "",
                "This is a fresh v2 pilot graph from refined structured data, official oppekava backbone, controlled task/criterion/competence taxonomies, material signals, and evidence spans. It intentionally excludes quarantined, rejected, needs-review, non-comparison-ready, truncated, and long source-chunk learning units from public graph nodes. This is only a high-precision candidate graph; canonical merge/split decisions require LLM adjudication over evidence batches.",
            ]
        )
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--graph-version", default=GRAPH_VERSION_DEFAULT)
    parser.add_argument("--schema-version", default=SCHEMA_VERSION_DEFAULT)
    parser.add_argument("--out", default="graph/snapshots/v2_unified_pilot")
    parser.add_argument("--use-adjudicated", action="store_true", help="Use LLM-adjudicated candidate layer instead of raw refined unit/task candidates.")
    parser.add_argument("--use-canonical", action="store_true", help="Use LLM-canonicalized candidate layer instead of raw/adjudicated candidates.")
    args = parser.parse_args()

    with (PROJECT_ROOT / "config" / "graph_schema.yaml").open("r", encoding="utf-8") as f:
        schema = yaml.safe_load(f)
    data = read_refined(PROJECT_ROOT)
    g = GraphBuilder(args.graph_version, args.schema_version)

    all_source_records: list[dict[str, Any]] = []
    for records in data.values():
        all_source_records.extend(records)
    add_source_documents(g, all_source_records)
    add_evidence_spans(g, data["evidence_spans"])
    add_backbone(g, data["official"])
    add_general_competence_taxonomy(g, data["general_competence_taxonomy"])
    add_task_and_criterion_taxonomies(g, data["task_taxonomy"], data["criterion_taxonomy"])
    material_by_url = add_materials(g, data["material_signals"], data["official"])
    adjudicated_rows: list[dict[str, Any]] = []
    if args.use_canonical:
        canonical_base = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "canonicalization"
        canonical_nodes = read_jsonl(canonical_base / "canonical_candidates.nodes.jsonl")
        canonical_relations = read_jsonl(canonical_base / "canonical_candidates.relations.jsonl")
        data["canonical_candidates"] = canonical_nodes
        data["canonical_relations"] = canonical_relations
        add_canonical_candidates(g, canonical_nodes, canonical_relations, material_by_url)
    elif args.use_adjudicated:
        adjudicated_rows = read_jsonl(PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "llm_adjudication" / "adjudicated_candidates.public.jsonl")
        data["adjudicated_candidates"] = adjudicated_rows
        add_adjudicated_candidates(g, adjudicated_rows, material_by_url)
    else:
        add_learning_units(g, data["learning_units"], material_by_url)
        add_tasks(g, data["task_signals"])
    add_level_expectations(g, data["level_expectations"])
    if not args.use_adjudicated and not args.use_canonical:
        add_competence_expressions(g, data["competence_expressions"])

    out_dir = PROJECT_ROOT / args.out
    out_dir.mkdir(parents=True, exist_ok=True)
    nodes = list(g.nodes.values())
    edges = list(g.edges.values())
    errors = validate_graph(g, schema)
    write_jsonl(out_dir / "nodes.jsonl", nodes)
    write_jsonl(out_dir / "edges.jsonl", edges)
    write_csv(out_dir / "nodes.csv", nodes)
    write_csv(out_dir / "edges.csv", edges)
    export_networkx(g, out_dir)
    write_cytoscape(g, out_dir / "cytoscape_elements.json")
    reports_dir = PROJECT_ROOT / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    snapshot_name = out_dir.name
    write_jsonl(reports_dir / f"{snapshot_name}_graph_validation_errors.jsonl", errors)
    build_report(g, data, errors, reports_dir / f"{snapshot_name}_graph_build_report.md")
    print(json.dumps({"nodes": len(nodes), "edges": len(edges), "validation_errors": len(errors), "out_dir": str(out_dir)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
