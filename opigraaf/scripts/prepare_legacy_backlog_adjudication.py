from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl


REPORTS = PROJECT_ROOT / "reports"
OUT = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "legacy_backlog"


def read_csv(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def write_prompt(path: Path, batch_name: str, input_path: str, output_path: str) -> None:
    prompt = f"""# Legacy Fuzzy Learning Node Backlog Adjudication: {batch_name}

Read every record in `{input_path}` and write JSONL decisions to `{output_path}`.

Goal: decide whether old fuzzy `Knowledge`/`Skill` rows from the previous graph should be mapped into the current curriculum-focus KG, added as missing canonical units, demoted, or rejected.

Use semantic judgment. Do not rely on keyword/string matching. Treat labels such as `kirjutab päevakajalisele tekstile kommentaari` as potentially valid even if the old audit failed to match them.

Use these files as needed:

- `graph/snapshots/v2_curriculum_focus/nodes.jsonl`
- `graph/snapshots/v2_curriculum_focus/edges.jsonl`
- `data/processed/structured/v2/canonicalization/canonical_candidates.nodes.jsonl`

For each input record, emit one JSON object with:

- `legacy_id`
- `decision`: `map_to_existing`, `add_new_canonical`, `merge_into_broader`, `demote_to_topic`, `demote_to_task`, `demote_to_criterion`, `reject_source_noise`
- `target_canonical_id`: existing id if mapped/merged, else null
- `new_public_type`: `KnowledgeUnit`, `SkillUnit`, `CompetenceUnit`, `Topic`, `TaskSubtype`, `AssessmentCriterion`, `CriterionDimension`, or null
- `new_label_et`: if adding or relabelling
- `definition_et`: concise teacher-readable definition
- `link_to_learning_outcome_ids`: likely official learning outcome ids, if obvious from current graph/source/label; otherwise []
- `relation_to_target`: `same_as`, `broader_than`, `narrower_than`, `related_to`, or null
- `confidence`: 0.0-1.0
- `reason`

Rules:

- Add missing valid curriculum skills/knowledge. Do not discard valid skills merely because they are absent from the current graph.
- Reject source noise, examples, page fragments, bibliography, and teacher instruction that is not a learner skill/knowledge/competence.
- If the item is valid but broader/narrower than an existing canonical unit, map it and specify the relation.
- Make the best decision yourself; no human escalation.
"""
    path.write_text(prompt, encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rows = read_csv(REPORTS / "legacy_learning_node_fate.csv")
    backlog = [
        row
        for row in rows
        if row.get("match_category") in {"no_obvious_match", "weak_possible_match"}
        and row.get("adjudication_fate") != "rejected_or_held_by_llm"
    ]
    # Put likely useful rows early: official/previous curriculum PDFs, not obvious web examples.
    def rank(row: dict[str, Any]) -> tuple[int, str]:
        label = (row.get("legacy_label") or "").lower()
        source = (row.get("source_url") or "").lower()
        score = 0
        if "oppekava" in source or "lisa-1" in source or "ainekava" in source:
            score -= 3
        if any(term in label for term in ["kirjutab", "loeb", "analüüsib", "kommenteerib", "põhjendab", "eristab", "kasutab", "tunneb", "teab"]):
            score -= 2
        if "kommentaar" in label or "kommenteer" in label:
            score -= 2
        if label.startswith("kommentaar ") or "page " in label:
            score += 4
        return score, label

    backlog.sort(key=rank)
    batch_size = 260
    manifest = []
    for i in range(0, len(backlog), batch_size):
        batch_no = i // batch_size + 1
        batch_name = f"legacy_backlog_batch_{batch_no:03d}"
        chunk = backlog[i : i + batch_size]
        input_path = OUT / f"{batch_name}.jsonl"
        output_path = OUT / f"{batch_name}.decisions.jsonl"
        prompt_path = OUT / f"{batch_name}.prompt.md"
        write_jsonl(input_path, chunk)
        write_prompt(prompt_path, batch_name, str(input_path), str(output_path))
        manifest.append(
            {
                "batch": batch_name,
                "input_path": str(input_path),
                "prompt_path": str(prompt_path),
                "expected_output_path": str(output_path),
                "records": len(chunk),
            }
        )
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"records": len(backlog), "batches": manifest}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
