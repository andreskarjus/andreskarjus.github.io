# Project State

Updated: 2026-05-20

## Status

Architecture reset completed for clean-sheet production graph construction.

The v1 graph remains available as an inspectable prototype:

- nodes: 5,516
- edges: 9,730
- isolated nodes: 0

The v2 architecture now separates official curriculum, cross-curricular
competence overlays, comparable learning units, task types, assessment
criteria, level expectations, and evidence.

The competence overlay has been implemented for the current PRÕK/GRÕK
structure:

- controlled `GeneralCompetence` rows for the eight national üldpädevused;
- controlled `TransversalTheme` rows for the eight läbivad teemad;
- `DomainCompetence` for `keele- ja kirjanduspädevus`;
- PRÕK `StageCompetenceExpectation` rows for I, II, and III kooliaste;
- evidence-linked `CompetenceExpression` candidates showing how those broad
  competences appear in eesti keel ja kirjandus source chunks.

## Current Decision

Do not continue production by incrementally adding nodes to the v1 final graph.
Start a clean-sheet v2 build after the architecture and corpus gates pass.

## Next Build Gate

Run:

```powershell
python scripts/prepare_clean_corpus.py
python scripts/extract_structured_data.py
python scripts/refine_structured_data.py
python scripts/architecture_qc.py
python scripts/qc_structured_data.py
```

If architecture QC has no blockers and structured-data QC has no blockers,
production graph construction can start from the v2 refined structured
datasets. Graph construction should use the refined `graph_ready_status`,
`generation_ready`, and `comparison_ready` gates rather than raw candidate
labels alone.
