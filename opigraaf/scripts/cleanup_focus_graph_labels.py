from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from typing import Any

import networkx as nx

from common import ROOT as PROJECT_ROOT
from common import read_jsonl, write_jsonl
from build_v2_unified_graph import xml_safe


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
REPORTS = PROJECT_ROOT / "reports"


REPLACEMENTS = {
    "võ?": "vää",
    "v?rt": "väärt",
    "v?": "võ",
    "?pp": "õpp",
    "?pit": "õpit",
    "?pi": "õpi",
    "?ig": "õig",
    "?ra": "ära",
    "?rat": "ärat",
    "?he": "ühe",
    "?les": "üles",
    "?ld": "üld",
    "?his": "ühis",
    "?anr": "žanr",
    "?rg": "ärg",
    "?rk": "ärk",
    "?l": "ül",
    "?u": "õu",
    "?o": "õo",
    "m?te": "mõte",
    "m?tted": "mõtted",
    "peam?tte": "peamõtte",
    "m?ist": "mõist",
    "m?test": "mõtest",
    "m?jut": "mõjut",
    "k?ne": "kõne",
    "k?sim": "küsim",
    "k?siraamat": "käsiraamat",
    "k?nek??nd": "kõnekäänd",
    "h??lik": "häälik",
    "kaash??lik": "kaashäälik",
    "j?rjest": "järjest",
    "j?rg": "järg",
    "j?reld": "järeld",
    "r?hmas": "rühmas",
    "sõndmus": "sündmus",
    "n?idend": "näidend",
    "s?non??m": "sünonüüm",
    "s?navorm": "sõnavorm",
    "s?naliik": "sõnaliik",
    "s?naraamat": "sõnaraamat",
    "t??": "töö",
    "l?bi": "läbi",
    "võhemalt": "vähemalt",
    "j?tkusuutlik": "jätkusuutlik",
    "kirjavahem?rgistus": "kirjavahemärgistus",
    "p?hiv?ide": "põhiväide",
    "l?petus": "lõpetus",
    "kokkuv?te": "kokkuvõte",
    "t??p": "tüüp",
    "t?hend": "tähend",
    "t?ps": "täps",
    "sõnon??me": "sünonüüme",
    "sõnon??m": "sünonüüm",
    "kaash?ülikuühendi": "kaashäälikuühendi",
    "kaash?üliku": "kaashääliku",
    "h?ülikuühendi": "häälikuühendi",
    "h?ülikusõsteemi": "häälikusüsteemi",
    "h?ülikut": "häälikut",
    "h?ülega": "häälega",
    "sulgh?üliku": "sulghääliku",
    "kõnek??ndu": "kõnekäändu",
    "kõnek??nu": "kõnekäändu",
    "f-i ja ? õigekiri": "f-i ja š õigekiri",
    "tõish?ülikuühendit": "täishäälikuühendit",
    "tõis- ja kaashäälik": "täis- ja kaashäälik",
    "tõis- ja kaash?ülik": "täis- ja kaashäälik",
    "tõhte": "tähte",
    "?nnitluse": "õnnitluse",
    "ette?tlemise": "etteütlemise",
    "n?idise": "näidise",
    "l?hiettekannet": "lühiettekannet",
    "l?hiettekande": "lühiettekande",
    "l?hiettekannet": "lühiettekannet",
}


def repair(text: str | None) -> str | None:
    if text is None:
        return None
    out = text
    for bad, good in REPLACEMENTS.items():
        out = out.replace(bad, good)
    return out


def repair_value(value: Any) -> Any:
    if isinstance(value, str):
        return repair(value)
    if isinstance(value, list):
        return [repair_value(item) for item in value]
    if isinstance(value, dict):
        return {key: repair_value(item) for key, item in value.items()}
    return value


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fields = []
    seen = set()
    for row in rows:
        for key in row:
            if key not in seen:
                seen.add(key)
                fields.append(key)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for k, v in row.items()})


def export(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> None:
    write_jsonl(FOCUS / "nodes.jsonl", nodes)
    write_jsonl(FOCUS / "edges.jsonl", edges)
    g = nx.MultiDiGraph()
    for node in nodes:
        g.add_node(node["id"], **{k: xml_safe(v) for k, v in node.items() if k != "id"})
    for edge in edges:
        g.add_edge(edge["source"], edge["target"], key=edge["id"], **{k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}})
    nx.write_graphml(g, FOCUS / "graph.graphml")
    nx.write_gexf(g, FOCUS / "graph.gexf")
    nx.read_graphml(FOCUS / "graph.graphml")
    nx.read_gexf(FOCUS / "graph.gexf")
    (FOCUS / "cytoscape_elements.json").write_text(json.dumps({"nodes": [{"data": n} for n in nodes], "edges": [{"data": e} for e in edges]}, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    edges = read_jsonl(FOCUS / "edges.jsonl")
    changes = []
    remaining_bad = []
    cleaned_nodes = []
    for node in nodes:
        old_label = node.get("label_et")
        old_desc = node.get("description")
        node = repair_value(node)
        if node.get("label_et") != old_label or node.get("description") != old_desc:
            changes.append({"id": node["id"], "type": node["type"], "old_label": old_label, "new_label": node.get("label_et"), "old_description": old_desc, "new_description": node.get("description")})
        if "?" in str(node.get("label_et") or ""):
            remaining_bad.append({"id": node["id"], "type": node["type"], "label_et": node.get("label_et")})
        cleaned_nodes.append(node)
    cleaned_edges = [repair_value(edge) for edge in edges]
    export(cleaned_nodes, cleaned_edges)
    write_csv(REPORTS / "focus_label_cleanup_changes.csv", changes)
    write_csv(REPORTS / "focus_label_cleanup_remaining_bad.csv", remaining_bad)
    report = [
        "# Focus Graph Label Cleanup",
        "",
        f"- Nodes changed: {len(changes):,}",
        f"- Remaining labels containing `?`: {len(remaining_bad):,}",
        "",
        "This pass repaired known mojibake/question-mark damage in labels and descriptions after backlog integration.",
    ]
    (REPORTS / "focus_label_cleanup_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"changed": len(changes), "remaining_bad": len(remaining_bad)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
