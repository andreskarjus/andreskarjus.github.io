# Autonomous Minimal Curriculum KG Pipeline

Minimal runnable prototype for an API-driven curriculum KG builder.

This is intentionally smaller than the full implementation spec in `reports/autonomous_multi_subject_kg_implementation_spec.md`. It is designed to test the core loop on a few long textbooks without using Codex subagents:

1. inventory sources;
2. extract PDF text;
3. chunk text;
4. call the OpenAI Responses API in batches to extract candidate units/tasks/criteria;
5. provisionally canonicalize candidates within the run;
6. build a small graph export;
7. run QC.

It assumes little or no prior graph. The only fixed knowledge is the taxonomy and controlled backbone.
If the existing official backbone file is available, the bootstrap command adds it as a curriculum anchor source. Extraction batches then receive a bounded list of relevant official learning outcomes and can attach extracted textbook units to those outcome IDs.

## Quick Dry Run

```powershell
cd C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et
python autonomous_minimal_pipeline\pipeline.py bootstrap-test --out autonomous_minimal_pipeline\runs\test_eesti_books
python autonomous_minimal_pipeline\pipeline.py run --run autonomous_minimal_pipeline\runs\test_eesti_books --dry-run
```

Dry run does not call an API. It creates heuristic placeholder candidates so the pipeline, exports, and QC can be tested.

## Live API Run

After setting an API key:

```powershell
$env:OPENAI_API_KEY="..."
python autonomous_minimal_pipeline\pipeline.py run --run autonomous_minimal_pipeline\runs\test_eesti_books --model gpt-5.5 --reasoning-effort none
```

The pipeline uses the Responses API via the installed `openai` Python package. Raw requests and parsed outputs are saved under the run folder.

## Curated Merge Test

This is the smallest end-to-end test for the scalable merge design. It creates six short text sources with deliberate overlap around `välde`, `sõnaliigid`, `tüüpsõna`, tasks, and criteria.

```powershell
cd C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et
python autonomous_minimal_pipeline\pipeline.py bootstrap-curated-merge-test --out autonomous_minimal_pipeline\runs\curated_merge_test
$env:OPENAI_API_KEY="..."
python autonomous_minimal_pipeline\pipeline.py run-merge --run autonomous_minimal_pipeline\runs\curated_merge_test --model gpt-5.5 --reasoning-effort none
```

The merge phase builds candidate blocks using cheap token/anchor/type retrieval only to queue work. The LLM receives each block as structured JSON and decides same-as groups plus `part_of`, `narrower_than`, `supports`, and `related_to` edges.

## Real Slice Merge Test

This uses a few page windows from real downloaded PDFs, so it tests API extraction and merge behavior without whole-book token burn.

```powershell
python autonomous_minimal_pipeline\pipeline.py bootstrap-real-slice-merge-test --out autonomous_minimal_pipeline\runs\real_slice_merge_test
$env:OPENAI_API_KEY="..."
python autonomous_minimal_pipeline\pipeline.py run-merge --run autonomous_minimal_pipeline\runs\real_slice_merge_test --model gpt-5.5 --reasoning-effort none
```

## Iterative Merge Test

`run-iterative-merge` replaces the one-pass merge with a bounded convergence loop:

```powershell
python autonomous_minimal_pipeline\pipeline.py run-iterative-merge --run autonomous_minimal_pipeline\runs\curated_merge_test --model gpt-5.5 --reasoning-effort none --max-merge-iterations 4 --max-merge-llm-calls 5 --max-merge-total-tokens 75000
```

The loop is monotonic in this prototype: an iteration can merge units, preserve units, and add semantic edges, but it cannot split already canonicalized units. This avoids merge/split oscillation while testing the API workflow. Guardrails include hard caps for iterations, LLM calls, and recorded tokens; repeated block signatures are not sent again; missing LLM group coverage is repaired by singleton preservation.

Each iteration writes a snapshot under `merge_iterations/iteration_XX/`, and the stop decision is written to `reports/merge_convergence_report.md`.

## Synthetic Merge Stress Test

This is a merge-only adversarial fixture. It writes fake structured candidates directly to `candidates.jsonl`: exact duplicates, semantic duplicates, related-but-distinct Estonian language units, cross-subject literacy, and biology noise. It should merge true duplicates, keep distinct language skills apart, retain cross-subject writing as a literacy skill, and quarantine biology facts/skills as out of scope.

```powershell
python autonomous_minimal_pipeline\pipeline.py bootstrap-synthetic-merge-stress-test --out autonomous_minimal_pipeline\runs\synthetic_merge_stress_gpt55
python autonomous_minimal_pipeline\pipeline.py iterate-merge --run autonomous_minimal_pipeline\runs\synthetic_merge_stress_gpt55 --model gpt-5.5 --reasoning-effort none --max-merge-iterations 3 --max-merge-llm-calls 4 --max-merge-total-tokens 60000
python autonomous_minimal_pipeline\pipeline.py build-graph --run autonomous_minimal_pipeline\runs\synthetic_merge_stress_gpt55
python autonomous_minimal_pipeline\pipeline.py qc --run autonomous_minimal_pipeline\runs\synthetic_merge_stress_gpt55
```

## Output

Each run writes:

```text
manifest.json
inventory.jsonl
chunks.jsonl
llm_requests.jsonl
  llm_responses.jsonl
  candidates.jsonl
  merge_blocks.jsonl
  merge_groups.jsonl
  merge_semantic_edges.jsonl
  excluded_groups.jsonl
  review_groups.jsonl
  canonical_nodes.jsonl
  canonical_edges.jsonl
  registry_nodes.jsonl
graph/
  nodes.jsonl
  edges.jsonl
  nodes.csv
  edges.csv
  graph.graphml
  cytoscape_elements.json
reports/
  qc_report.md
  run_report.md
```

## Notes

- Extraction is batched by chunks, not one API call per decision.
- Canonicalization here is intentionally simple: exact/normalized label grouping within the run plus type checks. The full future system should replace this with global registry retrieval and LLM adjudication.
- `run-merge` is the more realistic path: extraction -> candidate blocking -> structured LLM merge/adjudication -> registry nodes -> graph/QC.
- `run-iterative-merge` is the current convergence test path: extraction -> blocked LLM merge/adjudication -> canonical-node reblocking -> repeat until convergence or hard cap -> graph/QC.
- Official learning outcomes are anchors, not the whole graph. Textbook-derived units should become more granular KnowledgeUnit/SkillUnit/CompetenceUnit nodes linked back to those anchors.
- Source/evidence is stored as metadata on nodes/edges, not as a separate graph.
- Out-of-scope groups are kept in `excluded_groups.jsonl` for audit but are not exported as curriculum graph nodes.
- This minimal prototype is meant for testing API prompts and comparing a small generated graph with the current manually built KG.
