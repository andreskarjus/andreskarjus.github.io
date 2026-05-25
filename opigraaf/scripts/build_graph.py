from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

import networkx as nx

from common import (
    ROOT,
    edge_id,
    ensure_dirs,
    evidence_id,
    graph_edge,
    graph_node,
    read_jsonl,
    source_doc_id,
    stable_id,
    write_csv,
    write_jsonl,
)


def add_node(nodes: dict[str, dict[str, Any]], node: dict[str, Any]) -> None:
    if node["id"] not in nodes:
        nodes[node["id"]] = node
    else:
        existing = nodes[node["id"]]
        for key in ("evidence", "aliases"):
            existing[key] = sorted(set(existing.get(key, []) + node.get(key, [])))
        if not existing.get("source_url") and node.get("source_url"):
            existing["source_url"] = node["source_url"]


def add_edge(edges: dict[str, dict[str, Any]], edge: dict[str, Any]) -> None:
    edges[edge["id"]] = edge


def add_source_and_evidence(nodes: dict[str, dict[str, Any]], edges: dict[str, dict[str, Any]], source_url: str, text: str, source_system: str) -> str:
    sid = source_doc_id(source_url)
    eid = evidence_id(source_url, text)
    add_node(nodes, graph_node(sid, "SourceDocument", source_url, source_system, source_url, "harvested", 1.0, []))
    add_node(nodes, graph_node(eid, "EvidenceSpan", text[:280], source_system, source_url, "harvested", 1.0, [], text=text[:1200]))
    add_edge(edges, graph_edge(eid, sid, "extracted_from", 1.0, "official", [], source_url))
    return eid


def stage_prefix(stage: str) -> str:
    return "pilot_" if stage == "pilot" else ""


def load_inputs(stage: str) -> dict[str, list[dict[str, Any]]]:
    prefix = stage_prefix(stage)
    data = {
        "subject_pages": read_jsonl(ROOT / f"data/interim/oppekava/{prefix}subject_pages.jsonl"),
        "outcomes": read_jsonl(ROOT / f"data/interim/oppekava/{prefix}learning_outcomes.jsonl"),
        "topics": read_jsonl(ROOT / f"data/interim/oppekava/{prefix}topics.jsonl"),
        "materials": read_jsonl(ROOT / f"data/interim/oppekava/{prefix}materials.jsonl"),
        "candidates": [],
        "canonical_units": [],
        "curriculum_chunks": [],
        "material_text": [],
    }
    # Full harvest can be intentionally capped or absent while later stages are
    # being tested. Use the validated pilot oppekava graph as a fallback so
    # curriculum/material ingestion can still be sanity-checked.
    if stage != "pilot" and not data["outcomes"]:
        data["subject_pages"] = read_jsonl(ROOT / "data/interim/oppekava/pilot_subject_pages.jsonl")
        data["outcomes"] = read_jsonl(ROOT / "data/interim/oppekava/pilot_learning_outcomes.jsonl")
        data["topics"] = read_jsonl(ROOT / "data/interim/oppekava/pilot_topics.jsonl")
        data["materials"] = read_jsonl(ROOT / "data/interim/oppekava/pilot_materials.jsonl")
    if stage in {"v1_curriculum_steered", "final"}:
        data["curriculum_chunks"] = read_jsonl(ROOT / "data/interim/curriculum/chunks.jsonl")
        data["curriculum_chunks"].extend(read_jsonl(ROOT / "data/interim/curriculum/previous_chunks.jsonl"))
        data["curriculum_chunks"].extend(read_jsonl(ROOT / "data/interim/curriculum/direct_source_chunks.jsonl"))
    if stage == "final":
        data["candidates"] = read_jsonl(ROOT / "data/interim/candidates/candidate_units.jsonl")
        data["canonical_units"] = read_jsonl(ROOT / "data/processed/canonical_units.jsonl")
        data["material_text"] = read_jsonl(ROOT / "data/interim/materials/material_text_chunks.jsonl")
        data["material_text"].extend(read_jsonl(ROOT / "data/interim/materials/previous_material_chunks.jsonl"))
        data["material_text"].extend(read_jsonl(ROOT / "data/interim/materials/web_source_chunks.jsonl"))
        data["material_text"].extend(read_jsonl(ROOT / "data/interim/materials/direct_source_chunks.jsonl"))
    return data


def build(stage: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    data = load_inputs(stage)
    nodes: dict[str, dict[str, Any]] = {}
    edges: dict[str, dict[str, Any]] = {}

    for subject_page in data["subject_pages"]:
        subject_label = subject_page["subject"]
        source_url = subject_page["html_url"]
        ev = add_source_and_evidence(nodes, edges, source_url, subject_label, "oppekava")
        subject_id = stable_id("subject", subject_label)
        add_node(nodes, graph_node(subject_id, "Subject", subject_label, "oppekava", source_url, "official", 1.0, [ev], subject=subject_label))

    for topic in data["topics"]:
        label = topic["label"]
        source_url = topic.get("url")
        ev = add_source_and_evidence(nodes, edges, source_url or topic.get("ask_url", ""), label, "oppekava")
        topic_id = stable_id("topic", source_url or label)
        add_node(
            nodes,
            graph_node(
                topic_id,
                "Topic",
                label,
                "oppekava",
                source_url,
                "official",
                1.0,
                [ev],
                subject=topic.get("subject"),
                school_stage=", ".join(topic.get("school_stages", [])) or None,
            ),
        )
        subject_id = stable_id("subject", topic["subject"])
        add_edge(edges, graph_edge(subject_id, topic_id, "has_topic", 1.0, "official", [ev], source_url))
        for subtopic in topic.get("subtopics", []):
            if not subtopic.get("label"):
                continue
            sub_id = stable_id("topic", subtopic.get("url") or subtopic["label"])
            add_node(nodes, graph_node(sub_id, "Topic", subtopic["label"], "oppekava", subtopic.get("url"), "official", 0.95, [ev], subject=topic.get("subject")))
            add_edge(edges, graph_edge(topic_id, sub_id, "contains", 0.95, "official", [ev], source_url))

    for outcome in data["outcomes"]:
        label = outcome["label"]
        source_url = outcome.get("url")
        ev = add_source_and_evidence(nodes, edges, source_url or outcome.get("ask_url", ""), label, "oppekava")
        outcome_id = stable_id("outcome", source_url or label)
        add_node(
            nodes,
            graph_node(
                outcome_id,
                "LearningOutcome",
                label,
                "oppekava",
                source_url,
                "official",
                1.0,
                [ev],
                grade=", ".join(outcome.get("grades", [])) or None,
                school_stage=", ".join(outcome.get("school_stages", [])) or None,
                subject=outcome.get("subject"),
                verbs=outcome.get("verbs", []),
            ),
        )
        subject_id = stable_id("subject", outcome["subject"])
        add_edge(edges, graph_edge(subject_id, outcome_id, "has_learning_outcome", 1.0, "official", [ev], source_url))
        for topic in outcome.get("topics", []):
            if not topic.get("label"):
                continue
            topic_id = stable_id("topic", topic.get("url") or topic["label"])
            add_node(nodes, graph_node(topic_id, "Topic", topic["label"], "oppekava", topic.get("url"), "official", 1.0, [ev], subject=outcome.get("subject")))
            add_edge(edges, graph_edge(topic_id, outcome_id, "has_learning_outcome", 1.0, "official", [ev], source_url))
        for grade in outcome.get("grades", []):
            grade_id = stable_id("grade", grade)
            add_node(nodes, graph_node(grade_id, "Grade", grade, "oppekava", source_url, "official", 1.0, [ev]))
            add_edge(edges, graph_edge(outcome_id, grade_id, "has_grade", 1.0, "official", [ev], source_url))
        for stage_label in outcome.get("school_stages", []):
            stage_id = stable_id("stage", stage_label)
            add_node(nodes, graph_node(stage_id, "SchoolStage", stage_label, "oppekava", source_url, "official", 1.0, [ev]))
            add_edge(edges, graph_edge(outcome_id, stage_id, "has_stage", 1.0, "official", [ev], source_url))
        for req in outcome.get("requires", []):
            if req.get("label"):
                req_id = stable_id("outcome", req.get("url") or req["label"])
                add_node(nodes, graph_node(req_id, "LearningOutcome", req["label"], "oppekava", req.get("url"), "official", 0.9, [ev], subject=outcome.get("subject")))
                add_edge(edges, graph_edge(outcome_id, req_id, "requires", 0.9, "official", [ev], source_url))
        for concept in outcome.get("concepts", []):
            if not concept.get("label"):
                continue
            kid = stable_id("knowledge", concept.get("url") or concept["label"])
            add_node(nodes, graph_node(kid, "Knowledge", concept["label"], "oppekava", concept.get("url"), "candidate", 0.82, [ev], subject=outcome.get("subject")))
            add_edge(edges, graph_edge(outcome_id, kid, "mentions", 0.82, "official", [ev], source_url))

    for material in data["materials"]:
        label = material["label"]
        source_url = material.get("url")
        ev = add_source_and_evidence(nodes, edges, source_url or material.get("ask_url", ""), label, "oppekava")
        mid = stable_id("material", source_url or label)
        add_node(
            nodes,
            graph_node(
                mid,
                "Material",
                label,
                "oppekava",
                source_url,
                "harvested",
                0.85,
                [ev],
                grade=", ".join(material.get("grades", [])) or None,
                school_stage=", ".join(material.get("school_stages", [])) or None,
                subject=material.get("subject"),
                ekoolikott_id=material.get("ekoolikott_id"),
            ),
        )
        add_edge(edges, graph_edge(stable_id("subject", material["subject"]), mid, "contains", 0.75, "official", [ev], source_url))
        for topic in material.get("topics", []):
            if topic.get("label"):
                topic_id = stable_id("topic", topic.get("url") or topic["label"])
                add_node(nodes, graph_node(topic_id, "Topic", topic["label"], "oppekava", topic.get("url"), "official", 0.85, [ev], subject=material.get("subject")))
                add_edge(edges, graph_edge(mid, topic_id, "aligned_to", 0.75, "official", [ev], source_url))
        for outcome in material.get("outcomes", []):
            if outcome.get("label"):
                outcome_id = stable_id("outcome", outcome.get("url") or outcome["label"])
                add_node(nodes, graph_node(outcome_id, "LearningOutcome", outcome["label"], "oppekava", outcome.get("url"), "official", 0.85, [ev], subject=material.get("subject")))
                add_edge(edges, graph_edge(mid, outcome_id, "teaches", 0.78, "official", [ev], source_url))

    for chunk in data["curriculum_chunks"]:
        ev = add_source_and_evidence(nodes, edges, chunk["source_url"], chunk["text"], chunk.get("source_system", "curriculum"))
        doc_id = source_doc_id(chunk["source_url"])
        for subject in chunk.get("subjects", []):
            sid = stable_id("subject", subject)
            add_edge(edges, graph_edge(sid, doc_id, "aligned_to", 0.7, "heuristic", [ev], chunk["source_url"]))

    for chunk in data["material_text"]:
        ev = add_source_and_evidence(nodes, edges, chunk["source_url"], chunk["text"], chunk.get("source_system", "materials"))
        doc_id = source_doc_id(chunk["source_url"])
        label = chunk.get("material_label") or chunk.get("source_file") or chunk["source_url"]
        mid = stable_id("material", chunk["source_url"])
        add_node(
            nodes,
            graph_node(
                mid,
                "Material",
                label,
                chunk.get("source_system", "materials"),
                chunk["source_url"],
                chunk.get("status", "harvested"),
                0.72,
                [ev],
                subject=chunk.get("subject"),
                school_stage=chunk.get("school_stage"),
                grade=chunk.get("grade"),
                source_kind=chunk.get("source_kind"),
                learner_profile=chunk.get("learner_profile"),
            ),
        )
        add_edge(edges, graph_edge(mid, doc_id, "extracted_from", 0.9, "heuristic", [ev], chunk["source_url"]))
        for subject in chunk.get("subjects", []) or ([chunk.get("subject")] if chunk.get("subject") else []):
            sid = stable_id("subject", subject)
            add_edge(edges, graph_edge(sid, mid, "contains", 0.72, "heuristic", [ev], chunk["source_url"]))

    for unit in data["canonical_units"] or data["candidates"]:
        label = unit["label"]
        unit_type = unit.get("type", "Skill")
        uid = unit.get("canonical_id") or unit.get("id") or stable_id(unit_type.lower(), label)
        evs = list(unit.get("evidence", []))
        source_ev = None
        if unit.get("source_url"):
            source_ev = add_source_and_evidence(nodes, edges, unit["source_url"], label, "inferred")
            if source_ev not in evs:
                evs.append(source_ev)
        add_node(
            nodes,
            graph_node(
                uid,
                unit_type,
                label,
                "inferred",
                unit.get("source_url"),
                unit.get("status", "candidate"),
                unit.get("confidence", 0.75),
                evs,
                grade=unit.get("grade"),
                school_stage=unit.get("school_stage"),
                subject=unit.get("subject"),
                cluster_id=unit.get("cluster_id"),
            ),
        )
        if unit.get("source_url") and source_ev:
            add_edge(edges, graph_edge(uid, source_ev, "extracted_from", 0.8, unit.get("method", "heuristic"), evs, unit.get("source_url")))
        if unit.get("subject"):
            subject_id = stable_id("subject", unit["subject"])
            add_node(nodes, graph_node(subject_id, "Subject", unit["subject"], "oppekava", None, "official", 1.0, []))
            subject_edge = {"Skill": "has_skill", "Knowledge": "has_knowledge", "Competence": "has_competence"}.get(unit_type, "contains")
            add_edge(edges, graph_edge(subject_id, uid, subject_edge, 0.58 if not unit.get("aligned_outcomes") else 0.72, unit.get("method", "heuristic"), evs, unit.get("source_url")))
        for outcome_id in unit.get("aligned_outcomes", []):
            if outcome_id:
                add_edge(edges, graph_edge(outcome_id, uid, f"has_{unit_type.lower()}", unit.get("alignment_confidence", 0.72), unit.get("method", "heuristic"), evs, unit.get("source_url")))
        for knowledge_id in unit.get("knowledge_ids", []):
            add_edge(edges, graph_edge(uid, knowledge_id, "mentions", 0.72, unit.get("method", "heuristic"), evs, unit.get("source_url")))

    return list(nodes.values()), list(edges.values())


def validate(nodes: list[dict[str, Any]], edges: list[dict[str, Any]]) -> list[str]:
    errors = []
    node_ids = {n["id"] for n in nodes}
    for node in nodes:
        for key in ("id", "type", "label_et", "source_system", "status", "confidence", "evidence"):
            if key not in node:
                errors.append(f"node missing {key}: {node.get('id')}")
    for edge in edges:
        for key in ("id", "source", "target", "type", "confidence", "method", "evidence", "source_url", "created_at"):
            if key not in edge:
                errors.append(f"edge missing {key}: {edge.get('id')}")
        if edge.get("source") not in node_ids:
            errors.append(f"edge source missing: {edge.get('id')} {edge.get('source')}")
        if edge.get("target") not in node_ids:
            errors.append(f"edge target missing: {edge.get('id')} {edge.get('target')}")
    return errors


def xml_safe(value: Any) -> Any:
    if isinstance(value, (list, dict)):
        value = json.dumps(value, ensure_ascii=False)
    if value is None:
        return ""
    if not isinstance(value, str):
        return value
    # PDF extraction can surface form-feed/null/private control characters.
    # GraphML/GEXF are XML-based and reject those even though JSONL can carry them.
    value = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", " ", value)
    return "".join(
        " " if 0xD800 <= ord(ch) <= 0xDFFF or ord(ch) in {0xFFFE, 0xFFFF} else ch
        for ch in value
    )


def export_graph(nodes: list[dict[str, Any]], edges: list[dict[str, Any]], stage: str) -> None:
    out_dir = ROOT / ("graph" if stage == "final" else f"graph/snapshots/{stage}")
    out_dir.mkdir(parents=True, exist_ok=True)
    write_jsonl(out_dir / "nodes.jsonl", nodes)
    write_jsonl(out_dir / "edges.jsonl", edges)
    write_csv(out_dir / "nodes.csv", nodes)
    write_csv(out_dir / "edges.csv", edges)

    graph = nx.DiGraph()
    for node in nodes:
        attrs = {k: xml_safe(v) for k, v in node.items() if k != "id"}
        graph.add_node(node["id"], **attrs)
    for edge in edges:
        attrs = {k: xml_safe(v) for k, v in edge.items() if k not in {"source", "target"}}
        graph.add_edge(edge["source"], edge["target"], **attrs)
    nx.write_graphml(graph, out_dir / "graph.graphml")
    nx.write_gexf(graph, out_dir / "graph.gexf")
    cytoscape = {
        "nodes": [{"data": {"id": n["id"], "label": n["label_et"], **n}} for n in nodes],
        "edges": [{"data": {"id": e["id"], "source": e["source"], "target": e["target"], **e}} for e in edges],
    }
    (out_dir / "cytoscape_elements.json").write_text(json.dumps(cytoscape, ensure_ascii=False, indent=2), encoding="utf-8")
    # Verify exports can be read before allowing the stage to pass.
    nx.read_graphml(out_dir / "graph.graphml")
    nx.read_gexf(out_dir / "graph.gexf")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--stage", choices=["pilot", "v0_oppekava", "v1_curriculum_steered", "final"], default="pilot")
    args = parser.parse_args()
    ensure_dirs()
    nodes, edges = build(args.stage)
    errors = validate(nodes, edges)
    write_jsonl(ROOT / f"reports/{args.stage}_graph_validation_errors.jsonl", [{"error": e} for e in errors])
    if errors:
        raise SystemExit(f"Graph validation failed with {len(errors)} errors; see reports/{args.stage}_graph_validation_errors.jsonl")
    export_graph(nodes, edges, args.stage)
    report = [
        f"# Graph Build Report ({args.stage})",
        "",
        f"- Nodes: {len(nodes)}",
        f"- Edges: {len(edges)}",
        "- GraphML and GEXF were exported and read back with NetworkX.",
    ]
    (ROOT / f"reports/{args.stage}_graph_build_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    if args.stage == "final":
        (ROOT / "reports/graph_build_report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"Built {args.stage}: {len(nodes)} nodes, {len(edges)} edges")


if __name__ == "__main__":
    main()
