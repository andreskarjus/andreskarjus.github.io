from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup

from common import ROOT, ensure_dirs, fetch_url, read_jsonl, safe_filename_from_url, write_csv, write_jsonl


def possible_ekoolikott_urls(material_id: str) -> list[str]:
    return [
        f"https://e-koolikott.ee/oppematerjal/{material_id}",
        f"https://e-koolikott.ee/?id={material_id}",
    ]


def extract_visible_text(path: Path) -> str:
    try:
        soup = BeautifulSoup(path.read_text(encoding="utf-8", errors="ignore"), "lxml")
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        return " ".join(soup.get_text(" ", strip=True).split())
    except Exception:
        return ""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=40)
    args = parser.parse_args()
    ensure_dirs()

    source_checks = []
    for url in [
        "https://e-koolikott.ee/rest/materials.xml",
        "https://e-koolikott.ee/rest/portfolios.xml",
        "https://e-koolikott.ee/rest/users.xml",
        "https://sisuloome.e-koolikott.ee/",
        "https://vara.e-koolikott.ee/",
        "https://tekstitoo.weebly.com/",
    ]:
        raw_path = ROOT / "data/raw/materials" / safe_filename_from_url(url, ".html")
        result = fetch_url(url, raw_path=raw_path, timeout=(10, 45), retries=1)
        source_checks.append(
            {
                "url": url,
                "status_code": result.status_code,
                "content_type": result.content_type,
                "bytes": result.bytes,
                "error": result.error,
                "raw_path": result.path,
            }
        )

    materials = read_jsonl(ROOT / "data/interim/oppekava/materials.jsonl")
    if not materials:
        materials = read_jsonl(ROOT / "data/interim/oppekava/pilot_materials.jsonl")
    material_rows = []
    text_chunks = []
    for material in materials[: args.limit]:
        mid = material.get("ekoolikott_id")
        if not mid:
            m = re.search(r"E-koolikott:materjal:(\d+)", material.get("label", ""))
            mid = m.group(1) if m else None
        probe_urls = possible_ekoolikott_urls(mid) if mid else [material.get("url")]
        for url in [u for u in probe_urls if u]:
            raw_path = ROOT / "data/raw/materials" / safe_filename_from_url(url, ".html")
            result = fetch_url(url, raw_path=raw_path, timeout=(10, 30), retries=0)
            text = extract_visible_text(raw_path) if raw_path.exists() and result.status_code == 200 else ""
            material_rows.append(
                {
                    "label": material.get("label"),
                    "oppekava_url": material.get("url"),
                    "probe_url": url,
                    "ekoolikott_id": mid,
                    "status_code": result.status_code,
                    "content_type": result.content_type,
                    "bytes": result.bytes,
                    "raw_path": result.path,
                    "text_chars": len(text),
                    "error": result.error,
                    "note": "text appears to be SPA shell or blocked" if result.status_code == 200 and len(text) < 500 else "",
                }
            )
            if text and len(text) >= 500:
                text_chunks.append(
                    {
                        "material_label": material.get("label"),
                        "source_url": url,
                        "subject": material.get("subject"),
                        "text": text[:5000],
                        "method": "html_visible_text",
                    }
                )
            break

    write_csv(ROOT / "reports/material_source_probe.csv", source_checks)
    write_csv(ROOT / "reports/material_probe_report.csv", material_rows)
    write_jsonl(ROOT / "data/interim/materials/material_text_chunks.jsonl", text_chunks)
    md = [
        "# Material Probe Report",
        "",
        f"- Source endpoints probed: {len(source_checks)}",
        f"- Oppekava-linked materials probed: {len(material_rows)}",
        f"- Text chunks extracted: {len(text_chunks)}",
        "",
        "Material extraction is opportunistic in milestone 1. Blocked SPA/CAPTCHA/API paths are recorded rather than bypassed.",
    ]
    (ROOT / "reports/material_extraction_report.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"Probed {len(material_rows)} material URLs; extracted {len(text_chunks)} text chunks")


if __name__ == "__main__":
    main()
