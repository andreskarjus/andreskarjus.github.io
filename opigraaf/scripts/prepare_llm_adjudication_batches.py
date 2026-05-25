from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl


BATCH_DIR = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "llm_adjudication"


def load_evidence() -> dict[str, dict[str, Any]]:
    spans = read_jsonl(PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "evidence_spans.jsonl")
    return {span["id"]: span for span in spans if span.get("id")}


def evidence_ids(record: dict[str, Any]) -> list[str]:
    ids = record.get("evidence_ids") or record.get("evidence") or []
    if isinstance(ids, str):
        return [ids]
    if isinstance(ids, list):
        out = []
        for item in ids:
            if isinstance(item, str):
                out.append(item)
            elif isinstance(item, dict) and item.get("id"):
                out.append(str(item["id"]))
        return out
    return []


def evidence_context(record: dict[str, Any], evidence_by_id: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    contexts = []
    for evidence_id in evidence_ids(record)[:3]:
        span = evidence_by_id.get(evidence_id)
        if not span:
            continue
        contexts.append(
            {
                "evidence_id": evidence_id,
                "context_snippet": span.get("context_snippet"),
                "source_url": span.get("source_url"),
                "source_file": span.get("source_file"),
                "heading_path": span.get("heading_path"),
                "grade": span.get("grade"),
                "school_stage": span.get("school_stage"),
                "subject": span.get("subject"),
            }
        )
    return contexts


def compact_record(record: dict[str, Any], evidence_by_id: dict[str, dict[str, Any]], source_kind: str) -> dict[str, Any]:
    return {
        "id": record.get("id"),
        "source_kind": source_kind,
        "candidate_class": record.get("candidate_class"),
        "record_type": record.get("record_type"),
        "label_et": record.get("refined_label_et") or record.get("label_et") or record.get("label"),
        "description_et": record.get("refined_description_et") or record.get("description"),
        "action": record.get("action") or record.get("primary_operation"),
        "object": record.get("object") or record.get("task_object"),
        "context": record.get("context") or record.get("task_context") or record.get("learning_context"),
        "genre": record.get("genre"),
        "subject": record.get("subject"),
        "grades": record.get("grades"),
        "school_stages": record.get("school_stages"),
        "aligned_learning_outcomes": record.get("aligned_learning_outcomes"),
        "aligned_task_subtype": record.get("aligned_task_subtype") or record.get("task_subtype_id"),
        "aligned_competence_id": record.get("aligned_competence_id") or record.get("target_id"),
        "source_authority": record.get("source_authority"),
        "source_system": record.get("source_system"),
        "source_url": record.get("source_url"),
        "source_file": record.get("source_file"),
        "confidence": record.get("confidence"),
        "generation_ready": record.get("generation_ready"),
        "comparison_ready": record.get("comparison_ready"),
        "quality_flags": record.get("quality_flags"),
        "evidence_context": evidence_context(record, evidence_by_id),
    }


def write_prompt(path: Path, batch_name: str, input_file: str, output_file: str) -> None:
    prompt = f"""# LLM Adjudication Task: {batch_name}

Read every JSONL record in `{input_file}` and write decisions to `{output_file}` as JSONL.

Mission: decide whether each extracted candidate is a usable curriculum KG item for Eesti keel ja kirjandus. Think like a teacher and KG engineer. Do not merge purely by label or embeddings. Use label, source, grade/stage, aligned outcome/task/criterion, and evidence snippet together.

For each input record, emit one or more JSON objects with these fields:

- `source_id`: original candidate id.
- `decision`: one of `keep`, `rewrite`, `split`, `demote_to_topic`, `demote_to_source_note`, `reject`, `needs_human`.
- `public_type`: `KnowledgeUnit`, `SkillUnit`, `CompetenceUnit`, `TaskInstance`, `TaskSubtype`, `AssessmentCriterion`, `CriterionDimension`, `LevelExpectation`, `Topic`, `SourceNote`, or `null`.
- `canonical_label_et`: teacher-readable label. Use action + object for skills/tasks where possible.
- `definition_et`: one concise sentence explaining what a learner must know/do or what is being assessed.
- `grade_scope`: explicit grades/stages if supported by evidence; otherwise `[]`.
- `source_support`: `strong`, `medium`, `weak`, or `none`.
- `merge_key_et`: normalized semantic key for later candidate grouping. This is not a final merge decision.
- `same_as_candidates`: ids from this batch that appear semantically equivalent, only if evidence supports that.
- `broader_than_candidates`: ids this item appears broader than.
- `narrower_than_candidates`: ids this item appears narrower than.
- `reason`: short reason for the decision.
- `evidence_ids`: evidence ids used.

Rules:

- Reject bibliography fragments, curriculum section headers, source metadata, and random prose that is not a teachable/assessable unit.
- Split compound rows only when the split children would each be useful for tracking/exercise/assessment.
- Demote generic nouns or broad content areas to `Topic` unless the evidence supports a concrete skill/knowledge unit.
- Keep official learning outcomes as official alignment evidence, but do not copy broad outcomes into canonical units unless they express a reusable action-object unit.
- Rubric and grading language should become criteria, dimensions, scale points, or level expectations, not generic knowledge units.
- Never decide final equivalence just from labels. Include source/evidence reasoning.
"""
    path.write_text(prompt, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch-size", type=int, default=160)
    args = parser.parse_args()

    refined = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "refined"
    evidence_by_id = load_evidence()
    units = read_jsonl(refined / "learning_unit_candidates.refined.jsonl")
    tasks = read_jsonl(refined / "task_signals.refined.jsonl")
    criteria = read_jsonl(refined / "criterion_evidence.refined.jsonl")
    competences = read_jsonl(refined / "competence_expressions.refined.jsonl")

    BATCH_DIR.mkdir(parents=True, exist_ok=True)
    batches: list[tuple[str, list[dict[str, Any]]]] = []

    official_units = [
        compact_record(rec, evidence_by_id, "learning_unit_official_or_aligned")
        for rec in units
        if rec.get("graph_ready_status") == "candidate"
        and (rec.get("aligned_learning_outcomes") or "official_outcome_derived_requires_decomposition" in (rec.get("quality_flags") or []))
    ][: args.batch_size]
    batches.append(("batch_001_official_aligned_units", official_units))

    material_units = [
        compact_record(rec, evidence_by_id, "learning_unit_material_or_guidance")
        for rec in units
        if rec.get("graph_ready_status") == "candidate"
        and not rec.get("aligned_learning_outcomes")
        and "official_outcome_derived_requires_decomposition" not in (rec.get("quality_flags") or [])
    ][: args.batch_size]
    batches.append(("batch_002_material_units", material_units))

    task_rows = [
        compact_record(rec, evidence_by_id, "task_signal")
        for rec in tasks
        if rec.get("graph_ready_status") in {"candidate", "candidate_refined"}
    ][: args.batch_size]
    batches.append(("batch_003_task_signals", task_rows))

    assessment_rows = [
        compact_record(rec, evidence_by_id, "criterion_evidence")
        for rec in criteria
        if rec.get("graph_ready_status") in {"candidate", "candidate_refined", None}
    ][: args.batch_size // 2]
    assessment_rows.extend(
        compact_record(rec, evidence_by_id, "competence_expression")
        for rec in competences
        if rec.get("graph_ready_status") in {"candidate", "candidate_refined"}
    )
    batches.append(("batch_004_criteria_competences", assessment_rows[: args.batch_size]))

    manifest = []
    for name, rows in batches:
        input_path = BATCH_DIR / f"{name}.jsonl"
        output_path = BATCH_DIR / f"{name}.decisions.jsonl"
        prompt_path = BATCH_DIR / f"{name}.prompt.md"
        write_jsonl(input_path, rows)
        write_prompt(prompt_path, name, str(input_path), str(output_path))
        manifest.append(
            {
                "batch": name,
                "input_path": str(input_path),
                "prompt_path": str(prompt_path),
                "expected_output_path": str(output_path),
                "records": len(rows),
            }
        )

    (BATCH_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"batches": manifest}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
