from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from common import ROOT, read_jsonl

MODEL_CANDIDATES = [
    "kiri-ai/distiluse-base-multilingual-cased-et",
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
    "intfloat/multilingual-e5-small",
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=MODEL_CANDIDATES[0])
    parser.add_argument("--limit", type=int, default=64)
    args = parser.parse_args()

    try:
        from sentence_transformers import SentenceTransformer
    except Exception as exc:  # noqa: BLE001
        raise SystemExit(
            "sentence-transformers is not installed. Install it only after the base graph gates pass: "
            "python -m pip install sentence-transformers torch"
        ) from exc

    candidates = read_jsonl(ROOT / "data/interim/candidates/candidate_units.jsonl")[: args.limit]
    texts = [c["label"] for c in candidates] or [
        "analüüsib tegelaste suhteid",
        "kasutab lõikude vahel sidusvahendeid",
        "teksti sidusus",
    ]
    start = time.time()
    model = SentenceTransformer(args.model)
    load_seconds = time.time() - start
    start = time.time()
    emb = model.encode(texts, normalize_embeddings=True)
    encode_seconds = time.time() - start
    report = {
        "model": args.model,
        "texts": len(texts),
        "embedding_shape": list(emb.shape),
        "load_seconds": round(load_seconds, 3),
        "encode_seconds": round(encode_seconds, 3),
        "texts_per_second": round(len(texts) / max(0.001, encode_seconds), 3),
    }
    out = ROOT / "reports/contextual_embedding_benchmark.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
