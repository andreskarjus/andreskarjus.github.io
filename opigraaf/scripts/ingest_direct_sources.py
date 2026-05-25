from __future__ import annotations

import argparse
import csv
import re
import subprocess
from pathlib import Path
from typing import Any

import fitz

from common import (
    ROOT,
    USER_AGENT,
    clean_label,
    ensure_dirs,
    fetch_url,
    safe_filename_from_url,
    sha1_text,
    write_csv,
    write_jsonl,
)

WORKSPACE = ROOT.parent
DEFAULT_SOURCE_FILE = WORKSPACE / "more sources.txt"

SIGNAL_RE = re.compile(
    r"\b("
    r"õpitulem|õppekava|õppesisu|pädevus|kursus|hindam|õppija|õpilane|oskab|"
    r"eesti keel|kirjandus|grammatika|õigekiri|kirjavahem|lugem|kirjut|tekst|"
    r"lause|sõna|häälik|vorm|kääne|pööre|stiil|allika|argument|arutlus|analüüs|"
    r"metoodika|ülesanne|harjutus"
    r")\b",
    re.I,
)


def read_tsv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f, delimiter="\t"))
    out = []
    for row in rows:
        title = clean_label(row.get("Title / grade"))
        notes = clean_label(row.get("Format & notes"))
        url = (row.get("Direct download link") or "").strip()
        if title and url:
            out.append({"title": title, "notes": notes, "url": url})
    return out


def infer_source_meta(row: dict[str, str]) -> dict[str, Any]:
    title = row["title"]
    notes = row["notes"]
    url = row["url"]
    haystack = f"{title} {notes} {url}".lower()
    grade_match = re.search(r"(\d+)\.\s*klass", haystack)
    grade = f"{grade_match.group(1)}. klass" if grade_match else None
    school_stage = "gümnaasium" if "gümnaas" in haystack else ("põhikool" if grade else None)
    status = "public_pdf"
    learner_profile = "standard"
    source_kind = "direct_pdf_material"
    routing = "materials"
    assessment = "Useful as public material evidence for bottom-up unit discovery."

    if "metoodika" in haystack:
        source_kind = "teacher_methodology_curriculum_signal"
        routing = "curriculum"
        school_stage = school_stage or "gümnaasium"
        assessment = (
            "Teacher-facing methodology text. Use for gümnaasium course-design and curriculum-signal evidence, "
            "not as direct student-task evidence."
        )
    elif "struktuur" in haystack and "gümnaas" in haystack:
        source_kind = "upper_secondary_textbook"
        school_stage = "gümnaasium"
        assessment = "Upper-secondary textbook; useful for gümnaasium Estonian language knowledge units."
    elif "käsiraamat" in haystack or "eki.ee" in haystack:
        source_kind = "language_reference"
        assessment = (
            "Canonical grammar/reference source. Useful for terminology and concept evidence, "
            "but should not define curriculum coverage by itself."
        )
    elif "hev" in haystack or "simplified" in haystack:
        source_kind = "hev_simplified_material"
        learner_profile = "HEV/simplified"
        assessment = (
            "Simplified/HEV learner material. Useful evidence for accessible sequencing, "
            "but keep separate from standard grade expectations until reviewed."
        )
    elif "sample" in haystack or "sample pages" in haystack or "first 20 pages" in haystack:
        source_kind = "publisher_sample"
        status = "public_sample"
        assessment = "Publisher sample pages; useful for visible topic/task signals only."
    elif "töövihik" in haystack or "workbook" in haystack:
        source_kind = "workbook"
        assessment = "Workbook material; useful for task and practice-skill signals."

    return {
        "source_title": title,
        "source_kind": source_kind,
        "routing": routing,
        "status": status,
        "learner_profile": learner_profile,
        "grade": grade,
        "school_stage": school_stage,
        "subject": "Eesti keel",
        "subjects": ["Eesti keel"],
        "assessment": assessment,
    }


def chunk_text(text: str, max_chars: int = 1600) -> list[str]:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    chunks: list[str] = []
    buf = ""
    for para in paragraphs:
        if len(para) > max_chars:
            if buf:
                chunks.append(buf)
                buf = ""
            for i in range(0, len(para), max_chars):
                part = para[i : i + max_chars].strip()
                if part:
                    chunks.append(part)
            continue
        candidate = (buf + "\n\n" + para).strip() if buf else para
        if len(candidate) > max_chars and buf:
            chunks.append(buf)
            buf = para
        else:
            buf = candidate
    if buf:
        chunks.append(buf)
    return chunks


def extract_pdf_chunks(raw_path: Path, row: dict[str, str], meta: dict[str, Any]) -> tuple[list[dict[str, Any]], int, int]:
    chunks: list[dict[str, Any]] = []
    total_chars = 0
    with fitz.open(raw_path) as doc:
        page_count = doc.page_count
        for page_index, page in enumerate(doc, start=1):
            page_text = clean_label(page.get_text("text"))
            page_text = re.sub(r"\s+", " ", page_text).strip()
            if len(page_text) < 80:
                continue
            total_chars += len(page_text)
            for chunk_index, chunk in enumerate(chunk_text(page_text), start=1):
                if len(chunk) < 80:
                    continue
                chunk_id = "direct:" + sha1_text(f"{row['url']}|{page_index}|{chunk_index}|{chunk}", 20)
                chunks.append(
                    {
                        "id": chunk_id,
                        "source_system": "direct_pdf_sources",
                        "source_kind": meta["source_kind"],
                        "source_url": row["url"],
                        "source_title": meta["source_title"],
                        "source_file": raw_path.name,
                        "material_label": meta["source_title"],
                        "text": chunk,
                        "page": page_index,
                        "chunk_index": chunk_index,
                        "grade": meta["grade"],
                        "school_stage": meta["school_stage"],
                        "subject": meta["subject"],
                        "subjects": meta["subjects"],
                        "learner_profile": meta["learner_profile"],
                        "status": meta["status"],
                        "routing": meta["routing"],
                        "method": "direct_pdf_pymupdf",
                        "raw_path": str(raw_path),
                    }
                )
    return chunks, page_count, total_chars


def curl_fallback(url: str, raw_path: Path) -> dict[str, Any]:
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "curl.exe",
        "-L",
        "-sS",
        "-A",
        USER_AGENT,
        "-o",
        str(raw_path),
        "-w",
        "%{http_code}\t%{content_type}\t%{size_download}",
        url,
    ]
    try:
        proc = subprocess.run(cmd, check=False, capture_output=True, text=True, timeout=180)
    except Exception as exc:  # noqa: BLE001 - inventory should record failures.
        return {"ok": False, "error": repr(exc), "stdout": "", "stderr": ""}
    parts = proc.stdout.strip().split("\t")
    return {
        "ok": proc.returncode == 0,
        "returncode": proc.returncode,
        "http_status": parts[0] if len(parts) > 0 else None,
        "content_type": parts[1] if len(parts) > 1 else None,
        "bytes": int(float(parts[2])) if len(parts) > 2 and parts[2].replace(".", "", 1).isdigit() else None,
        "error": proc.stderr.strip() or None,
    }


def select_graph_chunks(chunks: list[dict[str, Any]], meta: dict[str, Any], max_per_source: int) -> list[dict[str, Any]]:
    if not chunks:
        return []
    scored = []
    for idx, chunk in enumerate(chunks):
        text = chunk.get("text", "")
        score = len(SIGNAL_RE.findall(text))
        if meta["source_kind"] in {"teacher_methodology_curriculum_signal", "upper_secondary_textbook"}:
            score += 1
        if meta["source_kind"] == "language_reference":
            score = score if score >= 2 else 0
        scored.append((score, idx, chunk))
    selected = [chunk for score, _idx, chunk in scored if score > 0]
    if len(selected) < min(12, len(chunks)):
        selected = [chunk for _score, _idx, chunk in sorted(scored, key=lambda row: row[1])[: min(12, len(chunks))]]
    selected = sorted(
        selected,
        key=lambda chunk: (
            0 if chunk.get("page") in {1, 2, 3} else 1,
            -len(SIGNAL_RE.findall(chunk.get("text", ""))),
            chunk.get("page") or 0,
            chunk.get("chunk_index") or 0,
        ),
    )
    return selected[:max_per_source]


def ingest(source_file: Path, max_graph_chunks_per_source: int) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    rows = read_tsv(source_file)
    raw_dir = ROOT / "data/raw/direct_sources"
    inventory = []
    all_chunks: list[dict[str, Any]] = []
    curriculum_chunks: list[dict[str, Any]] = []
    material_chunks: list[dict[str, Any]] = []

    for index, row in enumerate(rows, start=1):
        meta = infer_source_meta(row)
        raw_path = raw_dir / safe_filename_from_url(row["url"], ".pdf")
        pdf_magic = raw_path.exists() and raw_path.read_bytes()[:5] == b"%PDF-"
        fallback = None
        if pdf_magic:
            result = type(
                "CachedFetchResult",
                (),
                {
                    "status_code": "cached",
                    "content_type": "application/pdf",
                    "bytes": raw_path.stat().st_size,
                    "error": None,
                },
            )()
        else:
            result = fetch_url(row["url"], raw_path=raw_path, timeout=(15, 120), retries=2)
            pdf_magic = raw_path.exists() and raw_path.read_bytes()[:5] == b"%PDF-"
        if not pdf_magic:
            fallback = curl_fallback(row["url"], raw_path)
            pdf_magic = raw_path.exists() and raw_path.read_bytes()[:5] == b"%PDF-"
        status = "downloaded_pdf" if result.error is None and pdf_magic else "not_pdf_or_failed"
        page_count = 0
        total_chars = 0
        file_chunks: list[dict[str, Any]] = []
        selected_chunks: list[dict[str, Any]] = []
        error = result.error
        if status == "downloaded_pdf":
            try:
                file_chunks, page_count, total_chars = extract_pdf_chunks(raw_path, row, meta)
                selected_chunks = select_graph_chunks(file_chunks, meta, max_graph_chunks_per_source)
                all_chunks.extend(file_chunks)
                if meta["routing"] == "curriculum":
                    curriculum_chunks.extend(selected_chunks)
                else:
                    material_chunks.extend(selected_chunks)
            except Exception as exc:  # noqa: BLE001 - keep source inventory complete.
                status = "extract_failed"
                error = repr(exc)
        inventory.append(
            {
                "index": index,
                "title": row["title"],
                "url": row["url"],
                "http_status": result.status_code,
                "content_type": result.content_type,
                "bytes": result.bytes,
                "fallback_http_status": fallback.get("http_status") if fallback else None,
                "fallback_content_type": fallback.get("content_type") if fallback else None,
                "fallback_bytes": fallback.get("bytes") if fallback else None,
                "pdf_magic": pdf_magic,
                "raw_path": str(raw_path),
                "status": status,
                "source_kind": meta["source_kind"],
                "routing": meta["routing"],
                "grade": meta["grade"],
                "school_stage": meta["school_stage"],
                "learner_profile": meta["learner_profile"],
                "pages": page_count,
                "text_chars": total_chars,
                "chunks": len(file_chunks),
                "graph_chunks": len(selected_chunks),
                "assessment": meta["assessment"],
                "error": error or (fallback.get("error") if fallback else None),
            }
        )
    return inventory, all_chunks, curriculum_chunks + material_chunks


def write_report(inventory: list[dict[str, Any]], curriculum_chunks: list[dict[str, Any]], material_chunks: list[dict[str, Any]]) -> None:
    ok = [row for row in inventory if row["status"] == "downloaded_pdf"]
    failed = [row for row in inventory if row["status"] != "downloaded_pdf"]
    by_kind: dict[str, int] = {}
    for row in inventory:
        by_kind[row["source_kind"]] = by_kind.get(row["source_kind"], 0) + 1
    lines = [
        "# Direct PDF Source Assessment",
        "",
        "Assessment of `more sources.txt` direct PDF links for the Eesti keel ja kirjandus graph corpus.",
        "",
        f"- Rows assessed: {len(inventory)}",
        f"- Downloaded and extractable PDFs: {len(ok)}",
        f"- Failed or non-PDF rows: {len(failed)}",
        f"- Curriculum-routed graph chunks: {len(curriculum_chunks)}",
        f"- Material-routed graph chunks: {len(material_chunks)}",
        "",
        "## Source Roles",
    ]
    for kind, count in sorted(by_kind.items()):
        lines.append(f"- `{kind}`: {count}")
    lines.extend(
        [
            "",
            "## Critical Notes",
            "",
            "- The practical Estonian methodology book is teacher-facing. It is valuable for gümnaasium course design, sequencing, and assessment-language signals, but should not be counted as student material evidence.",
            "- The EKI handbook is a strong terminology and grammar reference, not a curriculum boundary source. It is routed as material/reference evidence with capped graph chunks.",
            "- HEV/simplified workbooks are retained with `learner_profile=HEV/simplified`; these should stay reviewable before being merged into standard grade expectations.",
            "- Publisher sample PDFs are public samples only. Their evidence is useful for visible topic and practice patterns, but absence of later chapters is not absence of coverage.",
            "",
            "## Per-Source Assessment",
            "",
            "| # | Source | Status | Role | Pages | Chunks | Graph chunks | Assessment |",
            "|---:|---|---|---|---:|---:|---:|---|",
        ]
    )
    for row in inventory:
        title = str(row["title"]).replace("|", "\\|")
        assessment = str(row["assessment"]).replace("|", "\\|")
        lines.append(
            f"| {row['index']} | {title} | {row['status']} | `{row['source_kind']}` | "
            f"{row['pages']} | {row['chunks']} | {row['graph_chunks']} | {assessment} |"
        )
    (ROOT / "reports/direct_source_assessment.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-file", default=str(DEFAULT_SOURCE_FILE))
    parser.add_argument("--max-graph-chunks-per-source", type=int, default=140)
    args = parser.parse_args()

    ensure_dirs()
    source_file = Path(args.source_file)
    inventory, all_chunks, graph_chunks = ingest(source_file, args.max_graph_chunks_per_source)
    curriculum_chunks = [chunk for chunk in graph_chunks if chunk.get("routing") == "curriculum"]
    material_chunks = [chunk for chunk in graph_chunks if chunk.get("routing") != "curriculum"]

    write_csv(ROOT / "reports/direct_source_inventory.csv", inventory)
    write_jsonl(ROOT / "data/interim/direct_sources/chunks.jsonl", all_chunks)
    write_jsonl(ROOT / "data/interim/curriculum/direct_source_chunks.jsonl", curriculum_chunks)
    write_jsonl(ROOT / "data/interim/materials/direct_source_chunks.jsonl", material_chunks)
    write_report(inventory, curriculum_chunks, material_chunks)
    print(
        f"Assessed {len(inventory)} sources; extracted {len(all_chunks)} chunks; "
        f"routed {len(curriculum_chunks)} curriculum and {len(material_chunks)} material graph chunks"
    )


if __name__ == "__main__":
    main()
