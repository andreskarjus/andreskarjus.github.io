from __future__ import annotations

import csv
from pathlib import Path
from urllib.parse import urlparse

from common import ROOT, ensure_dirs, fetch_url, load_yaml, write_csv


def main() -> None:
    ensure_dirs()
    registry = load_yaml("config/source_registry.yaml")
    rows = []
    for source in registry["sources"]:
        parsed = urlparse(source["url"])
        if parsed.scheme not in {"http", "https"}:
            local_path = (ROOT / source["url"]).resolve()
            exists = local_path.exists()
            rows.append(
                {
                    "key": source["key"],
                    "label": source["label"],
                    "role": source["role"],
                    "url": source["url"],
                    "status": "ok" if exists else "missing",
                    "http_status": None,
                    "content_type": "local_directory" if local_path.is_dir() else "local_file",
                    "bytes": None,
                    "final_url": str(local_path),
                    "raw_path": str(local_path),
                    "error": None if exists else "local path missing",
                    "note": "Local source bundle.",
                }
            )
            continue
        raw_suffix = ".xml" if source["url"].endswith(".xml") else ".html"
        raw_path = ROOT / "data/raw" / "source_probe" / f"{source['key']}{raw_suffix}"
        result = fetch_url(source["url"], raw_path=raw_path, timeout=(10, 45), retries=1)
        status = "ok" if result.status_code and 200 <= result.status_code < 400 else "blocked_or_error"
        note = ""
        if source["key"].startswith("ekoolikott") and result.status_code and result.status_code >= 400:
            note = "Documented open-data endpoint is currently unavailable or server-side blocked."
        if source["key"].endswith("eesti_keel") and source["role"] == "rdf_probe" and result.error:
            note = "RDF endpoint may be unstable; HTML/SMW Ask should be used as fallback."
        rows.append(
            {
                "key": source["key"],
                "label": source["label"],
                "role": source["role"],
                "url": source["url"],
                "status": status,
                "http_status": result.status_code,
                "content_type": result.content_type,
                "bytes": result.bytes,
                "final_url": result.final_url,
                "raw_path": result.path,
                "error": result.error,
                "note": note,
            }
        )

    write_csv(ROOT / "reports/source_access_test.csv", rows)
    md = ["# Source Inventory", "", "Live source access test for the Eesti keel ja kirjandus graph prototype.", ""]
    md.append("| Source | Role | Status | HTTP | Notes |")
    md.append("|---|---:|---:|---:|---|")
    for row in rows:
        md.append(f"| [{row['label']}]({row['url']}) | {row['role']} | {row['status']} | {row['http_status']} | {row['note'] or ''} |")
    md.extend(
        [
            "",
            "## Gate Assessment",
            "",
            "- `oppekava.edu.ee` HTML/SMW sources are the practical backbone.",
            "- RDF is used where stable; Semantic MediaWiki Ask JSON is the fallback for subject-level harvesting.",
            "- E-koolikott documented XML endpoints are probed and recorded before any fallback material route is used.",
        ]
    )
    (ROOT / "reports/source_inventory.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"Wrote {len(rows)} source checks to reports/source_access_test.csv")


if __name__ == "__main__":
    main()
