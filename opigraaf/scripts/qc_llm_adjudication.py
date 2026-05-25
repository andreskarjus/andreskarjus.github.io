from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT


REQUIRED = {
    "source_id",
    "decision",
    "public_type",
    "canonical_label_et",
    "definition_et",
    "grade_scope",
    "source_support",
    "merge_key_et",
    "same_as_candidates",
    "broader_than_candidates",
    "narrower_than_candidates",
    "reason",
    "evidence_ids",
}


VALID_DECISIONS = {
    "keep",
    "rewrite",
    "split",
    "demote_to_topic",
    "demote_to_source_note",
    "reject",
    "needs_human",
}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows = []
    with path.open("r", encoding="utf-8") as f:
        for lineno, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as exc:
                rows.append({"__parse_error__": str(exc), "__line__": lineno})
                continue
            row["__line__"] = lineno
            rows.append(row)
    return rows


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields: list[str] = []
    seen = set()
    for row in rows:
        for key in row:
            if key not in seen:
                seen.add(key)
                fields.append(key)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", default="data/processed/structured/v2/llm_adjudication")
    args = parser.parse_args()
    base = PROJECT_ROOT / args.dir
    manifest_path = base / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else []
    reports = PROJECT_ROOT / "reports"
    reports.mkdir(parents=True, exist_ok=True)

    all_errors: list[dict[str, Any]] = []
    batch_rows: list[dict[str, Any]] = []
    all_decisions = Counter()
    all_public_types = Counter()
    total_input = 0
    total_output = 0

    for batch in manifest:
        input_path = Path(batch["input_path"])
        output_path = Path(batch["expected_output_path"])
        input_rows = read_jsonl(input_path)
        output_rows = read_jsonl(output_path)
        total_input += len(input_rows)
        total_output += len(output_rows)
        input_ids = {row.get("id") for row in input_rows}
        output_source_ids = {row.get("source_id") for row in output_rows if row.get("source_id")}
        missing = sorted(str(item) for item in input_ids - output_source_ids if item)
        extra = sorted(str(item) for item in output_source_ids - input_ids if item)
        decision_counts = Counter(row.get("decision") for row in output_rows)
        public_type_counts = Counter(row.get("public_type") for row in output_rows if row.get("public_type"))
        all_decisions.update(decision_counts)
        all_public_types.update(public_type_counts)

        for row in output_rows:
            if row.get("__parse_error__"):
                all_errors.append({"batch": batch["batch"], "line": row.get("__line__"), "error": row["__parse_error__"]})
                continue
            missing_fields = sorted(REQUIRED - set(row))
            if missing_fields:
                all_errors.append({"batch": batch["batch"], "line": row.get("__line__"), "source_id": row.get("source_id"), "error": "missing_fields", "fields": missing_fields})
            if row.get("decision") not in VALID_DECISIONS:
                all_errors.append({"batch": batch["batch"], "line": row.get("__line__"), "source_id": row.get("source_id"), "error": "invalid_decision", "decision": row.get("decision")})
            if row.get("decision") in {"keep", "rewrite", "split", "demote_to_topic"} and not row.get("canonical_label_et"):
                all_errors.append({"batch": batch["batch"], "line": row.get("__line__"), "source_id": row.get("source_id"), "error": "missing_canonical_label"})

        batch_rows.append(
            {
                "batch": batch["batch"],
                "input_records": len(input_rows),
                "decision_rows": len(output_rows),
                "missing_source_ids": len(missing),
                "extra_source_ids": len(extra),
                "decision_counts": dict(decision_counts),
                "public_type_counts": dict(public_type_counts),
                "output_path": str(output_path),
            }
        )

    write_csv(reports / "llm_adjudication_batch_summary.csv", batch_rows)
    write_csv(reports / "llm_adjudication_validation_errors.csv", all_errors)
    lines = [
        "# LLM Adjudication QC",
        "",
        f"- Batches listed: {len(manifest)}",
        f"- Input records: {total_input:,}",
        f"- Decision rows written: {total_output:,}",
        f"- Validation errors: {len(all_errors):,}",
        "",
        "## Decisions",
        "",
    ]
    lines.extend(f"- {key}: {value:,}" for key, value in all_decisions.most_common())
    lines.extend(["", "## Public Types", ""])
    lines.extend(f"- {key}: {value:,}" for key, value in all_public_types.most_common())
    lines.extend(["", "## Batch Outputs", ""])
    for row in batch_rows:
        lines.append(f"- {row['batch']}: {row['decision_rows']:,}/{row['input_records']:,} decision rows, missing source ids {row['missing_source_ids']:,}")
    (reports / "llm_adjudication_qc.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"input_records": total_input, "decision_rows": total_output, "validation_errors": len(all_errors), "decisions": dict(all_decisions)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
