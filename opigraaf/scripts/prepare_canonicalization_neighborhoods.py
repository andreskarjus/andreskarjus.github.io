from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import sha1_text, write_jsonl


BASE = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "canonicalization"
INPUT = PROJECT_ROOT / "data" / "processed" / "structured" / "v2" / "llm_adjudication" / "adjudicated_candidates.public.jsonl"


STOPWORDS = {
    "ja",
    "ning",
    "või",
    "ehk",
    "ka",
    "kui",
    "et",
    "oma",
    "nii",
    "eri",
    "põhjal",
    "tekst",
    "teksti",
    "kasutab",
    "tunneb",
    "oskab",
}


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def norm(text: str | None) -> str:
    text = (text or "").lower()
    text = re.sub(r"\([^)]*estcore[^)]*\)", "", text, flags=re.I)
    text = re.sub(r"[^a-zõäöüšž0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokens(text: str | None) -> set[str]:
    return {tok for tok in norm(text).split() if len(tok) > 2 and tok not in STOPWORDS}


class DSU:
    def __init__(self, items: list[str]) -> None:
        self.parent = {item: item for item in items}

    def find(self, item: str) -> str:
        while self.parent[item] != item:
            self.parent[item] = self.parent[self.parent[item]]
            item = self.parent[item]
        return item

    def union(self, a: str, b: str) -> None:
        ra, rb = self.find(a), self.find(b)
        if ra != rb:
            self.parent[rb] = ra


def prepare_records(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = []
    for row in rows:
        source = row.get("source_candidate") or {}
        label = row.get("canonical_label_et") or ""
        merge_key = row.get("merge_key_et") or label
        out.append(
            {
                "id": row["id"],
                "source_id": row.get("source_id"),
                "public_type": row.get("public_type"),
                "label_et": label,
                "definition_et": row.get("definition_et"),
                "merge_key_et": merge_key,
                "grade_scope": row.get("grade_scope") or source.get("grades") or source.get("school_stages") or [],
                "subject": source.get("subject"),
                "source_support": row.get("source_support"),
                "source_authority": source.get("source_authority"),
                "source_url": source.get("source_url"),
                "aligned_learning_outcomes": source.get("aligned_learning_outcomes") or [],
                "aligned_task_subtype": source.get("aligned_task_subtype"),
                "same_as_candidates": row.get("same_as_candidates") or [],
                "broader_than_candidates": row.get("broader_than_candidates") or [],
                "narrower_than_candidates": row.get("narrower_than_candidates") or [],
                "evidence_ids": row.get("evidence_ids") or [],
                "evidence_context": source.get("evidence_context") or [],
                "_norm": norm(merge_key),
                "_tokens": sorted(tokens(merge_key + " " + label)),
            }
        )
    return out


def build_components(records: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    by_id = {row["id"]: row for row in records}
    by_source_id = {row["source_id"]: row["id"] for row in records if row.get("source_id")}
    dsu = DSU([row["id"] for row in records])

    exact = defaultdict(list)
    for row in records:
        exact[(row["public_type"], row["_norm"])].append(row["id"])
    for ids in exact.values():
        for other in ids[1:]:
            dsu.union(ids[0], other)

    for row in records:
        for rel_field in ("same_as_candidates", "broader_than_candidates", "narrower_than_candidates"):
            for candidate_id in row.get(rel_field) or []:
                other = by_source_id.get(candidate_id) or candidate_id
                if other in by_id and by_id[other]["public_type"] == row["public_type"]:
                    dsu.union(row["id"], other)

    by_type = defaultdict(list)
    for row in records:
        by_type[row["public_type"]].append(row)
    for row_type, group in by_type.items():
        for i, a in enumerate(group):
            toks_a = set(a["_tokens"])
            if not toks_a:
                continue
            for b in group[i + 1 :]:
                toks_b = set(b["_tokens"])
                if not toks_b:
                    continue
                jaccard = len(toks_a & toks_b) / len(toks_a | toks_b)
                if jaccard >= 0.58 and len(toks_a & toks_b) >= 2:
                    dsu.union(a["id"], b["id"])

    components = defaultdict(list)
    for row in records:
        components[dsu.find(row["id"])].append(row)
    result = []
    for group in components.values():
        group.sort(key=lambda item: (item.get("public_type") or "", item.get("label_et") or ""))
        result.append(group)
    result.sort(key=lambda group: (-len(group), group[0].get("public_type") or "", group[0].get("label_et") or ""))
    return result


def neighborhood_id(group: list[dict[str, Any]]) -> str:
    key = "|".join(sorted(row["id"] for row in group))
    return "neighborhood:" + sha1_text(key, 16)


def write_prompt(path: Path, batch_name: str, input_file: str, output_file: str) -> None:
    prompt = f"""# Canonicalization Adjudication: {batch_name}

Read `{input_file}` and write JSONL decisions to `{output_file}`.

Each input row is a candidate neighborhood of already LLM-adjudicated items. Use semantic judgment to decide canonical units and relations. Do not rely on labels alone; use definitions, evidence ids, source authority, grade scope, aligned outcomes, and source snippets when present.

For each neighborhood, emit one JSON object:

- `neighborhood_id`
- `decision`: `canonicalized`, `keep_separate`, or `needs_rebatch`
- `canonical_nodes`: array of objects:
  - `canonical_id`: stable id you choose, e.g. `canonical:skill:<short_slug>`
  - `public_type`
  - `label_et`
  - `definition_et`
  - `grade_scope`
  - `member_ids`: adjudicated ids included in this canonical node
  - `source_support`: `strong`, `medium`, or `weak`
  - `reason`
- `relations`: array of objects:
  - `source_canonical_id`
  - `target_canonical_id`
  - `type`: `same_as`, `broader_than`, `narrower_than`, `related_to`, or `supports_progression_to`
  - `reason`
- `rejected_member_ids`: adjudicated ids that should be dropped after seeing the neighborhood
- `notes`

Rules:

- Merge only true semantic equivalents. Similar grade-level variants may remain separate and use `supports_progression_to`.
- If one unit is broad and another is a narrower subskill/knowledge point, keep both and add broader/narrower relation.
- Keep level differences when they matter for assessment or exercise generation.
- Prefer action + object labels for skills, concise noun-phrase labels for knowledge, criterion/rubric labels for assessment.
- No human escalation; make the best decision from available evidence.
"""
    path.write_text(prompt, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch-size", type=int, default=30)
    args = parser.parse_args()

    records = prepare_records(read_jsonl(INPUT))
    components = build_components(records)
    BASE.mkdir(parents=True, exist_ok=True)

    neighborhoods = []
    singleton_count = 0
    for group in components:
        n = {
            "neighborhood_id": neighborhood_id(group),
            "public_type": group[0].get("public_type"),
            "size": len(group),
            "candidate_records": [{k: v for k, v in row.items() if not k.startswith("_")} for row in group],
        }
        neighborhoods.append(n)
        if len(group) == 1:
            singleton_count += 1

    write_jsonl(BASE / "canonicalization_neighborhoods.all.jsonl", neighborhoods)

    complex_neighborhoods = [row for row in neighborhoods if row["size"] > 1]
    batches = []
    for i in range(0, len(complex_neighborhoods), args.batch_size):
        batch_no = i // args.batch_size + 1
        batch_name = f"canonicalization_batch_{batch_no:03d}"
        rows = complex_neighborhoods[i : i + args.batch_size]
        input_path = BASE / f"{batch_name}.jsonl"
        output_path = BASE / f"{batch_name}.decisions.jsonl"
        prompt_path = BASE / f"{batch_name}.prompt.md"
        write_jsonl(input_path, rows)
        write_prompt(prompt_path, batch_name, str(input_path), str(output_path))
        batches.append(
            {
                "batch": batch_name,
                "input_path": str(input_path),
                "prompt_path": str(prompt_path),
                "expected_output_path": str(output_path),
                "neighborhoods": len(rows),
                "candidate_records": sum(row["size"] for row in rows),
            }
        )

    manifest = {
        "input_records": len(records),
        "neighborhoods": len(neighborhoods),
        "complex_neighborhoods": len(complex_neighborhoods),
        "singleton_neighborhoods": singleton_count,
        "records_by_public_type": dict(Counter(row["public_type"] for row in records)),
        "batches": batches,
    }
    (BASE / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
