from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from common import ROOT, read_jsonl, write_csv, write_jsonl

STRUCT_DIR = ROOT / "data/processed/structured/v2"


def norm(text: str | None) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-zA-ZõäöüšžÕÄÖÜŠŽ0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def load(name: str) -> list[dict[str, Any]]:
    return read_jsonl(STRUCT_DIR / name)


def main() -> None:
    datasets = {
        "official_backbone": load("official_backbone.jsonl"),
        "evidence_spans": load("evidence_spans.jsonl"),
        "learning_unit_candidates": load("learning_unit_candidates.jsonl"),
        "general_competence_taxonomy": load("general_competence_taxonomy.jsonl"),
        "competence_expressions": load("competence_expressions.jsonl"),
        "task_taxonomy": load("task_taxonomy.jsonl"),
        "task_signals": load("task_signals.jsonl"),
        "criterion_taxonomy": load("criterion_taxonomy.jsonl"),
        "criterion_evidence": load("criterion_evidence.jsonl"),
        "rubric_scale_points": load("rubric_scale_points.jsonl"),
        "level_expectations": load("level_expectations.jsonl"),
        "material_signals": load("material_signals.jsonl"),
    }
    blockers: list[str] = []
    warnings: list[str] = []
    for name, rows in datasets.items():
        if not rows:
            if name in {"rubric_scale_points"}:
                warnings.append(f"{name} is empty.")
            else:
                blockers.append(f"{name} is empty.")
    evidence_ids = {row["id"] for row in datasets["evidence_spans"]}
    for name in [
        "learning_unit_candidates",
        "competence_expressions",
        "task_signals",
        "criterion_evidence",
        "rubric_scale_points",
        "level_expectations",
        "material_signals",
    ]:
        missing = 0
        for row in datasets[name]:
            for evid in row.get("evidence_ids", []) or []:
                if evid not in evidence_ids:
                    missing += 1
        if missing:
            blockers.append(f"{name} has {missing} missing evidence references.")

    official_counts = Counter(row.get("record_type") for row in datasets["official_backbone"])
    if official_counts.get("learning_outcomes", 0) < 200:
        warnings.append("Official learning outcome count below 200; verify full oppekava harvest.")
    if official_counts.get("knobits", 0) == 0:
        warnings.append("No subject-filtered knobit records harvested; global category exists but oppeaine-filtered Ask returned empty responses. Use a fallback matching pass before relying on official knobit alignment.")

    unit_rows = datasets["learning_unit_candidates"]
    competence_taxonomy_rows = datasets["general_competence_taxonomy"]
    competence_expression_rows = datasets["competence_expressions"]
    unit_duplicate_labels = Counter((row.get("candidate_class"), norm(row.get("label_et")), row.get("subject")) for row in unit_rows)
    duplicate_rows = [
        {"candidate_class": k[0], "label_norm": k[1], "subject": k[2], "count": c}
        for k, c in unit_duplicate_labels.items()
        if k[1] and c > 1
    ]
    needs_review = [row for row in unit_rows if row.get("status") == "needs_review" or row.get("review_reasons")]
    teacher_long = [row for row in unit_rows if len(row.get("label_et", "")) > 120]
    task_signal_counts = Counter(row.get("task_subtype_label") for row in datasets["task_signals"])
    criterion_signal_counts = Counter(row.get("criterion_label") for row in datasets["criterion_evidence"])
    level_by_grade = Counter(row.get("grade") or row.get("school_stage") for row in datasets["level_expectations"])
    competence_taxonomy_counts = Counter(row.get("candidate_class") for row in competence_taxonomy_rows)
    competence_expression_counts = Counter(row.get("target_label_et") for row in competence_expression_rows)
    competence_expression_status = Counter(row.get("status") for row in competence_expression_rows)
    weak_competence_expressions = [
        row
        for row in competence_expression_rows
        if row.get("status") == "needs_review" or row.get("confidence", 0) < 0.65
    ]
    source_authority = Counter()
    for name, rows in datasets.items():
        source_authority.update(row.get("source_authority") for row in rows if row.get("source_authority"))

    if not any(row.get("source_authority") == "exam_rubric" for row in datasets["criterion_evidence"]):
        blockers.append("Criterion evidence has no exam_rubric authority rows.")
    if "task_subtype:arutlev_kirjand" not in {row.get("task_subtype_id") for row in datasets["task_signals"]}:
        warnings.append("No task signal for task_subtype:arutlev_kirjand.")
    if competence_taxonomy_counts.get("GeneralCompetence", 0) < 8:
        blockers.append("General competence taxonomy has fewer than 8 controlled GeneralCompetence rows.")
    if competence_taxonomy_counts.get("TransversalTheme", 0) < 8:
        blockers.append("Transversal theme taxonomy has fewer than 8 controlled TransversalTheme rows.")
    if competence_taxonomy_counts.get("DomainCompetence", 0) < 1:
        blockers.append("No DomainCompetence row present for Keel ja kirjandus.")
    if not competence_expression_rows:
        warnings.append("No competence expression candidates extracted from corpus chunks.")

    write_csv(ROOT / "reports/structured_duplicate_unit_labels.csv", duplicate_rows[:1000])
    write_csv(ROOT / "reports/structured_unit_review_queue.csv", needs_review[:1000])
    write_csv(ROOT / "reports/structured_long_labels.csv", teacher_long[:1000])
    write_csv(ROOT / "reports/structured_competence_expression_review_queue.csv", weak_competence_expressions[:1000])
    report = [
        "# Structured Data QC Report",
        "",
        f"- Status: `{'blocked' if blockers else 'passed'}`",
        f"- Blockers: {len(blockers)}",
        f"- Warnings: {len(warnings)}",
        "",
        "## Dataset Counts",
    ]
    for name, rows in datasets.items():
        report.append(f"- `{name}`: {len(rows)}")
    report.append("")
    report.append("## Official Backbone")
    for key, count in official_counts.most_common():
        report.append(f"- `{key}`: {count}")
    report.append("")
    report.append("## Unit Candidates")
    for key, count in Counter(row.get("candidate_class") for row in unit_rows).most_common():
        report.append(f"- `{key}`: {count}")
    report.extend(
        [
            f"- Duplicate normalized unit labels: {len(duplicate_rows)}",
            f"- Unit candidates needing review: {len(needs_review)}",
            f"- Teacher labels over 120 chars: {len(teacher_long)}",
            "",
            "## Task Signals",
        ]
    )
    for key, count in task_signal_counts.most_common(20):
        report.append(f"- `{key}`: {count}")
    report.append("")
    report.append("## Cross-Curricular Competence Overlay")
    for key, count in competence_taxonomy_counts.most_common():
        report.append(f"- `{key}` taxonomy rows: {count}")
    report.append(f"- `CompetenceExpression` candidates: {len(competence_expression_rows)}")
    report.append(f"- `CompetenceExpression` review rows: {len(weak_competence_expressions)}")
    for key, count in competence_expression_status.most_common():
        report.append(f"- `{key}` expressions: {count}")
    for key, count in competence_expression_counts.most_common(20):
        report.append(f"- `{key}`: {count}")
    report.append("")
    report.append("## Criterion Evidence")
    for key, count in criterion_signal_counts.most_common(20):
        report.append(f"- `{key}`: {count}")
    report.append("")
    report.append("## Level Expectations")
    for key, count in level_by_grade.most_common():
        report.append(f"- `{key}`: {count}")
    report.append("")
    report.append("## Source Authority")
    for key, count in source_authority.most_common():
        report.append(f"- `{key}`: {count}")
    report.append("")
    report.append("## Blockers")
    report.extend([f"- {item}" for item in blockers] or ["- None."])
    report.append("")
    report.append("## Warnings")
    report.extend([f"- {item}" for item in warnings] or ["- None."])
    (ROOT / "reports/structured_data_qc_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    write_jsonl(
        ROOT / "reports/structured_data_qc.jsonl",
        [
            {
                "blockers": blockers,
                "warnings": warnings,
                "dataset_counts": {k: len(v) for k, v in datasets.items()},
                "official_counts": dict(official_counts),
                "duplicate_unit_labels": len(duplicate_rows),
                "unit_review_rows": len(needs_review),
                "long_labels": len(teacher_long),
                "competence_taxonomy_counts": dict(competence_taxonomy_counts),
                "competence_expressions": len(competence_expression_rows),
                "competence_expression_review_rows": len(weak_competence_expressions),
            }
        ],
    )
    if blockers:
        raise SystemExit(f"Structured data QC blocked by {len(blockers)} issue(s); see reports/structured_data_qc_report.md")
    print(f"Structured data QC passed with {len(warnings)} warning(s)")


if __name__ == "__main__":
    main()
