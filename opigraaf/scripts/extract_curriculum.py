from __future__ import annotations

import re
from bs4 import BeautifulSoup

from common import ROOT, ensure_dirs, fetch_url, load_yaml, safe_filename_from_url, write_jsonl


def extract_subject_sections() -> list[dict]:
    chunks = []
    subjects = [s for s in load_yaml("config/subjects.yaml")["subjects"] if s.get("include")]
    for subject in subjects:
        title = subject["oppekava_title"]
        source_url = f"https://oppekava.edu.ee/a/{title}"
        html_path = ROOT / "data/raw/oppekava/html" / f"{title}.html"
        if not html_path.exists():
            fetch_url(source_url, raw_path=html_path, timeout=(10, 60), retries=2)
        soup = BeautifulSoup(html_path.read_text(encoding="utf-8", errors="ignore"), "lxml")
        path = []
        for element in soup.select("#mw-content-text h2, #mw-content-text h3, #mw-content-text h4, #mw-content-text p, #mw-content-text li"):
            if element.name in {"h2", "h3", "h4"}:
                level = int(element.name[1])
                text = element.get_text(" ", strip=True).replace("[muuda | muuda lähteteksti]", "").strip()
                path = path[: max(0, level - 2)] + [text]
            else:
                text = element.get_text(" ", strip=True)
                if len(text) < 40:
                    continue
                if any(key in " > ".join(path).lower() for key in ["õpitulem", "teemad", "õppeprotsess", "eesm"]):
                    chunks.append(
                        {
                            "id": f"curriculum:{subject['key']}:{len(chunks)+1}",
                            "source_system": "oppekava",
                            "source_url": source_url,
                            "subject": subject["label_et"],
                            "subjects": [subject["label_et"]],
                            "heading_path": path,
                            "text": text,
                            "method": "html_heading_chunk",
                        }
                    )
    return chunks


def probe_oppekava_ee() -> list[dict]:
    # Lightweight steering-source probe via WordPress search. It is useful
    # provenance, but the oppekava subject pages remain the structured source.
    chunks = []
    queries = ["eesti keel kirjandus õpitulemused", "keel ja kirjandus põhikool gümnaasium"]
    for q in queries:
        url = "https://oppekava.ee/wp-json/wp/v2/search?search=" + q.replace(" ", "%20")
        raw_path = ROOT / "data/raw/curriculum" / safe_filename_from_url(url, ".json")
        result = fetch_url(url, raw_path=raw_path, timeout=(10, 45), retries=1)
        chunks.append(
            {
                "id": f"curriculum_probe:{len(chunks)+1}",
                "source_system": "oppekava.ee",
                "source_url": url,
                "subjects": ["Eesti keel", "Kirjandus"],
                "heading_path": ["oppekava.ee search probe"],
                "text": f"Search probe `{q}` returned status {result.status_code}, bytes {result.bytes}.",
                "method": "wp_api_probe",
            }
        )
    return chunks


def main() -> None:
    ensure_dirs()
    chunks = extract_subject_sections() + probe_oppekava_ee()
    write_jsonl(ROOT / "data/interim/curriculum/chunks.jsonl", chunks)
    report = [
        "# Curriculum Parse Report",
        "",
        f"- Chunks: {len(chunks)}",
        "- Source hierarchy is preserved as `heading_path`.",
        "- These chunks steer coverage and broad scope; granular units still come from oppekava outcomes/material evidence.",
    ]
    (ROOT / "reports/curriculum_parse_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"Extracted {len(chunks)} curriculum steering chunks")


if __name__ == "__main__":
    main()
