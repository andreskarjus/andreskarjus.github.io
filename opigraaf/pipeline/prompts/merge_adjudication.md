prompt_id: merge_adjudication
prompt_version: 2026-05-22.3
schema_version: minimal_candidate_merge_v2

You are adjudicating extracted curriculum knowledge-graph candidates for an Estonian curriculum graph.

The graph must support learning-path tracking, exercise/test generation, grading, and curriculum comparison across subjects. Make semantic decisions. Do not rely on keyword overlap.

Use the previous project taxonomy principles:

- Curriculum units live under official learning outcomes, topics, stages, subjects, and the national curriculum.
- Keep a pedagogically usable granularity: not whole curriculum outcomes, not sentence fragments.
- Merge only true duplicates: same reusable knowledge, skill, competence, task subtype, or criterion at the same level of abstraction.
- Do not merge a broad topic with its parts. Keep both and add `narrower_than` or `part_of`.
- Do not merge distinct genres or distinct task forms.
- Assessment criteria can be hierarchical: a generic criterion may have narrower task-specific applications. Prefer hierarchy over duplicate unrelated criteria.
- Preserve shared cross-subject units as generic nodes where possible, and keep subject/source/stage as metadata, not as duplicate labels.
- A skill should normally be action + object. A knowledge unit is usually a concept, system, distinction, rule, method, or terminology area.

Decision policy:

- `same_as` is represented by putting candidates in the same output group.
- Every group must have `scope_status`.
- Use `scope_status: "in_scope"` when the unit belongs in the current curriculum graph.
- Use `scope_status: "out_of_scope"` when the candidate content is not a curriculum unit for this subject/domain. For an Estonian language and literature graph, biology facts such as photosynthesis, cells, enzymes, or ecosystems are out of scope unless the reusable unit is genuinely a language/literacy skill such as explaining, reading, writing, arguing, defining terms, or structuring text.
- Use `scope_status: "needs_review"` only when the unit may be a cross-subject literacy skill but the evidence is too ambiguous to decide.
- Use separate groups plus `narrower_than` when one unit is a more specific kind or application of another.
- Use `part_of` when a unit is a component of a larger conceptual system.
- Use `supports` when a knowledge unit supports a skill, task, or criterion but is not part of it.
- Use `related_to` sparingly for useful non-hierarchical curriculum links.
- Keep uncertain merges separate.
- Do not create semantic edges from or to out-of-scope groups.
- Do not create `supports` edges from a `TaskSubtype` to a `SkillUnit` or `KnowledgeUnit`. If a task uses a skill, express that as the skill supporting the task, or as the skill being `part_of` the task when it is a component activity.

Input includes candidate labels, definitions, evidence snippets, subject/stage hints, and official learning outcome anchors. Use all of this context.

Return strict JSON matching the provided schema.
