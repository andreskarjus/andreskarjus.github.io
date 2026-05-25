from __future__ import annotations

import json
from pathlib import Path

from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl
from prepare_llm_adjudication_batches import compact_record, load_evidence, write_prompt


def main() -> None:
    base = PROJECT_ROOT / "data" / "processed" / "structured" / "v2"
    out_dir = base / "llm_adjudication"
    evidence_by_id = load_evidence()
    processed = set()
    for path in out_dir.glob("batch_*.decisions.jsonl"):
        for row in read_jsonl(path):
            if row.get("source_id"):
                processed.add(row["source_id"])

    rows = []
    for rec in read_jsonl(base / "refined" / "learning_unit_candidates.refined.jsonl"):
        if rec.get("id") in processed:
            continue
        if rec.get("graph_ready_status") != "candidate":
            continue
        if not (rec.get("aligned_learning_outcomes") or "official_outcome_derived_requires_decomposition" in (rec.get("quality_flags") or [])):
            continue
        rows.append(compact_record(rec, evidence_by_id, "learning_unit_official_or_aligned_remainder"))

    batch_name = "batch_005_official_aligned_remainder"
    input_path = out_dir / f"{batch_name}.jsonl"
    output_path = out_dir / f"{batch_name}.decisions.jsonl"
    prompt_path = out_dir / f"{batch_name}.prompt.md"
    write_jsonl(input_path, rows)
    write_prompt(prompt_path, batch_name, str(input_path), str(output_path))

    manifest_path = out_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest = [row for row in manifest if row["batch"] != batch_name]
    manifest.append(
        {
            "batch": batch_name,
            "input_path": str(input_path),
            "prompt_path": str(prompt_path),
            "expected_output_path": str(output_path),
            "records": len(rows),
        }
    )
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"batch": batch_name, "records": len(rows), "input_path": str(input_path)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
