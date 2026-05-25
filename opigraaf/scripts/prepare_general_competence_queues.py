from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from common import ROOT as PROJECT_ROOT
from common import read_jsonl


FOCUS = PROJECT_ROOT / "graph" / "snapshots" / "v2_curriculum_focus"
OUT = PROJECT_ROOT / "data" / "processed" / "semantic_decisions" / "general_competence"


GENERAL_COMPETENCES = [
    {
        "id": "general_competence:kultuuri_ja_vaartuspadevus",
        "label_et": "Kultuuri- ja väärtuspädevus",
        "short_definition": "Väärtustab inimsuhteid, ühiskonda, kultuuri, loomingut, keelt ja kirjandust; mõtestab väärtusi, kõlblust, esteetikat ja kultuurilist identiteeti.",
        "typical_language_literature_signals": ["kirjandus", "kultuur", "väärtus", "identiteet", "rahvaluule", "autor", "teos", "eetika", "sõnavabadus", "esteetiline"],
    },
    {
        "id": "general_competence:sotsiaalne_ja_kodanikupadevus",
        "label_et": "Sotsiaalne ja kodanikupädevus",
        "short_definition": "Toimib aktiivse, teadliku, abivalmi ja vastutustundliku ühiskonnaliikmena; teeb koostööd, arvestab teistega, osaleb aruteludes ja mõistab ühiskondlikke suhteid.",
        "typical_language_literature_signals": ["arutelu", "väitlus", "koostöö", "kuulamine", "kodanik", "ühiskond", "suhtlus", "vastuväide", "seisukoht"],
    },
    {
        "id": "general_competence:enesemaaratluspadevus",
        "label_et": "Enesemääratluspädevus",
        "short_definition": "Mõistab ja hindab iseennast, oma tugevusi, vajadusi, väärtusi, rolle ja arengut; kujundab enesekohast väljendust ja refleksiooni.",
        "typical_language_literature_signals": ["eneseväljendus", "oma arvamus", "seisukoht", "refleksioon", "lugemiseelistus", "oma kogemus", "identiteet"],
    },
    {
        "id": "general_competence:opipadevus",
        "label_et": "Õpipädevus",
        "short_definition": "Korraldab õppimist, kasutab õpistrateegiaid, hangib ja töötleb infot, analüüsib teadmisi ja oskab õppida eri allikatest.",
        "typical_language_literature_signals": ["infootsing", "allikas", "sõnaraamat", "käsiraamat", "konspekt", "kokkuvõte", "õpistrateegia", "küsimus", "analüüs"],
    },
    {
        "id": "general_competence:suhtluspadevus",
        "label_et": "Suhtluspädevus",
        "short_definition": "Väljendab end selgelt, asjakohaselt ja viisakalt suuliselt, kirjalikult ja multimodaalselt; kuulab, loeb, kirjutab, arutleb ja kasutab sobivaid suhtluskanaleid.",
        "typical_language_literature_signals": ["kirjutab", "loeb", "kuulab", "räägib", "esitab", "suhtleb", "tekst", "arvamus", "kommentaar", "ettekanne", "kõne"],
    },
    {
        "id": "general_competence:matemaatika_loodusteaduste_tehnoloogiaalane_padevus",
        "label_et": "Matemaatika-, loodusteaduste ja tehnoloogiaalane pädevus",
        "short_definition": "Kasutab loogilist, süsteemset ja tõenduspõhist mõtlemist, andmeid, skeeme, tabeleid, digitehnoloogiat ja tehnoloogilist kirjaoskust probleemide lahendamisel.",
        "typical_language_literature_signals": ["tabel", "diagramm", "skeem", "andmed", "struktuur", "loogika", "tehnoloogia", "digivahend", "vormistus"],
    },
    {
        "id": "general_competence:ettevotlikkuspadevus",
        "label_et": "Ettevõtlikkuspädevus",
        "short_definition": "Algatab ideid, seab eesmärke, kavandab ja viib tegevusi ellu, lahendab probleeme, võtab vastutust ning loob väärtust.",
        "typical_language_literature_signals": ["loovtöö", "projekt", "algatab", "kavandab", "probleemülesanne", "koostab", "loob", "esitlus", "omalooming"],
    },
    {
        "id": "general_competence:digipadevus",
        "label_et": "Digipädevus",
        "short_definition": "Kasutab digivahendeid, digikeskkondi ja infoallikaid eesmärgipäraselt, turvaliselt ja kriitiliselt; loob ja vormistab digisisu.",
        "typical_language_literature_signals": ["digivahend", "internet", "veeb", "e-kiri", "veebisuhtlus", "õigekirjakorrektor", "slaid", "blogi", "podcast", "digikeskkond"],
    },
]


def compact(node: dict[str, Any]) -> dict[str, Any]:
    keep = ["id", "type", "label_et", "description", "source_authority", "review_status", "kg_layer"]
    return {key: node[key] for key in keep if key in node and node[key] not in (None, "", [], {})}


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    nodes = read_jsonl(FOCUS / "nodes.jsonl")
    annotatable = [
        compact(node)
        for node in nodes
        if node["type"] in {"SkillUnit", "KnowledgeUnit", "CompetenceUnit", "TaskSubtype"}
    ]
    common = {
        "instructions": [
            "Annotate every assigned node with one or more üldpädevused it genuinely supports.",
            "Do not rely on keyword overlap as the decision. Use curriculum semantics and the node label/description.",
            "Use 1-3 competences for most nodes. Use more only when the unit/task clearly develops multiple general competences.",
            "Suhtluspädevus will apply to many language/literature units, but do not make it the only label when a stronger learning, cultural, social/civic, digital, entrepreneurial, self-definition, or STEM/technology competence is also clearly supported.",
            "If a node is malformed or should not be in the KG, mark remove_from_focus. Use this sparingly because the main graph has already been cleaned.",
        ],
        "decision_schema": {
            "source_id": "GeneralCompetence id",
            "source_label": "GeneralCompetence label",
            "decision": "link | remove_from_focus | no_focus_edge",
            "target_id": "unit/task node id",
            "target_label": "unit/task label",
            "edge_type": "has_supporting_unit | has_supporting_task",
            "confidence": "0.55-0.95",
            "rationale": "semantic reason why the unit/task supports this üldpädevus",
        },
        "general_competences": GENERAL_COMPETENCES,
    }
    batch_size = 200
    for i in range(0, len(annotatable), batch_size):
        batch = annotatable[i : i + batch_size]
        write_json(OUT / f"general_competence_queue_{i // batch_size + 1:03d}.json", {**common, "items": batch, "start_index": i, "end_index": i + len(batch) - 1})
    write_json(OUT / "general_competence_definitions.json", GENERAL_COMPETENCES)
    print(json.dumps({"items": len(annotatable), "batches": (len(annotatable) + batch_size - 1) // batch_size, "out": str(OUT)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
