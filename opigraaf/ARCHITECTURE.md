# Production Architecture V2

This project now treats the previous graph as a prototype and starts production
KG construction from a clean-sheet v2 architecture.

## Core Separation

The production graph keeps these layers separate:

1. Official curriculum backbone:
   `NationalCurriculum -> CurriculumDomain -> Subject -> Stage/Grade/Course -> Topic -> LearningOutcome`

2. Cross-curricular competence overlays:
   `GeneralCompetence`, `DomainCompetence`, `StageCompetenceExpectation`,
   `TransversalTheme`, and `CompetenceExpression`

3. Comparable learner-state units:
   `KnowledgeUnit`, `SkillUnit`, `CompetenceUnit`, `AttitudeUnit`

4. Reusable tasks:
   `TaskType -> TaskSubtype -> TaskInstance`

5. Reusable assessment:
   `AssessmentCriterion -> CriterionDimension -> RubricScalePoint`

6. Progression:
   `LevelExpectation` connects a unit or criterion to grade/stage/course and
   stores parameters such as genre, text complexity, source use, independence,
   argument depth, strictness, and expected error rate.

7. Evidence and assertions:
   `SourceDocument`, `EvidenceSpan`, and edge/assertion metadata record source
   authority, extraction method, review status, schema version, and graph version.

## Üldpädevused And Läbivad Teemad

The Estonian national curriculum does not treat `üldpädevused` as another
subject-specific skill list. PRÕK § 4 distinguishes general competences,
domain competences, and school-stage competence expectations. GRÕK § 4 treats
general competences as subject- and domain-crossing. In both, general
competences are developed through subject learning outcomes, transversal
themes, lessons, and activity outside lessons.

The production graph therefore models them as an overlay:

- `GeneralCompetence` is the controlled national list, for example
  `suhtluspädevus`, `õpipädevus`, and `digipädevus`.
- `DomainCompetence` stores the official ainevaldkond competence such as
  `keele- ja kirjanduspädevus`.
- `TransversalTheme` stores the official `läbivad teemad`, because the
  curriculum uses them as an integration mechanism.
- `StageCompetenceExpectation` stores PRÕK stage-level summaries such as
  `III kooliastmes taotletavad pädevused`.
- `CompetenceExpression` stores the evidence-linked expression of a
  competence in a concrete outcome, task, material, criterion, or level
  expectation.

This keeps broad civic/personhood competences comparable across subjects while
still letting eesti keel ja kirjandus express them through assessable units
such as argumentation, source criticism, text creation, literary interpretation,
oral presentation, media literacy, and reflection.

## Why The Reset Is Needed

The prototype graph is technically valid, but its semantic layer is not clean
enough for production:

- official learning outcomes were promoted directly to candidate skill units;
- rubric prose sometimes became generic `Knowledge` or `Skill` nodes;
- generic concepts such as `Teema`, `Kuuldu`, and `Hinnang` were promoted too easily;
- task and assessment layers were not first-class;
- grade/stage labels existed but did not express levelled expectations;
- the official oppekava backbone still used pilot fallback data.

## Production Build Order

1. Run source inventory and official oppekava harvest.
2. Build the official backbone from oppekava/schema.edu.ee/official curriculum sources.
3. Prepare a clean corpus snapshot from all text/material sources.
4. Extract task, criterion, level, knowledge, and skill candidates into separate queues.
5. Canonicalize only within compatible classes and contexts.
6. Build the graph with assertion-level provenance.
7. Run architecture, graph, curriculum, and teacher-usability QC.
8. Produce visual graph exports and an assessment matrix view.

## Pilot Assessment Slice

The first production assessment slice is `arutlev kirjand / kirjand`.

Reason: it connects põhikool and gümnaasium outcomes, national exam rubrics,
writing, source use, argumentation, text structure, style, and language
correctness. It is also directly useful for mapping student progress and
generating exercises/tests.

## Key Configs

- `config/graph_schema.yaml` defines the v2 graph schema and allowed edge matrix.
- `config/schema_mappings.yaml` maps local node/edge types to schema.edu.ee or local extensions.
- `config/source_authority.yaml` ranks evidence sources.
- `config/assessment_taxonomy_eesti_keel_kirjandus.yaml` defines task, criterion, and level taxonomies.
- `config/general_competence_taxonomy.yaml` defines controlled üldpädevus,
  valdkonnapädevus, kooliastme pädevus, and läbiv teema overlays.
- `config/canonicalization_policy.yaml` defines promotion/rejection rules for comparable units.

## Gates

- `scripts/prepare_clean_corpus.py` writes a role-tagged clean corpus snapshot.
- `scripts/architecture_qc.py` validates the v2 architecture and reports readiness.

Production graph building should not start if `reports/architecture_readiness_report.md`
has blockers.
