from __future__ import annotations

import csv
import hashlib
import json
import re
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import quote, unquote, urlparse

import requests
import yaml

ROOT = Path(__file__).resolve().parents[1]
USER_AGENT = "curriculum-graph-research-prototype/0.1 (+oppekavad local research)"


def ensure_dirs() -> None:
    for rel in [
        "config",
        "data/raw/oppekava/html",
        "data/raw/oppekava/rdf",
        "data/raw/oppekava/ask",
        "data/raw/curriculum",
        "data/raw/materials",
        "data/interim/oppekava",
        "data/interim/curriculum",
        "data/interim/materials",
        "data/interim/candidates",
        "data/processed",
        "graph/subgraphs",
        "reports",
        "logs",
    ]:
        (ROOT / rel).mkdir(parents=True, exist_ok=True)


def load_yaml(rel: str) -> Any:
    with (ROOT / rel).open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def session() -> requests.Session:
    s = requests.Session()
    s.trust_env = False
    s.headers.update({"User-Agent": USER_AGENT})
    return s


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def sha1_text(text: str, n: int = 16) -> str:
    return hashlib.sha1(text.encode("utf-8", errors="ignore")).hexdigest()[:n]


def clean_label(text: str | None) -> str:
    if not text:
        return ""
    text = unquote(str(text)).replace("_", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def ascii_slug(text: str, max_len: int = 80) -> str:
    import unicodedata

    text = unicodedata.normalize("NFKD", clean_label(text))
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = re.sub(r"[^A-Za-z0-9]+", "-", text).strip("-").lower()
    return (text[:max_len].strip("-") or "item")


def stable_id(prefix: str, label_or_url: str) -> str:
    return f"{prefix}:{ascii_slug(label_or_url, 56)}:{sha1_text(label_or_url, 10)}"


def edge_id(source: str, target: str, edge_type: str, evidence: Iterable[str] | None = None) -> str:
    ev = "|".join(evidence or [])
    return "edge:" + sha1_text(f"{source}|{target}|{edge_type}|{ev}", 20)


def evidence_id(source_url: str, text: str) -> str:
    return "evidence:" + sha1_text(source_url + "\n" + text, 20)


def source_doc_id(source_url: str) -> str:
    return stable_id("source", source_url)


def write_jsonl(path: Path, rows: Iterable[dict[str, Any]]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("w", encoding="utf-8", newline="\n") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n")
            count += 1
    return count


def append_jsonl(path: Path, rows: Iterable[dict[str, Any]]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("a", encoding="utf-8", newline="\n") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n")
            count += 1
    return count


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def write_csv(path: Path, rows: Iterable[dict[str, Any]]) -> int:
    rows = list(rows)
    path.parent.mkdir(parents=True, exist_ok=True)
    keys: list[str] = []
    for row in rows:
        for key in row:
            if key not in keys:
                keys.append(key)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})
    return len(rows)


@dataclass
class FetchResult:
    url: str
    final_url: str | None
    status_code: int | None
    content_type: str | None
    bytes: int
    error: str | None
    path: str | None = None


def fetch_url(url: str, raw_path: Path | None = None, timeout: tuple[int, int] = (10, 60), retries: int = 2) -> FetchResult:
    s = session()
    last_error: str | None = None
    for attempt in range(retries + 1):
        try:
            r = s.get(url, timeout=timeout, allow_redirects=True)
            content = r.content
            if raw_path is not None:
                raw_path.parent.mkdir(parents=True, exist_ok=True)
                raw_path.write_bytes(content)
            return FetchResult(
                url=url,
                final_url=r.url,
                status_code=r.status_code,
                content_type=r.headers.get("content-type"),
                bytes=len(content),
                error=None,
                path=str(raw_path) if raw_path else None,
            )
        except Exception as exc:  # noqa: BLE001 - inventory should record all source failures.
            last_error = repr(exc)
            if attempt < retries:
                time.sleep(1.5 * (attempt + 1))
    return FetchResult(url=url, final_url=None, status_code=None, content_type=None, bytes=0, error=last_error, path=str(raw_path) if raw_path else None)


def smw_path_encode(text: str) -> str:
    encoded = quote(text, safe=":/=")
    replacements = {
        "%5B": "-5B",
        "%5D": "-5D",
        "%20": "-20",
        "%3F": "-3F",
        "%7B": "-7B",
        "%7D": "-7D",
    }
    for old, new in replacements.items():
        encoded = encoded.replace(old, new).replace(old.lower(), new)
    return encoded


def smw_ask_url(condition: str, printouts: list[tuple[str, str]], limit: int, offset: int, fmt: str = "json") -> str:
    print_path = "/".join(f"?{prop}={label}" for prop, label in printouts)
    return (
        "https://oppekava.edu.ee/a/Eri:Ask/"
        + smw_path_encode(condition)
        + "/"
        + smw_path_encode(print_path)
        + f"/mainlabel%3D/limit%3D{limit}/offset%3D{offset}/format%3D{fmt}"
    )


def smw_value_text(value: Any) -> str:
    if isinstance(value, dict):
        return clean_label(value.get("fulltext") or value.get("label") or value.get("fullurl") or "")
    return clean_label(str(value))


def smw_value_url(value: Any) -> str | None:
    if isinstance(value, dict):
        return value.get("fullurl")
    return None


def flatten_printouts(printouts: dict[str, Any], key: str) -> list[str]:
    values = printouts.get(key, [])
    return [smw_value_text(v) for v in values if smw_value_text(v)]


def flatten_printout_urls(printouts: dict[str, Any], key: str) -> list[dict[str, str | None]]:
    values = printouts.get(key, [])
    return [{"label": smw_value_text(v), "url": smw_value_url(v)} for v in values if smw_value_text(v)]


def normalize_for_match(text: str) -> str:
    text = clean_label(text).lower()
    text = re.sub(r"\([^)]*estcore[^)]*\)", "", text, flags=re.I)
    text = re.sub(r"[^a-zA-ZõäöüšžÕÄÖÜŠŽ0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokenize_et(text: str) -> list[str]:
    stop = {
        "ja", "ning", "või", "kui", "ka", "on", "oma", "nii", "et", "mis", "kes",
        "mille", "mida", "selle", "neid", "seda", "põhjal", "üle", "eri", "erinevaid",
    }
    return [t for t in normalize_for_match(text).split() if len(t) > 2 and t not in stop]


def graph_node(
    node_id: str,
    node_type: str,
    label_et: str,
    source_system: str,
    source_url: str | None,
    status: str,
    confidence: float,
    evidence: list[str] | None = None,
    **extra: Any,
) -> dict[str, Any]:
    row = {
        "id": node_id,
        "type": node_type,
        "label_et": label_et,
        "label_en": None,
        "aliases": [],
        "description": None,
        "source_system": source_system,
        "source_url": source_url,
        "grade": extra.pop("grade", None),
        "school_stage": extra.pop("school_stage", None),
        "subject": extra.pop("subject", None),
        "status": status,
        "confidence": confidence,
        "evidence": evidence or [],
    }
    row.update(extra)
    return row


def graph_edge(
    source: str,
    target: str,
    edge_type: str,
    confidence: float,
    method: str,
    evidence: list[str] | None,
    source_url: str | None,
    **extra: Any,
) -> dict[str, Any]:
    ev = evidence or []
    row = {
        "id": edge_id(source, target, edge_type, ev),
        "source": source,
        "target": target,
        "type": edge_type,
        "confidence": confidence,
        "method": method,
        "evidence": ev,
        "source_url": source_url,
        "created_at": now_iso(),
    }
    row.update(extra)
    return row


def safe_filename_from_url(url: str, suffix: str = "") -> str:
    parsed = urlparse(url)
    base = parsed.path.strip("/").replace("/", "__") or parsed.netloc
    if parsed.query:
        base += "__" + sha1_text(parsed.query, 8)
    # Always append a hash of the full URL. Semantic MediaWiki Ask queries can
    # differ only near the tail of a long path, so truncating the slug alone can
    # collapse different offsets into the same raw filename.
    return ascii_slug(unquote(base), 110) + "-" + sha1_text(url, 10) + suffix
