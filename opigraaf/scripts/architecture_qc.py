from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

from common import ROOT, load_yaml, read_jsonl, write_jsonl


def flatten_edge_types(schema: dict[str, Any]) -> set[str]:
    out: set[str] = set()
    for values in schema.get("edge_types", {}).values():
        out.update(values or [])
    return out


def all_node_types(schema: dict[str, Any]) -> set[str]:
    out: set[str] = set()
    for values in schema.get("node_types", {}).values():
        out.update(values or [])
    return out


def check_schema(schema: dict[str, Any], mappings: dict[str, Any]) -> tuple[list[str], list[str]]:
    blockers: list[str] = []
    warnings: list[str] = []
    node_types = all_node_types(schema) - set(schema.get("node_types", {}).get("legacy_v1", []))
    edge_types = flatten_edge_types(schema)
    node_mappings = mappings.get("node_type_mappings", {})
    edge_mappings = mappings.get("edge_type_mappings", {})

    for node_type in sorted(node_types):
        if node_type not in node_mappings:
            blockers.append(f"Missing node type mapping: {node_type}")
    for edge_type in sorted(edge_types):
        if edge_type not in edge_mappings:
            warnings.append(f"Missing edge type mapping: {edge_type}")

    for idx, row in enumerate(schema.get("allowed_edges", []), start=1):
        for key in ("source_type", "edge_type", "target_type"):
            if key not in row:
                blockers.append(f"allowed_edges row {idx} missing {key}")
        if row.get("source_type") not in node_types:
            blockers.append(f"allowed_edges row {idx} has unknown source_type {row.get('source_type')}")
        if row.get("target_type") not in node_types:
            blockers.append(f"allowed_edges row {idx} has unknown target_type {row.get('target_type')}")
        if row.get("edge_type") not in edge_types:
            blockers.append(f"allowed_edges row {idx} has unknown edge_type {row.get('edge_type')}")

    for required in ("node_required_fields", "edge_required_fields", "assertion_fields"):
        if not schema.get(required):
            blockers.append(f"Missing schema section: {required}")
    return blockers, warnings


def iter_taxonomy_ids(assessment: dict[str, Any]) -> list[str]:
    ids: list[str] = []
    for task_type in assessment.get("task_types", []):
        ids.append(task_type.get("id", ""))
        for subtype in task_type.get("subtypes", []):
            ids.append(subtype.get("id", ""))
    for criterion in assessment.get("criterion_dimensions", []):
        ids.append(criterion.get("id", ""))
        for sub in criterion.get("subdimensions", []):
            ids.append(sub.get("id", ""))
    for profile in assessment.get("level_expectation_dimensions", {}).get("benchmark_profiles", []):
        ids.append(profile.get("id", ""))
    return ids


def check_assessment_taxonomy(assessment: dict[str, Any]) -> tuple[list[str], list[str]]:
    blockers: list[str] = []
    warnings: list[str] = []
    ids = [item for item in iter_taxonomy_ids(assessment) if item]
    counts = Counter(ids)
    for item, count in counts.items():
        if count > 1:
            blockers.append(f"Duplicate taxonomy id: {item}")
    for item in ids:
        if re.search(r"\s", item):
            blockers.append(f"Taxonomy id contains whitespace: {item}")
        if ":" not in item:
            warnings.append(f"Taxonomy id has no namespace prefix: {item}")
    subtypes = {item for item in ids if item.startswith("task_subtype:")}
    for criterion in assessment.get("criterion_dimensions", []):
        for applies_to in criterion.get("applies_to", []):
            if applies_to not in subtypes:
                blockers.append(f"Criterion {criterion.get('id')} applies_to unknown task subtype {applies_to}")
    profiles = assessment.get("level_expectation_dimensions", {}).get("benchmark_profiles", [])
    expected = {"level:5_klass", "level:9_klass", "level:12_klass"}
    present = {profile.get("id") for profile in profiles}
    missing = expected - present
    if missing:
        blockers.append(f"Missing benchmark level profiles: {', '.join(sorted(missing))}")
    if len(assessment.get("criterion_dimensions", [])) < 6:
        warnings.append("Criterion taxonomy has fewer than six top-level dimensions.")
    return blockers, warnings


def check_general_competence_taxonomy(taxonomy: dict[str, Any]) -> tuple[list[str], list[str]]:
    blockers: list[str] = []
    warnings: list[str] = []
    general = taxonomy.get("general_competences", [])
    themes = taxonomy.get("transversal_themes", [])
    domains = taxonomy.get("domain_competences", [])
    stages = taxonomy.get("stage_competence_expectations", [])
    if len(general) < 8:
        blockers.append("General competence taxonomy has fewer than eight general competences.")
    if len(themes) < 8:
        blockers.append("Transversal theme taxonomy has fewer than eight transversal themes.")
    if not domains:
        blockers.append("General competence taxonomy has no domain competence rows.")
    if len(stages) < 3:
        warnings.append("Stage competence expectations have fewer than three PRÕK school stages.")
    ids = [row.get("id", "") for row in general + themes + domains + stages]
    counts = Counter(item for item in ids if item)
    for item, count in counts.items():
        if count > 1:
            blockers.append(f"Duplicate competence taxonomy id: {item}")
    for item in ids:
        if item and ":" not in item:
            warnings.append(f"Competence taxonomy id has no namespace prefix: {item}")
    sources = taxonomy.get("official_sources", {})
    for required in ("pohikool_current", "gymnaasium_current"):
        if not sources.get(required, {}).get("source_url"):
            blockers.append(f"Missing official source URL for {required}.")
    return blockers, warnings


def check_clean_corpus() -> tuple[list[str], list[str], dict[str, Any]]:
    blockers: list[str] = []
    warnings: list[str] = []
    out: dict[str, Any] = {}
    clean_path = ROOT / "data/processed/corpus_clean/chunks.jsonl"
    rejected_path = ROOT / "data/processed/corpus_clean/rejected_chunks.jsonl"
    official_path = ROOT / "data/processed/corpus_clean/official_records.jsonl"
    if not clean_path.exists():
        blockers.append("Clean corpus missing; run scripts/prepare_clean_corpus.py")
        return blockers, warnings, out
    chunks = read_jsonl(clean_path)
    rejected = read_jsonl(rejected_path)
    official = read_jsonl(official_path)
    out["clean_chunks"] = len(chunks)
    out["rejected_chunks"] = len(rejected)
    out["official_records"] = len(official)
    out["chunk_roles"] = dict(Counter(row.get("chunk_role") for row in chunks))
    out["source_authority"] = dict(Counter(row.get("source_authority") for row in chunks))
    official_fallback = sum(1 for row in official if row.get("used_pilot_fallback"))
    out["official_records_using_pilot_fallback"] = official_fallback
    if not chunks:
        blockers.append("Clean corpus has zero chunks.")
    if not official:
        blockers.append("Clean official record snapshot has zero rows.")
    if official_fallback:
        warnings.append(f"{official_fallback} official records come from pilot fallback; rerun full oppekava harvest before final production graph.")
    if "criterion_evidence" not in out["chunk_roles"]:
        warnings.append("No criterion_evidence chunks detected.")
    if "task_evidence" not in out["chunk_roles"]:
        warnings.append("No task_evidence chunks detected.")
    return blockers, warnings, out


def write_report(blockers: list[str], warnings: list[str], clean_stats: dict[str, Any]) -> None:
    ready = not blockers
    official_fallback = clean_stats.get("official_records_using_pilot_fallback", 0)
    status = "ready_for_clean_sheet_graph_build"
    if blockers:
        status = "blocked"
    elif official_fallback:
        status = "architecture_ready_official_harvest_recommended_first"
    lines = [
        "# Architecture Readiness Report",
        "",
        f"- Status: `{status}`",
        f"- Architecture blockers: {len(blockers)}",
        f"- Warnings: {len(warnings)}",
        f"- Clean chunks: {clean_stats.get('clean_chunks', 0)}",
        f"- Rejected chunks: {clean_stats.get('rejected_chunks', 0)}",
        f"- Official records: {clean_stats.get('official_records', 0)}",
        f"- Official records using pilot fallback: {official_fallback}",
        "",
        "## Blockers",
    ]
    if blockers:
        lines.extend(f"- {item}" for item in blockers)
    else:
        lines.append("- None.")
    lines.append("")
    lines.append("## Warnings")
    if warnings:
        lines.extend(f"- {item}" for item in warnings)
    else:
        lines.append("- None.")
    lines.extend(
        [
            "",
            "## Clean Corpus Roles",
        ]
    )
    for key, count in sorted(clean_stats.get("chunk_roles", {}).items()):
        lines.append(f"- `{key}`: {count}")
    lines.extend(
        [
            "",
            "## Recommendation",
            "",
        ]
    )
    if ready and official_fallback:
        lines.append("The v2 architecture is ready. Start production graph building by rerunning the official oppekava harvest with safeguards, then build the official backbone before extracting new units.")
    elif ready:
        lines.append("The v2 architecture is ready for clean-sheet graph building.")
    else:
        lines.append("Fix blockers before starting production graph building.")
    (ROOT / "reports/architecture_readiness_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    write_jsonl(
        ROOT / "reports/architecture_readiness.jsonl",
        [
            {
                "status": status,
                "blockers": blockers,
                "warnings": warnings,
                "clean_stats": clean_stats,
            }
        ],
    )


def main() -> None:
    schema = load_yaml("config/graph_schema.yaml")
    mappings = load_yaml("config/schema_mappings.yaml")
    assessment = load_yaml("config/assessment_taxonomy_eesti_keel_kirjandus.yaml")
    general_competence = load_yaml("config/general_competence_taxonomy.yaml")
    blockers: list[str] = []
    warnings: list[str] = []
    schema_blockers, schema_warnings = check_schema(schema, mappings)
    assessment_blockers, assessment_warnings = check_assessment_taxonomy(assessment)
    competence_blockers, competence_warnings = check_general_competence_taxonomy(general_competence)
    corpus_blockers, corpus_warnings, clean_stats = check_clean_corpus()
    blockers.extend(schema_blockers)
    blockers.extend(assessment_blockers)
    blockers.extend(competence_blockers)
    blockers.extend(corpus_blockers)
    warnings.extend(schema_warnings)
    warnings.extend(assessment_warnings)
    warnings.extend(competence_warnings)
    warnings.extend(corpus_warnings)
    write_report(blockers, warnings, clean_stats)
    if blockers:
        raise SystemExit(f"Architecture QC blocked by {len(blockers)} issue(s); see reports/architecture_readiness_report.md")
    print(f"Architecture QC passed with {len(warnings)} warning(s)")


if __name__ == "__main__":
    main()
