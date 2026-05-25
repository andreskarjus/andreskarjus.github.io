from __future__ import annotations

import argparse
import re
import time
from collections import deque
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urldefrag, urljoin, urlparse

from bs4 import BeautifulSoup

from common import ROOT, ensure_dirs, fetch_url, load_yaml, safe_filename_from_url, write_csv, write_jsonl


@dataclass
class QueueItem:
    url: str
    depth: int


def normalize_url(url: str) -> str:
    url, _ = urldefrag(url)
    parsed = urlparse(url)
    if not parsed.scheme:
        return url
    path = re.sub(r"/{2,}", "/", parsed.path or "/")
    normalized = parsed._replace(path=path, query=parsed.query).geturl()
    return normalized.rstrip("/") if path != "/" else normalized


def is_allowed(url: str, allowed_domains: list[str], exclude_patterns: list[str]) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        return False
    if parsed.netloc.lower() not in {d.lower() for d in allowed_domains}:
        return False
    low = url.lower()
    if any(pattern.lower() in low for pattern in exclude_patterns):
        return False
    return True


def visible_text_and_links(html: str, base_url: str) -> tuple[str, list[str], str]:
    soup = BeautifulSoup(html, "lxml")
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    for tag in soup(["script", "style", "noscript", "svg", "form"]):
        tag.decompose()
    main = soup.select_one("main") or soup.select_one("#main") or soup.select_one(".wsite-content") or soup.body or soup
    text = " ".join(main.get_text(" ", strip=True).split())
    links = []
    for a in soup.select("a[href]"):
        href = a.get("href")
        if not href:
            continue
        links.append(normalize_url(urljoin(base_url, href)))
    return text, links, title


def chunk_text(text: str, max_chars: int = 1800, overlap: int = 180) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    chunks = []
    step = max_chars - overlap
    for i in range(0, len(text), step):
        chunk = text[i : i + max_chars].strip()
        if len(chunk) >= 300:
            chunks.append(chunk)
    return chunks


def keyword_score(text: str, keywords: list[str]) -> int:
    low = text.lower()
    return sum(1 for kw in keywords if kw.lower() in low)


def crawl_source(source: dict, keywords: list[str], exclude_patterns: list[str], global_limit: int | None) -> tuple[list[dict], list[dict]]:
    key = source["key"]
    max_pages = min(source.get("max_pages", 100), global_limit) if global_limit else source.get("max_pages", 100)
    max_depth = source.get("max_depth", 2)
    allowed = source["allowed_domains"]
    delay = float(source.get("politeness_seconds", 1.0))
    raw_dir = ROOT / "data/raw/web_sources" / key
    queue = deque(QueueItem(normalize_url(url), 0) for url in source["start_urls"])
    seen: set[str] = set()
    page_rows = []
    chunk_rows = []

    while queue and len(page_rows) < max_pages:
        item = queue.popleft()
        if item.url in seen:
            continue
        seen.add(item.url)
        if not is_allowed(item.url, allowed, exclude_patterns):
            continue
        raw_path = raw_dir / safe_filename_from_url(item.url, ".html")
        result = fetch_url(item.url, raw_path=raw_path, timeout=(10, 45), retries=1)
        text = ""
        title = ""
        links: list[str] = []
        score = 0
        accepted = False
        if result.status_code == 200 and result.content_type and "html" in result.content_type and raw_path.exists():
            html = raw_path.read_text(encoding="utf-8", errors="ignore")
            text, links, title = visible_text_and_links(html, item.url)
            score = keyword_score(text + " " + title + " " + item.url, keywords)
            accepted = len(text) >= 400 and (score > 0 or item.depth == 0)
            if item.depth < max_depth:
                for link in links:
                    if link not in seen and is_allowed(link, allowed, exclude_patterns):
                        queue.append(QueueItem(link, item.depth + 1))
        page_rows.append(
            {
                "source_key": key,
                "url": item.url,
                "depth": item.depth,
                "status_code": result.status_code,
                "content_type": result.content_type,
                "bytes": result.bytes,
                "raw_path": result.path,
                "title": title,
                "text_chars": len(text),
                "keyword_score": score,
                "accepted": accepted,
                "out_links": len(links),
                "error": result.error,
            }
        )
        if accepted:
            for idx, chunk in enumerate(chunk_text(text), start=1):
                chunk_rows.append(
                    {
                        "source_system": key,
                        "source_kind": source.get("source_kind", "web_material"),
                        "source_url": item.url,
                        "source_title": title,
                        "chunk_index": idx,
                        "subject": "Eesti keel",
                        "subjects": ["Eesti keel", "Kirjandus"] if "kirjandus" in text.lower() else ["Eesti keel"],
                        "school_stage": None,
                        "material_label": title or item.url,
                        "text": chunk,
                        "method": "web_source_crawl_visible_text",
                    }
                )
        time.sleep(delay)
    return page_rows, chunk_rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default=None, help="Run only one source key.")
    parser.add_argument("--include-disabled", action="store_true")
    parser.add_argument("--max-pages", type=int, default=None, help="Override per-source page cap downward.")
    args = parser.parse_args()

    ensure_dirs()
    config = load_yaml("config/web_material_sources.yaml")
    sources = config["sources"]
    if args.source:
        sources = [s for s in sources if s["key"] == args.source]
    if not args.include_disabled:
        sources = [s for s in sources if s.get("enabled", True)]
    all_pages = []
    all_chunks = []
    for source in sources:
        pages, chunks = crawl_source(source, config.get("keywords", []), config.get("exclude_url_patterns", []), args.max_pages)
        all_pages.extend(pages)
        all_chunks.extend(chunks)

    write_csv(ROOT / "reports/web_source_mining_pages.csv", all_pages)
    write_jsonl(ROOT / "data/interim/materials/web_source_chunks.jsonl", all_chunks)

    # Keep the existing material_text_chunks file as the aggregate public web
    # material input so downstream candidate extraction can stay simple.
    existing_chunks = []
    existing_path = ROOT / "data/interim/materials/material_text_chunks.jsonl"
    if existing_path.exists():
        from common import read_jsonl

        existing_chunks = read_jsonl(existing_path)
    combined_by_key = {(row.get("source_url"), row.get("text")): row for row in existing_chunks}
    for row in all_chunks:
        combined_by_key[(row.get("source_url"), row.get("text"))] = row
    write_jsonl(existing_path, combined_by_key.values())

    md = [
        "# Web Source Mining Report",
        "",
        f"- Sources run: {len(sources)}",
        f"- Pages fetched: {len(all_pages)}",
        f"- Accepted text chunks: {len(all_chunks)}",
        "",
        "## Sources",
        "",
    ]
    for source in sources:
        source_pages = [p for p in all_pages if p["source_key"] == source["key"]]
        source_chunks = [c for c in all_chunks if c["source_system"] == source["key"]]
        md.append(f"- {source['label']} (`{source['key']}`): {len(source_pages)} pages, {len(source_chunks)} chunks")
    (ROOT / "reports/web_source_mining_report.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"Mined {len(all_pages)} pages into {len(all_chunks)} chunks")


if __name__ == "__main__":
    main()
