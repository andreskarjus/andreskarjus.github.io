from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from common import ROOT, clean_label, ensure_dirs, load_yaml, read_jsonl, sha1_text, write_csv, write_jsonl

EXTRACTOR_VERSION = "structured_extraction_v2_2026-05-20"
OUT_DIR = ROOT / "data/processed/structured/v2"

SKILL_VERBS = [
    "analüüsib",
    "arutleb",
    "kasutab",
    "kirjutab",
    "loeb",
    "mõistab",
    "võrdleb",
    "selgitab",
    "koostab",
    "esitab",
    "hindab",
    "leiab",
    "eristab",
    "tõlgendab",
    "sõnastab",
    "põhjendab",
    "rakendab",
    "toimetab",
    "parandab",
    "tunneb",
    "teab",
    "oskab",
]

SKILL_RE = re.compile(r"\b(" + "|".join(SKILL_VERBS) + r")\b", re.I)
KNOWLEDGE_SIGNAL_RE = re.compile(
    r"\b("
    r"õigekiri|kirjavahemärgistus|ortograafia|vormimoodustus|kääne|pööre|"
    r"sõnaliik|lauseehitus|sõnavara|tekstiliik|žanr|kujund|metafoor|"
    r"argumentatsioon|sidusus|allikakasutus|alustekst|kirjandus|rahvaluule|"
    r"eepika|lüürika|dramaatika|kompositsioon|stiil"
    r")\b",
    re.I,
)
TASK_SIGNAL_RE = re.compile(
    r"\b("
    r"kirjand|arutlus|essee|jutustus|kirjeldus|avaldus|cv|seletuskiri|"
    r"taotlus|motivatsioonikiri|ametlik kiri|e-kiri|juhend|meelespea|"
    r"uudis|arvamuslugu|intervjuu|reklaam|kuulutus|reportaaž|veebikommentaar|"
    r"arvustus|referaat|uurimistöö|tekstianalüüs|konspekt|kokkuvõte|"
    r"ümberjutustus|loovtöö|tegelase iseloomustus|miljöö kirjeldus|blogi|"
    r"pressiteade|podcast|teadustekst|ettekanne|kõne|väitlus|diskussioon|"
    r"rollimäng|etteütlus|kontrolltöö|test|grammatika test|sõnavara harjutus|"
    r"teksti toimetamine|lugemiskontroll"
    r")\b",
    re.I,
)
TASK_IMPERATIVE_RE = re.compile(
    r"\b(kirjuta|koosta|vormista|analüüsi|võrdle|põhjenda|leia|erista|"
    r"täida|paranda|toimeta|esita|jutusta|refereeri|tsiteeri)\b",
    re.I,
)
CRITERION_SIGNAL_RE = re.compile(
    r"\b("
    r"hindamismudel|hindamiskriteer|hinnatakse|punkt|punkti|maksimaalne tulemus|"
    r"pealkiri|sissejuhatus|probleemipüstitus|argumentatsioon|alustekst|"
    r"lõpetus|sõnavalik|lausemoodustus|kirjavahemärgistus|õigekiri|vormistus|"
    r"düsgraafia|diferentseeritud hindamine"
    r")\b",
    re.I,
)


def stable(prefix: str, *parts: Any) -> str:
    text = "|".join("" if part is None else str(part) for part in parts)
    return f"{prefix}:{sha1_text(text, 20)}"


def context(text: str, limit: int = 550) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit]


def split_statements(text: str) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    pieces = re.split(r"(?<=[.!?])\s+|[•\u2022]\s+|;\s+", text)
    out = []
    for piece in pieces:
        piece = re.sub(r"^\s*[-–—*\d.)]+\s*", "", piece).strip()
        if 18 <= len(piece) <= 180:
            out.append(piece)
    return out


def is_truncated(label: str) -> bool:
    return bool(re.search(r"[,;:]$|\b(ja|ning|või|et|kui|mille|mida)$", label.strip(), re.I))


def normalize_key(text: str) -> str:
    text = clean_label(text).lower()
    text = re.sub(r"[^a-zA-ZõäöüšžÕÄÖÜŠŽ0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def normalize_grades(values: Any) -> list[str]:
    if not values:
        return []
    if isinstance(values, str):
        values = [values]
    out: set[str] = set()
    for value in values:
        text = str(value)
        nums = re.findall(r"\b([1-9]|1[0-2])\s*\.?\s*(?:klass)?", text)
        for num in nums:
            out.add(f"{num}. klass")
        if "Gümnaasium" in text or "gümnaasium" in text:
            out.update({"10. klass", "11. klass", "12. klass"})
    return sorted(out, key=lambda x: int(x.split(".")[0]))


def infer_stages_from_grades(grades: list[str], explicit: Any = None) -> list[str]:
    stages: set[str] = set()
    if explicit:
        values = explicit if isinstance(explicit, list) else [explicit]
        for value in values:
            if value:
                stages.add(str(value))
    for grade in grades:
        num = int(grade.split(".")[0])
        if 1 <= num <= 3:
            stages.add("I kooliaste")
        elif 4 <= num <= 6:
            stages.add("II kooliaste")
        elif 7 <= num <= 9:
            stages.add("III kooliaste")
        elif 10 <= num <= 12:
            stages.add("Gümnaasium")
    return sorted(stages)


def extract_identifier(label: str, url: str | None) -> str | None:
    haystack = f"{label} {url or ''}"
    match = re.search(r"(EstCORE:\d+:\d+|EIS:test:\d+|E-koolikott:materjal:\d+)", haystack)
    return match.group(1) if match else None


def evidence_id_from_chunk(chunk: dict[str, Any]) -> str:
    return stable("evidence", chunk.get("id"), chunk.get("source_url"), chunk.get("text"))


def make_evidence_spans(chunks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    spans = []
    for chunk in chunks:
        spans.append(
            {
                "id": evidence_id_from_chunk(chunk),
                "source_chunk_id": chunk.get("id"),
                "source_system": chunk.get("source_system"),
                "source_kind": chunk.get("source_kind"),
                "source_authority": chunk.get("source_authority"),
                "source_url": chunk.get("source_url"),
                "source_file": chunk.get("source_file"),
                "source_title": chunk.get("source_title"),
                "page": chunk.get("page"),
                "heading_path": chunk.get("heading_path"),
                "chunk_role": chunk.get("chunk_role"),
                "extraction_targets": chunk.get("extraction_targets", []),
                "subject": chunk.get("subject"),
                "grade": chunk.get("grade"),
                "school_stage": chunk.get("school_stage"),
                "learner_profile": chunk.get("learner_profile"),
                "context_snippet": context(chunk.get("text", ""), 900),
                "extractor_version": EXTRACTOR_VERSION,
            }
        )
    return spans


def extract_official_backbone(official_records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = []
    for record in official_records:
        raw = record.get("raw", {})
        label = record.get("label") or raw.get("label") or raw.get("subject") or ""
        source_url = record.get("source_url")
        grades = normalize_grades(record.get("grades") or raw.get("grades"))
        stages = infer_stages_from_grades(grades, record.get("school_stages") or raw.get("school_stages"))
        row = {
            "id": record.get("id"),
            "record_type": record.get("record_type"),
            "label_et": clean_label(label),
            "subject": record.get("subject") or raw.get("subject"),
            "curriculum_domain": "Keel ja kirjandus",
            "source_url": source_url,
            "source_authority": "official_curriculum",
            "official_identifier": extract_identifier(label, source_url),
            "grades": grades,
            "school_stages": stages,
            "education_levels": raw.get("education_levels") or [],
            "topics": raw.get("topics") or [],
            "concepts": raw.get("concepts") or [],
            "verbs": raw.get("verbs") or [],
            "requires": raw.get("requires") or [],
            "is_prerequisite_for": raw.get("is_prerequisite_for") or [],
            "parts": raw.get("parts") or [],
            "linked_outcomes": raw.get("outcomes") or [],
            "linked_material_topics": raw.get("topics") or [],
            "ekoolikott_id": raw.get("ekoolikott_id"),
            "used_pilot_fallback": record.get("used_pilot_fallback"),
            "extractor_version": EXTRACTOR_VERSION,
        }
        out.append(row)
    return out


def source_ref_from_chunk(chunk: dict[str, Any]) -> dict[str, Any]:
    return {
        "evidence_id": evidence_id_from_chunk(chunk),
        "source_chunk_id": chunk.get("id"),
        "source_authority": chunk.get("source_authority"),
        "source_system": chunk.get("source_system"),
        "source_kind": chunk.get("source_kind"),
        "source_url": chunk.get("source_url"),
        "source_file": chunk.get("source_file"),
        "page": chunk.get("page"),
        "learner_profile": chunk.get("learner_profile"),
        "context_snippet": context(chunk.get("text", ""), 500),
    }


def load_policy() -> tuple[set[str], set[str]]:
    policy = load_yaml("config/canonicalization_policy.yaml")
    block = {normalize_key(x) for x in policy.get("generic_one_word_blocklist", [])}
    white = {normalize_key(x) for x in policy.get("generic_one_word_whitelist", [])}
    return block, white


def candidate_quality(label: str, candidate_class: str, blocklist: set[str], whitelist: set[str]) -> tuple[str, list[str]]:
    reasons = []
    key = normalize_key(label)
    words = key.split()
    if is_truncated(label):
        reasons.append("truncated")
    if len(label) > 120:
        reasons.append("long_teacher_label")
    if len(words) == 1 and key in blocklist and key not in whitelist:
        reasons.append("generic_one_word")
    if candidate_class == "SkillUnit" and not SKILL_RE.search(label):
        reasons.append("missing_action_verb")
    if reasons:
        return "needs_review", reasons
    return "candidate", []


def extract_units_from_official(official_backbone: list[dict[str, Any]], blocklist: set[str], whitelist: set[str]) -> list[dict[str, Any]]:
    rows = []
    seen: set[tuple[str, str, str | None]] = set()
    for rec in official_backbone:
        if rec["record_type"] != "learning_outcomes":
            continue
        label = rec["label_et"]
        if label:
            candidate_class = "SkillUnit" if SKILL_RE.search(label) else "CompetenceUnit"
            status, review = candidate_quality(label, candidate_class, blocklist, whitelist)
            key = (candidate_class, normalize_key(label), rec.get("subject"))
            if key not in seen:
                seen.add(key)
                first = normalize_key(label).split(" ")[0] if normalize_key(label) else None
                rows.append(
                    {
                        "id": stable("unit_candidate", candidate_class, label, rec.get("subject")),
                        "candidate_class": candidate_class,
                        "label_et": label,
                        "action": first if candidate_class == "SkillUnit" else None,
                        "object": " ".join(label.split()[1:]) if candidate_class == "SkillUnit" else label,
                        "context": None,
                        "subject": rec.get("subject"),
                        "grades": rec.get("grades"),
                        "school_stages": rec.get("school_stages"),
                        "source_authority": "official_curriculum",
                        "source_system": "oppekava",
                        "source_url": rec.get("source_url"),
                        "source_record_id": rec.get("id"),
                        "aligned_learning_outcomes": [rec.get("id")],
                        "evidence_ids": [],
                        "confidence": 0.72 if status == "candidate" else 0.45,
                        "status": status,
                        "review_reasons": review or ["official_outcome_derived_requires_decomposition"],
                        "extractor_version": EXTRACTOR_VERSION,
                    }
                )
        for concept in rec.get("concepts") or []:
            concept_label = clean_label(concept.get("label"))
            if not concept_label:
                continue
            status, review = candidate_quality(concept_label, "KnowledgeUnit", blocklist, whitelist)
            key = ("KnowledgeUnit", normalize_key(concept_label), rec.get("subject"))
            if key in seen:
                continue
            seen.add(key)
            rows.append(
                {
                    "id": stable("unit_candidate", "KnowledgeUnit", concept_label, rec.get("subject")),
                    "candidate_class": "KnowledgeUnit",
                    "label_et": concept_label,
                    "action": None,
                    "object": concept_label,
                    "context": None,
                    "subject": rec.get("subject"),
                    "grades": rec.get("grades"),
                    "school_stages": rec.get("school_stages"),
                    "source_authority": "official_curriculum",
                    "source_system": "oppekava",
                    "source_url": concept.get("url") or rec.get("source_url"),
                    "source_record_id": rec.get("id"),
                    "aligned_learning_outcomes": [rec.get("id")],
                    "evidence_ids": [],
                    "confidence": 0.7 if status == "candidate" else 0.42,
                    "status": status,
                    "review_reasons": review,
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
    return rows


def infer_unit_class(statement: str, chunk: dict[str, Any]) -> str | None:
    if chunk.get("chunk_role") == "criterion_evidence":
        return None
    if SKILL_RE.search(statement):
        return "SkillUnit"
    if KNOWLEDGE_SIGNAL_RE.search(statement):
        return "KnowledgeUnit"
    return None


def extract_units_from_chunks(chunks: list[dict[str, Any]], blocklist: set[str], whitelist: set[str], limit: int | None = None) -> list[dict[str, Any]]:
    rows = []
    seen: set[tuple[str, str, str | None]] = set()
    for chunk in chunks:
        if chunk.get("chunk_role") in {"criterion_evidence"}:
            continue
        for statement in split_statements(chunk.get("text", "")):
            candidate_class = infer_unit_class(statement, chunk)
            if not candidate_class:
                continue
            status, review = candidate_quality(statement, candidate_class, blocklist, whitelist)
            key = (candidate_class, normalize_key(statement), chunk.get("subject"))
            if key in seen:
                continue
            seen.add(key)
            action = None
            obj = statement
            verb_match = SKILL_RE.search(statement)
            if verb_match:
                action = verb_match.group(1).lower()
                obj = statement[verb_match.end() :].strip(" ,.;:") or statement
            rows.append(
                {
                    "id": stable("unit_candidate", candidate_class, statement, chunk.get("source_url"), chunk.get("id")),
                    "candidate_class": candidate_class,
                    "label_et": statement,
                    "action": action,
                    "object": obj,
                    "context": None,
                    "subject": chunk.get("subject") or (chunk.get("subjects") or [None])[0],
                    "grades": normalize_grades(chunk.get("grade")),
                    "school_stages": infer_stages_from_grades(normalize_grades(chunk.get("grade")), chunk.get("school_stage")),
                    "source_authority": chunk.get("source_authority"),
                    "source_system": chunk.get("source_system"),
                    "source_kind": chunk.get("source_kind"),
                    "source_url": chunk.get("source_url"),
                    "source_chunk_id": chunk.get("id"),
                    "aligned_learning_outcomes": [],
                    "evidence_ids": [evidence_id_from_chunk(chunk)],
                    "confidence": 0.62 if status == "candidate" else 0.36,
                    "status": status,
                    "review_reasons": review,
                    "learner_profile": chunk.get("learner_profile"),
                    "context_snippet": context(chunk.get("text", ""), 500),
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
            if limit and len(rows) >= limit:
                return rows
    return rows


def flatten_assessment_taxonomy(assessment: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    task_rows: list[dict[str, Any]] = []
    criterion_rows: list[dict[str, Any]] = []
    for task_type in assessment.get("task_types", []):
        task_rows.append(
            {
                "id": task_type["id"],
                "candidate_class": "TaskType",
                "label_et": task_type["label_et"],
                "parent_id": None,
                "source_authority": "teacher_guidance",
                "source_system": "assessment_taxonomy_config",
                "evidence_ids": [],
                "status": "controlled_taxonomy",
                "confidence": 0.82,
                "extractor_version": EXTRACTOR_VERSION,
            }
        )
        for subtype in task_type.get("subtypes", []):
            task_rows.append(
                {
                    "id": subtype["id"],
                    "candidate_class": "TaskSubtype",
                    "label_et": subtype["label_et"],
                    "parent_id": task_type["id"],
                    "genres": subtype.get("genres", []),
                    "source_authority": "teacher_guidance",
                    "source_system": "assessment_taxonomy_config",
                    "evidence_ids": [],
                    "status": "controlled_taxonomy",
                    "confidence": 0.82,
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
    for criterion in assessment.get("criterion_dimensions", []):
        criterion_rows.append(
            {
                "id": criterion["id"],
                "candidate_class": "AssessmentCriterion",
                "label_et": criterion["label_et"],
                "parent_id": None,
                "applies_to": criterion.get("applies_to", []),
                "source_authority": "teacher_guidance",
                "source_system": "assessment_taxonomy_config",
                "evidence_ids": [],
                "status": "controlled_taxonomy",
                "confidence": 0.82,
                "extractor_version": EXTRACTOR_VERSION,
            }
        )
        for sub in criterion.get("subdimensions", []):
            criterion_rows.append(
                {
                    "id": sub["id"],
                    "candidate_class": "CriterionDimension",
                    "label_et": sub["label_et"],
                    "parent_id": criterion["id"],
                    "applies_to": criterion.get("applies_to", []),
                    "source_authority": "teacher_guidance",
                    "source_system": "assessment_taxonomy_config",
                    "evidence_ids": [],
                    "status": "controlled_taxonomy",
                    "confidence": 0.82,
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
    return task_rows, criterion_rows


def source_urls_from_competence_taxonomy(taxonomy: dict[str, Any]) -> list[str]:
    urls = []
    for source in taxonomy.get("official_sources", {}).values():
        url = source.get("source_url")
        if url:
            urls.append(url)
    return urls


def primary_source_url(taxonomy: dict[str, Any], key: str = "pohikool_current") -> str | None:
    source = taxonomy.get("official_sources", {}).get(key, {})
    return source.get("source_url")


def flatten_general_competence_taxonomy(taxonomy: dict[str, Any]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    all_source_urls = source_urls_from_competence_taxonomy(taxonomy)
    pohikool_url = primary_source_url(taxonomy, "pohikool_current")
    gymnaasium_url = primary_source_url(taxonomy, "gymnaasium_current")

    def base_row(item: dict[str, Any], candidate_class: str, source_url: str | None, extra: dict[str, Any] | None = None) -> dict[str, Any]:
        row = {
            "id": item["id"],
            "candidate_class": candidate_class,
            "label_et": item["label_et"],
            "aliases": item.get("aliases", []),
            "expression_keywords": item.get("expression_keywords", []),
            "source_authority": "legal",
            "source_system": "riigiteataja",
            "source_url": source_url,
            "source_urls": all_source_urls if candidate_class != "StageCompetenceExpectation" else [pohikool_url],
            "evidence_ids": [],
            "status": "controlled_taxonomy",
            "confidence": 0.96,
            "extractor_version": EXTRACTOR_VERSION,
        }
        if extra:
            row.update(extra)
        return row

    for item in taxonomy.get("general_competences", []):
        rows.append(base_row(item, "GeneralCompetence", pohikool_url))
    for item in taxonomy.get("domain_competences", []):
        rows.append(
            base_row(
                item,
                "DomainCompetence",
                pohikool_url or gymnaasium_url,
                {
                    "curriculum_domain": item.get("curriculum_domain"),
                    "applies_to_subjects": item.get("applies_to_subjects", []),
                },
            )
        )
    for item in taxonomy.get("transversal_themes", []):
        rows.append(base_row(item, "TransversalTheme", pohikool_url or gymnaasium_url))
    for item in taxonomy.get("stage_competence_expectations", []):
        rows.append(
            base_row(
                item,
                "StageCompetenceExpectation",
                pohikool_url,
                {
                    "school_stage": item.get("school_stage"),
                    "source_section": item.get("source_section"),
                },
            )
        )
    return rows


def term_in_text(term: str, normalized_text: str) -> bool:
    key = normalize_key(term)
    if not key:
        return False
    return re.search(rf"(^|\s){re.escape(key)}(\s|$)", normalized_text) is not None


def match_competence_targets(text: str, taxonomy_rows: list[dict[str, Any]], anchors: list[str]) -> list[tuple[dict[str, Any], str, str]]:
    normalized_text = normalize_key(text)
    anchor_present = any(term_in_text(anchor, normalized_text) for anchor in anchors)
    matches: list[tuple[dict[str, Any], str, str]] = []
    for row in taxonomy_rows:
        if row.get("candidate_class") not in {"GeneralCompetence", "DomainCompetence", "TransversalTheme"}:
            continue
        strong_terms = [row.get("label_et", "")] + [term for term in row.get("aliases", []) if len(normalize_key(term).split()) > 1]
        weak_terms = [term for term in row.get("aliases", []) if len(normalize_key(term).split()) <= 1]
        weak_terms.extend(row.get("expression_keywords", []))
        matched_term = next((term for term in strong_terms if term_in_text(term, normalized_text)), None)
        if matched_term:
            matches.append((row, matched_term, "explicit_label_or_alias"))
            continue
        if anchor_present:
            matched_term = next((term for term in weak_terms if term_in_text(term, normalized_text)), None)
            if matched_term:
                matches.append((row, matched_term, "anchored_keyword"))
    return matches


def extract_competence_expressions(
    chunks: list[dict[str, Any]],
    competence_taxonomy_rows: list[dict[str, Any]],
    taxonomy: dict[str, Any],
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str]] = set()
    anchors = taxonomy.get("high_precision_expression_anchors", [])
    eligible_roles = {
        "curriculum_steering",
        "task_evidence",
        "criterion_evidence",
        "material_evidence",
        "accessible_material_evidence",
    }
    for chunk in chunks:
        text = chunk.get("text", "")
        if chunk.get("chunk_role") not in eligible_roles and not any(anchor.lower() in text.lower() for anchor in anchors):
            continue
        for target, matched_term, match_type in match_competence_targets(text, competence_taxonomy_rows, anchors):
            key = (target["id"], chunk.get("id"), match_type)
            if key in seen:
                continue
            seen.add(key)
            explicit = match_type == "explicit_label_or_alias"
            source_authority = chunk.get("source_authority")
            confidence = 0.84 if explicit else 0.56
            if source_authority in {"legal", "official_curriculum"}:
                confidence += 0.06
            rows.append(
                {
                    "id": stable("competence_expression", target["id"], chunk.get("id"), match_type),
                    "candidate_class": "CompetenceExpression",
                    "label_et": f"{target.get('label_et')} väljendus: {matched_term}",
                    "target_id": target["id"],
                    "target_class": target.get("candidate_class"),
                    "target_label_et": target.get("label_et"),
                    "matched_term": matched_term,
                    "match_type": match_type,
                    "subject": chunk.get("subject") or (chunk.get("subjects") or [None])[0],
                    "grades": normalize_grades(chunk.get("grade")),
                    "school_stages": infer_stages_from_grades(normalize_grades(chunk.get("grade")), chunk.get("school_stage")),
                    "learner_profile": chunk.get("learner_profile"),
                    "source_authority": source_authority,
                    "source_system": chunk.get("source_system"),
                    "source_kind": chunk.get("source_kind"),
                    "source_url": chunk.get("source_url"),
                    "source_file": chunk.get("source_file"),
                    "evidence_ids": [evidence_id_from_chunk(chunk)],
                    "context_snippet": context(text, 700),
                    "confidence": min(confidence, 0.93),
                    "status": "candidate" if explicit else "needs_review",
                    "review_reasons": [] if explicit else ["anchored_keyword_competence_expression"],
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
    return rows


def match_task_subtypes(text: str, task_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matches = []
    low = text.lower()
    for row in task_rows:
        if row["candidate_class"] != "TaskSubtype":
            continue
        labels = [row["label_et"]] + row.get("genres", [])
        for label in labels:
            if label and label.lower() in low:
                matches.append(row)
                break
    return matches


def extract_tasks_from_chunks(chunks: list[dict[str, Any]], task_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = []
    seen: set[tuple[str, str]] = set()
    for chunk in chunks:
        if chunk.get("chunk_role") not in {"task_evidence", "criterion_evidence", "material_evidence", "curriculum_steering", "accessible_material_evidence"}:
            continue
        text = chunk.get("text", "")
        matched = match_task_subtypes(text, task_rows)
        if not matched and (TASK_SIGNAL_RE.search(text) or TASK_IMPERATIVE_RE.search(text)):
            label = (TASK_SIGNAL_RE.search(text) or TASK_IMPERATIVE_RE.search(text)).group(1)
            matched = [
                {
                    "id": stable("task_subtype_candidate", label),
                    "label_et": label,
                    "candidate_class": "TaskSubtype",
                    "parent_id": None,
                }
            ]
        for task in matched:
            key = (task["id"], chunk.get("id"))
            if key in seen:
                continue
            seen.add(key)
            rows.append(
                {
                    "id": stable("task_signal", task["id"], chunk.get("id")),
                    "candidate_class": "TaskInstanceSignal",
                    "task_subtype_id": task["id"],
                    "task_subtype_label": task.get("label_et"),
                    "task_type_id": task.get("parent_id"),
                    "material_title": chunk.get("source_title"),
                    "material_kind": chunk.get("source_kind"),
                    "subject": chunk.get("subject") or (chunk.get("subjects") or [None])[0],
                    "grades": normalize_grades(chunk.get("grade")),
                    "school_stages": infer_stages_from_grades(normalize_grades(chunk.get("grade")), chunk.get("school_stage")),
                    "learner_profile": chunk.get("learner_profile"),
                    "source_authority": chunk.get("source_authority"),
                    "source_system": chunk.get("source_system"),
                    "source_kind": chunk.get("source_kind"),
                    "source_url": chunk.get("source_url"),
                    "evidence_ids": [evidence_id_from_chunk(chunk)],
                    "context_snippet": context(text, 600),
                    "confidence": 0.68 if task.get("parent_id") else 0.48,
                    "status": "candidate",
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
    return rows


def build_criterion_keyword_map(criterion_rows: list[dict[str, Any]]) -> list[tuple[str, dict[str, Any]]]:
    rows = []
    for criterion in criterion_rows:
        label = criterion.get("label_et", "")
        if criterion.get("candidate_class") not in {"AssessmentCriterion", "CriterionDimension"}:
            continue
        key = normalize_key(label)
        if key:
            rows.append((key, criterion))
    aliases = {
        "sisu ülesehitus": "criterion:sisu_teemaarendus",
        "sisu ja ülesehitus": "criterion:sisu_teemaarendus",
        "lausestus sõnavalik": "criterion:sonastus_stiil",
        "lausestus ja sõnavalik": "criterion:sonastus_stiil",
        "õigekiri vormistus": "criterion:oigekiri",
        "õigekiri ja vormistus": "criterion:oigekiri",
        "alusteksti kasutamine": "criterion:alusteksti_integreerimine",
        "liigendus": "criterion:teksti_liigendus",
    }
    by_id = {row["id"]: row for row in criterion_rows}
    for alias, cid in aliases.items():
        if cid in by_id:
            rows.append((alias, by_id[cid]))
    return rows


def extract_criteria_from_chunks(chunks: list[dict[str, Any]], criterion_rows: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    keyword_map = build_criterion_keyword_map(criterion_rows)
    criterion_evidence = []
    scale_points = []
    seen: set[tuple[str, str]] = set()
    point_re = re.compile(r"(?P<points>\d+)\s*(?:punkti|punkt)\b", re.I)
    max_re = re.compile(r"(?:kokku kuni|maksimaalne tulemus|max)\s*(?P<points>\d+)\s*(?:punkti|punkt)", re.I)
    for chunk in chunks:
        if chunk.get("chunk_role") != "criterion_evidence" and not CRITERION_SIGNAL_RE.search(chunk.get("text", "")):
            continue
        text_key = normalize_key(chunk.get("text", ""))
        matches = []
        for keyword, criterion in keyword_map:
            if keyword and keyword in text_key:
                matches.append(criterion)
        if not matches and chunk.get("chunk_role") == "criterion_evidence":
            matches = [row for row in criterion_rows if row.get("id") in {"criterion:sisu_teemaarendus", "criterion:sonastus_stiil", "criterion:oigekiri"}]
        for criterion in matches:
            key = (criterion["id"], chunk.get("id"))
            if key in seen:
                continue
            seen.add(key)
            criterion_evidence.append(
                {
                    "id": stable("criterion_evidence", criterion["id"], chunk.get("id")),
                    "criterion_id": criterion["id"],
                    "criterion_label": criterion.get("label_et"),
                    "criterion_class": criterion.get("candidate_class"),
                    "task_subtype_ids": criterion.get("applies_to", []),
                    "source_authority": chunk.get("source_authority"),
                    "source_system": chunk.get("source_system"),
                    "source_kind": chunk.get("source_kind"),
                    "source_url": chunk.get("source_url"),
                    "source_file": chunk.get("source_file"),
                    "evidence_ids": [evidence_id_from_chunk(chunk)],
                    "level_descriptor": context(chunk.get("text", ""), 700),
                    "learner_profile": chunk.get("learner_profile"),
                    "confidence": 0.76 if chunk.get("source_authority") == "exam_rubric" else 0.58,
                    "status": "candidate",
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
        for match in point_re.finditer(chunk.get("text", "")):
            points = int(match.group("points"))
            if 0 <= points <= 30:
                scale_points.append(
                    {
                        "id": stable("rubric_scale", chunk.get("id"), points, match.start()),
                        "points": points,
                        "scale_kind": "mentioned_points",
                        "source_authority": chunk.get("source_authority"),
                        "source_url": chunk.get("source_url"),
                        "source_file": chunk.get("source_file"),
                        "evidence_ids": [evidence_id_from_chunk(chunk)],
                        "context_snippet": context(chunk.get("text", ""), 650),
                        "status": "candidate",
                        "confidence": 0.62,
                        "extractor_version": EXTRACTOR_VERSION,
                    }
                )
        for match in max_re.finditer(chunk.get("text", "")):
            points = int(match.group("points"))
            scale_points.append(
                {
                    "id": stable("rubric_scale", chunk.get("id"), "max", points),
                    "points": points,
                    "scale_kind": "maximum_total",
                    "source_authority": chunk.get("source_authority"),
                    "source_url": chunk.get("source_url"),
                    "source_file": chunk.get("source_file"),
                    "evidence_ids": [evidence_id_from_chunk(chunk)],
                    "context_snippet": context(chunk.get("text", ""), 650),
                    "status": "candidate",
                    "confidence": 0.72,
                    "extractor_version": EXTRACTOR_VERSION,
                }
            )
    return criterion_evidence, scale_points


def extract_level_expectations(chunks: list[dict[str, Any]], assessment: dict[str, Any], criterion_evidence: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = []
    profiles = assessment.get("level_expectation_dimensions", {}).get("benchmark_profiles", [])
    for profile in profiles:
        rows.append(
            {
                "id": profile["id"],
                "candidate_class": "LevelExpectation",
                "label_et": f"{profile['grade']} {profile['school_stage']} ootustase",
                "grade": profile.get("grade"),
                "school_stage": profile.get("school_stage"),
                "task_subtype_id": "task_subtype:arutlev_kirjand" if profile["id"] in {"level:9_klass", "level:12_klass"} else None,
                "text_complexity": profile.get("text_complexity"),
                "source_use": profile.get("source_use"),
                "independence": profile.get("independence"),
                "argument_depth": profile.get("argument_depth"),
                "language_accuracy": profile.get("language_accuracy"),
                "source_authority": "teacher_guidance",
                "source_system": "assessment_taxonomy_config",
                "evidence_ids": [],
                "confidence": 0.7,
                "status": "controlled_taxonomy_benchmark",
                "extractor_version": EXTRACTOR_VERSION,
            }
        )
    for item in criterion_evidence:
        descriptor = item.get("level_descriptor", "")
        stage = None
        grade = None
        if "9. klass" in descriptor or "põhikooli" in descriptor.lower():
            stage = "III kooliaste"
            grade = "9. klass"
        elif "gümnaas" in descriptor.lower():
            stage = "Gümnaasium"
        elif "5. klass" in descriptor:
            stage = "II kooliaste"
            grade = "5. klass"
        if not (stage or grade):
            continue
        rows.append(
            {
                "id": stable("level_expectation", item.get("criterion_id"), grade, stage, item.get("id")),
                "candidate_class": "LevelExpectation",
                "label_et": f"{grade or stage} - {item.get('criterion_label')}",
                "grade": grade,
                "school_stage": stage,
                "criterion_id": item.get("criterion_id"),
                "criterion_label": item.get("criterion_label"),
                "task_subtype_id": "task_subtype:arutlev_kirjand",
                "descriptor": descriptor,
                "source_authority": item.get("source_authority"),
                "source_system": item.get("source_system"),
                "source_url": item.get("source_url"),
                "source_file": item.get("source_file"),
                "evidence_ids": item.get("evidence_ids", []),
                "confidence": item.get("confidence", 0.55),
                "status": "candidate",
                "extractor_version": EXTRACTOR_VERSION,
            }
        )
    return rows


def extract_material_signals(official_backbone: list[dict[str, Any]], chunks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows = []
    for rec in official_backbone:
        if rec["record_type"] != "materials":
            continue
        rows.append(
            {
                "id": stable("material_signal", rec.get("source_url"), rec.get("label_et")),
                "label_et": rec.get("label_et"),
                "subject": rec.get("subject"),
                "grades": rec.get("grades"),
                "school_stages": rec.get("school_stages"),
                "official_identifier": rec.get("official_identifier"),
                "ekoolikott_id": rec.get("ekoolikott_id"),
                "source_authority": "official_curriculum",
                "source_system": "oppekava",
                "source_url": rec.get("source_url"),
                "linked_outcomes": rec.get("linked_outcomes", []),
                "linked_topics": rec.get("linked_material_topics", []),
                "confidence": 0.84,
                "status": "harvested",
                "extractor_version": EXTRACTOR_VERSION,
            }
        )
    for chunk in chunks:
        if chunk.get("chunk_role") not in {"material_evidence", "accessible_material_evidence", "task_evidence"}:
            continue
        rows.append(
            {
                "id": stable("material_signal", chunk.get("source_url"), chunk.get("source_file"), chunk.get("id")),
                "label_et": chunk.get("source_title") or chunk.get("source_file") or chunk.get("source_url"),
                "subject": chunk.get("subject") or (chunk.get("subjects") or [None])[0],
                "grades": normalize_grades(chunk.get("grade")),
                "school_stages": infer_stages_from_grades(normalize_grades(chunk.get("grade")), chunk.get("school_stage")),
                "source_authority": chunk.get("source_authority"),
                "source_system": chunk.get("source_system"),
                "source_kind": chunk.get("source_kind"),
                "source_url": chunk.get("source_url"),
                "source_file": chunk.get("source_file"),
                "learner_profile": chunk.get("learner_profile"),
                "evidence_ids": [evidence_id_from_chunk(chunk)],
                "context_snippet": context(chunk.get("text", ""), 450),
                "confidence": 0.58,
                "status": "candidate",
                "extractor_version": EXTRACTOR_VERSION,
            }
        )
    return rows


def build_review_sample(
    units: list[dict[str, Any]],
    task_signals: list[dict[str, Any]],
    criterion_evidence: list[dict[str, Any]],
    level_expectations: list[dict[str, Any]],
    competence_expressions: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    rows = []
    for item in units:
        if item.get("status") == "needs_review" or item.get("review_reasons"):
            rows.append(
                {
                    "review_type": "unit_candidate",
                    "id": item["id"],
                    "label": item.get("label_et"),
                    "class": item.get("candidate_class"),
                    "reason": "; ".join(item.get("review_reasons", [])),
                    "source_authority": item.get("source_authority"),
                    "source_url": item.get("source_url"),
                    "context": item.get("context_snippet"),
                }
            )
    for collection_name, collection in [
        ("task_signal", task_signals),
        ("criterion_evidence", criterion_evidence),
        ("level_expectation", level_expectations),
        ("competence_expression", competence_expressions),
    ]:
        for item in sorted(collection, key=lambda x: x.get("confidence", 0))[:75]:
            rows.append(
                {
                    "review_type": collection_name,
                    "id": item["id"],
                    "label": item.get("label_et") or item.get("criterion_label") or item.get("task_subtype_label"),
                    "class": item.get("candidate_class") or item.get("criterion_class"),
                    "reason": "low_confidence_or_candidate",
                    "source_authority": item.get("source_authority"),
                    "source_url": item.get("source_url"),
                    "context": item.get("context_snippet") or item.get("level_descriptor") or item.get("descriptor"),
                }
            )
    return rows[:500]


def write_report(
    official_backbone: list[dict[str, Any]],
    evidence_spans: list[dict[str, Any]],
    unit_candidates: list[dict[str, Any]],
    competence_taxonomy: list[dict[str, Any]],
    competence_expressions: list[dict[str, Any]],
    task_taxonomy: list[dict[str, Any]],
    task_signals: list[dict[str, Any]],
    criterion_taxonomy: list[dict[str, Any]],
    criterion_evidence: list[dict[str, Any]],
    rubric_scale_points: list[dict[str, Any]],
    level_expectations: list[dict[str, Any]],
    material_signals: list[dict[str, Any]],
) -> None:
    lines = [
        "# Structured Extraction Report",
        "",
        f"- Extractor version: `{EXTRACTOR_VERSION}`",
        f"- Official backbone records: {len(official_backbone)}",
        f"- Evidence spans: {len(evidence_spans)}",
        f"- Learning unit candidates: {len(unit_candidates)}",
        f"- Competence taxonomy rows: {len(competence_taxonomy)}",
        f"- Competence expression candidates: {len(competence_expressions)}",
        f"- Task taxonomy rows: {len(task_taxonomy)}",
        f"- Task instance signals: {len(task_signals)}",
        f"- Criterion taxonomy rows: {len(criterion_taxonomy)}",
        f"- Criterion evidence links: {len(criterion_evidence)}",
        f"- Rubric scale points: {len(rubric_scale_points)}",
        f"- Level expectations: {len(level_expectations)}",
        f"- Material signals: {len(material_signals)}",
        "",
        "## Official Backbone By Type",
    ]
    for key, count in Counter(row["record_type"] for row in official_backbone).most_common():
        lines.append(f"- `{key}`: {count}")
    lines.append("")
    lines.append("## Unit Candidates By Class")
    for key, count in Counter(row["candidate_class"] for row in unit_candidates).most_common():
        lines.append(f"- `{key}`: {count}")
    lines.append("")
    lines.append("## Cross-Curricular Competence Overlay")
    for key, count in Counter(row["candidate_class"] for row in competence_taxonomy).most_common():
        lines.append(f"- `{key}`: {count}")
    lines.append(f"- `CompetenceExpression`: {len(competence_expressions)}")
    for key, count in Counter(row.get("target_label_et") for row in competence_expressions).most_common(15):
        lines.append(f"- `{key}` expressions: {count}")
    lines.append("")
    lines.append("## Evidence By Authority")
    for key, count in Counter(row.get("source_authority") for row in evidence_spans).most_common():
        lines.append(f"- `{key}`: {count}")
    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- These are structured extraction datasets, not graph nodes/edges.",
            "- Official outcomes are preserved as official backbone records and only produce candidate learner units requiring decomposition/review.",
            "- Üldpädevused, valdkonnapädevus, kooliastme pädevus, and läbivad teemad are routed to the cross-curricular competence overlay.",
            "- CompetenceExpression rows are evidence-linked candidates for how a broad competence is expressed in eesti keel ja kirjandus tasks, outcomes, materials, and criteria.",
            "- Rubric prose is routed to criterion and level evidence, not generic KnowledgeUnit/SkillUnit extraction.",
            "- HEV/simplified material keeps learner profile metadata.",
            "- Knobits remain absent from the harvested oppekava results; this should be investigated before final graph construction.",
        ]
    )
    (ROOT / "reports/structured_extraction_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--chunk-unit-limit", type=int, default=None)
    args = parser.parse_args()

    ensure_dirs()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    official_records = read_jsonl(ROOT / "data/processed/corpus_clean/official_records.jsonl")
    chunks = read_jsonl(ROOT / "data/processed/corpus_clean/chunks.jsonl")
    assessment = load_yaml("config/assessment_taxonomy_eesti_keel_kirjandus.yaml")
    general_competence_config = load_yaml("config/general_competence_taxonomy.yaml")
    blocklist, whitelist = load_policy()

    official_backbone = extract_official_backbone(official_records)
    evidence_spans = make_evidence_spans(chunks)
    competence_taxonomy = flatten_general_competence_taxonomy(general_competence_config)
    competence_expressions = extract_competence_expressions(chunks, competence_taxonomy, general_competence_config)
    task_taxonomy, criterion_taxonomy = flatten_assessment_taxonomy(assessment)
    unit_candidates = extract_units_from_official(official_backbone, blocklist, whitelist)
    unit_candidates.extend(extract_units_from_chunks(chunks, blocklist, whitelist, args.chunk_unit_limit))
    task_signals = extract_tasks_from_chunks(chunks, task_taxonomy)
    criterion_evidence, rubric_scale_points = extract_criteria_from_chunks(chunks, criterion_taxonomy)
    level_expectations = extract_level_expectations(chunks, assessment, criterion_evidence)
    material_signals = extract_material_signals(official_backbone, chunks)
    review = build_review_sample(unit_candidates, task_signals, criterion_evidence, level_expectations, competence_expressions)

    write_jsonl(OUT_DIR / "official_backbone.jsonl", official_backbone)
    write_jsonl(OUT_DIR / "evidence_spans.jsonl", evidence_spans)
    write_jsonl(OUT_DIR / "learning_unit_candidates.jsonl", unit_candidates)
    write_jsonl(OUT_DIR / "general_competence_taxonomy.jsonl", competence_taxonomy)
    write_jsonl(OUT_DIR / "competence_expressions.jsonl", competence_expressions)
    write_jsonl(OUT_DIR / "task_taxonomy.jsonl", task_taxonomy)
    write_jsonl(OUT_DIR / "task_signals.jsonl", task_signals)
    write_jsonl(OUT_DIR / "criterion_taxonomy.jsonl", criterion_taxonomy)
    write_jsonl(OUT_DIR / "criterion_evidence.jsonl", criterion_evidence)
    write_jsonl(OUT_DIR / "rubric_scale_points.jsonl", rubric_scale_points)
    write_jsonl(OUT_DIR / "level_expectations.jsonl", level_expectations)
    write_jsonl(OUT_DIR / "material_signals.jsonl", material_signals)
    write_csv(ROOT / "reports/structured_extraction_review_sample.csv", review)
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(
            {
                "extractor_version": EXTRACTOR_VERSION,
                "outputs": {
                    "official_backbone": len(official_backbone),
                    "evidence_spans": len(evidence_spans),
                    "learning_unit_candidates": len(unit_candidates),
                    "general_competence_taxonomy": len(competence_taxonomy),
                    "competence_expressions": len(competence_expressions),
                    "task_taxonomy": len(task_taxonomy),
                    "task_signals": len(task_signals),
                    "criterion_taxonomy": len(criterion_taxonomy),
                    "criterion_evidence": len(criterion_evidence),
                    "rubric_scale_points": len(rubric_scale_points),
                    "level_expectations": len(level_expectations),
                    "material_signals": len(material_signals),
                    "review_rows": len(review),
                },
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    write_report(
        official_backbone,
        evidence_spans,
        unit_candidates,
        competence_taxonomy,
        competence_expressions,
        task_taxonomy,
        task_signals,
        criterion_taxonomy,
        criterion_evidence,
        rubric_scale_points,
        level_expectations,
        material_signals,
    )
    print(
        "Structured extraction complete: "
        f"{len(unit_candidates)} unit candidates, "
        f"{len(competence_expressions)} competence expressions, "
        f"{len(task_signals)} task signals, "
        f"{len(criterion_evidence)} criterion evidence rows"
    )


if __name__ == "__main__":
    main()
