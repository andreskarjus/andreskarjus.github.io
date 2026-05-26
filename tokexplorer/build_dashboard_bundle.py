#!/usr/bin/env python3
"""Build the data file for the supplementary TikTok corpus atlas."""

from __future__ import annotations

import json
import re
import shutil
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

APP_DIR = Path(__file__).resolve().parent
ROOT = APP_DIR.parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from cooccurrence_analysis import load_collapsed_dataset

DATA_DIR = APP_DIR / "data"
VENDOR_DIR = APP_DIR / "vendor"

RAW_JSON_PATH = ROOT / "MASTER_SCRAPE_LLM_MERGED_DATA_26-01-26_20-25.json"
PROMPT_PATH = ROOT / "prompt_v4.txt"
CACHE_COORDS_PATH = ROOT / "cooccurrence_outputs" / "paper_dataset_map_coordinates.tsv"
COMMENT_METRICS_PATH = ROOT / "cooccurrence_outputs" / "paper_comment_map_metrics_with_activity.tsv"
FEATURE_CATALOG_PATH = ROOT / "analytics_outputs" / "analytics_feature_catalog.tsv"

APP_DATA_PATH = DATA_DIR / "app-data.js"
PLOTLY_TARGET_PATH = VENDOR_DIR / "plotly.min.js"

SECTION_LABELS = OrderedDict(
    [
        ("general_characteristics", "General Characteristics"),
        ("GRZENKOWICZ_WILDFEUER_2025_ANNOTATION", "Multimodal Annotation"),
        ("rhetorical_and_audience_analysis", "Rhetorical & Audience Analysis"),
        ("chandler_semiotic_analysis", "Semiotic Analysis"),
        ("hall_encoding_decoding_analysis", "Hall Encoding / Decoding"),
        ("bk_uses_and_gratifications_analysis", "Uses & Gratifications"),
        ("burke_dramatistic_analysis", "Burke Dramatistic Analysis"),
        ("aristotle_rhetorical_appeals", "Aristotle Rhetorical Appeals"),
        ("propp_campbell_narrative_arc_analysis_sp", "Narrative Arc"),
        ("labov_narrative_analysis", "Labov Narrative Analysis"),
        ("polti_dramatic_situations_sp", "Polti Dramatic Situations"),
    ]
)

SIZE_DEFAULTS = OrderedDict(
    [
        ("none", "Constant Size"),
        ("likes", "Like Count"),
        ("comments", "Comment Count"),
        ("shares", "Share Count"),
        ("saves", "Save Count"),
        ("follower_count", "Follower Count"),
        ("following_count", "Following Count"),
        ("total_likes_count", "Account Total Likes"),
        ("video_age_days", "Video Age (Days)"),
        ("scraped_top_level_comments", "Scraped Top-Level Comments"),
        ("scraped_total_replies", "Scraped Total Replies"),
        ("scraped_total_nodes", "Scraped Total Comment Nodes"),
        ("avg_thread_size", "Average Thread Size"),
        ("max_thread_length", "Max Thread Length"),
        ("activity_visible_char_count", "Visible Comment Characters"),
        ("activity_used_char_count", "Used Comment Characters"),
    ]
)

NUMERIC_VARIABLES = OrderedDict(
    [
        ("likes", {"label": "Like Count", "group": "Platform Metadata", "description": "Raw video like count."}),
        ("comments", {"label": "Comment Count", "group": "Platform Metadata", "description": "Raw video comment count."}),
        ("shares", {"label": "Share Count", "group": "Platform Metadata", "description": "Raw video share count."}),
        ("saves", {"label": "Save Count", "group": "Platform Metadata", "description": "Raw video save count."}),
        ("follower_count", {"label": "Follower Count", "group": "Platform Metadata", "description": "Account follower count snapshot."}),
        ("following_count", {"label": "Following Count", "group": "Platform Metadata", "description": "Account following count snapshot."}),
        ("total_likes_count", {"label": "Account Total Likes", "group": "Platform Metadata", "description": "Account total like count snapshot."}),
        ("video_age_days", {"label": "Video Age (Days)", "group": "Platform Metadata", "description": "Age of the video at scrape time."}),
        ("scraped_top_level_comments", {"label": "Scraped Top-Level Comments", "group": "Comment Ecology", "description": "Observed top-level comments in the scraped thread."}),
        ("scraped_total_replies", {"label": "Scraped Total Replies", "group": "Comment Ecology", "description": "Observed replies across all scraped threads."}),
        ("scraped_total_nodes", {"label": "Scraped Total Comment Nodes", "group": "Comment Ecology", "description": "Top-level comments plus replies in the scraped thread tree."}),
        ("avg_thread_size", {"label": "Average Thread Size", "group": "Comment Ecology", "description": "Average number of comments per observed top-level thread."}),
        ("max_thread_length", {"label": "Max Thread Length", "group": "Comment Ecology", "description": "Largest observed reply-thread size."}),
        ("activity_visible_char_count", {"label": "Visible Comment Characters", "group": "Comment Ecology", "description": "Visible characters available to the comment-coding pass."}),
        ("activity_used_char_count", {"label": "Used Comment Characters", "group": "Comment Ecology", "description": "Characters used for the comment-coding pass."}),
    ]
)

COMMENT_ACTIVITY_ORDER = [
    "supportive",
    "critical",
    "information_seeking",
    "neutral",
    "unclear",
]

COMMENT_ACTIVITY_LABELS = {
    "supportive": "Supportive",
    "critical": "Critical",
    "information_seeking": "Information-seeking",
    "neutral": "Neutral",
    "unclear": "Unclear / Not coded",
}


def friendly_variable_label(field_name: str) -> str:
    short_name = field_name.split(".", 1)[-1]
    short_name = re.sub(r"^(cat_|bin_)", "", short_name)
    short_name = short_name.removesuffix("_sp")
    label = short_name.replace("_", " ").strip()
    parts = [part for part in label.split(" ") if part]
    out = " ".join(word.capitalize() if word.islower() else word for word in parts)
    replacements = {
        "Bk": "BK",
        "Av": "A/V",
        "Labov Abstract Hook Strategy": "Labov Hook Strategy",
        "Coda Call To Action Type": "Coda CTA Type",
        "Semiotics Peirce Dominant Sign Mode": "Peircean Sign Mode",
        "Hall Anticipated Decoding Position": "Anticipated Decoding Position",
        "Polti Core Conflict": "Polti Core Conflict",
        "Narrative Arc Shape": "Narrative Arc Shape",
        "Music Emotion Cowen": "Music Emotion (Cowen)",
        "Address Affective Tone": "Address Affective Tone",
        "Address Power Dynamic": "Address Power Dynamic",
        "Address Social Distance": "Address Social Distance",
        "Address Directness": "Address Directness",
    }
    return replacements.get(out, out)


def wrap_label_for_plot(label: str) -> str:
    special = {
        "Surprising or Visually Arresting Image": "Surprising<br>or Visually<br>Arresting Image",
        "Provocative Question/Statement": "Provocative<br>Question/Statement",
        "Direct Address to a Niche Audience": "Direct Address to a<br>Niche Audience",
        "Abstract/Visual-Montage": "Abstract/Visual-<br>Montage",
        "Highly-Scripted/Performative": "Highly-Scripted/<br>Performative",
        "To Express/Share-Experience": "To Express/<br>Share-Experience",
    }
    if label in special:
        return special[label]
    if len(label) <= 24:
        return label
    split_on = " / " if " / " in label else "/" if "/" in label else " "
    parts = label.split(split_on)
    if len(parts) > 1:
        midpoint = max(1, len(parts) // 2)
        left = split_on.join(parts[:midpoint])
        right = split_on.join(parts[midpoint:])
        return f"{left}<br>{right}"
    words = label.split(" ")
    midpoint = max(1, len(words) // 2)
    return f"{' '.join(words[:midpoint])}<br>{' '.join(words[midpoint:])}"


def normalize_text_field(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and np.isnan(value):
        return ""
    return str(value).strip()


def normalize_numeric_series(series: pd.Series) -> list[float | None]:
    numeric = pd.to_numeric(series, errors="coerce").replace([np.inf, -np.inf], np.nan)
    return [None if pd.isna(value) else float(value) for value in numeric]


def preferred_levels(catalog_row: pd.Series | None, series: pd.Series) -> list[str]:
    values = series.astype(str).str.strip()
    observed = [value for value in values.unique().tolist() if value]
    if catalog_row is None or "levels_after_collapse" not in catalog_row:
        return sorted(observed)
    try:
        raw = json.loads(catalog_row["levels_after_collapse"])
    except Exception:
        raw = []
    preferred = [level for level, _count in raw if level in observed]
    remaining = sorted(level for level in observed if level not in preferred)
    return preferred + remaining


def encode_categorical(series: pd.Series, *, level_order: list[str] | None = None) -> tuple[list[str], list[int]]:
    cleaned = series.astype(str).str.strip()
    cleaned = cleaned.replace({"": "Other"})
    levels = level_order[:] if level_order else []
    for value in cleaned.unique().tolist():
        if value and value not in levels:
            levels.append(value)
    level_lookup = {value: idx for idx, value in enumerate(levels)}
    codes = [level_lookup[value] for value in cleaned.tolist()]
    return levels, codes


def get_plotly_source_path() -> Path:
    import plotly

    source = Path(plotly.__file__).resolve().parent / "package_data" / "plotly.min.js"
    if not source.exists():
        raise FileNotFoundError(f"Could not locate Plotly bundle at {source}")
    return source


def load_prompt_spec() -> dict[str, Any]:
    return json.loads(PROMPT_PATH.read_text(encoding="utf-8"))


def build_metadata_records(raw_lookup: dict[str, dict[str, Any]], video_ids: list[str]) -> dict[str, list[str]]:
    source_urls: list[str] = []
    upload_dates: list[str] = []
    descriptions: list[str] = []
    summaries: list[str] = []
    for video_id in video_ids:
        rec = raw_lookup.get(video_id, {})
        source_urls.append(normalize_text_field(rec.get("source_url")))
        upload_dates.append(normalize_text_field(rec.get("upload_date_normalized") or rec.get("upload_date")))
        description = normalize_text_field(rec.get("description"))
        descriptions.append(re.sub(r"\s+", " ", description)[:220])
        summary = ""
        for path in [
            ("chandler_semiotic_analysis", "semiotics_barthes_denotation"),
            ("labov_narrative_analysis", "labov_summary_and_element_justification"),
            ("propp_campbell_narrative_arc_analysis_sp", "justification_narrative_arc"),
            ("burke_dramatistic_analysis", "burke_pentad_justification"),
        ]:
            candidate = rec
            for part in path:
                candidate = candidate.get(part) if isinstance(candidate, dict) else None
            text = normalize_text_field(candidate)
            if text and text != "Not Applicable":
                summary = text
                break
        summaries.append(re.sub(r"\s+", " ", summary)[:320])
    return {
        "source_url": source_urls,
        "upload_date": upload_dates,
        "description": descriptions,
        "summary": summaries,
    }


def build_bundle() -> dict[str, Any]:
    prompt_spec = load_prompt_spec()
    categories = prompt_spec["ANALYSIS_CATEGORIES"]

    df, catalog, feature_order = load_collapsed_dataset()
    coords = pd.read_csv(CACHE_COORDS_PATH, sep="\t")
    if len(df) != len(coords):
        raise ValueError(f"Collapsed dataset rows ({len(df)}) do not match projection coordinates ({len(coords)})")

    df = df.reset_index(drop=True).copy()
    df["dim1"] = coords["dim1"].to_numpy(dtype=float)
    df["dim2"] = coords["dim2"].to_numpy(dtype=float)

    comment_metrics = pd.read_csv(COMMENT_METRICS_PATH, sep="\t").copy()
    keep_comment_cols = [
        "video_filename",
        "scraped_top_level_comments",
        "scraped_total_replies",
        "scraped_total_nodes",
        "avg_thread_size",
        "max_thread_length",
        "comment_activity",
        "activity_visible_char_count",
        "activity_used_char_count",
    ]
    comment_metrics = comment_metrics[keep_comment_cols]
    df = df.merge(comment_metrics, on="video_filename", how="left")
    df["comment_activity"] = (
        df["comment_activity"]
        .astype(str)
        .str.strip()
        .replace({"": "unclear", "nan": "unclear", "None": "unclear"})
    )

    with RAW_JSON_PATH.open("r", encoding="utf-8") as handle:
        raw_lookup = json.load(handle)
    raw_meta = build_metadata_records(raw_lookup, df["video_filename"].astype(str).tolist())

    catalog_lookup = catalog.set_index("field").to_dict(orient="index")
    variable_meta: list[dict[str, Any]] = []
    categorical_data: dict[str, dict[str, Any]] = {}
    groups: list[dict[str, Any]] = []

    for section_key, section_label in SECTION_LABELS.items():
        section_spec = categories.get(section_key, {})
        section_variables: list[str] = []
        for field_name, field_prompt in section_spec.items():
            if field_name == "theory_guidance":
                continue
            full_key = f"{section_key}.{field_name}"
            if full_key not in feature_order:
                continue
            catalog_row = catalog_lookup.get(full_key)
            variable_type = "binary" if field_name.startswith("bin_") else "categorical"
            label = friendly_variable_label(full_key)
            levels, codes = encode_categorical(
                df[full_key],
                level_order=preferred_levels(catalog_row, df[full_key]),
            )
            categorical_data[full_key] = {
                "levels": levels,
                "codes": codes,
                "wrappedLevels": [wrap_label_for_plot(level) for level in levels],
            }
            variable_meta.append(
                {
                    "key": full_key,
                    "label": label,
                    "group": section_label,
                    "groupKey": section_key,
                    "type": variable_type,
                    "description": normalize_text_field(field_prompt),
                    "searchText": f"{label} {full_key} {field_prompt}",
                    "levelCount": len(levels),
                }
            )
            section_variables.append(full_key)
        if section_variables:
            groups.append({"key": section_key, "label": section_label, "variables": section_variables})

    comment_activity_levels, comment_activity_codes = encode_categorical(
        df["comment_activity"].map(lambda value: value if value in COMMENT_ACTIVITY_ORDER else "unclear"),
        level_order=COMMENT_ACTIVITY_ORDER,
    )
    categorical_data["comment_activity"] = {
        "levels": [COMMENT_ACTIVITY_LABELS.get(value, friendly_variable_label(value)) for value in comment_activity_levels],
        "codes": comment_activity_codes,
        "wrappedLevels": [
            wrap_label_for_plot(COMMENT_ACTIVITY_LABELS.get(value, friendly_variable_label(value)))
            for value in comment_activity_levels
        ],
    }
    variable_meta.append(
        {
            "key": "comment_activity",
            "label": "Comment Activity",
            "group": "Comment Ecology",
            "groupKey": "comment_ecology",
            "type": "categorical",
            "description": "Dominant coded audience-response activity in the comment thread.",
            "searchText": "Comment Activity supportive critical information-seeking neutral unclear",
            "levelCount": len(comment_activity_levels),
        }
    )
    groups.append({"key": "comment_ecology", "label": "Comment Ecology", "variables": ["comment_activity"]})

    numeric_data: dict[str, list[float | None]] = {
        "dim1": normalize_numeric_series(df["dim1"]),
        "dim2": normalize_numeric_series(df["dim2"]),
    }
    for key in NUMERIC_VARIABLES:
        numeric_data[key] = normalize_numeric_series(df[key])
        meta = NUMERIC_VARIABLES[key]
        variable_meta.append(
            {
                "key": key,
                "label": meta["label"],
                "group": meta["group"],
                "groupKey": meta["group"].lower().replace(" ", "_"),
                "type": "numeric",
                "description": meta["description"],
                "searchText": f"{meta['label']} {key} {meta['description']}",
            }
        )

    groups.append(
        {
            "key": "platform_metadata",
            "label": "Platform Metadata",
            "variables": [key for key, meta in NUMERIC_VARIABLES.items() if meta["group"] == "Platform Metadata"],
        }
    )
    groups.append(
        {
            "key": "comment_ecology_numeric",
            "label": "Comment Ecology Metrics",
            "variables": [key for key, meta in NUMERIC_VARIABLES.items() if meta["group"] == "Comment Ecology"],
        }
    )

    text_data = {
        "video_filename": [normalize_text_field(value) for value in df["video_filename"]],
        "username": [normalize_text_field(value) for value in df["username"]],
        "source_url": raw_meta["source_url"],
        "upload_date": raw_meta["upload_date"],
        "description": raw_meta["description"],
        "summary": raw_meta["summary"],
    }

    return {
        "meta": {
            "title": "Interactive TikTok Corpus Atlas",
            "rows": int(len(df)),
            "accounts": int(df["username"].astype(str).nunique()),
            "codedVariables": int(len(feature_order)),
            "projection": "Hamming-distance t-SNE",
            "sources": [
                RAW_JSON_PATH.name,
                FEATURE_CATALOG_PATH.name,
                CACHE_COORDS_PATH.name,
                COMMENT_METRICS_PATH.name,
            ],
            "defaultColor": "general_characteristics.cat_communicative_intent",
            "defaultSize": "likes",
            "defaultAnalysisA": "general_characteristics.cat_communicative_intent",
            "defaultAnalysisB": "likes",
        },
        "groups": groups,
        "variables": variable_meta,
        "sizeEligible": list(SIZE_DEFAULTS.keys()),
        "categorical": categorical_data,
        "numeric": numeric_data,
        "text": text_data,
    }


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    VENDOR_DIR.mkdir(parents=True, exist_ok=True)

    bundle = build_bundle()
    payload = "window.__TIKTOK_ATLAS_DATA__ = " + json.dumps(
        bundle,
        ensure_ascii=True,
        separators=(",", ":"),
    ) + ";\n"
    APP_DATA_PATH.write_text(payload, encoding="utf-8")

    plotly_source = get_plotly_source_path()
    shutil.copyfile(plotly_source, PLOTLY_TARGET_PATH)

    print(f"Wrote {APP_DATA_PATH}")
    print(f"Copied {plotly_source} -> {PLOTLY_TARGET_PATH}")


if __name__ == "__main__":
    main()
