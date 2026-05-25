from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl, sha1_text, write_jsonl


PUBLIC_DECISIONS = {"keep", "rewrite", "split", "demote_to_topic"}


def repair_mojibake(value: Any) -> Any:
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
            "Å ": "Š",
            "Å¾": "ž",
            "Å½": "Ž",
        }
        for bad, good in replacements.items():
            value = value.replace(bad, good)
        if any(marker in value for marker in ("Ã", "Å", "Â")):
            best = value
            best_bad = sum(value.count(marker) for marker in ("Ã", "Å", "Â"))
            for encoding in ("cp1252", "latin1"):
                try:
                    repaired = value.encode(encoding).decode("utf-8")
                except UnicodeError:
                    continue
                bad_after = sum(repaired.count(marker) for marker in ("Ã", "Å", "Â"))
                if bad_after < best_bad:
                    best = repaired
                    best_bad = bad_after
            return best
        return value
    if isinstance(value, list):
        return [repair_mojibake(item) for item in value]
    if isinstance(value, dict):
        return {key: repair_mojibake(item) for key, item in value.items()}
    return value


def load_manifest(base: Path) -> list[dict[str, Any]]:
    return json.loads((base / "manifest.json").read_text(encoding="utf-8"))


def decision_outputs(base: Path, manifest: list[dict[str, Any]]) -> list[tuple[dict[str, Any], list[dict[str, Any]], dict[str, dict[str, Any]]]]:
    outputs = []
    for batch in manifest:
        input_rows = read_jsonl(Path(batch["input_path"]))
        input_by_id = {row["id"]: row for row in input_rows if row.get("id")}
        decisions = read_jsonl(Path(batch["expected_output_path"]))
        outputs.append((batch, decisions, input_by_id))
    return outputs


def stable_decision_id(row: dict[str, Any], index: int) -> str:
    key = json.dumps(
        {
            "source_id": row.get("source_id"),
            "decision": row.get("decision"),
            "public_type": row.get("public_type"),
            "label": row.get("canonical_label_et"),
            "index": index,
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    return "adjudicated:" + sha1_text(key, 20)


def build_layer(base: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Counter]]:
    manifest = load_manifest(base)
    public_rows: list[dict[str, Any]] = []
    rejected_rows: list[dict[str, Any]] = []
    counters: dict[str, Counter] = {"decision": Counter(), "public_type": Counter(), "batch_decision": Counter()}

    for batch, decisions, input_by_id in decision_outputs(base, manifest):
        seen_source_counts: Counter[str] = Counter()
        for decision in decisions:
            decision = repair_mojibake(decision)
            source_id = decision.get("source_id")
            seen_source_counts[source_id] += 1
            source = repair_mojibake(input_by_id.get(source_id, {}))
            counters["decision"][decision.get("decision")] += 1
            if decision.get("public_type"):
                counters["public_type"][decision.get("public_type")] += 1
            counters["batch_decision"][(batch["batch"], decision.get("decision"))] += 1
            row = {
                "id": stable_decision_id(decision, seen_source_counts[source_id]),
                "source_id": source_id,
                "batch": batch["batch"],
                "decision": decision.get("decision"),
                "public_type": decision.get("public_type"),
                "canonical_label_et": decision.get("canonical_label_et"),
                "definition_et": decision.get("definition_et"),
                "grade_scope": decision.get("grade_scope") or [],
                "source_support": decision.get("source_support"),
                "merge_key_et": decision.get("merge_key_et"),
                "same_as_candidates": decision.get("same_as_candidates") or [],
                "broader_than_candidates": decision.get("broader_than_candidates") or [],
                "narrower_than_candidates": decision.get("narrower_than_candidates") or [],
                "reason": decision.get("reason"),
                "evidence_ids": decision.get("evidence_ids") or [],
                "source_candidate": {
                    "candidate_class": source.get("candidate_class"),
                    "source_kind": source.get("source_kind"),
                    "label_et": source.get("label_et"),
                    "description_et": source.get("description_et"),
                    "subject": source.get("subject"),
                    "grades": source.get("grades"),
                    "school_stages": source.get("school_stages"),
                    "source_authority": source.get("source_authority"),
                    "source_system": source.get("source_system"),
                    "source_url": source.get("source_url"),
                    "source_file": source.get("source_file"),
                    "aligned_learning_outcomes": source.get("aligned_learning_outcomes"),
                    "aligned_task_subtype": source.get("aligned_task_subtype"),
                    "aligned_competence_id": source.get("aligned_competence_id"),
                    "evidence_context": source.get("evidence_context"),
                },
                "review_status": "llm_adjudicated",
                "adjudication_version": "llm_adjudication_v1_2026-05-21",
            }
            if decision.get("decision") in PUBLIC_DECISIONS and decision.get("public_type") != "SourceNote":
                public_rows.append(row)
            else:
                rejected_rows.append(row)

    return public_rows, rejected_rows, counters


def write_report(public_rows: list[dict[str, Any]], rejected_rows: list[dict[str, Any]], counters: dict[str, Counter], report_path: Path) -> None:
    by_batch_public = Counter(row["batch"] for row in public_rows)
    by_batch_rejected = Counter(row["batch"] for row in rejected_rows)
    lines = [
        "# Adjudicated Candidate Layer",
        "",
        f"- Public/admissible rows: {len(public_rows):,}",
        f"- Rejected/held rows: {len(rejected_rows):,}",
        "",
        "## Decisions",
        "",
    ]
    lines.extend(f"- {key}: {value:,}" for key, value in counters["decision"].most_common())
    lines.extend(["", "## Public Types", ""])
    lines.extend(f"- {key}: {value:,}" for key, value in counters["public_type"].most_common())
    lines.extend(["", "## Public Rows By Batch", ""])
    lines.extend(f"- {key}: {value:,}" for key, value in by_batch_public.most_common())
    lines.extend(["", "## Rejected/Held Rows By Batch", ""])
    lines.extend(f"- {key}: {value:,}" for key, value in by_batch_rejected.most_common())
    lines.extend(
        [
            "",
            "## Interpretation",
            "",
            "This layer is LLM-adjudicated from evidence-bearing candidate batches. It is suitable as the first semantic input for canonical graph iteration. It is still sampled: only the prepared 720-record adjudication set is covered, so remaining refined candidates should be batched before declaring comprehensive coverage.",
        ]
    )
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", default="data/processed/structured/v2/llm_adjudication")
    args = parser.parse_args()
    base = PROJECT_ROOT / args.dir
    public_rows, rejected_rows, counters = build_layer(base)
    write_jsonl(base / "adjudicated_candidates.public.jsonl", public_rows)
    write_jsonl(base / "adjudicated_candidates.rejected_or_held.jsonl", rejected_rows)
    reports = PROJECT_ROOT / "reports"
    reports.mkdir(parents=True, exist_ok=True)
    write_report(public_rows, rejected_rows, counters, reports / "adjudicated_candidate_layer_report.md")
    print(json.dumps({"public_rows": len(public_rows), "rejected_or_held_rows": len(rejected_rows), "decisions": dict(counters["decision"])}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
