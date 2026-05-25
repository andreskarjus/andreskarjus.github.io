from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

from common import ROOT, clean_label, read_jsonl, sha1_text, write_csv, write_jsonl

STRUCT_DIR = ROOT / "data/processed/structured/v2"
OUT_DIR = STRUCT_DIR / "refined"
REFINER_VERSION = "structured_refinement_v1_2026-05-20"

NAV_LABEL_RE = re.compile(
    r"([>]{1,}|ALUSTA SIIT|LÜHIDALT EKSAMIST|Powered by|Get Started|"
    r"^\s*(NUTIKALT EKSAMILE|LUGEMISÜLESANNE|KIRJUTAMISÜLESANNE)\b)",
    re.I,
)
NAV_CONTEXT_RE = re.compile(r"ALUSTA SIIT.*LUGEMISÜLESANNE.*KIRJUTAMISÜLESANNE", re.I)
TEACHER_CONTEXT_RE = re.compile(r"\b(Metoodika|Õpetaja|õpetaja:|soovitused õpetajale)\b", re.I)
TEACHER_ACTION_RE = re.compile(
    r"\b(arutleb koos õpilastega|leiab sobiva teksti|salvestab|annab ülesande|selgitab|tutvustab|suunab|jagab soovitusi)\b",
    re.I,
)
MOJIBAKE_RE = re.compile(r"(Ã.|â€|�)")
INTERNAL_GUIDANCE_RE = re.compile(r"(agents guidance\.txt|õppekavade õpitulemitest|pilot agent results)", re.I)

TASK_OPERATION_PATTERNS: list[tuple[str, str, str]] = [
    ("analüüsib", r"\b(analüüsi|analüüsib|analüüsida|analüüsimine|analüüs)\b", "analüüsib"),
    ("võrdleb", r"\b(võrdle|võrdleb|võrrelda|võrdlemine|võrdlus)\b", "võrdleb"),
    ("põhjendab", r"\b(põhjenda|põhjendab|põhjendada|põhjendamine|tõesta|tõestab|tõestada)\b", "põhjendab"),
    ("esitab", r"\b(esita|esitab|esitada|esitamine)\b", "esitab"),
    ("leiab", r"\b(leia|leiab|leida|leidmine|nimeta|nimetab|nimetada)\b", "leiab"),
    ("selgitab", r"\b(selgita|selgitab|selgitada|selgitamine)\b", "selgitab"),
    ("iseloomustab", r"\b(iseloomusta|iseloomustab|iseloomustada|iseloomustamine)\b", "iseloomustab"),
    ("kirjutab", r"\b(kirjuta|kirjutab|kirjutada|kirjutamine|koosta|koostab|koostada)\b", "kirjutab"),
    ("refereerib", r"\b(refereeri|refereerib|refereerida|refereerimine)\b", "refereerib"),
    ("tsiteerib", r"\b(tsiteeri|tsiteerib|tsiteerida|tsiteerimine)\b", "tsiteerib"),
    ("toimetab", r"\b(toimeta|toimetab|toimetada|toimetamine|paranda|parandab|parandada)\b", "toimetab"),
]

GENRE_LABELS = {
    "Uudis",
    "Arvamuslugu",
    "Intervjuu",
    "Reklaam",
    "Reportaaž",
    "Veebikommentaar",
    "Arvustus",
    "Arutlev kirjand",
    "Essee",
    "Kokkuvõte",
    "Avaldus",
    "Seletuskiri",
    "Taotlus",
}


def stable(prefix: str, *parts: Any) -> str:
    return f"{prefix}:{sha1_text('|'.join('' if p is None else str(p) for p in parts), 20)}"


def norm(text: str | None) -> str:
    text = clean_label(text).lower()
    text = re.sub(r"[^a-zA-ZõäöüšžÕÄÖÜŠŽ0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def find_operations(text: str) -> list[str]:
    found = []
    for op, pattern, _ in TASK_OPERATION_PATTERNS:
        if re.search(pattern, text, re.I):
            found.append(op)
    return found


def operation_from_label(label: str) -> str | None:
    label_norm = norm(label)
    mapping = {
        "esita": "esitab",
        "leia": "leiab",
        "võrdle": "võrdleb",
        "vordle": "võrdleb",
        "analüüsi": "analüüsib",
        "analuusi": "analüüsib",
        "põhjenda": "põhjendab",
        "pohjenda": "põhjendab",
        "selgita": "selgitab",
        "kirjuta": "kirjutab",
    }
    return mapping.get(label_norm)


def infer_task_context(text: str, source_url: str | None = None) -> str | None:
    low = text.lower()
    url = (source_url or "").lower()
    if "lugemisüles" in low or "lugemisüles" in url or "tekstimõist" in low:
        return "lugemisülesanne"
    if "kirjutamisüles" in low or "kirjand" in low or "sisu kavandamine" in low:
        return "kirjutamisülesanne"
    if "veebisuhtlus" in low or "kommentaari" in low or "kommenteer" in low:
        return "veebisuhtlus"
    if "tarbetekst" in low or "avaldus" in low or "seletuskiri" in low or "cv" in low:
        return "tarbetekst"
    if "õigekeel" in low or "ortograafia" in low or "kirjavahem" in low:
        return "õigekeel"
    if "väitlus" in low:
        return "väitlus"
    return None


def infer_stage(row: dict[str, Any]) -> tuple[list[str], list[str]]:
    grades = list(row.get("grades") or [])
    stages = list(row.get("school_stages") or [])
    text = " ".join(str(row.get(k) or "") for k in ("source_url", "source_file", "context_snippet", "label_et"))
    if re.search(r"\b9\.\s*klass|IX[_\s.-]*klass|III[-_\s]*kooliaste", text, re.I):
        if "9. klass" not in grades:
            grades.append("9. klass")
        if "III kooliaste" not in stages:
            stages.append("III kooliaste")
    if re.search(r"\bgümnaas|riigieksam|12\.\s*klass", text, re.I):
        if "Gümnaasium" not in stages:
            stages.append("Gümnaasium")
    return grades, stages


def object_from_context(operation: str | None, label: str, text: str) -> str | None:
    if not operation:
        return None
    low = text.lower()
    if operation == "esitab":
        match = re.search(r"esita\s+([^.;)]{8,90})", text, re.I)
        if match:
            return clean_label(match.group(1))
        if "väiteid" in low:
            return "väiteid või tekstipõhiseid vastuseid"
    if operation == "analüüsib":
        if re.search(r"vormi,\s*žanri\s+ja\s+keelekasutuse", text, re.I):
            return "teksti vormi, žanri ja keelekasutust"
        if "väärtushinnanguid" in low:
            return "väärtushinnanguid ja tekstinäiteid"
        if "pealkirja" in low:
            return "teksti ja pealkirja seoseid"
    if operation == "võrdleb":
        if "sarnas" in low or "erinevus" in low:
            return "tekstide sarnasusi ja erinevusi"
        if "väärtushinnanguid" in low:
            return "väärtushinnanguid"
    if operation == "põhjendab":
        if "seisuko" in low:
            return "oma seisukohta tekstinäidetega"
        if "väite" in low:
            return "väiteid tekstinäidetega"
    if operation == "kirjutab":
        if "kommentaar" in low:
            return "päevakajalisele tekstile kommentaari"
        if "kirjand" in low:
            return "arutlevat kirjandit"
    if operation == "leiab":
        if "info" in low:
            return "tekstist vajalikku infot"
        if "näite" in low:
            return "tekstinäiteid"
    if operation == "iseloomustab":
        return "tegelast, suhtumist või kujundlikku keelekasutust teksti põhjal"
    return label if len(label.split()) > 1 else None


def classify_label_quality(label: str, context: str) -> list[str]:
    flags: list[str] = []
    if NAV_LABEL_RE.search(label) or (NAV_CONTEXT_RE.search(context) and NAV_LABEL_RE.search(label)):
        flags.append("navigation_or_heading_residue")
    if len(label) > 140:
        flags.append("overlong_label")
    if len(norm(label).split()) == 1:
        flags.append("thin_one_word_label")
    if TEACHER_CONTEXT_RE.search(context) and TEACHER_ACTION_RE.search(label):
        flags.append("teacher_action_not_learner_unit")
    if re.search(r"\b(õpetaja|õpilastega|õpilased)\b", label, re.I) and TEACHER_CONTEXT_RE.search(context):
        flags.append("teacher_method_prose")
    if MOJIBAKE_RE.search(label) or MOJIBAKE_RE.search(context):
        flags.append("mojibake")
    return flags


def source_flags(row: dict[str, Any]) -> list[str]:
    haystack = " ".join(str(row.get(k) or "") for k in ("source_url", "source_file", "source_system"))
    flags = []
    if INTERNAL_GUIDANCE_RE.search(haystack):
        flags.append("internal_guidance_source")
    return flags


def readiness_fields(row: dict[str, Any], quality_flags: list[str], graph_ready_status: str) -> dict[str, Any]:
    has_level = bool(row.get("grades") or row.get("school_stages"))
    generation_ready = graph_ready_status in {"candidate", "candidate_refined"} and has_level
    comparison_ready = (
        generation_ready
        and row.get("source_authority") in {"legal", "official_curriculum", "exam_rubric", "teacher_guidance", "public_material"}
        and not any(flag in quality_flags for flag in {"weak_keyword_match", "internal_guidance_source", "mojibake", "navigation_or_heading_residue"})
    )
    return {
        "generation_ready": generation_ready,
        "comparison_ready": comparison_ready,
        "grade_stage_ready": has_level,
    }


def refine_learning_units(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    refined = []
    for row in rows:
        out = dict(row)
        label = row.get("label_et") or ""
        ctx = row.get("context_snippet") or ""
        flags = classify_label_quality(label, ctx) + source_flags(row)
        grades, stages = infer_stage(row)
        row_for_ready = dict(row)
        row_for_ready["grades"] = grades
        row_for_ready["school_stages"] = stages
        status = row.get("status")
        graph_ready = "candidate"
        if "internal_guidance_source" in flags:
            graph_ready = "quarantine"
            status = "quarantined_by_refiner"
        elif "navigation_or_heading_residue" in flags:
            graph_ready = "reject"
            status = "rejected_by_refiner"
        elif any(f in flags for f in ("teacher_action_not_learner_unit", "teacher_method_prose", "thin_one_word_label", "overlong_label", "mojibake")):
            graph_ready = "needs_review"
            status = "needs_review"
        elif row.get("candidate_class") == "SkillUnit" and not row.get("action"):
            graph_ready = "needs_review"
        out.update(
            {
                "refiner_version": REFINER_VERSION,
                "quality_flags": sorted(set((row.get("review_reasons") or []) + flags)),
                "graph_ready_status": graph_ready,
                "status": status,
                "refined_label_et": label,
                "grades": grades,
                "school_stages": stages,
                **readiness_fields(row_for_ready, flags, graph_ready),
            }
        )
        refined.append(out)
    return refined


def refine_task_signals(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    refined = []
    for row in rows:
        out = dict(row)
        label = row.get("task_subtype_label") or ""
        ctx = row.get("context_snippet") or ""
        operations = find_operations(ctx)
        label_operation = operation_from_label(label)
        primary_operation = label_operation or (operations[0] if operations else None)
        task_context = infer_task_context(ctx, row.get("source_url"))
        task_object = object_from_context(primary_operation, label, ctx)
        genre = label if label in GENRE_LABELS else None
        flags = classify_label_quality(label, ctx) + source_flags(row)
        evidence_role = "assigned_task"
        graph_ready = "candidate"
        if "internal_guidance_source" in flags:
            evidence_role = "internal_guidance"
            graph_ready = "quarantine"
        elif label_operation:
            flags.append("imperative_as_label")
            evidence_role = "operation_example"
            if primary_operation and task_object:
                graph_ready = "candidate_refined"
            else:
                graph_ready = "needs_review"
        elif genre and primary_operation and task_context == "lugemisülesanne":
            evidence_role = "genre_or_text_type_context"
            graph_ready = "needs_review"
        elif genre and not primary_operation:
            evidence_role = "task_family_mention"
            graph_ready = "needs_review"
        elif genre and primary_operation and not task_object:
            evidence_role = "genre_or_text_type_context"
            graph_ready = "needs_review"
        if "navigation_or_heading_residue" in flags:
            graph_ready = "reject"
            evidence_role = "navigation_only"
        if "mojibake" in flags and graph_ready not in {"reject", "quarantine"}:
            graph_ready = "needs_review"
        if primary_operation and task_object:
            refined_label = f"{primary_operation} {task_object}"
            if genre and genre.lower() not in norm(task_object):
                refined_label += f" ({genre.lower()})"
        elif task_context and genre:
            refined_label = f"{task_context}: {genre.lower()}"
        else:
            refined_label = label
        grades, stages = infer_stage(row)
        row_for_ready = dict(row)
        row_for_ready["grades"] = grades
        row_for_ready["school_stages"] = stages
        out.update(
            {
                "refiner_version": REFINER_VERSION,
                "operations": operations,
                "primary_operation": primary_operation,
                "task_object": task_object,
                "task_context": task_context,
                "genre": genre,
                "evidence_role": evidence_role,
                "refined_label_et": refined_label,
                "quality_flags": sorted(set(flags)),
                "graph_ready_status": graph_ready,
                "grades": grades,
                "school_stages": stages,
                **readiness_fields(row_for_ready, flags, graph_ready),
            }
        )
        refined.append(out)
    return refined


def refine_competence_expressions(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    refined = []
    for row in rows:
        out = dict(row)
        ctx = row.get("context_snippet") or ""
        flags = classify_label_quality(row.get("label_et") or "", ctx) + source_flags(row)
        match_type = row.get("match_type")
        graph_ready = "candidate" if match_type == "explicit_label_or_alias" else "needs_review"
        if match_type == "anchored_keyword":
            flags.append("weak_keyword_match")
        if "internal_guidance_source" in flags:
            graph_ready = "quarantine"
        elif "navigation_or_heading_residue" in flags and match_type != "explicit_label_or_alias":
            graph_ready = "reject"
        grades, stages = infer_stage(row)
        row_for_ready = dict(row)
        row_for_ready["grades"] = grades
        row_for_ready["school_stages"] = stages
        out.update(
            {
                "refiner_version": REFINER_VERSION,
                "task_context": infer_task_context(ctx, row.get("source_url")),
                "quality_flags": sorted(set((row.get("review_reasons") or []) + flags)),
                "graph_ready_status": graph_ready,
                "grades": grades,
                "school_stages": stages,
                **readiness_fields(row_for_ready, flags, graph_ready),
            }
        )
        refined.append(out)
    return refined


def refine_criterion_evidence(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    refined = []
    for row in rows:
        out = dict(row)
        ctx = row.get("level_descriptor") or row.get("context_snippet") or ""
        flags = classify_label_quality(row.get("criterion_label") or "", ctx) + source_flags(row)
        graph_ready = "candidate"
        if "internal_guidance_source" in flags:
            graph_ready = "quarantine"
        elif "navigation_or_heading_residue" in flags and row.get("source_authority") != "exam_rubric":
            graph_ready = "needs_review"
        elif "mojibake" in flags:
            graph_ready = "needs_review"
        grades, stages = infer_stage(row)
        row_for_ready = dict(row)
        row_for_ready["grades"] = grades
        row_for_ready["school_stages"] = stages
        out.update(
            {
                "refiner_version": REFINER_VERSION,
                "task_context": infer_task_context(ctx, row.get("source_url")),
                "quality_flags": sorted(set(flags)),
                "graph_ready_status": graph_ready,
                "grades": grades,
                "school_stages": stages,
                **readiness_fields(row_for_ready, flags, graph_ready),
            }
        )
        refined.append(out)
    return refined


def summarize(name: str, rows: list[dict[str, Any]]) -> list[str]:
    lines = [f"## {name}", f"- Rows: {len(rows)}"]
    status = Counter(row.get("graph_ready_status") for row in rows)
    for key, count in status.most_common():
        lines.append(f"- `{key}`: {count}")
    flags = Counter(flag for row in rows for flag in row.get("quality_flags", []))
    if flags:
        lines.append("- Top quality flags:")
        for key, count in flags.most_common(12):
            lines.append(f"  - `{key}`: {count}")
    lines.append(f"- Generation-ready rows: {sum(1 for row in rows if row.get('generation_ready'))}")
    lines.append(f"- Comparison-ready rows: {sum(1 for row in rows if row.get('comparison_ready'))}")
    return lines


def review_rows(*collections: tuple[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    rows = []
    for name, collection in collections:
        for row in collection:
            if row.get("graph_ready_status") not in {"needs_review", "reject", "quarantine"}:
                continue
            rows.append(
                {
                    "dataset": name,
                    "id": row.get("id"),
                    "label": row.get("label_et") or row.get("task_subtype_label") or row.get("criterion_label"),
                    "refined_label": row.get("refined_label_et"),
                    "graph_ready_status": row.get("graph_ready_status"),
                    "generation_ready": row.get("generation_ready"),
                    "comparison_ready": row.get("comparison_ready"),
                    "quality_flags": row.get("quality_flags", []),
                    "source_authority": row.get("source_authority"),
                    "source_url": row.get("source_url"),
                    "context": row.get("context_snippet") or row.get("level_descriptor") or "",
                }
            )
    return rows


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    units = refine_learning_units(read_jsonl(STRUCT_DIR / "learning_unit_candidates.jsonl"))
    tasks = refine_task_signals(read_jsonl(STRUCT_DIR / "task_signals.jsonl"))
    criteria = refine_criterion_evidence(read_jsonl(STRUCT_DIR / "criterion_evidence.jsonl"))
    competences = refine_competence_expressions(read_jsonl(STRUCT_DIR / "competence_expressions.jsonl"))

    write_jsonl(OUT_DIR / "learning_unit_candidates.refined.jsonl", units)
    write_jsonl(OUT_DIR / "task_signals.refined.jsonl", tasks)
    write_jsonl(OUT_DIR / "criterion_evidence.refined.jsonl", criteria)
    write_jsonl(OUT_DIR / "competence_expressions.refined.jsonl", competences)
    review = review_rows(("learning_units", units), ("task_signals", tasks), ("criterion_evidence", criteria), ("competence_expressions", competences))
    write_csv(ROOT / "reports/refined_structured_review_queue.csv", review[:2000])

    lines = [
        "# Refined Structured Data Report",
        "",
        f"- Refiner version: `{REFINER_VERSION}`",
        "",
    ]
    for section in [
        summarize("Learning Unit Candidates", units),
        summarize("Task Signals", tasks),
        summarize("Criterion Evidence", criteria),
        summarize("Competence Expressions", competences),
    ]:
        lines.extend(section)
        lines.append("")
    lines.extend(
        [
            "## Notes",
            "",
            "- This refinement layer does not merge or split candidates; it enriches and gates raw structured records before graph construction.",
            "- `candidate_refined` task signals have enough operation/object/context to be useful for exercise/test generation.",
            "- `needs_review` records may still provide evidence, but should not drive automatic joins by label alone.",
            "- `reject` records are mostly navigation, heading, or menu residue and should not become graph nodes.",
        ]
    )
    (ROOT / "reports/refined_structured_data_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    manifest = {
        "refiner_version": REFINER_VERSION,
        "outputs": {
            "learning_unit_candidates": len(units),
            "task_signals": len(tasks),
            "criterion_evidence": len(criteria),
            "competence_expressions": len(competences),
            "review_rows": len(review),
        },
        "graph_ready_counts": {
            "learning_unit_candidates": dict(Counter(row.get("graph_ready_status") for row in units)),
            "task_signals": dict(Counter(row.get("graph_ready_status") for row in tasks)),
            "criterion_evidence": dict(Counter(row.get("graph_ready_status") for row in criteria)),
            "competence_expressions": dict(Counter(row.get("graph_ready_status") for row in competences)),
        },
        "generation_ready_counts": {
            "learning_unit_candidates": sum(1 for row in units if row.get("generation_ready")),
            "task_signals": sum(1 for row in tasks if row.get("generation_ready")),
            "criterion_evidence": sum(1 for row in criteria if row.get("generation_ready")),
            "competence_expressions": sum(1 for row in competences if row.get("generation_ready")),
        },
        "comparison_ready_counts": {
            "learning_unit_candidates": sum(1 for row in units if row.get("comparison_ready")),
            "task_signals": sum(1 for row in tasks if row.get("comparison_ready")),
            "criterion_evidence": sum(1 for row in criteria if row.get("comparison_ready")),
            "competence_expressions": sum(1 for row in competences if row.get("comparison_ready")),
        },
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        "Refined structured data: "
        f"{len(units)} units, {len(tasks)} task signals, "
        f"{len(criteria)} criterion evidence rows, {len(competences)} competence expressions"
    )


if __name__ == "__main__":
    main()
