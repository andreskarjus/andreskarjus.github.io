from __future__ import annotations

import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from common import ROOT, ensure_dirs, load_yaml, read_jsonl, sha1_text, write_csv, write_jsonl

PIPELINE_VERSION = "prepare_clean_corpus_v1_2026-05-20"

CHUNK_INPUTS = [
    ("curriculum_oppekava", "data/interim/curriculum/chunks.jsonl"),
    ("curriculum_previous", "data/interim/curriculum/previous_chunks.jsonl"),
    ("curriculum_direct_pdf", "data/interim/curriculum/direct_source_chunks.jsonl"),
    ("materials_previous", "data/interim/materials/previous_material_chunks.jsonl"),
    ("materials_oppekava_probe", "data/interim/materials/material_text_chunks.jsonl"),
    ("materials_web", "data/interim/materials/web_source_chunks.jsonl"),
    ("materials_direct_pdf", "data/interim/materials/direct_source_chunks.jsonl"),
]

OFFICIAL_INPUTS = [
    ("subject_pages", "data/interim/oppekava/subject_pages.jsonl", "data/interim/oppekava/pilot_subject_pages.jsonl"),
    ("learning_outcomes", "data/interim/oppekava/learning_outcomes.jsonl", "data/interim/oppekava/pilot_learning_outcomes.jsonl"),
    ("topics", "data/interim/oppekava/topics.jsonl", "data/interim/oppekava/pilot_topics.jsonl"),
    ("materials", "data/interim/oppekava/materials.jsonl", "data/interim/oppekava/pilot_materials.jsonl"),
    ("knobits", "data/interim/oppekava/knobits.jsonl", "data/interim/oppekava/pilot_knobits.jsonl"),
]

CRITERION_RE = re.compile(
    r"\b(hindamiskriteer|hindamismudel|hinnatakse|punkti?|maksimaalne tulemus|"
    r"õigekeelsusvig|rubriik|kriteerium|skaala)\b",
    re.I,
)
TASK_RE = re.compile(
    r"\b(ülesanne|harjutus|test|kontrolltöö|etteütlus|kirjand|arutlus|"
    r"referaat|ettekanne|väitlus|kokkuvõte|toimetamine|lugemiskontroll)\b",
    re.I,
)
KNOWLEDGE_RE = re.compile(
    r"\b(teab|tunneb|mõiste|reegel|teadmine|grammatika|õigekiri|"
    r"kirjavahemärgistus|sõnaliik|kääne|pööre|žanr|kujund)\b",
    re.I,
)
SKILL_RE = re.compile(
    r"\b(oskab|kasutab|kirjutab|loeb|analüüsib|põhjendab|selgitab|"
    r"võrdleb|arutleb|koostab|esitab|hindab|toimetab|sõnastab)\b",
    re.I,
)


def source_authority(row: dict[str, Any], authority_config: dict[str, Any]) -> str:
    source_system = row.get("source_system")
    source_kind = row.get("source_kind")
    for tier, spec in authority_config.get("tiers", {}).items():
        if source_system and source_system in spec.get("source_systems", []):
            return tier
        if source_kind and source_kind in spec.get("source_kinds", []):
            return tier
    return authority_config.get("default_tier", "inferred")


def is_long_base64_token(token: str) -> bool:
    if len(token) < 300:
        return False
    if not re.fullmatch(r"[A-Za-z0-9+/=\n\r]+", token):
        return False
    return True


def junk_reason(text: str) -> str | None:
    stripped = text.strip()
    if len(stripped) < 40:
        return "too_short"
    lower = stripped.lower()
    if "data:image" in lower or "ivborw0kggo" in lower or "aaelftksuqmcc" in lower:
        return "embedded_image_or_base64"
    for token in re.findall(r"[A-Za-z0-9+/=]{300,}", stripped):
        if is_long_base64_token(token):
            return "long_base64_token"
    printable = sum(1 for ch in stripped if ch.isprintable() or ch.isspace())
    if printable / max(1, len(stripped)) < 0.95:
        return "non_printable_text"
    return None


def classify_role(row: dict[str, Any]) -> tuple[str, list[str]]:
    text = row.get("text", "")
    source_kind = row.get("source_kind") or ""
    source_file = row.get("source_file") or ""
    lower_file = source_file.lower()
    lower_kind = source_kind.lower()
    targets: set[str] = set()

    if CRITERION_RE.search(text) or "hindamismudel" in lower_file or lower_kind in {"assessment_model", "exam_rubric"}:
        role = "criterion_evidence"
        targets.update({"AssessmentCriterion", "CriterionDimension", "RubricScalePoint", "LevelExpectation"})
    elif TASK_RE.search(text):
        role = "task_evidence"
        targets.update({"TaskType", "TaskSubtype", "TaskInstance", "SkillUnit"})
    elif source_kind == "language_reference":
        role = "reference_evidence"
        targets.update({"KnowledgeUnit"})
    elif source_kind == "teacher_methodology_curriculum_signal" or row.get("routing") == "curriculum":
        role = "curriculum_steering"
        targets.update({"LearningOutcome", "TaskType", "AssessmentCriterion", "LevelExpectation"})
    elif row.get("learner_profile") == "HEV/simplified" or source_kind == "hev_simplified_material":
        role = "accessible_material_evidence"
        targets.update({"KnowledgeUnit", "SkillUnit", "LevelExpectation"})
    else:
        role = "material_evidence"
        targets.update({"KnowledgeUnit", "SkillUnit", "TaskInstance"})

    if KNOWLEDGE_RE.search(text):
        targets.add("KnowledgeUnit")
    if SKILL_RE.search(text):
        targets.add("SkillUnit")
    if CRITERION_RE.search(text):
        targets.update({"AssessmentCriterion", "CriterionDimension"})
    if TASK_RE.search(text):
        targets.update({"TaskType", "TaskSubtype", "TaskInstance"})

    return role, sorted(targets)


def clean_text(text: str) -> str:
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def read_preferred_official(path: str, fallback: str) -> tuple[list[dict[str, Any]], str, bool]:
    primary = ROOT / path
    fallback_path = ROOT / fallback
    primary_rows = read_jsonl(primary)
    if primary_rows:
        return primary_rows, path, False
    return read_jsonl(fallback_path), fallback, True


def build_clean_chunks(authority_config: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    clean_rows: list[dict[str, Any]] = []
    rejected_rows: list[dict[str, Any]] = []
    input_summary: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()

    for input_key, rel_path in CHUNK_INPUTS:
        path = ROOT / rel_path
        rows = read_jsonl(path)
        accepted = 0
        rejected = 0
        for row in rows:
            text = clean_text(row.get("text", ""))
            reason = junk_reason(text)
            source_url = row.get("source_url") or row.get("source_file") or input_key
            key = (source_url, sha1_text(text, 20))
            if reason:
                rejected += 1
                rejected_rows.append(
                    {
                        "id": row.get("id") or f"rejected:{sha1_text(source_url + text, 20)}",
                        "input_key": input_key,
                        "reason": reason,
                        "source_url": source_url,
                        "source_file": row.get("source_file"),
                        "source_kind": row.get("source_kind"),
                        "text_preview": text[:300],
                    }
                )
                continue
            if key in seen:
                rejected += 1
                rejected_rows.append(
                    {
                        "id": row.get("id") or f"rejected:{sha1_text(source_url + text, 20)}",
                        "input_key": input_key,
                        "reason": "duplicate_source_text",
                        "source_url": source_url,
                        "source_file": row.get("source_file"),
                        "source_kind": row.get("source_kind"),
                        "text_preview": text[:300],
                    }
                )
                continue
            seen.add(key)
            role, targets = classify_role({**row, "text": text})
            clean_rows.append(
                {
                    "id": row.get("id") or f"clean:{sha1_text(source_url + text, 20)}",
                    "input_key": input_key,
                    "source_system": row.get("source_system"),
                    "source_kind": row.get("source_kind"),
                    "source_authority": source_authority(row, authority_config),
                    "source_url": row.get("source_url"),
                    "source_file": row.get("source_file"),
                    "source_title": row.get("source_title") or row.get("material_label"),
                    "raw_path": row.get("raw_path"),
                    "page": row.get("page"),
                    "heading_path": row.get("heading_path"),
                    "subject": row.get("subject"),
                    "subjects": row.get("subjects") or ([row.get("subject")] if row.get("subject") else []),
                    "grade": row.get("grade"),
                    "school_stage": row.get("school_stage"),
                    "learner_profile": row.get("learner_profile"),
                    "chunk_role": role,
                    "extraction_targets": targets,
                    "pipeline_version": PIPELINE_VERSION,
                    "text": text,
                }
            )
            accepted += 1
        input_summary.append(
            {
                "input_key": input_key,
                "path": rel_path,
                "rows": len(rows),
                "accepted": accepted,
                "rejected": rejected,
            }
        )
    return clean_rows, rejected_rows, input_summary


def build_official_records(authority_config: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    records: list[dict[str, Any]] = []
    summary: list[dict[str, Any]] = []
    for record_type, primary, fallback in OFFICIAL_INPUTS:
        rows, used_path, used_fallback = read_preferred_official(primary, fallback)
        for row in rows:
            source_url = row.get("url") or row.get("html_url") or row.get("source_url") or row.get("ask_url")
            records.append(
                {
                    "id": f"official:{record_type}:{sha1_text((source_url or '') + (row.get('label') or row.get('subject') or ''), 20)}",
                    "record_type": record_type,
                    "source_authority": "official_curriculum",
                    "source_path": used_path,
                    "used_pilot_fallback": used_fallback,
                    "label": row.get("label") or row.get("subject"),
                    "source_url": source_url,
                    "subject": row.get("subject"),
                    "school_stages": row.get("school_stages"),
                    "grades": row.get("grades"),
                    "raw": row,
                }
            )
        summary.append(
            {
                "record_type": record_type,
                "path": used_path,
                "used_pilot_fallback": used_fallback,
                "records": len(rows),
            }
        )
    return records, summary


def write_report(
    clean_rows: list[dict[str, Any]],
    rejected_rows: list[dict[str, Any]],
    input_summary: list[dict[str, Any]],
    official_summary: list[dict[str, Any]],
    official_records: list[dict[str, Any]],
) -> None:
    role_counts = Counter(row["chunk_role"] for row in clean_rows)
    authority_counts = Counter(row["source_authority"] for row in clean_rows)
    target_counts: Counter[str] = Counter()
    for row in clean_rows:
        target_counts.update(row.get("extraction_targets", []))
    fallback_count = sum(1 for row in official_summary if row["used_pilot_fallback"])
    lines = [
        "# Clean Corpus Preparation Report",
        "",
        f"- Pipeline version: `{PIPELINE_VERSION}`",
        f"- Clean chunks: {len(clean_rows)}",
        f"- Rejected chunks: {len(rejected_rows)}",
        f"- Official records: {len(official_records)}",
        f"- Official record types using pilot fallback: {fallback_count}",
        "",
        "## Chunk Roles",
    ]
    for key, count in role_counts.most_common():
        lines.append(f"- `{key}`: {count}")
    lines.append("")
    lines.append("## Source Authority")
    for key, count in authority_counts.most_common():
        lines.append(f"- `{key}`: {count}")
    lines.append("")
    lines.append("## Extraction Targets")
    for key, count in target_counts.most_common():
        lines.append(f"- `{key}`: {count}")
    lines.append("")
    lines.append("## Official Backbone Inputs")
    for row in official_summary:
        fallback = "pilot fallback" if row["used_pilot_fallback"] else "full/current"
        lines.append(f"- `{row['record_type']}`: {row['records']} records from `{row['path']}` ({fallback})")
    lines.extend(
        [
            "",
            "## Gate Notes",
            "",
            "- Raw files were not deleted or modified.",
            "- Embedded image/base64 chunks are rejected before candidate extraction.",
            "- Rubric-like text is routed to assessment targets instead of generic Knowledge/Skill extraction.",
            "- If official records use pilot fallback, production graph building should first rerun the official oppekava harvest.",
        ]
    )
    (ROOT / "reports/clean_corpus_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    ensure_dirs()
    authority_config = load_yaml("config/source_authority.yaml")
    out_dir = ROOT / "data/processed/corpus_clean"
    out_dir.mkdir(parents=True, exist_ok=True)

    clean_rows, rejected_rows, input_summary = build_clean_chunks(authority_config)
    official_records, official_summary = build_official_records(authority_config)
    write_jsonl(out_dir / "chunks.jsonl", clean_rows)
    write_jsonl(out_dir / "rejected_chunks.jsonl", rejected_rows)
    write_jsonl(out_dir / "official_records.jsonl", official_records)
    write_csv(ROOT / "reports/clean_corpus_inputs.csv", input_summary)
    write_csv(ROOT / "reports/clean_corpus_official_inputs.csv", official_summary)
    write_csv(ROOT / "reports/clean_corpus_rejected_chunks.csv", rejected_rows)
    write_report(clean_rows, rejected_rows, input_summary, official_summary, official_records)
    print(f"Clean corpus: {len(clean_rows)} chunks, {len(rejected_rows)} rejected, {len(official_records)} official records")


if __name__ == "__main__":
    main()
