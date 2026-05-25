from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any

import rdflib
from bs4 import BeautifulSoup
from rdflib.namespace import RDF, RDFS

from common import (
    ROOT,
    clean_label,
    ensure_dirs,
    fetch_url,
    flatten_printout_urls,
    flatten_printouts,
    load_yaml,
    safe_filename_from_url,
    session,
    smw_ask_url,
    write_jsonl,
)

PRINT_OPIVALJUND = [
    ("Haridus:verb", "Verb"),
    ("Skos:semanticRelation", "Moiste"),
    ("Haridus:eeldab", "Eeldab"),
    ("Haridus:onEelduseks", "OnEelduseks"),
    ("Haridus:koosneb", "Koosneb"),
    ("Haridus:klass", "Klass"),
    ("Haridus:kooliaste", "Kooliaste"),
    ("Haridus:seotudHaridusaste", "Haridusaste"),
    ("Haridus:seotudOppeaine", "Oppeaine"),
    ("Haridus:seotudTeema", "Teema"),
]

PRINT_TEEMA = [
    ("Haridus:seotudOppeaine", "Oppeaine"),
    ("Haridus:seotudHaridusaste", "Haridusaste"),
    ("Haridus:kooliaste", "Kooliaste"),
    ("Haridus:alateema", "Alateema"),
]

PRINT_MATERIAL = [
    ("Haridus:seotudOppeaine", "Oppeaine"),
    ("Haridus:seotudTeema", "Teema"),
    ("Haridus:klass", "Klass"),
    ("Haridus:kooliaste", "Kooliaste"),
    ("Haridus:seotudOpivaljund", "Opivaljund"),
]

PRINT_KNOBIT = [
    ("Haridus:seotudOppeaine", "Oppeaine"),
    ("Haridus:seotudTeema", "Teema"),
    ("Haridus:klass", "Klass"),
    ("Haridus:kooliaste", "Kooliaste"),
    ("Skos:semanticRelation", "Moiste"),
]


def parse_smw_results(data: dict[str, Any]) -> list[dict[str, Any]]:
    results = data.get("results", {})
    if isinstance(results, dict):
        iterable = results.items()
    else:
        iterable = ((label, obj) for label, obj in results)
    rows = []
    for label, obj in iterable:
        printouts = obj.get("printouts", {})
        rows.append(
            {
                "label": clean_label(label),
                "url": obj.get("fullurl"),
                "exists": obj.get("exists"),
                "printouts": printouts,
            }
        )
    return rows


def ask_all(
    subject_label: str,
    category: str,
    printouts: list[tuple[str, str]],
    limit: int,
    max_rows: int | None,
    max_pages: int,
) -> list[dict[str, Any]]:
    s = session()
    all_rows = []
    offset = 0
    seen_signatures: set[str] = set()
    page_count = 0
    while True:
        if page_count >= max_pages:
            break
        condition = f"[[Kategooria:{category}]] [[Haridus:seotudOppeaine::{subject_label}]]"
        url = smw_ask_url(condition, printouts, limit=limit, offset=offset, fmt="json")
        raw_path = ROOT / "data/raw/oppekava/ask" / safe_filename_from_url(url, ".json")
        result = fetch_url(url, raw_path=raw_path, timeout=(10, 60), retries=2)
        if result.status_code != 200 or result.error:
            break
        try:
            data = json.loads(raw_path.read_text(encoding="utf-8"))
        except Exception:
            break
        rows = parse_smw_results(data)
        signature = "|".join(row["label"] for row in rows)
        if signature in seen_signatures:
            break
        seen_signatures.add(signature)
        for row in rows:
            row["subject"] = subject_label
            row["category"] = category
            row["ask_url"] = url
        all_rows.extend(rows)
        if len(rows) < limit:
            break
        offset += limit
        if max_rows and len(all_rows) >= max_rows:
            all_rows = all_rows[:max_rows]
            break
        page_count += 1
    return all_rows


def normalize_outcome(row: dict[str, Any]) -> dict[str, Any]:
    po = row["printouts"]
    return {
        "label": row["label"],
        "url": row["url"],
        "subject": row["subject"],
        "verbs": flatten_printouts(po, "Verb"),
        "concepts": flatten_printout_urls(po, "Moiste"),
        "requires": flatten_printout_urls(po, "Eeldab"),
        "is_prerequisite_for": flatten_printout_urls(po, "OnEelduseks"),
        "parts": flatten_printout_urls(po, "Koosneb"),
        "grades": flatten_printouts(po, "Klass"),
        "school_stages": flatten_printouts(po, "Kooliaste"),
        "education_levels": flatten_printouts(po, "Haridusaste"),
        "topics": flatten_printout_urls(po, "Teema"),
        "ask_url": row["ask_url"],
    }


def normalize_topic(row: dict[str, Any]) -> dict[str, Any]:
    po = row["printouts"]
    return {
        "label": row["label"],
        "url": row["url"],
        "subject": row["subject"],
        "subjects": flatten_printout_urls(po, "Oppeaine"),
        "education_levels": flatten_printouts(po, "Haridusaste"),
        "school_stages": flatten_printouts(po, "Kooliaste"),
        "subtopics": flatten_printout_urls(po, "Alateema"),
        "ask_url": row["ask_url"],
    }


def normalize_material(row: dict[str, Any]) -> dict[str, Any]:
    po = row["printouts"]
    material_id = None
    m = re.search(r"E-koolikott:materjal:(\d+)", row["label"])
    if m:
        material_id = m.group(1)
    return {
        "label": row["label"],
        "url": row["url"],
        "subject": row["subject"],
        "ekoolikott_id": material_id,
        "topics": flatten_printout_urls(po, "Teema"),
        "outcomes": flatten_printout_urls(po, "Opivaljund"),
        "grades": flatten_printouts(po, "Klass"),
        "school_stages": flatten_printouts(po, "Kooliaste"),
        "ask_url": row["ask_url"],
    }


def harvest_subject_page(subject: dict[str, Any]) -> dict[str, Any]:
    title = subject["oppekava_title"]
    html_url = f"https://oppekava.edu.ee/a/{title}"
    rdf_url = f"https://oppekava.edu.ee/a/Eri:ExportRDF/{title}"
    html_path = ROOT / "data/raw/oppekava/html" / f"{title}.html"
    rdf_path = ROOT / "data/raw/oppekava/rdf" / f"{title}.rdf"
    html = fetch_url(html_url, raw_path=html_path, timeout=(10, 60), retries=2)
    rdf = fetch_url(rdf_url, raw_path=rdf_path, timeout=(10, 90), retries=1)
    sections = []
    if html_path.exists():
        soup = BeautifulSoup(html_path.read_text(encoding="utf-8", errors="ignore"), "lxml")
        for heading in soup.select("h2, h3, h4"):
            title_text = heading.get_text(" ", strip=True).replace("[muuda | muuda lähteteksti]", "").strip()
            content = []
            for sibling in heading.find_next_siblings():
                if sibling.name in {"h2", "h3", "h4"}:
                    break
                text = sibling.get_text(" ", strip=True)
                if text:
                    content.append(text)
            if title_text and content:
                sections.append({"heading": title_text, "text": "\n".join(content)[:8000]})
    rdf_resources = []
    if rdf_path.exists() and rdf.status_code == 200:
        try:
            graph = rdflib.Graph()
            graph.parse(str(rdf_path), format="xml")
            subject_uri = rdflib.URIRef(f"http://oppekava.edu.ee/a/Special:URIResolver/{title}")
            pred = rdflib.URIRef("https://schema.edu.ee/seotudOppeaine")
            for res, _, obj in graph.triples((None, pred, subject_uri)):
                label = next(graph.objects(res, RDFS.label), None)
                rdf_resources.append({"label": clean_label(str(label or res)), "uri": str(res), "subject": subject["label_et"]})
        except Exception as exc:  # noqa: BLE001
            rdf_resources.append({"label": f"RDF parse error: {exc}", "uri": None, "subject": subject["label_et"]})
    return {
        "subject": subject["label_et"],
        "html_url": html_url,
        "rdf_url": rdf_url,
        "html_status": html.status_code,
        "rdf_status": rdf.status_code,
        "rdf_error": rdf.error,
        "html_path": str(html_path),
        "rdf_path": str(rdf_path),
        "sections": sections,
        "rdf_resources": rdf_resources,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["pilot", "full"], default="pilot")
    parser.add_argument("--max-pages", type=int, default=None, help="Maximum SMW Ask pages per subject/category.")
    parser.add_argument("--max-material-rows", type=int, default=1000, help="Safety cap for noisy material pages in full mode.")
    args = parser.parse_args()
    ensure_dirs()
    subjects = [s for s in load_yaml("config/subjects.yaml")["subjects"] if s.get("include")]
    limit = 25 if args.mode == "pilot" else 50
    max_rows = 75 if args.mode == "pilot" else None
    max_pages = args.max_pages or (3 if args.mode == "pilot" else 40)

    subject_pages = []
    outcomes = []
    topics = []
    materials = []
    knobits = []
    errors = []
    for subject in subjects:
        label = subject["label_et"]
        subject_pages.append(harvest_subject_page(subject))
        for category, printouts, normalizer, sink in [
            ("Haridus:Opivaljund", PRINT_OPIVALJUND, normalize_outcome, outcomes),
            ("Haridus:Teema", PRINT_TEEMA, normalize_topic, topics),
            ("Haridus:Oppematerjal", PRINT_MATERIAL, normalize_material, materials),
            ("Haridus:Knobit", PRINT_KNOBIT, normalize_material, knobits),
        ]:
            try:
                category_max_rows = max_rows
                if args.mode == "full" and category == "Haridus:Oppematerjal":
                    category_max_rows = args.max_material_rows
                rows = ask_all(label, category, printouts, limit=limit, max_rows=category_max_rows, max_pages=max_pages)
                sink.extend(normalizer(row) for row in rows)
            except Exception as exc:  # noqa: BLE001
                errors.append({"subject": label, "category": category, "error": repr(exc)})

    prefix = "pilot_" if args.mode == "pilot" else ""
    write_jsonl(ROOT / f"data/interim/oppekava/{prefix}subject_pages.jsonl", subject_pages)
    write_jsonl(ROOT / f"data/interim/oppekava/{prefix}learning_outcomes.jsonl", outcomes)
    write_jsonl(ROOT / f"data/interim/oppekava/{prefix}topics.jsonl", topics)
    write_jsonl(ROOT / f"data/interim/oppekava/{prefix}materials.jsonl", materials)
    write_jsonl(ROOT / f"data/interim/oppekava/{prefix}knobits.jsonl", knobits)
    write_jsonl(ROOT / f"reports/{prefix}oppekava_parse_errors.jsonl", errors)

    md = [
        f"# Oppekava Harvest Report ({args.mode})",
        "",
        f"- Subject pages: {len(subject_pages)}",
        f"- Learning outcomes: {len(outcomes)}",
        f"- Topics: {len(topics)}",
        f"- Materials: {len(materials)}",
        f"- Knobits: {len(knobits)}",
        f"- Errors: {len(errors)}",
        "",
        "## Notes",
        "",
        "- Harvest uses Semantic MediaWiki Ask JSON for subject-filtered outcomes/topics/materials.",
        "- Subject RDF is retained where available, but HTML/Ask remains the fallback for unstable RDF pages.",
    ]
    (ROOT / f"reports/{prefix}oppekava_harvest_report.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"Harvested {len(outcomes)} outcomes, {len(topics)} topics, {len(materials)} materials ({args.mode})")


if __name__ == "__main__":
    main()
