from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from collections import Counter, defaultdict, deque
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Literal


ROOT = Path(__file__).resolve().parents[1]
PIPELINE_ROOT = Path(__file__).resolve().parent
DEFAULT_MODEL = "gpt-5.5"
GRAPH_VERSION = "minimal_api_pipeline_2026-05-22"
SCHEMA_VERSION = "minimal_curriculum_kg_v1"

NODE_TYPES = {
    "NationalCurriculum",
    "CurriculumDomain",
    "Subject",
    "SchoolStage",
    "Grade",
    "Topic",
    "LearningOutcome",
    "KnowledgeUnit",
    "SkillUnit",
    "CompetenceUnit",
    "TaskSubtype",
    "AssessmentCriterion",
    "CriterionDimension",
    "LevelExpectation",
}

UNIT_TYPES = {"KnowledgeUnit", "SkillUnit", "CompetenceUnit"}
TASK_CRITERION_TYPES = {"TaskSubtype", "AssessmentCriterion", "CriterionDimension", "LevelExpectation"}
SEMANTIC_EDGE_PRECEDENCE = {"related_to": 1, "supports": 2, "narrower_than": 3, "part_of": 4}

try:
    from pydantic import BaseModel, ConfigDict, TypeAdapter
except Exception:  # pragma: no cover - optional local validation
    BaseModel = None
    ConfigDict = None
    TypeAdapter = None

if BaseModel is not None:
    CandidateType = Literal["KnowledgeUnit", "SkillUnit", "CompetenceUnit", "TaskSubtype", "AssessmentCriterion", "CriterionDimension", "LevelExpectation"]
    SemanticEdgeType = Literal["narrower_than", "part_of", "supports", "related_to"]
    ScopeStatus = Literal["in_scope", "needs_review", "out_of_scope"]

    class ExtractedCandidate(BaseModel):
        model_config = ConfigDict(extra="forbid")

        local_id: str
        type: CandidateType
        label_et: str
        definition: str
        evidence_text: str
        source_chunk_ids: list[str]
        official_anchor_ids: list[str]
        subject_hint: str | None
        stage_hint: str | None
        grade_hint: str | None
        confidence: float
        rationale: str

    class CandidateExtractionResult(BaseModel):
        model_config = ConfigDict(extra="forbid")

        candidates: list[ExtractedCandidate]

    class MergeGroupModel(BaseModel):
        model_config = ConfigDict(extra="forbid")

        group_id: str
        canonical_type: CandidateType
        canonical_label_et: str
        canonical_definition: str
        member_candidate_ids: list[str]
        scope_status: ScopeStatus
        scope_rationale: str
        merge_rationale: str
        confidence: float

    class MergeSemanticEdgeModel(BaseModel):
        model_config = ConfigDict(extra="forbid")

        source_group_id: str
        target_group_id: str
        type: SemanticEdgeType
        rationale: str
        confidence: float

    class CandidateMergeResult(BaseModel):
        model_config = ConfigDict(extra="forbid")

        groups: list[MergeGroupModel]
        semantic_edges: list[MergeSemanticEdgeModel]


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def sha1_text(text: str, n: int = 16) -> str:
    return hashlib.sha1(text.encode("utf-8", errors="ignore")).hexdigest()[:n]


def clean_text(text: str) -> str:
    text = repair_mojibake(text)
    text = text.replace("\x00", " ")
    text = re.sub(r"-\n(?=\w)", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def repair_mojibake(text: str) -> str:
    if not text or not any(marker in text for marker in ("Ã", "Â", "â€", "â€“", "â€”")):
        return text
    candidates = [text]
    for encoding in ("cp1252", "latin1"):
        try:
            candidates.append(text.encode(encoding, errors="ignore").decode("utf-8", errors="ignore"))
        except Exception:
            pass

    def score(candidate: str) -> int:
        bad = sum(candidate.count(marker) for marker in ("Ã", "Â", "â€", "â€“", "â€”"))
        good = sum(candidate.count(ch) for ch in "õäöüÕÄÖÜšžŠŽ")
        return good * 3 - bad * 10

    return max(candidates, key=score)


def slug(text: str, max_len: int = 72) -> str:
    import unicodedata

    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    return (text[:max_len].strip("_") or "item")


def stable_id(prefix: str, label: str, context: str = "") -> str:
    return f"{prefix}:{slug(label)}:{sha1_text(label + '|' + context, 8)}"


def edge_id(source: str, edge_type: str, target: str, context: str = "") -> str:
    return "edge:" + sha1_text(f"{source}|{edge_type}|{target}|{context}", 20)


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


def write_csv(path: Path, rows: Iterable[dict[str, Any]]) -> int:
    rows = list(rows)
    fields: list[str] = []
    seen = set()
    for row in rows:
        for key in row:
            if key not in seen:
                seen.add(key)
                fields.append(key)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})
    return len(rows)


def file_sha1(path: Path) -> str:
    h = hashlib.sha1()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_manifest(run_dir: Path) -> dict[str, Any]:
    return json.loads((run_dir / "manifest.json").read_text(encoding="utf-8"))


def save_manifest(run_dir: Path, manifest: dict[str, Any]) -> None:
    run_dir.mkdir(parents=True, exist_ok=True)
    (run_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


def normalize_stage_hint(value: Any) -> str | None:
    if not value:
        return None
    text = str(value).strip()
    if not text:
        return None
    lower = text.lower()
    if "iv" in lower or "gümnaas" in lower or "gumnaas" in lower or "keskharidus" in lower or "12" in lower:
        return "IV kooliaste"
    if "iii" in lower or "põhikool" in lower or "pohikool" in lower or "9" in lower:
        return "III kooliaste"
    return text


def normalize_stage_hints(values: Iterable[Any] | None) -> list[str]:
    out = []
    for value in values or []:
        norm = normalize_stage_hint(value)
        if norm and norm not in out:
            out.append(norm)
    return out


def normalize_subject_hint(value: Any) -> str | None:
    if not value:
        return None
    text = str(value).strip()
    if not text:
        return None
    lower = text.lower()
    if "kirjandus" in lower:
        return "Kirjandus"
    if "eesti" in lower and "keel" in lower:
        return "Eesti keel"
    return text


def normalize_subject_hints(values: Iterable[Any] | None) -> list[str]:
    out = []
    for value in values or []:
        norm = normalize_subject_hint(value)
        if norm and norm not in out:
            out.append(norm)
    return out


def load_official_anchors(run_dir: Path, subject_hints: Iterable[str] | None = None, stage_hints: Iterable[str] | None = None, limit: int | None = None) -> list[dict[str, Any]]:
    manifest = load_manifest(run_dir)
    path_value = manifest.get("official_backbone_path")
    if not path_value:
        return []
    path = Path(path_value)
    if not path.exists():
        return []
    subjects = set(normalize_subject_hints(subject_hints) or manifest.get("taxonomy", {}).get("subjects", []))
    stages = set(normalize_stage_hints(stage_hints))
    anchors = []
    for row in read_jsonl(path):
        if row.get("record_type") != "learning_outcomes":
            continue
        subject = normalize_subject_hint(row.get("subject"))
        if subjects and subject not in subjects:
            continue
        row_stages = normalize_stage_hints(row.get("school_stages", []))
        if stages and row_stages and not (stages & set(row_stages)):
            continue
        anchors.append(
            {
                "id": row.get("id"),
                "label_et": row.get("label_et"),
                "subject": subject,
                "school_stages": row_stages,
                "grades": row.get("grades", []),
                "topics": [t.get("label") if isinstance(t, dict) else str(t) for t in row.get("topics", [])],
                "source_url": row.get("source_url"),
            }
        )
        if limit and len(anchors) >= limit:
            break
    return anchors


def bootstrap_test(args: argparse.Namespace) -> None:
    run_dir = Path(args.out).resolve()
    direct_inventory = ROOT / "reports" / "direct_source_inventory.csv"
    rows: list[dict[str, str]] = []
    if direct_inventory.exists():
        with direct_inventory.open("r", encoding="utf-8-sig", newline="") as f:
            rows = list(csv.DictReader(f))

    preferred_titles = [
        "Eesti keele struktuur: õpik gümnaasiumile",
        "Eesti keele käsiraamat (2020 edition)",
        "Gümnaasiumi praktilise eesti keele kursuste metoodika õpik (Practical Estonian for upper‑secondary)",
    ]
    sources = []
    for title in preferred_titles:
        match = next((row for row in rows if row.get("title") == title and row.get("raw_path")), None)
        if match and Path(match["raw_path"]).exists():
            sources.append(
                {
                    "path": match["raw_path"],
                    "title": repair_mojibake(match["title"]),
                    "source_type": match.get("source_kind") or "textbook",
                    "source_authority": "student_material" if "õpik" in repair_mojibake(match["title"]).lower() else "teacher_guidance",
                    "subject_hints": normalize_subject_hints(["Eesti keel"]),
                    "stage_hints": normalize_stage_hints([match.get("school_stage") or "IV kooliaste"]),
                    "grade_hints": [],
                    "max_pages": 35,
                }
            )
    if not sources:
        pdfs = sorted((ROOT / "data" / "raw" / "direct_sources").glob("*.pdf"), key=lambda p: p.stat().st_size, reverse=True)[:3]
        for pdf in pdfs:
            sources.append(
                {
                    "path": str(pdf),
                    "title": pdf.stem,
                    "source_type": "textbook",
                    "source_authority": "student_material",
                    "subject_hints": ["Eesti keel"],
                    "stage_hints": normalize_stage_hints(["IV kooliaste"]),
                    "grade_hints": [],
                    "max_pages": 25,
                }
            )

    manifest = {
        "run_id": run_dir.name,
        "created_at": now_iso(),
        "pipeline_version": "minimal_2026-05-22",
        "taxonomy": {
            "subjects": ["Eesti keel", "Kirjandus"],
            "domain": "Keel ja kirjandus",
            "stages": ["III kooliaste", "IV kooliaste"],
            "grades": ["9. klass", "12. klass"],
            "node_types": sorted(NODE_TYPES),
        },
        "settings": {
            "chunk_max_chars": 3500,
            "chunk_overlap_chars": 250,
            "chunks_per_llm_batch": 6,
            "max_batches": 6,
            "official_anchor_context_limit": 80,
        },
        "sources": sources,
    }
    official_backbone = ROOT / "data" / "processed" / "structured" / "v2" / "official_backbone.jsonl"
    if official_backbone.exists():
        manifest["official_backbone_path"] = str(official_backbone)
    save_manifest(run_dir, manifest)
    print(json.dumps({"run_dir": str(run_dir), "sources": len(sources)}, ensure_ascii=False, indent=2))


CURATED_MERGE_TEXTS = [
    {
        "filename": "01_fonoloogia_opikutekst.txt",
        "title": "Curated: fonoloogia õpikutekst",
        "text": """Häälikusüsteem on keele häälikute korrastatud tervik. Eesti keele häälikusüsteemi käsitlemisel eristab õpilane vokaale ja konsonante, kirjeldab häälikupikkust ja väldet ning selgitab, kuidas lühike, pikk ja ülipikk häälik võivad sõna tähendust eristada. Õppija peab suutma näite põhjal põhjendada, miks sõnas on teine või kolmas välde.""",
    },
    {
        "filename": "02_valde_harjutus.txt",
        "title": "Curated: välte harjutus",
        "text": """Välte määramise harjutuses kuulab või loeb õpilane sõnu, määrab sõna välte ning põhjendab otsust häälikupikkuse abil. Sama oskus esineb ka tekstitoimetuses: õpilane märkab, kas hääliku pikkus ja õigekiri on kooskõlas. Hindamisel vaadatakse, kas välte määramine on korrektne ja kas põhjendus kasutab sobivaid näiteid.""",
    },
    {
        "filename": "03_morfoloogia_opikutekst.txt",
        "title": "Curated: morfoloogia õpikutekst",
        "text": """Sõnaliikide süsteem aitab kirjeldada, kuidas sõnad lauses käituvad. Õpilane tunneb sõnaliike, eristab muutuvaid ja muutumatuid sõnu ning kasutab mõisteid nimisõna, tegusõna ja omadussõna. Vormiõpetuses seostab õppija sõnaliike käände, arvu ja tegusõna vormidega.""",
    },
    {
        "filename": "04_sonaliigid_tooleht.txt",
        "title": "Curated: sõnaliikide tööleht",
        "text": """Töölehel tuleb määrata tekstis sõnaliik: nimisõna, omadussõna, tegusõna või määrsõna. Õpilane põhjendab liigitust sõna tähenduse, vormi ja lausefunktsiooni järgi. Eraldi ülesanne palub eristada käändsõnu ja muutumatuid sõnu ning kasutada sõnaliikide nimetusi korrektselt.""",
    },
    {
        "filename": "05_tyypsona_kaandemall.txt",
        "title": "Curated: tüüpsõna ja käänamismall",
        "text": """Käänamismall kirjeldab, kuidas käändsõna vorme moodustatakse. Õpilane leiab tüüpsõna, võrdleb seda antud sõnaga ning kasutab tüüpsõna käänete moodustamisel. Sama oskus sõnastatakse vahel kui tüüpsõna leidmine või sobiva käänamismalli valimine.""",
    },
    {
        "filename": "06_tyypsona_hindamine.txt",
        "title": "Curated: tüüpsõna hindamine",
        "text": """Hindamiskriteerium: õpilane valib sobiva tüüpsõna, moodustab selle eeskujul õiged käändevormid ja selgitab, miks valitud käänamismall sobib. Ülesandetüüp on vormimoodustuse harjutus, kus tuleb leida tüüpsõna ja rakendada käändemalli uuele sõnale.""",
    },
]


def bootstrap_curated_merge_test(args: argparse.Namespace) -> None:
    run_dir = Path(args.out).resolve()
    source_dir = run_dir / "curated_sources"
    source_dir.mkdir(parents=True, exist_ok=True)
    sources = []
    for item in CURATED_MERGE_TEXTS:
        path = source_dir / item["filename"]
        path.write_text(item["text"].strip() + "\n", encoding="utf-8")
        sources.append(
            {
                "path": str(path),
                "title": item["title"],
                "source_type": "curated_merge_test_text",
                "source_authority": "internal_test_fixture",
                "subject_hints": ["Eesti keel"],
                "stage_hints": ["III kooliaste", "IV kooliaste"],
                "grade_hints": ["9. klass", "12. klass"],
                "max_pages": None,
            }
        )

    manifest = {
        "run_id": run_dir.name,
        "created_at": now_iso(),
        "pipeline_version": "minimal_2026-05-22",
        "test_goal": "Curated overlap test for extraction, semantic merging, hierarchy, task, and criterion links.",
        "taxonomy": {
            "subjects": ["Eesti keel", "Kirjandus"],
            "domain": "Keel ja kirjandus",
            "stages": ["III kooliaste", "IV kooliaste"],
            "grades": ["9. klass", "12. klass"],
            "node_types": sorted(NODE_TYPES),
        },
        "settings": {
            "chunk_max_chars": 1800,
            "chunk_overlap_chars": 0,
            "chunks_per_llm_batch": 3,
            "max_batches": 3,
            "official_anchor_context_limit": 40,
            "merge_block_size": 50,
            "merge_neighbor_top_k": 12,
            "merge_min_score": 0.12,
        },
        "sources": sources,
    }
    official_backbone = ROOT / "data" / "processed" / "structured" / "v2" / "official_backbone.jsonl"
    if official_backbone.exists():
        manifest["official_backbone_path"] = str(official_backbone)
    save_manifest(run_dir, manifest)
    (run_dir / "reports").mkdir(parents=True, exist_ok=True)
    (run_dir / "reports" / "curated_test_expected.md").write_text(
        "\n".join(
            [
                "# Curated Merge Test Expectations",
                "",
                "- `Häälikupikkus ja välde`, `Välde`, and `Määrab sõna välte` should not all become unrelated singletons.",
                "- `Määrab sõna välte` should remain a SkillUnit, supported by KnowledgeUnit nodes about häälikupikkus/välde.",
                "- `Sõnaliigid` should connect to narrower/part units such as `Muutuvad ja muutumatud sõnad` and task-like `Määrab tekstis sõnaliigi`.",
                "- `Tüüpsõna leidmine`, `Leiab tüüpsõna`, and `Käänamismall` should be adjudicated as related but not blindly merged.",
                "- The hindamiskriteerium in source 06 should connect to the task/skill, not form an isolated criterion island.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"run_dir": str(run_dir), "sources": len(sources)}, ensure_ascii=False, indent=2))


def bootstrap_real_slice_merge_test(args: argparse.Namespace) -> None:
    run_dir = Path(args.out).resolve()
    sources = [
        {
            "path": str(ROOT / "data" / "raw" / "direct_sources" / "bitstreams-efdce212-1812-4282-af7d-7e9dbce08688-download-3b2777fcb1.pdf"),
            "title": "Eesti keele struktuur: häälikusüsteemi real slice",
            "source_type": "upper_secondary_textbook",
            "source_authority": "student_material",
            "subject_hints": ["Eesti keel"],
            "stage_hints": ["IV kooliaste"],
            "grade_hints": ["12. klass"],
            "start_page": 25,
            "max_pages": 6,
        },
        {
            "path": str(ROOT / "data" / "raw" / "direct_sources" / "wp-content-uploads-2024-05-eestikeelekasiraamat-2020-pdf-f277d5b45f.pdf"),
            "title": "Eesti keele käsiraamat: häälikud ja välde real slice",
            "source_type": "language_reference",
            "source_authority": "teacher_guidance",
            "subject_hints": ["Eesti keel"],
            "stage_hints": ["IV kooliaste"],
            "grade_hints": ["12. klass"],
            "start_page": 48,
            "max_pages": 7,
        },
        {
            "path": str(ROOT / "data" / "raw" / "direct_sources" / "bitstreams-f17a9ee8-71d3-4a7f-b3e3-c5f7b396fd17-download-2c1eab236e.pdf"),
            "title": "Praktilise eesti keele metoodika: course/task signal slice",
            "source_type": "teacher_methodology_curriculum_signal",
            "source_authority": "teacher_guidance",
            "subject_hints": ["Eesti keel"],
            "stage_hints": ["IV kooliaste"],
            "grade_hints": ["12. klass"],
            "start_page": 20,
            "max_pages": 5,
        },
    ]
    manifest = {
        "run_id": run_dir.name,
        "created_at": now_iso(),
        "pipeline_version": "minimal_2026-05-22",
        "test_goal": "Small real-corpus extraction plus blocked merge test. Focus is merge/KG behavior, not broad extraction coverage.",
        "taxonomy": {
            "subjects": ["Eesti keel", "Kirjandus"],
            "domain": "Keel ja kirjandus",
            "stages": ["III kooliaste", "IV kooliaste"],
            "grades": ["9. klass", "12. klass"],
            "node_types": sorted(NODE_TYPES),
        },
        "settings": {
            "chunk_max_chars": 2600,
            "chunk_overlap_chars": 150,
            "chunks_per_llm_batch": 3,
            "max_batches": 3,
            "interleave_sources": True,
            "official_anchor_context_limit": 50,
            "merge_block_size": 60,
            "merge_neighbor_top_k": 16,
            "merge_min_score": 0.1,
        },
        "sources": sources,
    }
    official_backbone = ROOT / "data" / "processed" / "structured" / "v2" / "official_backbone.jsonl"
    if official_backbone.exists():
        manifest["official_backbone_path"] = str(official_backbone)
    save_manifest(run_dir, manifest)
    (run_dir / "reports").mkdir(parents=True, exist_ok=True)
    (run_dir / "reports" / "real_slice_test_scope.md").write_text(
        "\n".join(
            [
                "# Real Slice Merge Test Scope",
                "",
                "This run intentionally uses small page windows from real downloaded sources.",
                "",
                "- `Eesti keele struktuur`, pages 25-30: häälikusüsteem / vokaalid / konsonandid.",
                "- `Eesti keele käsiraamat`, pages 48-54: häälikud, foneemid, silbitamine, rõhk/välde area.",
                "- `Praktilise eesti keele kursuste metoodika`, pages 20-24: course/task/curriculum signal slice.",
                "",
                "The point is to test API-based extraction plus LLM merge and KG wiring on real text without whole-book token burn.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"run_dir": str(run_dir), "sources": len(sources)}, ensure_ascii=False, indent=2))


SYNTHETIC_MERGE_CANDIDATES = [
    {
        "local_id": "synthetic_01",
        "type": "SkillUnit",
        "label_et": "Kirjutab päevakajalisele tekstile kommentaari",
        "definition": "Õpilane kirjutab päevakajalise teksti kohta sidusa kommentaari, milles väljendab ja põhjendab oma seisukohta.",
        "evidence_text": "Ülesandes kirjutab õpilane päevakajalisele artiklile kommentaari ning põhjendab oma arvamust tekstinäidete abil.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.93,
        "rationale": "Synthetic clear language-skill unit.",
    },
    {
        "local_id": "synthetic_02",
        "type": "SkillUnit",
        "label_et": "Kirjutab päevakajalisele tekstile kommentaari",
        "definition": "Õpilane koostab päevakajalise teksti põhjal kommentaari, esitab arvamuse ja toetab seda põhjendustega.",
        "evidence_text": "Kirjuta kommentaar päevakajalisele tekstile. Too välja seisukoht ning põhjenda seda.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.95,
        "rationale": "Synthetic exact duplicate label with same skill.",
    },
    {
        "local_id": "synthetic_03",
        "type": "SkillUnit",
        "label_et": "Kommenteerib kirjalikult päevakajalist teksti",
        "definition": "Õpilane reageerib kirjalikult päevakajalisele tekstile, sõnastab seisukoha ja põhjendab seda.",
        "evidence_text": "Õpilane kommenteerib kirjalikult päevakajalist teksti, sidudes arvamuse teksti sisuga.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.9,
        "rationale": "Synthetic semantic duplicate of comment-writing skill.",
    },
    {
        "local_id": "synthetic_04",
        "type": "SkillUnit",
        "label_et": "Põhjendab tekstikommentaaris oma seisukohta",
        "definition": "Õpilane esitab tekstikommentaaris väite ja toetab seda põhjenduse või näitega.",
        "evidence_text": "Kommentaari hindamisel vaadatakse, kas seisukoht on põhjendatud ning seotud kommenteeritava tekstiga.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.92,
        "rationale": "Synthetic component skill, should support/part_of comment writing, not merge blindly.",
    },
    {
        "local_id": "synthetic_05",
        "type": "KnowledgeUnit",
        "label_et": "Tekstikommentaari ülesehitus",
        "definition": "Õpilane tunneb tekstikommentaari ülesehitust: seisukoht, põhjendus, näide ja kokkuvõttev järeldus.",
        "evidence_text": "Kommentaaris on seisukoht, põhjendus, näide ja kokkuvõttev järeldus.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.9,
        "rationale": "Synthetic knowledge unit.",
    },
    {
        "local_id": "synthetic_06",
        "type": "KnowledgeUnit",
        "label_et": "Kommentaari struktuur",
        "definition": "Õpilane teab, et kommentaar sisaldab arvamust, põhjendust ja vajaduse korral näidet.",
        "evidence_text": "Kommentaari struktuur koosneb arvamusest, põhjendusest ja näitest.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.88,
        "rationale": "Synthetic semantic duplicate of text-comment structure.",
    },
    {
        "local_id": "synthetic_07",
        "type": "TaskSubtype",
        "label_et": "Päevakajalise teksti kommentaari kirjutamine",
        "definition": "Ülesandetüüp, kus õpilane kirjutab päevakajalisele tekstile kommentaari.",
        "evidence_text": "Ülesandetüüp: päevakajalise teksti kommentaari kirjutamine.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.9,
        "rationale": "Synthetic task subtype.",
    },
    {
        "local_id": "synthetic_08",
        "type": "AssessmentCriterion",
        "label_et": "Kommentaar sisaldab põhjendatud seisukohta",
        "definition": "Hindamiskriteerium: kommentaaris on selge seisukoht ja see on põhjendatud.",
        "evidence_text": "Hindamisel arvestatakse, kas kommentaar sisaldab põhjendatud seisukohta.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.9,
        "rationale": "Synthetic criterion that should link to comment-writing and justification skill.",
    },
    {
        "local_id": "synthetic_09",
        "type": "SkillUnit",
        "label_et": "Kirjutab uudise",
        "definition": "Õpilane kirjutab uudise, järgides uudise ülesehitust ja neutraalset stiili.",
        "evidence_text": "Kirjuta uudis, millel on pealkiri, juhtlõik ja olulised faktid.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.88,
        "rationale": "Synthetic related but distinct genre-writing skill.",
    },
    {
        "local_id": "synthetic_10",
        "type": "SkillUnit",
        "label_et": "Analüüsib uudise ülesehitust",
        "definition": "Õpilane analüüsib uudise pealkirja, juhtlõiku, faktivalikut ja ülesehitust.",
        "evidence_text": "Analüüsi uudise pealkirja, juhtlõiku ja faktide järjestust.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.87,
        "rationale": "Synthetic related but distinct reading/analysis skill.",
    },
    {
        "local_id": "synthetic_11",
        "type": "KnowledgeUnit",
        "label_et": "Fotosüntees",
        "definition": "Õpilane teab, kuidas taimed kasutavad valgust, vett ja süsihappegaasi glükoosi tootmiseks.",
        "evidence_text": "Fotosünteesis kasutab taim valgusenergiat, vett ja süsihappegaasi ning toodab glükoosi ja hapnikku.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.91,
        "rationale": "Synthetic biology content with misleading subject hint; should be out of scope.",
    },
    {
        "local_id": "synthetic_12",
        "type": "SkillUnit",
        "label_et": "Selgitab fotosünteesi protsessi",
        "definition": "Õpilane selgitab fotosünteesi etappe ja kirjeldab lähteaineid ning saadusi.",
        "evidence_text": "Selgita fotosünteesi protsessi ning nimeta selle lähteained ja saadused.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.88,
        "rationale": "Synthetic biology skill with misleading subject hint; should be out of scope, not treated as generic explaining.",
    },
    {
        "local_id": "synthetic_13",
        "type": "SkillUnit",
        "label_et": "Määrab taimeraku organellid",
        "definition": "Õpilane määrab joonisel taimeraku organellid ja kirjeldab nende ülesandeid.",
        "evidence_text": "Määra joonisel taimeraku organellid: tuum, kloroplast, rakukest ja vakuool.",
        "subject_hint": "Bioloogia",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.9,
        "rationale": "Synthetic metadata-out-of-scope biology unit.",
    },
    {
        "local_id": "synthetic_14",
        "type": "SkillUnit",
        "label_et": "Kirjutab lühiselgituse loodusteadusliku nähtuse kohta",
        "definition": "Õpilane kirjutab selge lühiselgituse, milles tutvustab nähtust, kasutab mõisteid arusaadavalt ja seob laused loogiliselt.",
        "evidence_text": "Kirjuta lühiselgitus valitud nähtuse kohta. Hinnatakse teksti selgust, mõistete arusaadavat kasutust ja lausete loogilist seost.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.86,
        "rationale": "Synthetic cross-subject literacy skill; should remain in scope as writing/explanation skill.",
    },
    {
        "local_id": "synthetic_15",
        "type": "KnowledgeUnit",
        "label_et": "Selgitava teksti ülesehitus",
        "definition": "Õpilane tunneb selgitava teksti ülesehitust: nähtuse nimetamine, oluliste tunnuste esitamine ja loogiline järjestus.",
        "evidence_text": "Selgitav tekst nimetab nähtuse, esitab olulised tunnused ning järjestab info loogiliselt.",
        "subject_hint": "Eesti keel",
        "stage_hint": "III kooliaste",
        "grade_hint": "9. klass",
        "confidence": 0.88,
        "rationale": "Synthetic in-scope knowledge unit supporting explanatory writing.",
    },
]


def bootstrap_synthetic_merge_stress_test(args: argparse.Namespace) -> None:
    run_dir = Path(args.out).resolve()
    run_dir.mkdir(parents=True, exist_ok=True)
    chunks = []
    candidates = []
    for idx, item in enumerate(SYNTHETIC_MERGE_CANDIDATES, start=1):
        chunk_id = f"synthetic_chunk:{idx:02d}"
        chunks.append(
            {
                "chunk_id": chunk_id,
                "source_id": "source:synthetic_merge_stress",
                "source_title": "Synthetic adversarial merge stress candidates",
                "source_authority": "internal_test_fixture",
                "source_type": "synthetic_structured_candidate_fixture",
                "page_start": idx,
                "page_end": idx,
                "text": item["evidence_text"],
                "char_count": len(item["evidence_text"]),
                "subject_hints": [item["subject_hint"]],
                "stage_hints": [item["stage_hint"]],
                "grade_hints": [item["grade_hint"]],
            }
        )
        candidate = dict(item)
        candidate["candidate_id"] = "candidate:synthetic:" + sha1_text(item["local_id"] + "|" + item["label_et"], 12)
        candidate["run_id"] = run_dir.name
        candidate["batch_no"] = 0
        candidate["method"] = "synthetic_structured_candidate_fixture"
        candidate["model"] = None
        candidate["created_at"] = now_iso()
        candidate["status"] = "candidate"
        candidate["source_chunk_ids"] = [chunk_id]
        candidate["official_anchor_ids"] = []
        candidates.append(candidate)
    manifest = {
        "run_id": run_dir.name,
        "created_at": now_iso(),
        "pipeline_version": "minimal_2026-05-22",
        "test_goal": "Adversarial merge-only test: exact duplicates, semantic duplicates, related-but-distinct language units, cross-subject literacy, and out-of-scope biology noise.",
        "taxonomy": {
            "subjects": ["Eesti keel", "Kirjandus"],
            "domain": "Keel ja kirjandus",
            "stages": ["III kooliaste", "IV kooliaste"],
            "grades": ["9. klass", "12. klass"],
            "node_types": sorted(NODE_TYPES),
        },
        "settings": {
            "force_single_merge_block": True,
            "merge_block_size": 80,
            "merge_neighbor_top_k": 40,
            "merge_min_score": 0.0,
            "max_merge_iterations": 3,
            "max_merge_llm_calls": 4,
            "max_merge_total_tokens": 60000,
            "min_merge_rate": 0.01,
        },
        "sources": [],
    }
    official_backbone = ROOT / "data" / "processed" / "structured" / "v2" / "official_backbone.jsonl"
    if official_backbone.exists():
        manifest["official_backbone_path"] = str(official_backbone)
    save_manifest(run_dir, manifest)
    write_jsonl(run_dir / "chunks.jsonl", chunks)
    write_jsonl(run_dir / "candidates.jsonl", candidates)
    (run_dir / "reports").mkdir(parents=True, exist_ok=True)
    (run_dir / "reports" / "synthetic_merge_expected.md").write_text(
        "\n".join(
            [
                "# Synthetic Merge Stress Expectations",
                "",
                "- Exact and semantic duplicates of `Kirjutab päevakajalisele tekstile kommentaari` should merge.",
                "- `Tekstikommentaari ülesehitus` and `Kommentaari struktuur` should merge or be treated as the same knowledge unit.",
                "- `Kirjutab uudise` and `Analüüsib uudise ülesehitust` should remain separate.",
                "- Biology content (`Fotosüntees`, `Selgitab fotosünteesi protsessi`, `Määrab taimeraku organellid`) should be excluded or quarantined, not connected into the Estonian language KG.",
                "- `Kirjutab lühiselgituse loodusteadusliku nähtuse kohta` should remain in scope as a literacy/writing skill, despite using science content.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"run_dir": str(run_dir), "synthetic_candidates": len(candidates)}, ensure_ascii=False, indent=2))


def inventory(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    manifest = load_manifest(run_dir)
    rows = []
    for source in manifest["sources"]:
        path = Path(source["path"]).resolve()
        status = "ok" if path.exists() else "missing"
        checksum = file_sha1(path) if path.exists() else None
        rows.append(
            {
                "source_id": "source:" + sha1_text(str(path) + "|" + str(checksum), 16),
                "run_id": manifest["run_id"],
                "path": str(path),
                "title": source.get("title") or path.stem,
                "source_type": source.get("source_type") or "unknown",
                "source_authority": source.get("source_authority") or "unknown",
                "subject_hints": normalize_subject_hints(source.get("subject_hints", [])),
                "stage_hints": normalize_stage_hints(source.get("stage_hints", [])),
                "grade_hints": source.get("grade_hints", []),
                "start_page": source.get("start_page"),
                "max_pages": source.get("max_pages"),
                "checksum": checksum,
                "status": status,
                "created_at": now_iso(),
            }
        )
    write_jsonl(run_dir / "inventory.jsonl", rows)
    print(json.dumps({"inventory": len(rows), "ok": sum(1 for row in rows if row["status"] == "ok")}, ensure_ascii=False, indent=2))


def extract_pdf_pages(path: Path, max_pages: int | None = None, start_page: int | None = None) -> list[dict[str, Any]]:
    start_page = max(1, int(start_page or 1))
    try:
        import pdfplumber

        pages = []
        with pdfplumber.open(str(path)) as pdf:
            page_count = len(pdf.pages)
            start_idx = min(page_count, start_page - 1)
            end_idx = min(page_count, start_idx + (max_pages or page_count))
            for i in range(start_idx, end_idx):
                text = pdf.pages[i].extract_text() or ""
                text = clean_text(text)
                if text:
                    pages.append({"page": i + 1, "text": text})
        if pages:
            return pages
    except Exception:
        pass

    try:
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        start_idx = min(len(reader.pages), start_page - 1)
        limit = min(len(reader.pages), start_idx + (max_pages or len(reader.pages)))
        pages = []
        for i in range(start_idx, limit):
            text = reader.pages[i].extract_text() or ""
            text = clean_text(text)
            if text:
                pages.append({"page": i + 1, "text": text})
        if pages:
            return pages
    except Exception:
        pass

    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / "out.txt"
        cmd = ["pdftotext", "-layout"]
        cmd.extend(["-f", str(start_page)])
        if max_pages:
            cmd.extend(["-l", str(start_page + max_pages - 1)])
        cmd.extend([str(path), str(out)])
        subprocess.run(cmd, check=True, capture_output=True)
        text = clean_text(out.read_text(encoding="utf-8", errors="ignore"))
        return [{"page": start_page, "text": text}] if text else []


def extract_text_pages(path: Path, max_pages: int | None = None, start_page: int | None = None) -> list[dict[str, Any]]:
    text = None
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin1"):
        try:
            text = path.read_text(encoding=encoding)
            break
        except UnicodeDecodeError:
            continue
    if text is None:
        text = path.read_text(encoding="utf-8", errors="ignore")
    sections = [clean_text(section) for section in re.split(r"\f|\n\s*---+\s*\n", text)]
    pages = [{"page": i + 1, "text": section} for i, section in enumerate(sections) if section]
    if start_page and start_page > 1:
        pages = pages[start_page - 1 :]
    if max_pages:
        pages = pages[:max_pages]
    return pages


def extract_source_pages(path: Path, max_pages: int | None = None, start_page: int | None = None) -> list[dict[str, Any]]:
    if path.suffix.lower() == ".pdf":
        return extract_pdf_pages(path, max_pages, start_page=start_page)
    return extract_text_pages(path, max_pages, start_page=start_page)


def chunk_text(text: str, max_chars: int, overlap: int) -> list[str]:
    text = clean_text(text)
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        if end < len(text):
            boundary = max(text.rfind(". ", start, end), text.rfind("\n", start, end))
            if boundary > start + int(max_chars * 0.55):
                end = boundary + 1
        chunk = text[start:end].strip()
        if len(chunk) > 200:
            chunks.append(chunk)
        if end >= len(text):
            break
        start = max(0, end - overlap)
    return chunks


def prepare(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    manifest = load_manifest(run_dir)
    inv = read_jsonl(run_dir / "inventory.jsonl")
    if not inv:
        inventory(args)
        inv = read_jsonl(run_dir / "inventory.jsonl")
    settings = manifest.get("settings", {})
    max_chars = int(settings.get("chunk_max_chars", 3500))
    overlap = int(settings.get("chunk_overlap_chars", 250))
    chunks = []
    text_dir = run_dir / "texts"
    text_dir.mkdir(parents=True, exist_ok=True)
    for row in inv:
        if row["status"] != "ok":
            continue
        path = Path(row["path"])
        pages = extract_source_pages(path, row.get("max_pages"), start_page=row.get("start_page"))
        full_text = "\n\n".join(f"[page {page['page']}]\n{page['text']}" for page in pages)
        (text_dir / f"{row['source_id'].replace(':', '_')}.txt").write_text(full_text, encoding="utf-8")
        for page in pages:
            for idx, chunk in enumerate(chunk_text(page["text"], max_chars=max_chars, overlap=overlap), start=1):
                chunk_id = "chunk:" + sha1_text(f"{row['source_id']}|{page['page']}|{idx}|{chunk}", 20)
                chunks.append(
                    {
                        "chunk_id": chunk_id,
                        "source_id": row["source_id"],
                        "source_title": row["title"],
                        "source_authority": row["source_authority"],
                        "source_type": row["source_type"],
                        "page_start": page["page"],
                        "page_end": page["page"],
                        "text": chunk,
                        "char_count": len(chunk),
                        "subject_hints": normalize_subject_hints(row.get("subject_hints", [])),
                        "stage_hints": normalize_stage_hints(row.get("stage_hints", [])),
                        "grade_hints": row.get("grade_hints", []),
                    }
                )
    write_jsonl(run_dir / "chunks.jsonl", chunks)
    print(json.dumps({"chunks": len(chunks), "sources": len(inv)}, ensure_ascii=False, indent=2))


def extraction_schema() -> dict[str, Any]:
    candidate = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "local_id": {"type": "string"},
            "type": {"type": "string", "enum": sorted(UNIT_TYPES | TASK_CRITERION_TYPES)},
            "label_et": {"type": "string"},
            "definition": {"type": "string"},
            "evidence_text": {"type": "string"},
            "source_chunk_ids": {"type": "array", "items": {"type": "string"}},
            "official_anchor_ids": {"type": "array", "items": {"type": "string"}},
            "subject_hint": {"type": ["string", "null"]},
            "stage_hint": {"type": ["string", "null"]},
            "grade_hint": {"type": ["string", "null"]},
            "confidence": {"type": "number"},
            "rationale": {"type": "string"},
        },
        "required": ["local_id", "type", "label_et", "definition", "evidence_text", "source_chunk_ids", "official_anchor_ids", "subject_hint", "stage_hint", "grade_hint", "confidence", "rationale"],
    }
    return {
        "name": "minimal_candidate_extraction",
        "schema": {
            "type": "object",
            "additionalProperties": False,
            "properties": {"candidates": {"type": "array", "items": candidate}},
            "required": ["candidates"],
        },
        "strict": True,
    }


def merge_schema() -> dict[str, Any]:
    group = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "group_id": {"type": "string"},
            "canonical_type": {"type": "string", "enum": sorted(UNIT_TYPES | TASK_CRITERION_TYPES)},
            "canonical_label_et": {"type": "string"},
            "canonical_definition": {"type": "string"},
            "member_candidate_ids": {"type": "array", "items": {"type": "string"}},
            "scope_status": {"type": "string", "enum": ["in_scope", "needs_review", "out_of_scope"]},
            "scope_rationale": {"type": "string"},
            "merge_rationale": {"type": "string"},
            "confidence": {"type": "number"},
        },
        "required": ["group_id", "canonical_type", "canonical_label_et", "canonical_definition", "member_candidate_ids", "scope_status", "scope_rationale", "merge_rationale", "confidence"],
    }
    semantic_edge = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "source_group_id": {"type": "string"},
            "target_group_id": {"type": "string"},
            "type": {"type": "string", "enum": ["narrower_than", "part_of", "supports", "related_to"]},
            "rationale": {"type": "string"},
            "confidence": {"type": "number"},
        },
        "required": ["source_group_id", "target_group_id", "type", "rationale", "confidence"],
    }
    return {
        "name": "minimal_candidate_merge",
        "schema": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "groups": {"type": "array", "items": group},
                "semantic_edges": {"type": "array", "items": semantic_edge},
            },
            "required": ["groups", "semantic_edges"],
        },
        "strict": True,
    }


def prompt_text(name: str) -> str:
    return (PIPELINE_ROOT / "prompts" / name).read_text(encoding="utf-8")


def validate_structured_output(task_type: str, parsed: dict[str, Any]) -> dict[str, Any]:
    if BaseModel is None:
        return parsed
    if task_type == "candidate_extraction":
        return CandidateExtractionResult.model_validate(parsed).model_dump()
    if task_type == "candidate_merge":
        return CandidateMergeResult.model_validate(parsed).model_dump()
    return parsed


def call_responses_api(task_type: str, model: str, payload: dict[str, Any], schema: dict[str, Any], run_dir: Path, reasoning_effort: str = "none") -> dict[str, Any]:
    from openai import OpenAI

    client = OpenAI()
    prompt_name = {
        "candidate_extraction": "candidate_extraction.md",
        "candidate_merge": "merge_adjudication.md",
    }.get(task_type, "canonicalize_minimal.md")
    prompt = prompt_text(prompt_name)
    request = {
        "task_type": task_type,
        "model": model,
        "payload": payload,
        "prompt_version": prompt.splitlines()[1] if len(prompt.splitlines()) > 1 else "",
        "created_at": now_iso(),
    }
    request_id = "request:" + sha1_text(json.dumps(request, ensure_ascii=False, sort_keys=True), 20)
    request["request_id"] = request_id
    append_jsonl(run_dir / "llm_requests.jsonl", [request])
    api_kwargs = {
        "model": model,
        "instructions": prompt,
        "input": json.dumps(payload, ensure_ascii=False),
        "text": {"format": {"type": "json_schema", **schema}},
        "temperature": 0,
    }
    if reasoning_effort and reasoning_effort != "omit":
        api_kwargs["reasoning"] = {"effort": reasoning_effort}
    response = client.responses.create(**api_kwargs)
    raw_text = response.output_text
    parsed = json.loads(raw_text)
    parsed = validate_structured_output(task_type, parsed)
    append_jsonl(
        run_dir / "llm_responses.jsonl",
        [
            {
                "request_id": request_id,
                "task_type": task_type,
                "model": model,
                "raw_text": raw_text,
                "parsed": parsed,
                "usage": getattr(response, "usage", None).model_dump() if getattr(response, "usage", None) else None,
                "created_at": now_iso(),
            }
        ],
    )
    return parsed


def make_batches(chunks: list[dict[str, Any]], chunks_per_batch: int, max_batches: int | None) -> list[list[dict[str, Any]]]:
    batches = [chunks[i : i + chunks_per_batch] for i in range(0, len(chunks), chunks_per_batch)]
    if max_batches:
        batches = batches[:max_batches]
    return batches


def interleave_chunks_by_source(chunks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[str, deque[dict[str, Any]]] = defaultdict(deque)
    source_order = []
    for chunk in chunks:
        source_id = chunk.get("source_id") or "unknown"
        if source_id not in grouped:
            source_order.append(source_id)
        grouped[source_id].append(chunk)
    out = []
    while any(grouped[source_id] for source_id in source_order):
        for source_id in source_order:
            if grouped[source_id]:
                out.append(grouped[source_id].popleft())
    return out


def dry_run_candidates(batch: list[dict[str, Any]], batch_no: int) -> list[dict[str, Any]]:
    patterns = [
        ("kirjut", "SkillUnit", "Kirjutab sidusat teksti", "Learner writes coherent text with appropriate structure."),
        ("analüü", "SkillUnit", "Analüüsib teksti", "Learner analyzes a text, source, or example."),
        ("põhjend", "SkillUnit", "Põhjendab väidet", "Learner supports a claim or position with reasons or examples."),
        ("kokkuvõ", "SkillUnit", "Koostab kokkuvõtte", "Learner summarizes relevant content accurately."),
        ("õigekir", "KnowledgeUnit", "Õigekirjareeglid", "Learner knows spelling and orthography rules."),
        ("mõiste", "KnowledgeUnit", "Kasutab ainealaseid mõisteid", "Learner knows and uses subject terminology."),
    ]
    out = []
    for chunk in batch:
        lower = chunk["text"].lower()
        for needle, typ, label, definition in patterns:
            if needle in lower:
                out.append(
                    {
                        "local_id": f"dry_{batch_no}_{len(out)+1}",
                        "type": typ,
                        "label_et": label,
                        "definition": definition,
                        "evidence_text": chunk["text"][:500],
                        "source_chunk_ids": [chunk["chunk_id"]],
                        "official_anchor_ids": [],
                        "subject_hint": normalize_subject_hint((chunk.get("subject_hints") or [None])[0]),
                        "stage_hint": normalize_stage_hint((chunk.get("stage_hints") or [None])[0]),
                        "grade_hint": (chunk.get("grade_hints") or [None])[0],
                        "confidence": 0.35,
                        "rationale": "Dry-run heuristic placeholder; replace with API extraction.",
                    }
                )
        if len(out) >= 8:
            break
    return out


def extract(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    manifest = load_manifest(run_dir)
    chunks = read_jsonl(run_dir / "chunks.jsonl")
    if not chunks:
        prepare(args)
        chunks = read_jsonl(run_dir / "chunks.jsonl")
    settings = manifest.get("settings", {})
    if settings.get("interleave_sources"):
        chunks = interleave_chunks_by_source(chunks)
    max_batches = args.max_batches if getattr(args, "max_batches", None) is not None else int(settings.get("max_batches", 6))
    batches = make_batches(chunks, int(settings.get("chunks_per_llm_batch", 6)), max_batches)
    all_candidates = []
    for batch_no, batch in enumerate(batches, start=1):
        batch_subjects = sorted({s for row in batch for s in normalize_subject_hints(row.get("subject_hints", []))})
        batch_stages = sorted({s for row in batch for s in normalize_stage_hints(row.get("stage_hints", []))})
        official_context = load_official_anchors(
            run_dir,
            subject_hints=batch_subjects,
            stage_hints=batch_stages,
            limit=int(settings.get("official_anchor_context_limit", 80)),
        )
        payload = {
            "run_id": manifest["run_id"],
            "taxonomy": manifest["taxonomy"],
            "batch_no": batch_no,
            "official_learning_outcome_context": official_context,
            "chunks": [
                {
                    "chunk_id": row["chunk_id"],
                    "source_title": row["source_title"],
                    "source_authority": row["source_authority"],
                    "source_type": row["source_type"],
                    "page": row["page_start"],
                    "subject_hints": normalize_subject_hints(row.get("subject_hints", [])),
                    "stage_hints": normalize_stage_hints(row.get("stage_hints", [])),
                    "grade_hints": row.get("grade_hints", []),
                    "text": row["text"],
                }
                for row in batch
            ],
        }
        if args.dry_run:
            candidates = dry_run_candidates(batch, batch_no)
        else:
            parsed = call_responses_api("candidate_extraction", args.model, payload, extraction_schema(), run_dir, args.reasoning_effort)
            candidates = parsed.get("candidates", [])
        for i, cand in enumerate(candidates, start=1):
            evidence_key = "|".join(cand.get("source_chunk_ids") or []) + cand.get("label_et", "")
            cand["candidate_id"] = "candidate:" + sha1_text(f"{manifest['run_id']}|{batch_no}|{i}|{evidence_key}", 20)
            cand["run_id"] = manifest["run_id"]
            cand["batch_no"] = batch_no
            cand["method"] = "dry_run_heuristic" if args.dry_run else "responses_api_candidate_extraction"
            cand["model"] = None if args.dry_run else args.model
            cand["created_at"] = now_iso()
            cand["status"] = "candidate"
            cand["subject_hint"] = normalize_subject_hint(cand.get("subject_hint"))
            cand["stage_hint"] = normalize_stage_hint(cand.get("stage_hint"))
            cand["official_anchor_ids"] = [aid for aid in cand.get("official_anchor_ids", []) if isinstance(aid, str)]
            all_candidates.append(cand)
    write_jsonl(run_dir / "candidates.jsonl", all_candidates)
    print(json.dumps({"batches": len(batches), "candidates": len(all_candidates), "dry_run": args.dry_run}, ensure_ascii=False, indent=2))


def normalize_label(label: str) -> str:
    label = label.lower().strip()
    label = re.sub(r"\s+", " ", label)
    label = label.rstrip(".")
    return label


STOPWORDS_ET = {
    "ning",
    "või",
    "voi",
    "kui",
    "mis",
    "kus",
    "see",
    "seda",
    "selle",
    "tema",
    "õpilane",
    "opilane",
    "õppija",
    "oppija",
    "kasutab",
    "teab",
    "tunneb",
    "oskab",
    "selgitab",
    "kirjeldab",
    "eristab",
    "määrab",
    "maarab",
    "leiab",
    "mõistab",
    "moistab",
    "teema",
    "üksus",
    "uksus",
}


def block_tokens(text: str) -> set[str]:
    text = normalize_label(repair_mojibake(text or ""))
    tokens = re.findall(r"[a-zA-ZõäöüšžÕÄÖÜŠŽ]{3,}", text)
    return {t for t in tokens if t not in STOPWORDS_ET}


def candidate_tokens(candidate: dict[str, Any]) -> set[str]:
    return block_tokens(" ".join([str(candidate.get("label_et") or ""), str(candidate.get("definition") or ""), str(candidate.get("rationale") or "")]))


def candidate_pair_score(a: dict[str, Any], b: dict[str, Any], tokens_by_id: dict[str, set[str]]) -> float:
    if a.get("type") != b.get("type"):
        pair = {a.get("type"), b.get("type")}
        compatible = (
            pair <= {"KnowledgeUnit", "SkillUnit", "CompetenceUnit"}
            or bool(pair & {"TaskSubtype", "AssessmentCriterion", "CriterionDimension", "LevelExpectation"})
            and bool(pair & {"KnowledgeUnit", "SkillUnit", "CompetenceUnit", "TaskSubtype", "AssessmentCriterion", "CriterionDimension", "LevelExpectation"})
        )
        if not compatible:
            return 0.0
    score = 0.0
    ta = tokens_by_id.get(a["candidate_id"], set())
    tb = tokens_by_id.get(b["candidate_id"], set())
    if ta or tb:
        score += len(ta & tb) / max(1, len(ta | tb))
    anchors_a = set(a.get("official_anchor_ids", []))
    anchors_b = set(b.get("official_anchor_ids", []))
    if anchors_a and anchors_b:
        score += 0.35 * (len(anchors_a & anchors_b) / max(1, len(anchors_a | anchors_b)))
    if a.get("type") == b.get("type"):
        score += 0.15
    if a.get("subject_hint") and a.get("subject_hint") == b.get("subject_hint"):
        score += 0.05
    if a.get("stage_hint") and a.get("stage_hint") == b.get("stage_hint"):
        score += 0.03
    return score


def build_merge_blocks(candidates: list[dict[str, Any]], max_block_size: int = 60, neighbor_top_k: int = 12, min_score: float = 0.12) -> list[dict[str, Any]]:
    valid = [c for c in candidates if c.get("candidate_id") and c.get("type") in UNIT_TYPES | TASK_CRITERION_TYPES]
    by_id = {c["candidate_id"]: c for c in valid}
    tokens_by_id = {cid: candidate_tokens(c) for cid, c in by_id.items()}
    inverted: dict[str, set[str]] = defaultdict(set)
    anchor_index: dict[str, set[str]] = defaultdict(set)
    for c in valid:
        cid = c["candidate_id"]
        for token in tokens_by_id[cid]:
            inverted[token].add(cid)
        for aid in c.get("official_anchor_ids", []):
            anchor_index[aid].add(cid)

    neighbors: dict[str, dict[str, float]] = {c["candidate_id"]: {} for c in valid}
    for c in valid:
        cid = c["candidate_id"]
        candidate_neighbor_ids = set()
        for token in tokens_by_id[cid]:
            candidate_neighbor_ids.update(inverted.get(token, set()))
        for aid in c.get("official_anchor_ids", []):
            candidate_neighbor_ids.update(anchor_index.get(aid, set()))
        candidate_neighbor_ids.discard(cid)
        scored = []
        for nid in candidate_neighbor_ids:
            score = candidate_pair_score(c, by_id[nid], tokens_by_id)
            if score >= min_score:
                scored.append((score, nid))
        for score, nid in sorted(scored, reverse=True)[:neighbor_top_k]:
            neighbors[cid][nid] = score
            neighbors[nid][cid] = max(neighbors[nid].get(cid, 0.0), score)

    visited = set()
    components = []
    for cid in by_id:
        if cid in visited:
            continue
        queue = deque([cid])
        visited.add(cid)
        component = []
        while queue:
            cur = queue.popleft()
            component.append(cur)
            for nxt in neighbors[cur]:
                if nxt not in visited:
                    visited.add(nxt)
                    queue.append(nxt)
        components.append(component)

    blocks = []
    for component_no, component in enumerate(sorted(components, key=lambda x: (-len(x), x[0])), start=1):
        component = sorted(component, key=lambda cid: (by_id[cid].get("type", ""), normalize_label(by_id[cid].get("label_et", "")), cid))
        for part_no, start in enumerate(range(0, len(component), max_block_size), start=1):
            ids = component[start : start + max_block_size]
            block_id = f"merge_block_{component_no:03d}_{part_no:02d}"
            blocks.append(
                {
                    "block_id": block_id,
                    "candidate_ids": ids,
                    "size": len(ids),
                    "method": "token_anchor_type_blocking_for_llm_adjudication",
                    "note": "Blocking is only retrieval/queueing. The LLM makes all merge and hierarchy decisions.",
                }
            )
    return blocks


def canonicalize(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    candidates = read_jsonl(run_dir / "candidates.jsonl")
    groups: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    for cand in candidates:
        typ = cand.get("type")
        if typ not in UNIT_TYPES | TASK_CRITERION_TYPES:
            continue
        label = normalize_label(cand.get("label_et") or "")
        if len(label) < 3:
            continue
        groups[(typ, label)].append(cand)
    canonical_nodes = []
    canonical_edges = []
    for (typ, norm_label), members in sorted(groups.items()):
        label = members[0]["label_et"].strip()
        canonical_id = stable_id(typ.lower(), label, typ)
        subjects = sorted({m.get("subject_hint") for m in members if m.get("subject_hint")})
        stages = sorted({m.get("stage_hint") for m in members if m.get("stage_hint")})
        grades = sorted({m.get("grade_hint") for m in members if m.get("grade_hint")})
        evidence_chunks = sorted({cid for m in members for cid in m.get("source_chunk_ids", [])})
        official_anchor_ids = sorted({aid for m in members for aid in m.get("official_anchor_ids", []) if aid})
        canonical_nodes.append(
            {
                "id": canonical_id,
                "type": typ,
                "label_et": label,
                "description": members[0].get("definition"),
                "aliases": sorted({m["label_et"] for m in members}),
                "subjects_seen": subjects,
                "stages_seen": stages,
                "grades_seen": grades,
                "member_candidate_ids": [m["candidate_id"] for m in members],
                "evidence_chunk_ids": evidence_chunks,
                "official_anchor_ids": official_anchor_ids,
                "confidence": round(sum(float(m.get("confidence", 0.5)) for m in members) / len(members), 3),
                "status": "canonical_candidate",
                "method": "minimal_exact_label_canonicalization",
                "graph_version": GRAPH_VERSION,
                "schema_version": SCHEMA_VERSION,
                "kg_layer": "curriculum_content" if typ in UNIT_TYPES else "assessment_task",
                "default_view": True,
                "provenance_mode": "metadata",
            }
        )
        for m in members:
            canonical_edges.append(
                {
                    "id": edge_id(m["candidate_id"], "same_as", canonical_id),
                    "source": m["candidate_id"],
                    "target": canonical_id,
                    "type": "same_as",
                    "confidence": 0.7,
                    "method": "minimal_exact_label_canonicalization",
                    "candidate_id": m["candidate_id"],
                    "kg_layer": "canonicalization",
                    "default_view": False,
                    "provenance_mode": "metadata",
                }
            )
    write_jsonl(run_dir / "canonical_nodes.jsonl", canonical_nodes)
    write_jsonl(run_dir / "canonical_edges.jsonl", canonical_edges)
    print(json.dumps({"canonical_nodes": len(canonical_nodes), "canonical_edges": len(canonical_edges)}, ensure_ascii=False, indent=2))


def merge_candidates(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    manifest = load_manifest(run_dir)
    candidates = read_jsonl(run_dir / "candidates.jsonl")
    if not candidates:
        extract(args)
        candidates = read_jsonl(run_dir / "candidates.jsonl")
    anchor_by_id = {a["id"]: a for a in load_official_anchors(run_dir)}
    payload = {
        "run_id": manifest["run_id"],
        "taxonomy": manifest["taxonomy"],
        "instructions": {
            "same_as_merge_only": "Merge candidates only when they name the same reusable curriculum unit at the same granularity.",
            "keep_hierarchy": "Do not merge broad topics with their parts. Use semantic_edges with narrower_than or part_of.",
            "context_policy": "Use labels, definitions, evidence snippets, type, stage, subject, and official anchor labels. Do not rely on keyword overlap alone.",
        },
        "candidates": [
            {
                "candidate_id": c["candidate_id"],
                "type": c.get("type"),
                "label_et": c.get("label_et"),
                "definition": c.get("definition"),
                "evidence_text": c.get("evidence_text"),
                "subject_hint": c.get("subject_hint"),
                "stage_hint": c.get("stage_hint"),
                "grade_hint": c.get("grade_hint"),
                "official_anchors": [
                    {
                        "id": aid,
                        "label_et": anchor_by_id.get(aid, {}).get("label_et"),
                        "subject": anchor_by_id.get(aid, {}).get("subject"),
                        "school_stages": anchor_by_id.get(aid, {}).get("school_stages", []),
                    }
                    for aid in c.get("official_anchor_ids", [])
                ],
            }
            for c in candidates
        ],
    }
    parsed = call_responses_api("candidate_merge", args.model, payload, merge_schema(), run_dir, args.reasoning_effort)
    groups = parsed.get("groups", [])
    semantic_edges = parsed.get("semantic_edges", [])
    group_to_node: dict[str, str] = {}
    candidate_by_id = {c["candidate_id"]: c for c in candidates}
    canonical_nodes = []
    canonical_edges = []
    for group in groups:
        members = [candidate_by_id[cid] for cid in group.get("member_candidate_ids", []) if cid in candidate_by_id]
        if not members:
            continue
        if group_is_out_of_scope(group):
            continue
        typ = group["canonical_type"]
        label = group["canonical_label_et"].strip()
        canonical_id = stable_id(typ.lower(), label, typ)
        suffix = 2
        existing_ids = {node["id"] for node in canonical_nodes}
        while canonical_id in existing_ids:
            canonical_id = stable_id(typ.lower(), label, f"{typ}|{group.get('group_id')}|{suffix}")
            suffix += 1
        group_to_node[group["group_id"]] = canonical_id
        canonical_nodes.append(
            {
                "id": canonical_id,
                "type": typ,
                "label_et": label,
                "description": group.get("canonical_definition"),
                "aliases": sorted({m["label_et"] for m in members}),
                "subjects_seen": sorted({m.get("subject_hint") for m in members if m.get("subject_hint")}),
                "stages_seen": sorted({m.get("stage_hint") for m in members if m.get("stage_hint")}),
                "grades_seen": sorted({m.get("grade_hint") for m in members if m.get("grade_hint")}),
                "member_candidate_ids": [m["candidate_id"] for m in members],
                "evidence_chunk_ids": sorted({cid for m in members for cid in m.get("source_chunk_ids", [])}),
                "official_anchor_ids": sorted({aid for m in members for aid in m.get("official_anchor_ids", []) if aid}),
                "confidence": round(float(group.get("confidence", 0.7)), 3),
                "status": "canonical_candidate",
                "method": "responses_api_semantic_merge",
                "merge_rationale": group.get("merge_rationale"),
                "scope_status": group.get("scope_status", "in_scope"),
                "scope_rationale": group.get("scope_rationale", ""),
                "graph_version": GRAPH_VERSION,
                "schema_version": SCHEMA_VERSION,
                "kg_layer": "curriculum_content" if typ in UNIT_TYPES else "assessment_task",
                "default_view": True,
                "provenance_mode": "metadata",
            }
        )
        for m in members:
            canonical_edges.append(
                {
                    "id": edge_id(m["candidate_id"], "same_as", canonical_id),
                    "source": m["candidate_id"],
                    "target": canonical_id,
                    "type": "same_as",
                    "confidence": round(float(group.get("confidence", 0.7)), 3),
                    "method": "responses_api_semantic_merge",
                    "candidate_id": m["candidate_id"],
                    "kg_layer": "canonicalization",
                    "default_view": False,
                    "provenance_mode": "metadata",
                }
            )
    for edge in semantic_edges:
        source = group_to_node.get(edge.get("source_group_id"))
        target = group_to_node.get(edge.get("target_group_id"))
        if not source or not target or source == target:
            continue
        canonical_edges.append(
            {
                "id": edge_id(source, edge["type"], target),
                "source": source,
                "target": target,
                "type": edge["type"],
                "confidence": round(float(edge.get("confidence", 0.6)), 3),
                "method": "responses_api_semantic_merge",
                "rationale": edge.get("rationale"),
                "kg_layer": "curriculum_content",
                "default_view": True,
                "provenance_mode": "metadata",
            }
        )
    write_jsonl(run_dir / "merge_groups.jsonl", groups)
    write_jsonl(run_dir / "merge_semantic_edges.jsonl", semantic_edges)
    write_jsonl(run_dir / "canonical_nodes.jsonl", canonical_nodes)
    write_jsonl(run_dir / "canonical_edges.jsonl", canonical_edges)
    print(json.dumps({"groups": len(groups), "semantic_edges": len(semantic_edges), "canonical_nodes": len(canonical_nodes), "canonical_edges": len(canonical_edges)}, ensure_ascii=False, indent=2))


def convert_merge_outputs_to_canonical(run_dir: Path, groups: list[dict[str, Any]], semantic_edges: list[dict[str, Any]], candidates: list[dict[str, Any]], method: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    group_to_node: dict[str, str] = {}
    candidate_by_id = {c["candidate_id"]: c for c in candidates}
    canonical_nodes = []
    canonical_edges = []
    for group in groups:
        members = [candidate_by_id[cid] for cid in group.get("member_candidate_ids", []) if cid in candidate_by_id]
        if not members:
            continue
        if group_is_out_of_scope(group):
            continue
        typ = group["canonical_type"]
        label = group["canonical_label_et"].strip()
        canonical_id = stable_id(typ.lower(), label, typ)
        suffix = 2
        existing_ids = {node["id"] for node in canonical_nodes}
        while canonical_id in existing_ids:
            canonical_id = stable_id(typ.lower(), label, f"{typ}|{group.get('group_id')}|{suffix}")
            suffix += 1
        group_to_node[group["group_id"]] = canonical_id
        canonical_nodes.append(
            {
                "id": canonical_id,
                "type": typ,
                "label_et": label,
                "description": group.get("canonical_definition"),
                "aliases": sorted({m["label_et"] for m in members}),
                "subjects_seen": sorted({m.get("subject_hint") for m in members if m.get("subject_hint")}),
                "stages_seen": sorted({m.get("stage_hint") for m in members if m.get("stage_hint")}),
                "grades_seen": sorted({m.get("grade_hint") for m in members if m.get("grade_hint")}),
                "member_candidate_ids": [m["candidate_id"] for m in members],
                "evidence_chunk_ids": sorted({cid for m in members for cid in m.get("source_chunk_ids", [])}),
                "official_anchor_ids": sorted({aid for m in members for aid in m.get("official_anchor_ids", []) if aid}),
                "confidence": round(float(group.get("confidence", 0.7)), 3),
                "status": "canonical_candidate",
                "method": method,
                "merge_rationale": group.get("merge_rationale"),
                "scope_status": group.get("scope_status", "in_scope"),
                "scope_rationale": group.get("scope_rationale", ""),
                "graph_version": GRAPH_VERSION,
                "schema_version": SCHEMA_VERSION,
                "kg_layer": "curriculum_content" if typ in UNIT_TYPES else "assessment_task",
                "default_view": True,
                "provenance_mode": "metadata",
            }
        )
        for m in members:
            canonical_edges.append(
                {
                    "id": edge_id(m["candidate_id"], "same_as", canonical_id),
                    "source": m["candidate_id"],
                    "target": canonical_id,
                    "type": "same_as",
                    "confidence": round(float(group.get("confidence", 0.7)), 3),
                    "method": method,
                    "candidate_id": m["candidate_id"],
                    "kg_layer": "canonicalization",
                    "default_view": False,
                    "provenance_mode": "metadata",
                }
            )
    for edge in semantic_edges:
        source = group_to_node.get(edge.get("source_group_id"))
        target = group_to_node.get(edge.get("target_group_id"))
        if not source or not target or source == target:
            continue
        canonical_edges.append(
            {
                "id": edge_id(source, edge["type"], target),
                "source": source,
                "target": target,
                "type": edge["type"],
                "confidence": round(float(edge.get("confidence", 0.6)), 3),
                "method": method,
                "rationale": edge.get("rationale"),
                "kg_layer": "curriculum_content",
                "default_view": True,
                "provenance_mode": "metadata",
            }
        )
    return canonical_nodes, dedupe_edges(normalize_semantic_edge_directions(canonical_edges, canonical_nodes))


def singleton_merge_group(block_id: str, candidate: dict[str, Any], reason: str) -> dict[str, Any]:
    return {
        "group_id": f"{block_id}:singleton:{slug(candidate.get('candidate_id') or candidate.get('label_et') or 'item', 48)}",
        "canonical_type": candidate["type"],
        "canonical_label_et": candidate["label_et"],
        "canonical_definition": candidate.get("definition") or candidate.get("label_et") or "",
        "member_candidate_ids": [candidate["candidate_id"]],
        "scope_status": "in_scope",
        "scope_rationale": "No scope problem detected.",
        "merge_rationale": reason,
        "confidence": float(candidate.get("confidence", 0.65)),
    }


def out_of_scope_merge_group(block_id: str, candidate: dict[str, Any], reason: str) -> dict[str, Any]:
    return {
        "group_id": f"{block_id}:out_of_scope:{slug(candidate.get('candidate_id') or candidate.get('label_et') or 'item', 48)}",
        "canonical_type": candidate["type"],
        "canonical_label_et": candidate["label_et"],
        "canonical_definition": candidate.get("definition") or candidate.get("label_et") or "",
        "member_candidate_ids": [candidate["candidate_id"]],
        "scope_status": "out_of_scope",
        "scope_rationale": reason,
        "merge_rationale": "Excluded from the subject KG by scope guardrail.",
        "confidence": float(candidate.get("confidence", 0.65)),
    }


def group_is_out_of_scope(group: dict[str, Any]) -> bool:
    return group.get("scope_status") == "out_of_scope"


def group_needs_review(group: dict[str, Any]) -> bool:
    return group.get("scope_status") == "needs_review"


def metadata_scope_reason(candidate: dict[str, Any], manifest: dict[str, Any]) -> str | None:
    allowed_subjects = set(normalize_subject_hints(manifest.get("taxonomy", {}).get("subjects", [])))
    subject = normalize_subject_hint(candidate.get("subject_hint"))
    if subject and allowed_subjects and subject not in allowed_subjects:
        return f"Candidate subject hint `{subject}` is outside this run's subject scope: {', '.join(sorted(allowed_subjects))}."
    return None


def ensure_candidate_coverage(groups: list[dict[str, Any]], block_candidates: list[dict[str, Any]], block_id: str) -> list[dict[str, Any]]:
    """Force a monotonic partition: every input candidate appears in exactly one group."""
    valid_ids = {c["candidate_id"] for c in block_candidates}
    candidate_by_id = {c["candidate_id"]: c for c in block_candidates}
    seen: set[str] = set()
    out = []
    for group in groups:
        members = []
        for cid in group.get("member_candidate_ids", []):
            if cid in valid_ids and cid not in seen:
                members.append(cid)
                seen.add(cid)
        if not members:
            continue
        group = dict(group)
        group["member_candidate_ids"] = members
        out.append(group)
    for cid in sorted(valid_ids - seen):
        out.append(singleton_merge_group(block_id, candidate_by_id[cid], "Coverage guardrail: candidate was missing from LLM grouping, so it was preserved as a singleton."))
    return out


def canonical_nodes_as_merge_candidates(canonical_nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    candidates = []
    for node in canonical_nodes:
        if node.get("type") not in UNIT_TYPES | TASK_CRITERION_TYPES:
            continue
        candidates.append(
            {
                "candidate_id": node["id"],
                "type": node["type"],
                "label_et": node.get("label_et") or "",
                "definition": node.get("description") or node.get("label_et") or "",
                "evidence_text": node.get("description") or node.get("merge_rationale") or node.get("label_et") or "",
                "source_chunk_ids": node.get("evidence_chunk_ids", []),
                "official_anchor_ids": node.get("official_anchor_ids", []),
                "subject_hint": (node.get("subjects_seen") or [None])[0],
                "stage_hint": (node.get("stages_seen") or [None])[0],
                "grade_hint": (node.get("grades_seen") or [None])[0],
                "confidence": float(node.get("confidence", 0.65)),
                "rationale": node.get("merge_rationale") or node.get("description") or "",
                "source_canonical_node_ids": sorted(set([node["id"]] + list(node.get("source_canonical_node_ids", [])))),
                "member_candidate_ids": node.get("member_candidate_ids", []),
            }
        )
    return candidates


def block_signature(candidate_ids: Iterable[str]) -> str:
    return sha1_text("|".join(sorted(candidate_ids)), 20)


def graph_state_signature(canonical_nodes: list[dict[str, Any]], canonical_edges: list[dict[str, Any]]) -> str:
    node_parts = [
        "|".join(
            [
                node.get("type", ""),
                normalize_label(node.get("label_et") or ""),
                normalize_label(node.get("description") or ""),
                ",".join(sorted(str(cid) for cid in node.get("member_candidate_ids", []))),
            ]
        )
        for node in canonical_nodes
    ]
    edge_parts = [
        "|".join([edge.get("source", ""), edge.get("type", ""), edge.get("target", "")])
        for edge in canonical_edges
        if edge.get("type") != "same_as"
    ]
    return sha1_text("\n".join(sorted(node_parts) + sorted(edge_parts)), 24)


def llm_usage_totals(run_dir: Path) -> dict[str, int]:
    totals = {"input_tokens": 0, "output_tokens": 0, "total_tokens": 0, "responses": 0}
    for row in read_jsonl(run_dir / "llm_responses.jsonl"):
        usage = row.get("usage") or {}
        totals["responses"] += 1
        input_tokens = int(usage.get("input_tokens") or usage.get("prompt_tokens") or 0)
        output_tokens = int(usage.get("output_tokens") or usage.get("completion_tokens") or 0)
        total_tokens = int(usage.get("total_tokens") or input_tokens + output_tokens)
        totals["input_tokens"] += input_tokens
        totals["output_tokens"] += output_tokens
        totals["total_tokens"] += total_tokens
    return totals


def prefixed_merge_outputs(parsed: dict[str, Any], block_id: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    group_ids = {g["group_id"] for g in parsed.get("groups", [])}
    groups = []
    semantic_edges = []
    for group in parsed.get("groups", []):
        group = dict(group)
        group["group_id"] = f"{block_id}:{group['group_id']}"
        groups.append(group)
    for edge in parsed.get("semantic_edges", []):
        if edge.get("source_group_id") not in group_ids or edge.get("target_group_id") not in group_ids:
            continue
        edge = dict(edge)
        edge["source_group_id"] = f"{block_id}:{edge['source_group_id']}"
        edge["target_group_id"] = f"{block_id}:{edge['target_group_id']}"
        semantic_edges.append(edge)
    return groups, semantic_edges


def dedupe_edges(edges: list[dict[str, Any]]) -> list[dict[str, Any]]:
    exact: dict[tuple[str, str, str], dict[str, Any]] = {}
    pair_best_semantic: dict[tuple[str, str], dict[str, Any]] = {}
    passthrough = []
    for edge in edges:
        typ = edge.get("type")
        if typ == "same_as":
            passthrough.append(edge)
            continue
        exact_key = (edge.get("source", ""), typ or "", edge.get("target", ""))
        if typ not in SEMANTIC_EDGE_PRECEDENCE:
            old = exact.get(exact_key)
            if old is None or float(edge.get("confidence", 0) or 0) > float(old.get("confidence", 0) or 0):
                exact[exact_key] = edge
            continue
        pair_key = (edge.get("source", ""), edge.get("target", ""))
        old = pair_best_semantic.get(pair_key)
        if old is None:
            pair_best_semantic[pair_key] = edge
            continue
        old_rank = SEMANTIC_EDGE_PRECEDENCE.get(old.get("type"), 0)
        new_rank = SEMANTIC_EDGE_PRECEDENCE.get(typ, 0)
        old_conf = float(old.get("confidence", 0) or 0)
        new_conf = float(edge.get("confidence", 0) or 0)
        if (new_rank, new_conf) > (old_rank, old_conf):
            pair_best_semantic[pair_key] = edge
    out = passthrough + list(exact.values()) + list(pair_best_semantic.values())
    return sorted(out, key=lambda e: (e.get("source", ""), e.get("type", ""), e.get("target", ""), e.get("id", "")))


def normalize_semantic_edge_directions(edges: list[dict[str, Any]], nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    type_by_id = {node.get("id"): node.get("type") for node in nodes}
    normalized = []
    for edge in edges:
        if edge.get("type") == "supports" and type_by_id.get(edge.get("source")) == "TaskSubtype" and type_by_id.get(edge.get("target")) in UNIT_TYPES:
            new_edge = dict(edge)
            old_source = edge["source"]
            old_target = edge["target"]
            new_edge["source"] = old_target
            new_edge["target"] = old_source
            new_edge["id"] = edge_id(new_edge["source"], new_edge["type"], new_edge["target"], "direction_normalized")
            new_edge["method"] = f"{edge.get('method', 'unknown')}+type_direction_normalization"
            rationale = edge.get("rationale") or ""
            new_edge["rationale"] = (rationale + " Direction normalized: tasks use or assess skills; skills support task performance.").strip()
            normalized.append(new_edge)
        else:
            normalized.append(edge)
    return normalized


def run_blocked_merge_pass(
    args: argparse.Namespace,
    run_dir: Path,
    manifest: dict[str, Any],
    candidates: list[dict[str, Any]],
    iteration: int,
    seen_block_signatures: set[str] | None = None,
    max_llm_calls: int | None = None,
    llm_calls_so_far: int = 0,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    settings = manifest.get("settings", {})
    metadata_excluded = []
    scoped_candidates = []
    for candidate in candidates:
        reason = metadata_scope_reason(candidate, manifest)
        if reason:
            metadata_excluded.append(candidate)
        else:
            scoped_candidates.append(candidate)
    candidates = scoped_candidates
    max_block_size = getattr(args, "merge_block_size", None) or int(settings.get("merge_block_size", 60))
    neighbor_top_k = getattr(args, "merge_neighbor_top_k", None) or int(settings.get("merge_neighbor_top_k", 12))
    min_score = getattr(args, "merge_min_score", None)
    if min_score is None:
        min_score = float(settings.get("merge_min_score", 0.12))
    if settings.get("force_single_merge_block"):
        valid_ids = [c["candidate_id"] for c in candidates if c.get("candidate_id") and c.get("type") in UNIT_TYPES | TASK_CRITERION_TYPES]
        blocks = [
            {
                "block_id": "merge_block_forced_all",
                "candidate_ids": valid_ids,
                "size": len(valid_ids),
                "method": "forced_single_block_for_synthetic_adversarial_test",
                "note": "All scoped candidates are sent together so the LLM can test duplicates, semantic duplicates, and content-scope judgments.",
            }
        ] if valid_ids else []
    else:
        blocks = build_merge_blocks(candidates, max_block_size=max_block_size, neighbor_top_k=neighbor_top_k, min_score=float(min_score))
    seen_block_signatures = seen_block_signatures if seen_block_signatures is not None else set()
    candidate_by_id = {c["candidate_id"]: c for c in candidates}
    anchor_by_id = {a["id"]: a for a in load_official_anchors(run_dir)}
    all_groups = []
    all_semantic_edges = []
    for candidate in metadata_excluded:
        reason = metadata_scope_reason(candidate, manifest) or "Candidate is outside this run's subject scope."
        all_groups.append(out_of_scope_merge_group(f"iter{iteration:02d}_metadata_scope_guard", candidate, reason))
    stats: dict[str, Any] = {
        "iteration": iteration,
        "input_candidates": len(candidates) + len(metadata_excluded),
        "scoped_candidates": len(candidates),
        "metadata_excluded_candidates": len(metadata_excluded),
        "blocks": len(blocks),
        "block_sizes": [b["size"] for b in blocks],
        "llm_calls": 0,
        "singleton_blocks": 0,
        "skipped_repeated_blocks": 0,
        "skipped_by_call_cap_blocks": 0,
        "hit_llm_call_cap": False,
    }
    for block in blocks:
        block_candidates = [candidate_by_id[cid] for cid in block["candidate_ids"] if cid in candidate_by_id]
        if not block_candidates:
            continue
        scoped_block_id = f"iter{iteration:02d}_{block['block_id']}"
        sig = block_signature(c["candidate_id"] for c in block_candidates)
        if len(block_candidates) == 1:
            stats["singleton_blocks"] += 1
            all_groups.append(singleton_merge_group(scoped_block_id, block_candidates[0], "Singleton block; no LLM same-as adjudication needed."))
            continue
        if sig in seen_block_signatures:
            stats["skipped_repeated_blocks"] += 1
            for c in block_candidates:
                all_groups.append(singleton_merge_group(scoped_block_id, c, "Anti-loop guardrail: identical candidate set was already adjudicated, so the block was not sent again."))
            continue
        if max_llm_calls is not None and llm_calls_so_far + stats["llm_calls"] >= max_llm_calls:
            stats["hit_llm_call_cap"] = True
            stats["skipped_by_call_cap_blocks"] += 1
            for c in block_candidates:
                all_groups.append(singleton_merge_group(scoped_block_id, c, "Hard LLM-call cap reached; preserved as singleton for this pass."))
            continue
        payload = {
            "run_id": manifest["run_id"],
            "block_id": scoped_block_id,
            "taxonomy": manifest["taxonomy"],
            "blocking_context": block,
            "iteration_context": {
                "iteration": iteration,
                "monotonicity_rule": "This pass may merge units or add semantic edges. It must not split existing units. If a previous canonical unit seems too broad, keep it as one group and explain the risk in merge_rationale.",
                "anti_oscillation_rule": "Prefer preserving uncertain cases as separate groups. Do not rename units unless the new label is clearer and still means the same unit.",
            },
            "instructions": {
                "blocking_is_not_evidence": "The block was built by cheap retrieval. You must make semantic decisions from the candidate content and evidence.",
                "registry_update_goal": "Group same units, keep broader/narrower units separate, and add useful semantic edges among canonical groups.",
                "scope_policy": "Mark groups as out_of_scope when the candidate content is not a curriculum unit for this subject/domain. Biology facts are out of scope for this Estonian language/literature run unless the actual reusable unit is a language skill such as writing, explaining, arguing, reading, or terminology use.",
            },
            "existing_canonical_neighbors": [],
            "candidates": [
                {
                    "candidate_id": c["candidate_id"],
                    "type": c.get("type"),
                    "label_et": c.get("label_et"),
                    "definition": c.get("definition"),
                    "evidence_text": c.get("evidence_text"),
                    "subject_hint": c.get("subject_hint"),
                    "stage_hint": c.get("stage_hint"),
                    "grade_hint": c.get("grade_hint"),
                    "official_anchors": [
                        {
                            "id": aid,
                            "label_et": anchor_by_id.get(aid, {}).get("label_et"),
                            "subject": anchor_by_id.get(aid, {}).get("subject"),
                            "school_stages": anchor_by_id.get(aid, {}).get("school_stages", []),
                        }
                        for aid in c.get("official_anchor_ids", [])
                    ],
                    "source_canonical_node_ids": c.get("source_canonical_node_ids", []),
                    "member_candidate_ids": c.get("member_candidate_ids", []),
                }
                for c in block_candidates
            ],
        }
        if args.dry_run:
            parsed = {"groups": [singleton_merge_group(scoped_block_id, c, "Dry-run iterative merge placeholder.") for c in block_candidates], "semantic_edges": []}
        else:
            parsed = call_responses_api("candidate_merge", args.model, payload, merge_schema(), run_dir, args.reasoning_effort)
            stats["llm_calls"] += 1
        parsed["groups"] = ensure_candidate_coverage(parsed.get("groups", []), block_candidates, scoped_block_id)
        groups, semantic_edges = prefixed_merge_outputs(parsed, scoped_block_id)
        all_groups.extend(groups)
        all_semantic_edges.extend(semantic_edges)
        seen_block_signatures.add(sig)
    stats["groups"] = len(all_groups)
    stats["semantic_edges"] = len(all_semantic_edges)
    stats["out_of_scope_groups"] = sum(1 for g in all_groups if group_is_out_of_scope(g))
    stats["review_groups"] = sum(1 for g in all_groups if group_needs_review(g))
    return all_groups, all_semantic_edges, blocks, stats


def convert_iterative_outputs_to_canonical(
    groups: list[dict[str, Any]],
    semantic_edges: list[dict[str, Any]],
    previous_nodes: list[dict[str, Any]],
    previous_edges: list[dict[str, Any]],
    method: str,
    iteration: int,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    previous_by_id = {node["id"]: node for node in previous_nodes}
    old_to_new: dict[str, str] = {}
    group_to_node: dict[str, str] = {}
    canonical_nodes = []
    canonical_edges = []
    for group in groups:
        members = [previous_by_id[cid] for cid in group.get("member_candidate_ids", []) if cid in previous_by_id]
        if not members:
            continue
        if group_is_out_of_scope(group):
            continue
        typ = group["canonical_type"]
        label = group["canonical_label_et"].strip()
        canonical_id = stable_id(typ.lower(), label, typ)
        suffix = 2
        existing_ids = {node["id"] for node in canonical_nodes}
        while canonical_id in existing_ids:
            canonical_id = stable_id(typ.lower(), label, f"{typ}|{group.get('group_id')}|{suffix}")
            suffix += 1
        group_to_node[group["group_id"]] = canonical_id
        for member in members:
            old_to_new[member["id"]] = canonical_id
        aliases = sorted({alias for m in members for alias in list(m.get("aliases", [])) + [m.get("label_et", "")] if alias})
        member_candidate_ids = sorted({cid for m in members for cid in m.get("member_candidate_ids", []) if cid})
        source_canonical_node_ids = sorted({sid for m in members for sid in list(m.get("source_canonical_node_ids", [])) + [m["id"]] if sid})
        canonical_nodes.append(
            {
                "id": canonical_id,
                "type": typ,
                "label_et": label,
                "description": group.get("canonical_definition"),
                "aliases": aliases,
                "subjects_seen": sorted({s for m in members for s in m.get("subjects_seen", []) if s}),
                "stages_seen": sorted({s for m in members for s in m.get("stages_seen", []) if s}),
                "grades_seen": sorted({g for m in members for g in m.get("grades_seen", []) if g}),
                "member_candidate_ids": member_candidate_ids,
                "source_canonical_node_ids": source_canonical_node_ids,
                "evidence_chunk_ids": sorted({cid for m in members for cid in m.get("evidence_chunk_ids", [])}),
                "official_anchor_ids": sorted({aid for m in members for aid in m.get("official_anchor_ids", []) if aid}),
                "confidence": round(float(group.get("confidence", 0.7)), 3),
                "status": "canonical_candidate",
                "method": method,
                "merge_iteration": iteration,
                "merge_rationale": group.get("merge_rationale"),
                "scope_status": group.get("scope_status", "in_scope"),
                "scope_rationale": group.get("scope_rationale", ""),
                "graph_version": GRAPH_VERSION,
                "schema_version": SCHEMA_VERSION,
                "kg_layer": "curriculum_content" if typ in UNIT_TYPES else "assessment_task",
                "default_view": True,
                "provenance_mode": "metadata",
            }
        )
        for member in members:
            canonical_edges.append(
                {
                    "id": edge_id(member["id"], "same_as", canonical_id, str(iteration)),
                    "source": member["id"],
                    "target": canonical_id,
                    "type": "same_as",
                    "confidence": round(float(group.get("confidence", 0.7)), 3),
                    "method": method,
                    "kg_layer": "canonicalization",
                    "default_view": False,
                    "provenance_mode": "metadata",
                    "merge_iteration": iteration,
                }
            )

    seen_edges: set[tuple[str, str, str]] = set()
    for edge in previous_edges:
        if edge.get("type") == "same_as":
            continue
        source = old_to_new.get(edge.get("source"), edge.get("source"))
        target = old_to_new.get(edge.get("target"), edge.get("target"))
        if not source or not target or source == target:
            continue
        key = (source, edge.get("type", ""), target)
        if key in seen_edges:
            continue
        seen_edges.add(key)
        kept = dict(edge)
        kept.update(
            {
                "id": edge_id(source, edge["type"], target, f"preserved:{iteration}"),
                "source": source,
                "target": target,
                "method": edge.get("method", method),
                "merge_iteration": iteration,
            }
        )
        canonical_edges.append(kept)

    for edge in semantic_edges:
        source = group_to_node.get(edge.get("source_group_id"))
        target = group_to_node.get(edge.get("target_group_id"))
        if not source or not target or source == target:
            continue
        key = (source, edge["type"], target)
        if key in seen_edges:
            continue
        seen_edges.add(key)
        canonical_edges.append(
            {
                "id": edge_id(source, edge["type"], target, f"iter:{iteration}"),
                "source": source,
                "target": target,
                "type": edge["type"],
                "confidence": round(float(edge.get("confidence", 0.6)), 3),
                "method": method,
                "rationale": edge.get("rationale"),
                "kg_layer": "curriculum_content",
                "default_view": True,
                "provenance_mode": "metadata",
                "merge_iteration": iteration,
            }
        )
    return canonical_nodes, dedupe_edges(normalize_semantic_edge_directions(canonical_edges, canonical_nodes))


def write_merge_iteration_snapshot(run_dir: Path, iteration: int, groups: list[dict[str, Any]], semantic_edges: list[dict[str, Any]], nodes: list[dict[str, Any]], edges: list[dict[str, Any]], stats: dict[str, Any]) -> None:
    iteration_dir = run_dir / "merge_iterations" / f"iteration_{iteration:02d}"
    write_jsonl(iteration_dir / "merge_groups.jsonl", groups)
    write_jsonl(iteration_dir / "merge_semantic_edges.jsonl", semantic_edges)
    write_jsonl(iteration_dir / "canonical_nodes.jsonl", nodes)
    write_jsonl(iteration_dir / "canonical_edges.jsonl", edges)
    (iteration_dir / "stats.json").write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding="utf-8")


def iterative_merge_blocks(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    manifest = load_manifest(run_dir)
    candidates = read_jsonl(run_dir / "candidates.jsonl")
    if not candidates:
        extract(args)
        candidates = read_jsonl(run_dir / "candidates.jsonl")
    max_iterations = int(getattr(args, "max_merge_iterations", None) or manifest.get("settings", {}).get("max_merge_iterations", 3))
    max_iterations = max(1, min(max_iterations, 8))
    max_llm_calls = getattr(args, "max_merge_llm_calls", None)
    if max_llm_calls is None:
        max_llm_calls = int(manifest.get("settings", {}).get("max_merge_llm_calls", 12))
    max_total_tokens = getattr(args, "max_merge_total_tokens", None)
    if max_total_tokens is None:
        max_total_tokens = int(manifest.get("settings", {}).get("max_merge_total_tokens", 150000))
    min_merge_rate = float(getattr(args, "min_merge_rate", None) or manifest.get("settings", {}).get("min_merge_rate", 0.01))
    start_time = time.monotonic()
    seen_block_signatures: set[str] = set()
    seen_state_signatures: set[str] = set()
    all_iteration_groups = []
    all_iteration_edges = []
    iteration_stats = []
    canonical_nodes: list[dict[str, Any]] = []
    canonical_edges: list[dict[str, Any]] = []
    stop_reason = "max_iterations"
    llm_calls_total = 0

    for iteration in range(1, max_iterations + 1):
        if iteration == 1:
            merge_input = candidates
            previous_node_count = len(candidates)
        else:
            merge_input = canonical_nodes_as_merge_candidates(canonical_nodes)
            previous_node_count = len(canonical_nodes)
        if not merge_input:
            stop_reason = "no_merge_input"
            break
        groups, semantic_edges, blocks, stats = run_blocked_merge_pass(
            args,
            run_dir,
            manifest,
            merge_input,
            iteration,
            seen_block_signatures=seen_block_signatures,
            max_llm_calls=max_llm_calls,
            llm_calls_so_far=llm_calls_total,
        )
        llm_calls_total += int(stats.get("llm_calls", 0))
        if iteration == 1:
            canonical_nodes, canonical_edges = convert_merge_outputs_to_canonical(run_dir, groups, semantic_edges, candidates, "responses_api_iterative_semantic_merge")
        else:
            canonical_nodes, canonical_edges = convert_iterative_outputs_to_canonical(
                groups,
                semantic_edges,
                canonical_nodes,
                canonical_edges,
                "responses_api_iterative_semantic_merge",
                iteration,
            )
        merge_count = max(0, previous_node_count - len(canonical_nodes))
        merge_rate = merge_count / max(1, previous_node_count)
        usage = llm_usage_totals(run_dir)
        state_sig = graph_state_signature(canonical_nodes, canonical_edges)
        stats.update(
            {
                "canonical_nodes": len(canonical_nodes),
                "canonical_edges": len(canonical_edges),
                "merge_count": merge_count,
                "merge_rate": round(merge_rate, 4),
                "state_signature": state_sig,
                "elapsed_seconds": round(time.monotonic() - start_time, 2),
                "llm_calls_total": llm_calls_total,
                "llm_total_tokens_seen": usage["total_tokens"],
            }
        )
        write_merge_iteration_snapshot(run_dir, iteration, groups, semantic_edges, canonical_nodes, canonical_edges, stats)
        all_iteration_groups.extend(dict(g, merge_iteration=iteration) for g in groups)
        all_iteration_edges.extend(dict(e, merge_iteration=iteration) for e in semantic_edges)
        iteration_stats.append(stats)

        if state_sig in seen_state_signatures:
            stop_reason = "repeated_state_signature"
            break
        seen_state_signatures.add(state_sig)
        if stats.get("hit_llm_call_cap"):
            stop_reason = "llm_call_cap"
            break
        if usage["total_tokens"] >= max_total_tokens:
            stop_reason = "token_budget_cap"
            break
        if iteration > 1 and merge_count == 0:
            stop_reason = "no_new_merges"
            break
        if iteration > 1 and merge_rate < min_merge_rate:
            stop_reason = "merge_rate_below_threshold"
            break
    else:
        stop_reason = "max_iterations"

    write_jsonl(run_dir / "merge_groups.jsonl", all_iteration_groups)
    write_jsonl(run_dir / "merge_semantic_edges.jsonl", all_iteration_edges)
    excluded_groups = [g for g in all_iteration_groups if group_is_out_of_scope(g)]
    review_groups = [g for g in all_iteration_groups if group_needs_review(g)]
    write_jsonl(run_dir / "excluded_groups.jsonl", excluded_groups)
    write_jsonl(run_dir / "review_groups.jsonl", review_groups)
    write_jsonl(run_dir / "canonical_nodes.jsonl", canonical_nodes)
    write_jsonl(run_dir / "canonical_edges.jsonl", canonical_edges)
    write_jsonl(run_dir / "registry_nodes.jsonl", canonical_nodes)
    usage = llm_usage_totals(run_dir)
    report = [
        "# Iterative Merge Convergence Report",
        "",
        f"- Stop reason: `{stop_reason}`",
        f"- Iterations completed: {len(iteration_stats):,}",
        f"- LLM merge calls: {llm_calls_total:,} / {max_llm_calls:,}",
        f"- Total tokens recorded for all LLM responses in this run: {usage['total_tokens']:,} / {max_total_tokens:,}",
        f"- Final canonical nodes: {len(canonical_nodes):,}",
        f"- Final canonical edges: {len(canonical_edges):,}",
        f"- Excluded groups: {len(excluded_groups):,}",
        f"- Review groups: {len(review_groups):,}",
        "",
        "## Guardrails",
        "",
        f"- Hard merge-iteration cap: {max_iterations}",
        f"- Hard merge LLM-call cap: {max_llm_calls}",
        f"- Hard recorded token cap: {max_total_tokens:,}",
        "- Repeated block signatures are not sent to the LLM again.",
        "- Every pass is monotonic: it can merge or preserve units, but it cannot split existing canonical units.",
        "- Missing LLM group coverage is repaired by singleton preservation.",
        "",
        "## Iterations",
        "",
        "| iteration | input | blocks | calls | canonical | merges | merge_rate | skipped_repeat | stop_cap | tokens_seen | elapsed_s |",
        "|---:|---:|---:|---:|---:|---:|---:|---:|:---:|---:|---:|",
    ]
    for stats in iteration_stats:
        report.append(
            "| {iteration} | {input_candidates} | {blocks} | {llm_calls} | {canonical_nodes} | {merge_count} | {merge_rate:.4f} | {skipped_repeated_blocks} | {hit_llm_call_cap} | {llm_total_tokens_seen} | {elapsed_seconds} |".format(
                **stats
            )
        )
    (run_dir / "reports").mkdir(parents=True, exist_ok=True)
    (run_dir / "reports" / "merge_convergence_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"stop_reason": stop_reason, "iterations": len(iteration_stats), "llm_calls": llm_calls_total, "canonical_nodes": len(canonical_nodes), "canonical_edges": len(canonical_edges), "tokens_seen": usage["total_tokens"]}, ensure_ascii=False, indent=2))


def merge_blocks(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    manifest = load_manifest(run_dir)
    settings = manifest.get("settings", {})
    candidates = read_jsonl(run_dir / "candidates.jsonl")
    if not candidates:
        extract(args)
        candidates = read_jsonl(run_dir / "candidates.jsonl")
    max_block_size = getattr(args, "merge_block_size", None) or int(settings.get("merge_block_size", 60))
    neighbor_top_k = getattr(args, "merge_neighbor_top_k", None) or int(settings.get("merge_neighbor_top_k", 12))
    min_score = getattr(args, "merge_min_score", None)
    if min_score is None:
        min_score = float(settings.get("merge_min_score", 0.12))
    blocks = build_merge_blocks(candidates, max_block_size=max_block_size, neighbor_top_k=neighbor_top_k, min_score=float(min_score))
    write_jsonl(run_dir / "merge_blocks.jsonl", blocks)
    if getattr(args, "dry_run", False):
        print(json.dumps({"blocks": len(blocks), "block_sizes": [b["size"] for b in blocks], "dry_run": True}, ensure_ascii=False, indent=2))
        return

    candidate_by_id = {c["candidate_id"]: c for c in candidates}
    anchor_by_id = {a["id"]: a for a in load_official_anchors(run_dir)}
    all_groups = []
    all_semantic_edges = []
    for block in blocks:
        block_candidates = [candidate_by_id[cid] for cid in block["candidate_ids"] if cid in candidate_by_id]
        if not block_candidates:
            continue
        if len(block_candidates) == 1:
            c = block_candidates[0]
            group_id = f"{block['block_id']}:singleton"
            all_groups.append(
                {
                    "group_id": group_id,
                    "canonical_type": c["type"],
                    "canonical_label_et": c["label_et"],
                    "canonical_definition": c.get("definition") or c["label_et"],
                    "member_candidate_ids": [c["candidate_id"]],
                    "merge_rationale": "Singleton block; no candidate neighbor required LLM same-as adjudication.",
                    "confidence": float(c.get("confidence", 0.65)),
                }
            )
            continue
        payload = {
            "run_id": manifest["run_id"],
            "block_id": block["block_id"],
            "taxonomy": manifest["taxonomy"],
            "blocking_context": block,
            "instructions": {
                "blocking_is_not_evidence": "The block was built by cheap retrieval. You must make semantic decisions from the candidate content and evidence.",
                "registry_update_goal": "Group same units, keep broader/narrower units separate, and add useful semantic edges among canonical groups.",
            },
            "existing_canonical_neighbors": [],
            "candidates": [
                {
                    "candidate_id": c["candidate_id"],
                    "type": c.get("type"),
                    "label_et": c.get("label_et"),
                    "definition": c.get("definition"),
                    "evidence_text": c.get("evidence_text"),
                    "subject_hint": c.get("subject_hint"),
                    "stage_hint": c.get("stage_hint"),
                    "grade_hint": c.get("grade_hint"),
                    "official_anchors": [
                        {
                            "id": aid,
                            "label_et": anchor_by_id.get(aid, {}).get("label_et"),
                            "subject": anchor_by_id.get(aid, {}).get("subject"),
                            "school_stages": anchor_by_id.get(aid, {}).get("school_stages", []),
                        }
                        for aid in c.get("official_anchor_ids", [])
                    ],
                }
                for c in block_candidates
            ],
        }
        parsed = call_responses_api("candidate_merge", args.model, payload, merge_schema(), run_dir, args.reasoning_effort)
        group_ids = {g["group_id"] for g in parsed.get("groups", [])}
        for group in parsed.get("groups", []):
            group = dict(group)
            group["group_id"] = f"{block['block_id']}:{group['group_id']}"
            all_groups.append(group)
        for edge in parsed.get("semantic_edges", []):
            if edge.get("source_group_id") not in group_ids or edge.get("target_group_id") not in group_ids:
                continue
            edge = dict(edge)
            edge["source_group_id"] = f"{block['block_id']}:{edge['source_group_id']}"
            edge["target_group_id"] = f"{block['block_id']}:{edge['target_group_id']}"
            all_semantic_edges.append(edge)

    canonical_nodes, canonical_edges = convert_merge_outputs_to_canonical(run_dir, all_groups, all_semantic_edges, candidates, "responses_api_blocked_semantic_merge")
    write_jsonl(run_dir / "merge_groups.jsonl", all_groups)
    write_jsonl(run_dir / "merge_semantic_edges.jsonl", all_semantic_edges)
    write_jsonl(run_dir / "excluded_groups.jsonl", [g for g in all_groups if group_is_out_of_scope(g)])
    write_jsonl(run_dir / "review_groups.jsonl", [g for g in all_groups if group_needs_review(g)])
    write_jsonl(run_dir / "canonical_nodes.jsonl", canonical_nodes)
    write_jsonl(run_dir / "canonical_edges.jsonl", canonical_edges)
    write_jsonl(run_dir / "registry_nodes.jsonl", canonical_nodes)
    report = [
        "# Merge Blocks Report",
        "",
        f"- Candidates: {len(candidates):,}",
        f"- Blocks: {len(blocks):,}",
        f"- Block sizes: {', '.join(str(b['size']) for b in blocks)}",
        f"- Canonical nodes: {len(canonical_nodes):,}",
        f"- Same-as edges: {sum(1 for e in canonical_edges if e.get('type') == 'same_as'):,}",
        f"- Semantic edges: {sum(1 for e in canonical_edges if e.get('type') != 'same_as'):,}",
        f"- Excluded groups: {sum(1 for g in all_groups if group_is_out_of_scope(g)):,}",
        f"- Review groups: {sum(1 for g in all_groups if group_needs_review(g)):,}",
        "",
        "Blocking used token/anchor/type retrieval only to choose LLM work queues. Merge and hierarchy decisions came from structured LLM adjudication.",
    ]
    (run_dir / "reports").mkdir(parents=True, exist_ok=True)
    (run_dir / "reports" / "merge_blocks_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"blocks": len(blocks), "groups": len(all_groups), "semantic_edges": len(all_semantic_edges), "canonical_nodes": len(canonical_nodes), "canonical_edges": len(canonical_edges)}, ensure_ascii=False, indent=2))


def graph_node(node_id: str, typ: str, label: str, layer: str, **extra: Any) -> dict[str, Any]:
    row = {
        "id": node_id,
        "type": typ,
        "label_et": label,
        "description": None,
        "confidence": 0.9,
        "status": "controlled",
        "source_authority": "internal_modeling",
        "graph_version": GRAPH_VERSION,
        "schema_version": SCHEMA_VERSION,
        "kg_layer": layer,
        "default_view": True,
        "provenance_mode": "metadata",
    }
    row.update(extra)
    return row


def graph_edge(source: str, target: str, edge_type: str, layer: str, confidence: float = 0.8, **extra: Any) -> dict[str, Any]:
    row = {
        "id": edge_id(source, edge_type, target),
        "source": source,
        "target": target,
        "type": edge_type,
        "confidence": confidence,
        "method": "minimal_pipeline_graph_build",
        "source_authority": "internal_modeling",
        "evidence_ids": [],
        "graph_version": GRAPH_VERSION,
        "schema_version": SCHEMA_VERSION,
        "kg_layer": layer,
        "default_view": True,
        "provenance_mode": "metadata",
        "created_at": now_iso(),
    }
    row.update(extra)
    return row


def dedupe_nodes(nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_id: dict[str, dict[str, Any]] = {}
    for node in nodes:
        node_id = node.get("id")
        if not node_id:
            continue
        if node_id not in by_id:
            by_id[node_id] = node
            continue
        old = by_id[node_id]
        if float(node.get("confidence", 0) or 0) > float(old.get("confidence", 0) or 0):
            merged = dict(old)
            merged.update({k: v for k, v in node.items() if v not in (None, "", [])})
            by_id[node_id] = merged
    return list(by_id.values())


def build_graph(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    manifest = load_manifest(run_dir)
    canonical_nodes = read_jsonl(run_dir / "canonical_nodes.jsonl")
    if not canonical_nodes:
        canonicalize(args)
        canonical_nodes = read_jsonl(run_dir / "canonical_nodes.jsonl")
    graph_dir = run_dir / "graph"
    nodes = []
    edges = []
    nodes.append(graph_node("curriculum:riiklik_oppekava", "NationalCurriculum", "Riiklik õppekava", "curriculum_backbone"))
    nodes.append(graph_node("domain:keel_ja_kirjandus", "CurriculumDomain", manifest["taxonomy"].get("domain", "Keel ja kirjandus"), "curriculum_backbone"))
    edges.append(graph_edge("curriculum:riiklik_oppekava", "domain:keel_ja_kirjandus", "contains", "curriculum_backbone"))
    subject_ids = {}
    for subject in manifest["taxonomy"].get("subjects", []):
        sid = stable_id("subject", subject)
        subject_ids[subject] = sid
        nodes.append(graph_node(sid, "Subject", subject, "curriculum_backbone"))
        edges.append(graph_edge("domain:keel_ja_kirjandus", sid, "has_subject", "curriculum_backbone"))
    stage_ids = {}
    for stage in manifest["taxonomy"].get("stages", []):
        stage_id = "stage:" + slug(stage)
        stage_ids[stage] = stage_id
        nodes.append(graph_node(stage_id, "SchoolStage", stage, "curriculum_backbone"))
        edges.append(graph_edge("domain:keel_ja_kirjandus", stage_id, "has_stage", "curriculum_backbone"))
    for grade in manifest["taxonomy"].get("grades", []):
        gid = "grade:" + slug(grade)
        stage = "III kooliaste" if grade.startswith("9") else "IV kooliaste" if grade.startswith("12") else None
        nodes.append(graph_node(gid, "Grade", grade, "curriculum_backbone", school_stage=stage))
        if stage in stage_ids:
            edges.append(graph_edge(stage_ids[stage], gid, "contains", "curriculum_backbone"))

    node_ids = {n["id"] for n in nodes}
    official_anchors = load_official_anchors(run_dir)
    official_anchor_ids = set()
    topic_ids = {}
    for anchor in official_anchors:
        if not anchor.get("id") or not anchor.get("label_et"):
            continue
        official_anchor_ids.add(anchor["id"])
        nodes.append(
            graph_node(
                anchor["id"],
                "LearningOutcome",
                anchor["label_et"],
                "curriculum_backbone",
                confidence=0.95,
                status="official_anchor",
                source_authority="official_curriculum",
                source_url=anchor.get("source_url"),
                subject=anchor.get("subject"),
                school_stages=anchor.get("school_stages", []),
                grades=anchor.get("grades", []),
                topics=anchor.get("topics", []),
            )
        )
        node_ids.add(anchor["id"])
        subject_id = subject_ids.get(anchor.get("subject"))
        if subject_id:
            edges.append(graph_edge(subject_id, anchor["id"], "has_learning_outcome", "curriculum_backbone", confidence=0.95, source_authority="official_curriculum"))
        for stage in anchor.get("school_stages", []):
            if stage in stage_ids:
                edges.append(graph_edge(stage_ids[stage], anchor["id"], "frames_learning_outcome", "curriculum_backbone", confidence=0.9, source_authority="official_curriculum"))
        for grade in anchor.get("grades", []):
            gid = "grade:" + slug(grade)
            if gid not in node_ids:
                stage = "III kooliaste" if str(grade).startswith(("7", "8", "9")) else "IV kooliaste" if str(grade).startswith(("10", "11", "12")) else None
                nodes.append(graph_node(gid, "Grade", grade, "curriculum_backbone", school_stage=stage))
                node_ids.add(gid)
                if stage in stage_ids:
                    edges.append(graph_edge(stage_ids[stage], gid, "contains", "curriculum_backbone"))
            edges.append(graph_edge(gid, anchor["id"], "frames_learning_outcome", "curriculum_backbone", confidence=0.85, source_authority="official_curriculum"))
        for topic in anchor.get("topics", []):
            if not topic:
                continue
            topic_id = topic_ids.get(topic) or stable_id("topic", topic)
            topic_ids[topic] = topic_id
            if topic_id not in node_ids:
                nodes.append(graph_node(topic_id, "Topic", topic, "curriculum_backbone", confidence=0.9, status="official_anchor", source_authority="official_curriculum"))
                node_ids.add(topic_id)
            if subject_id:
                edges.append(graph_edge(subject_id, topic_id, "has_topic", "curriculum_backbone", confidence=0.9, source_authority="official_curriculum"))
            edges.append(graph_edge(topic_id, anchor["id"], "has_learning_outcome", "curriculum_backbone", confidence=0.95, source_authority="official_curriculum"))

    for node in canonical_nodes:
        nodes.append(node)
        target_type = node["type"]
        if target_type in UNIT_TYPES:
            edge_type = {
                "SkillUnit": "has_skill_unit",
                "KnowledgeUnit": "has_knowledge_unit",
                "CompetenceUnit": "has_competence_unit",
            }[target_type]
            anchors = [aid for aid in node.get("official_anchor_ids", []) if aid in official_anchor_ids]
            if anchors:
                for anchor_id in anchors:
                    edges.append(graph_edge(anchor_id, node["id"], edge_type, "curriculum_content", confidence=node.get("confidence", 0.6), evidence_ids=node.get("evidence_chunk_ids", []), source_authority="textbook_plus_official_anchor"))
            else:
                edges.append(graph_edge("domain:keel_ja_kirjandus", node["id"], edge_type, "curriculum_content", confidence=node.get("confidence", 0.6), evidence_ids=node.get("evidence_chunk_ids", [])))
        elif target_type == "TaskSubtype":
            edges.append(graph_edge("domain:keel_ja_kirjandus", node["id"], "has_task_subtype", "assessment_task", confidence=node.get("confidence", 0.6), evidence_ids=node.get("evidence_chunk_ids", [])))
        elif target_type in {"AssessmentCriterion", "CriterionDimension", "LevelExpectation"}:
            edges.append(graph_edge("domain:keel_ja_kirjandus", node["id"], "has_assessment_element", "assessment_task", confidence=node.get("confidence", 0.6), evidence_ids=node.get("evidence_chunk_ids", [])))

    graph_node_ids = {n["id"] for n in nodes}
    for edge in read_jsonl(run_dir / "canonical_edges.jsonl"):
        if edge.get("type") == "same_as":
            continue
        if edge.get("source") in graph_node_ids and edge.get("target") in graph_node_ids:
            edges.append(
                graph_edge(
                    edge["source"],
                    edge["target"],
                    edge["type"],
                    edge.get("kg_layer", "curriculum_content"),
                    confidence=edge.get("confidence", 0.6),
                    method=edge.get("method", "responses_api_semantic_merge"),
                    rationale=edge.get("rationale"),
                    source_authority="llm_semantic_adjudication",
                )
            )

    nodes = dedupe_nodes(nodes)
    edges = dedupe_edges(normalize_semantic_edge_directions(edges, nodes))
    write_jsonl(graph_dir / "nodes.jsonl", nodes)
    write_jsonl(graph_dir / "edges.jsonl", edges)
    write_csv(graph_dir / "nodes.csv", nodes)
    write_csv(graph_dir / "edges.csv", edges)
    export_graphml(graph_dir, nodes, edges)
    (graph_dir / "cytoscape_elements.json").write_text(json.dumps({"nodes": [{"data": n} for n in nodes], "edges": [{"data": e} for e in edges]}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"nodes": len(nodes), "edges": len(edges)}, ensure_ascii=False, indent=2))


def xml_safe(value: Any) -> Any:
    if value is None:
        return ""
    if isinstance(value, (int, float, bool)):
        return value
    text = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False, sort_keys=True)
    text = "".join(ch if ch in "\t\n\r" or ord(ch) >= 32 else " " for ch in text)
    return text[:32000]


def export_graphml(graph_dir: Path, nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> None:
    try:
        import networkx as nx

        graph = nx.MultiDiGraph()
        for node in nodes:
            graph.add_node(node["id"], **{k: xml_safe(v) for k, v in node.items() if k != "id"})
        for edge in edges:
            graph.add_edge(edge["source"], edge["target"], key=edge["id"], **{k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}})
        nx.write_graphml(graph, graph_dir / "graph.graphml")
        nx.read_graphml(graph_dir / "graph.graphml")
    except Exception as exc:
        (graph_dir / "graphml_error.txt").write_text(repr(exc), encoding="utf-8")


def qc(args: argparse.Namespace) -> None:
    run_dir = Path(args.run).resolve()
    graph_dir = run_dir / "graph"
    nodes = read_jsonl(graph_dir / "nodes.jsonl")
    edges = read_jsonl(graph_dir / "edges.jsonl")
    node_ids = {n["id"] for n in nodes}
    dangling = [e for e in edges if e["source"] not in node_ids or e["target"] not in node_ids]
    connected = {e["source"] for e in edges} | {e["target"] for e in edges}
    isolated = [n for n in nodes if n["id"] not in connected]
    raw_labels = [n for n in nodes if re.match(r"^[a-z_]+:", str(n.get("label_et") or ""))]
    counts = Counter(n["type"] for n in nodes)
    edge_counts = Counter(e["type"] for e in edges)
    report = [
        "# Minimal Pipeline QC",
        "",
        f"- Nodes: {len(nodes):,}",
        f"- Edges: {len(edges):,}",
        f"- Dangling edges: {len(dangling):,}",
        f"- Isolated nodes: {len(isolated):,}",
        f"- Raw-looking labels: {len(raw_labels):,}",
        "",
        "## Node Counts",
        "",
    ]
    for key, value in counts.most_common():
        report.append(f"- {key}: {value:,}")
    report.extend(["", "## Edge Counts", ""])
    for key, value in edge_counts.most_common():
        report.append(f"- {key}: {value:,}")
    (run_dir / "reports").mkdir(parents=True, exist_ok=True)
    (run_dir / "reports" / "qc_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"nodes": len(nodes), "edges": len(edges), "dangling": len(dangling), "isolated": len(isolated), "raw_labels": len(raw_labels)}, ensure_ascii=False, indent=2))


def run_all(args: argparse.Namespace) -> None:
    inventory(args)
    prepare(args)
    extract(args)
    canonicalize(args)
    build_graph(args)
    qc(args)
    write_run_report(Path(args.run).resolve(), args)


def run_with_merge(args: argparse.Namespace) -> None:
    inventory(args)
    prepare(args)
    extract(args)
    merge_blocks(args)
    build_graph(args)
    qc(args)
    write_run_report(Path(args.run).resolve(), args)


def run_with_iterative_merge(args: argparse.Namespace) -> None:
    inventory(args)
    prepare(args)
    extract(args)
    iterative_merge_blocks(args)
    build_graph(args)
    qc(args)
    write_run_report(Path(args.run).resolve(), args)


def write_run_report(run_dir: Path, args: argparse.Namespace) -> None:
    manifest = load_manifest(run_dir)
    report = [
        "# Minimal Pipeline Run Report",
        "",
        f"- Run: `{manifest['run_id']}`",
        f"- Dry run: {bool(args.dry_run)}",
        f"- Model: `{args.model}`",
        f"- Sources: {len(manifest.get('sources', []))}",
        "",
        "This run is a minimal autonomous pipeline test. With `--dry-run`, candidate extraction is heuristic and only verifies plumbing. With an API key and without `--dry-run`, candidates come from the Responses API. The `run-merge` command adds blocked LLM merge/adjudication before graph export.",
    ]
    (run_dir / "reports").mkdir(parents=True, exist_ok=True)
    (run_dir / "reports" / "run_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Minimal autonomous curriculum KG pipeline")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("bootstrap-test")
    p.add_argument("--out", required=True)
    p.set_defaults(func=bootstrap_test)

    p = sub.add_parser("bootstrap-curated-merge-test")
    p.add_argument("--out", required=True)
    p.set_defaults(func=bootstrap_curated_merge_test)

    p = sub.add_parser("bootstrap-real-slice-merge-test")
    p.add_argument("--out", required=True)
    p.set_defaults(func=bootstrap_real_slice_merge_test)

    p = sub.add_parser("bootstrap-synthetic-merge-stress-test")
    p.add_argument("--out", required=True)
    p.set_defaults(func=bootstrap_synthetic_merge_stress_test)

    for name, func in [
        ("inventory", inventory),
        ("prepare", prepare),
        ("extract", extract),
        ("merge", merge_candidates),
        ("merge-blocks", merge_blocks),
        ("iterate-merge", iterative_merge_blocks),
        ("canonicalize", canonicalize),
        ("build-graph", build_graph),
        ("qc", qc),
        ("run", run_all),
        ("run-merge", run_with_merge),
        ("run-iterative-merge", run_with_iterative_merge),
    ]:
        sp = sub.add_parser(name)
        sp.add_argument("--run", required=True)
        sp.add_argument("--model", default=DEFAULT_MODEL)
        sp.add_argument("--reasoning-effort", default="none")
        sp.add_argument("--max-batches", type=int, default=None)
        sp.add_argument("--merge-block-size", type=int, default=None)
        sp.add_argument("--merge-neighbor-top-k", type=int, default=None)
        sp.add_argument("--merge-min-score", type=float, default=None)
        sp.add_argument("--max-merge-iterations", type=int, default=None)
        sp.add_argument("--max-merge-llm-calls", type=int, default=None)
        sp.add_argument("--max-merge-total-tokens", type=int, default=None)
        sp.add_argument("--min-merge-rate", type=float, default=None)
        sp.add_argument("--dry-run", action="store_true")
        sp.set_defaults(func=func)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
