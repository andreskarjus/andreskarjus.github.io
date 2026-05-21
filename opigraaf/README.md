# Pilot Graph Viewer Prototype

## Current Focus Prototype

Prototype file:

- `opigraaf.html`

Folder:

- `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\prototypes`

Generator script:

- `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\scripts\build_v2_graph_viewer.py`

Source graph:

- `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\graph\snapshots\v2_curriculum_focus\nodes.jsonl`
- `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\graph\snapshots\v2_curriculum_focus\edges.jsonl`

Scale:

- 1,347 nodes
- 4,297 raw edges in the source JSONL
- 4,097 embedded/renderable edges after dropping edges whose endpoint is absent from the snapshot

Default view:

- Uses `kg_layer` as the primary view switch.
- Opens on `Kõik kihid ja kõik seosed`.
- Shows `curriculum_backbone`, `curriculum_content`, `assessment_task`, `competence_overlay`, and `canonicalization`.
- Shows all 1,347 nodes in the current snapshot.
- Shows all edge types by default, including `has_supporting_unit` and `has_supporting_task`.
- The max-node slider has an unlimited far-right setting labelled `Kõik`; this is the default.
- Treats provenance as metadata/source links, not as a separate KG layer.

Rendering strategy:

- Plain standalone HTML/CSS/JS
- No CDN, package install, or runtime server required
- Custom canvas renderer with pan, zoom, drag, click selection, and bounded force relaxation
- Full graph data is embedded, but rendering and physics run only on the currently visible filtered subgraph
- Search keeps matching nodes plus immediate neighbors
- Labels use level-of-detail rules so the large unit cloud stays readable

Interface:

- Right sidebar is always visible
- Presets cover everything, subjects (`Ained`), default layers, content/unit graph, assessment, competence overlay, and canonicalization.
- `kg_layer` checkboxes are the main layer controls.
- `has_supporting_unit` and `has_supporting_task` are available through the "Üldpädevuste tugiseosed" toggle.
- The "Kõik kihid ja kõik seosed" preset enables every layer and every edge type; current renderable total is 4,097 edges.
- `Alusta tühjalt` clears the view down to only `NationalCurriculum`, with all links disabled.
- Selected-node details always show a source link when one exists
- Selecting a node highlights its visible edges and lightly highlights connected nodes.
- A bottom status chip lists the selected node and a capped sample of its visible connections.
- Labels are deterministic and viewport-aware: sparse labels stay visible when zoomed out, and zooming in reveals more labels near the viewport center without flooding the entire canvas.

Edit mode:

- Off by default
- Stores edits as a client-side patch over the immutable embedded graph
- Supports node rename, node delete from editable view, link add, and link remove
- Keeps a local browser history with undo, redo, jump-to-history-state, and revert-to-original
- Persists that history in `localStorage` for the same browser
- Exports the full edit patch/history as JSON for review or later backend import

Future backend:

- `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\scripts\edit_backend.py`
- Uses only Python stdlib plus SQLite
- Provides draft `/sessions`, `/sessions/{id}/events`, and `/sessions/{id}/snapshots` JSON endpoints
- The static HTML does not call this backend yet

Verification:

- Rendered in browser through a temporary local Node server
- Confirmed default checked layers are `curriculum_backbone`, `curriculum_content`, `assessment_task`, `competence_overlay`, and `canonicalization`
- Confirmed `canonicalization` appears as an edge-only layer switch
- Confirmed support edges are on by default
- Confirmed default view renders 1,347 / 1,347 nodes and 4,097 / 4,297 edges
- Confirmed max-node slider default is `Kõik`
- Confirmed selection details open and source links appear
- Confirmed edit mode controls are included in the generated DOM
- Browser console error check returned no errors

## Earlier Pilot Prototype

Prototype file:

- `pilot_graph_viewer.html`

Folder:

- `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\prototypes`

Generator script:

- `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\scripts\build_pilot_viewer.py`

## What It Uses

- Source graph: `C:\Users\andres.karjus\Documents\oppekavad\curriculum_graph_et\graph\snapshots\pilot\cytoscape_elements.json`
- Runtime: plain standalone HTML, CSS, and JavaScript
- Rendering: custom `<canvas>` network renderer
- Dependencies: none; no CDN, no server, no JS package install

The generator reads the Cytoscape export, normalizes node and edge fields, and embeds the graph data directly into `pilot_graph_viewer.html`.

## Design And Performance Choices

The reference site at `http://opigraaf.itcollege.ee/` uses a network graph with search and filter controls, but it loads slowly and initially shows too much visual clutter. This prototype keeps the same core interaction model while making the first view faster and clearer.

Initial view:

- Shows only high-level nodes: `Subject`, `SchoolStage`, `Grade`, `Topic`
- Starts with about 149 visible nodes and 109 visible edges
- Hides `LearningOutcome`, `Knowledge`, `Material`, `SourceDocument`, and `EvidenceSpan` by default

The full pilot graph remains embedded:

- 1,416 nodes
- 1,573 edges

Users can reveal more through the right sidebar filters, display modes, search, node expansion, and focus controls.

## Interface

The right sidebar is always visible and narrow, approximately 306px wide. It contains:

- Subject filter
- Display mode selector
- Maximum visible node slider
- Node type checkboxes
- Edge type checkboxes
- Selected-node details
- `Laienda` action to add neighboring nodes
- `Fookus` action to isolate one node and its neighborhood

Display modes:

- `Kõrgem tasand`: subjects, school stages, grades, topics
- `Õpiväljundid ja teadmised`: adds learning outcomes and knowledge nodes
- `Materjalid`: focuses materials plus related curriculum units
- `Kõik lubatud tüübid`: enables all node types

Graph interactions:

- Mouse wheel zooms
- Dragging empty space pans
- Dragging a node moves it
- Clicking a node opens details in the sidebar
- Search keeps matching nodes and their immediate neighbors

## Visual Style

The prototype intentionally does not copy the original site's colors. It uses a more restrained minimalist palette:

- Teal: subjects
- Slate: school stages and grades
- Blue: topics
- Purple: learning outcomes
- Orange: knowledge
- Green: materials
- Gray/orange muted tones: source and evidence nodes

Labels are limited in the default view to keep the graph readable. More labels appear with zoom, hover, or node selection.

## Verification

The rendered output was checked in browser through a temporary local HTTP server because the browser automation environment blocks direct `file:///` navigation. The deliverable itself remains a standalone HTML file that can be opened directly by clicking.
