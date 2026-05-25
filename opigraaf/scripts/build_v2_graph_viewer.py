import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_NAME = "v2_curriculum_focus"
SNAPSHOT = ROOT / "graph" / "snapshots" / SNAPSHOT_NAME
OUT = ROOT / "prototypes" / "opigraaf.html"
MANIFEST = SNAPSHOT / "layer_manifest.json"


LAYER_ORDER = [
    "curriculum_backbone",
    "curriculum_content",
    "assessment_task",
    "competence_overlay",
    "canonicalization",
]

LAYER_LABELS = {
    "curriculum_backbone": "Õppekava selgroog",
    "curriculum_content": "Sisu ja üksused",
    "assessment_task": "Ülesanded ja hindamine",
    "competence_overlay": "Pädevuste kiht",
    "canonicalization": "Kanoniseerimine",
}

DEFAULT_HIDDEN_EDGE_TYPES = {"has_supporting_unit", "has_supporting_task"}


TYPE_GROUPS = {
    "official": [
        "NationalCurriculum",
        "CurriculumDomain",
        "Subject",
        "SchoolStage",
        "Grade",
        "Topic",
        "LearningOutcome",
    ],
    "canonical": ["KnowledgeUnit", "SkillUnit", "CompetenceUnit"],
    "assessment": [
        "TaskType",
        "TaskSubtype",
        "AssessmentCriterion",
        "CriterionDimension",
        "LevelExpectation",
    ],
    "cross": [
        "GeneralCompetence",
        "TransversalTheme",
        "StageCompetenceExpectation",
        "DomainCompetence",
    ],
    "resources": ["Material", "SourceDocument", "EvidenceSpan"],
}

TYPE_ORDER = [
    *TYPE_GROUPS["official"],
    *TYPE_GROUPS["canonical"],
    *TYPE_GROUPS["assessment"],
    *TYPE_GROUPS["cross"],
    *TYPE_GROUPS["resources"],
]


def load_jsonl(path):
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                yield json.loads(line)


def load_graph():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    nodes = []
    for data in load_jsonl(SNAPSHOT / "nodes.jsonl"):
        subject = data.get("subject") or data.get("subject_key")
        grade = data.get("grade")
        if not grade and isinstance(data.get("grades"), list):
            grade = ", ".join(data["grades"])
        school_stage = data.get("school_stage")
        if not school_stage and isinstance(data.get("school_stages"), list):
            school_stage = ", ".join(data["school_stages"])
        related_terms = []
        for key in ("topics", "concepts", "linked_material_topics"):
            for item in data.get(key) or []:
                if isinstance(item, dict) and item.get("label"):
                    related_terms.append(item["label"])
        nodes.append(
            {
                "id": data["id"],
                "label": data.get("label_et") or data.get("label") or data["id"],
                "type": data.get("type") or "Unknown",
                "kg_layer": data.get("kg_layer") or "curriculum_content",
                "default_view": bool(data.get("default_view", True)),
                "provenance_mode": data.get("provenance_mode"),
                "subject": subject,
                "grade": grade,
                "school_stage": school_stage,
                "status": data.get("status"),
                "review_status": data.get("review_status"),
                "confidence": data.get("confidence"),
                "authority": data.get("source_authority"),
                "source_system": data.get("source_system"),
                "source_url": data.get("source_url"),
                "description": data.get("description"),
                "text": data.get("text"),
                "related_terms": related_terms[:8],
                "evidence_count": data.get("evidence_count"),
            }
        )

    edges = []
    degree = {node["id"]: 0 for node in nodes}
    raw_edge_count = 0
    skipped_edge_count = 0
    for data in load_jsonl(SNAPSHOT / "edges.jsonl"):
        raw_edge_count += 1
        source = data.get("source")
        target = data.get("target")
        if source not in degree or target not in degree:
            skipped_edge_count += 1
            continue
        degree[source] += 1
        degree[target] += 1
        edges.append(
            {
                "id": data.get("id") or f"{source}->{target}",
                "source": source,
                "target": target,
                "type": data.get("type") or "related_to",
                "kg_layer": data.get("kg_layer") or "curriculum_content",
                "default_view": bool(data.get("default_view", True)),
                "provenance_mode": data.get("provenance_mode"),
                "confidence": data.get("confidence"),
                "authority": data.get("source_authority"),
                "source_url": data.get("source_url"),
            }
        )

    for node in nodes:
        node["degree"] = degree[node["id"]]

    return {
        "meta": {
            "snapshot": SNAPSHOT_NAME,
            "nodes": len(nodes),
            "edges": raw_edge_count,
            "edges_embedded": len(edges),
            "edges_skipped_missing_endpoint": skipped_edge_count,
            "source": str(SNAPSHOT),
            "manifest": manifest,
        },
        "nodes": nodes,
        "edges": edges,
    }


def html_doc(graph):
    graph_json = json.dumps(graph, ensure_ascii=False, separators=(",", ":"))
    type_groups = json.dumps(TYPE_GROUPS, ensure_ascii=False)
    type_order = json.dumps(TYPE_ORDER, ensure_ascii=False)
    layer_order = json.dumps(LAYER_ORDER, ensure_ascii=False)
    layer_labels = json.dumps(LAYER_LABELS, ensure_ascii=False)
    default_hidden_edges = json.dumps(sorted(DEFAULT_HIDDEN_EDGE_TYPES), ensure_ascii=False)
    return f"""<!doctype html>
<html lang="et">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Õppekava KG · v2 curriculum focus</title>
<style>
:root {{
  --bg: #f6f8fb;
  --panel: #ffffff;
  --panel-2: #f2f5f8;
  --ink: #17202c;
  --muted: #667383;
  --line: #dde4ec;
  --accent: #0f766e;
  --blue: #2563eb;
  --shadow: 0 12px 30px rgba(23, 32, 44, .09);
}}
* {{ box-sizing: border-box; }}
html, body {{ height: 100%; margin: 0; overflow: hidden; }}
body {{
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--ink);
  background: var(--bg);
}}
button, input, select {{ font: inherit; }}
.app {{ height: 100vh; display: grid; grid-template-columns: minmax(0, 1fr) 330px; }}
.stage {{
  position: relative;
  min-width: 0;
  background:
    linear-gradient(rgba(255,255,255,.90), rgba(255,255,255,.90)),
    radial-gradient(circle at 18% 10%, rgba(15,118,110,.12), transparent 34%),
    radial-gradient(circle at 86% 18%, rgba(37,99,235,.12), transparent 32%);
}}
#graph {{ display: block; width: 100%; height: 100%; cursor: grab; }}
#graph.dragging {{ cursor: grabbing; }}
.topbar {{
  position: absolute;
  z-index: 5;
  top: 14px;
  left: 16px;
  right: 18px;
  display: grid;
  grid-template-columns: auto minmax(260px, 560px) auto;
  gap: 12px;
  align-items: center;
  pointer-events: none;
}}
.brand, .search, .tools, .notice {{
  pointer-events: auto;
  border: 1px solid rgba(221,228,236,.96);
  background: rgba(255,255,255,.94);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}}
.brand {{
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 760;
  white-space: nowrap;
}}
.mark {{
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: conic-gradient(from 20deg, #0f766e, #2563eb, #9333ea, #d97706, #0f766e);
  position: relative;
}}
.mark:after {{ content: ""; position: absolute; inset: 7px; border-radius: 50%; background: white; }}
.search {{
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  border-radius: 999px;
  padding: 7px;
}}
.search input {{
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 7px 12px;
}}
.tools {{ border-radius: 999px; padding: 5px; display: flex; gap: 4px; }}
.iconbtn, .pillbtn {{
  border: 0;
  min-width: 34px;
  height: 34px;
  padding: 0 11px;
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}}
.iconbtn:hover, .pillbtn:hover {{ background: var(--panel-2); }}
.pillbtn.primary {{ background: var(--ink); color: white; }}
.hud {{
  position: absolute;
  z-index: 4;
  left: 16px;
  bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: calc(100% - 32px);
}}
.status-card {{
  border: 1px solid var(--line);
  background: var(--panel-2);
  border-radius: 8px;
  padding: 9px 10px;
  margin-top: 8px;
  display: grid;
  gap: 5px;
  font-size: 12px;
  color: var(--muted);
}}
.status-card strong {{ color: var(--ink); font-weight: 760; }}
.status-card .warn {{ color: #92400e; }}
.status-help {{ line-height: 1.35; }}
.chip {{
  border: 1px solid var(--line);
  background: rgba(255,255,255,.94);
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--muted);
  font-size: 12px;
  box-shadow: 0 6px 16px rgba(23, 32, 44, .07);
}}
.chip.warn {{ color: #92400e; border-color: #f3d39a; background: rgba(255,251,235,.96); }}
aside {{
  min-width: 0;
  overflow-y: auto;
  background: var(--panel);
  border-left: 1px solid var(--line);
}}
.side-inner {{ padding: 16px 14px 22px; }}
h2 {{ font-size: 15px; line-height: 1.25; margin: 0 0 4px; }}
h3 {{
  font-size: 12px;
  margin: 18px 0 9px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0;
}}
.hint {{ color: var(--muted); font-size: 12px; line-height: 1.42; margin: 0; }}
.field {{ display: grid; gap: 6px; margin-top: 12px; }}
.field label {{ color: var(--muted); font-size: 12px; }}
select {{
  width: 100%;
  min-height: 35px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  padding: 6px 8px;
}}
input[type="range"] {{ width: 100%; accent-color: var(--accent); }}
.check {{
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-height: 28px;
  font-size: 13px;
}}
.check input {{ margin: 0; accent-color: var(--accent); }}
.count {{ color: var(--muted); font-size: 11px; }}
.legend {{ display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; vertical-align: -1px; }}
.row-actions {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }}
.button {{
  min-height: 34px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  cursor: pointer;
}}
.button:hover {{ border-color: #b6c2cf; }}
.button.strong {{ color: white; background: var(--accent); border-color: var(--accent); }}
.button.danger {{ color: #991b1b; border-color: #fecaca; background: #fff7f7; }}
.button.danger:hover {{ border-color: #fca5a5; }}
.button.utility {{ color: #334155; background: #f8fafc; }}
.selection {{
  margin-top: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel-2);
  padding: 11px;
}}
.selection-title {{ font-size: 13px; font-weight: 760; line-height: 1.35; overflow-wrap: anywhere; }}
.kv {{ display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 5px 8px; margin-top: 10px; font-size: 12px; }}
.kv div:nth-child(odd) {{ color: var(--muted); }}
.link {{ color: var(--blue); overflow-wrap: anywhere; text-decoration: none; }}
.link:hover {{ text-decoration: underline; }}
.empty {{ color: var(--muted); font-size: 12px; line-height: 1.45; }}
.edit-panel {{
  margin-top: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fbfcfd;
  padding: 10px;
}}
.edit-panel[hidden], .edit-tools[hidden] {{ display: none; }}
.edit-grid {{ display: grid; gap: 8px; margin-top: 9px; }}
.edit-grid input, .edit-grid select {{
  width: 100%;
  min-height: 34px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: white;
  padding: 6px 8px;
}}
.edit-note {{ color: var(--muted); font-size: 12px; line-height: 1.4; margin-top: 7px; }}
.edge-list {{ display: grid; gap: 6px; margin-top: 8px; }}
.edge-row {{
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 7px;
  align-items: center;
  font-size: 12px;
  color: var(--muted);
}}
.edge-row span {{ overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
.mini {{
  min-height: 26px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: white;
  cursor: pointer;
  color: var(--ink);
}}
.mini.danger {{ color: #991b1b; border-color: #fecaca; }}
.edit-badge {{
  display: inline-block;
  margin-left: 6px;
  color: #0f766e;
  font-size: 11px;
  font-weight: 760;
}}
.meter {{
  height: 6px;
  background: #e8edf3;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}}
.meter > span {{ display: block; height: 100%; width: 0; background: linear-gradient(90deg, #0f766e, #2563eb); }}
@media (max-width: 900px) {{
  .app {{ grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) 280px; }}
  aside {{ border-left: 0; border-top: 1px solid var(--line); }}
  .topbar {{ grid-template-columns: 1fr; right: 16px; }}
  .brand, .tools {{ display: none; }}
}}
</style>
</head>
<body>
<div class="app">
  <main class="stage">
    <div class="topbar">
      <div class="brand"><span class="mark"></span><span>Õppekava KG</span></div>
      <div class="search">
        <input id="search" placeholder="Otsi teemat, oskust, õpiväljundit, materjali..." autocomplete="off">
        <button id="searchBtn" class="pillbtn primary" title="Otsi">Otsi</button>
      </div>
      <div class="tools">
        <button id="fitBtn" class="iconbtn" title="Mahuta vaatesse">⌖</button>
        <button id="resetBtn" class="iconbtn" title="Taasta algvaade">↺</button>
      </div>
    </div>
    <canvas id="graph"></canvas>
    <div class="hud">
      <div id="selectedSummary" class="chip" hidden></div>
    </div>
  </main>
  <aside>
    <div class="side-inner">
      <h2>Versioon: v2</h2>
      <div class="status-card">
        <div><strong>Graaf:</strong> <span id="visibleStats"></span></div>
        <div class="status-help">Kerimine suumib · lohistamine/nooled nihutavad · klõps avab detailid</div>
        <div id="capNotice" class="warn" hidden></div>
      </div>
      <div class="meter"><span id="visibleMeter"></span></div>

      <div class="field">
        <label for="preset">Vaade</label>
        <select id="preset">
          <option value="everything">Kõik kihid ja kõik seosed</option>
          <option value="subjects">Ained</option>
          <option value="default_layers">Default: sisu + hindamine + pädevused</option>
          <option value="content_units">Sisu ja oskusgraaf</option>
          <option value="assessment">Ülesanded ja hindamine</option>
          <option value="competence">Üldpädevuste overlay</option>
          <option value="canonicalization">Kanoniseerimine ja duplikaadid</option>
          <option value="custom">Kohandatud</option>
        </select>
      </div>
      <label class="check" style="margin-top: 12px;">
        <input id="supportEdgesToggle" type="checkbox">
        <span>Üldpädevuste tugiseosed</span>
        <span id="supportEdgeCount" class="count">0</span>
      </label>
      <div class="field">
        <label for="subjectFilter">Õppeaine</label>
        <select id="subjectFilter"></select>
      </div>
      <div class="field">
        <label for="maxNodes">Maksimum nähtavaid sõlmi: <span id="maxNodesLabel"></span></label>
        <input id="maxNodes" type="range" min="120" max="3000" step="20" value="3000">
      </div>
      <button class="button utility" id="cleanGraphBtn" style="width: 100%; margin-top: 10px;">Alusta tühjalt</button>

      <h3>Sõlmetüübid</h3>
      <div id="layerFilters"></div>
      <h3>Tüübid</h3>
      <div id="typeFilters"></div>

      <h3>Seosetüübid</h3>
      <div id="edgeFilters"></div>

      <h3>Muudatused</h3>
      <label class="check">
        <input id="editModeToggle" type="checkbox">
        <span>Edit mode</span>
        <span id="editCount" class="count">0</span>
      </label>
      <div id="editPanel" class="edit-panel" hidden>
        <div class="field" style="margin-top: 0;">
          <label for="historySelect">Ajalugu</label>
          <select id="historySelect"></select>
        </div>
        <div class="row-actions">
          <button class="button" id="undoBtn">Undo</button>
          <button class="button" id="redoBtn">Redo</button>
        </div>
        <div class="row-actions">
          <button class="button" id="originalBtn">Original</button>
          <button class="button" id="exportPatchBtn">Export</button>
        </div>
        <button class="button danger" id="clearSavedBtn" style="width: 100%; margin-top: 8px;">Clear saved edits</button>
        <div class="edit-note">Edits are local to this browser. Use Export to pass the patch back to the KG builder.</div>
      </div>

      <h3>Valitud sõlm</h3>
      <div id="selection" class="selection">
        <div class="empty">Klõpsa sõlmel, et näha metaandmeid ja avada naabrus.</div>
      </div>
    </div>
  </aside>
</div>
<script>
var GRAPH = {graph_json};
const TYPE_GROUPS = {type_groups};
const TYPE_ORDER = {type_order};
const LAYER_ORDER = {layer_order};
const LAYER_LABELS = {layer_labels};
const DEFAULT_HIDDEN_EDGE_TYPES = new Set({default_hidden_edges});
const DEFAULT_PRESET = "everything";
const PRESETS = {{
  default_layers: {{
    layers: ["curriculum_backbone", "curriculum_content", "assessment_task", "competence_overlay"],
    edges: "default",
    maxNodes: 1400,
  }},
  content_units: {{
    layers: ["curriculum_backbone", "curriculum_content"],
    edges: "default",
    maxNodes: 1000,
  }},
  assessment: {{
    layers: ["curriculum_backbone", "curriculum_content", "assessment_task"],
    edges: "default",
    maxNodes: 980,
  }},
  competence: {{
    layers: ["curriculum_backbone", "curriculum_content", "assessment_task", "competence_overlay"],
    edges: "support",
    maxNodes: 1100,
  }},
  canonicalization: {{
    layers: ["curriculum_backbone", "curriculum_content", "canonicalization"],
    edges: "canonical",
    maxNodes: 980,
  }},
  everything: {{
    layers: [...LAYER_ORDER],
    edges: "all",
    maxNodes: "all",
  }},
  subjects: {{
    layers: ["curriculum_backbone"],
    edges: "subjects",
    maxNodes: "all",
    types: ["NationalCurriculum", "CurriculumDomain", "Subject"],
  }},
}};
const RESOURCE_TYPES = new Set(TYPE_GROUPS.resources);
const TYPE_LABELS = {{
  NationalCurriculum: "Riiklik õppekava",
  CurriculumDomain: "Valdkond",
  Subject: "Õppeaine",
  SchoolStage: "Kooliaste",
  Grade: "Klass",
  Topic: "Teema",
  LearningOutcome: "Õpiväljund",
  KnowledgeUnit: "Teadmisüksus",
  SkillUnit: "Oskusüksus",
  CompetenceUnit: "Pädevusüksus",
  TaskType: "Ülesandetüüp",
  TaskSubtype: "Ülesande alatüüp",
  AssessmentCriterion: "Hindamiskriteerium",
  CriterionDimension: "Kriteeriumi mõõde",
  LevelExpectation: "Tasemeootus",
  GeneralCompetence: "Üldpädevus",
  TransversalTheme: "Läbiv teema",
  StageCompetenceExpectation: "Kooliastme pädevusootus",
  DomainCompetence: "Valdkonnapädevus",
  Material: "Materjal",
  SourceDocument: "Allikas",
  EvidenceSpan: "Tõendus"
}};
const COLORS = {{
  NationalCurriculum: "#0f766e",
  CurriculumDomain: "#14b8a6",
  Subject: "#0d9488",
  SchoolStage: "#334155",
  Grade: "#64748b",
  Topic: "#2563eb",
  LearningOutcome: "#7c3aed",
  KnowledgeUnit: "#c2410c",
  SkillUnit: "#db2777",
  CompetenceUnit: "#9333ea",
  TaskType: "#0891b2",
  TaskSubtype: "#0284c7",
  AssessmentCriterion: "#ca8a04",
  CriterionDimension: "#d97706",
  LevelExpectation: "#ea580c",
  GeneralCompetence: "#16a34a",
  TransversalTheme: "#65a30d",
  StageCompetenceExpectation: "#4d7c0f",
  DomainCompetence: "#15803d",
  Material: "#475569",
  SourceDocument: "#94a3b8",
  EvidenceSpan: "#a16207",
  Unknown: "#475569"
}};
const GROUP_X = {{
  NationalCurriculum: -760,
  CurriculumDomain: -650,
  Subject: -540,
  SchoolStage: -430,
  Grade: -320,
  Topic: -260,
  LearningOutcome: -60,
  KnowledgeUnit: 180,
  SkillUnit: 280,
  CompetenceUnit: 390,
  TaskType: 560,
  TaskSubtype: 630,
  AssessmentCriterion: 720,
  CriterionDimension: 820,
  LevelExpectation: 920,
  GeneralCompetence: -710,
  TransversalTheme: -610,
  StageCompetenceExpectation: -510,
  DomainCompetence: -790,
  Material: 560,
  SourceDocument: 760,
  EvidenceSpan: 920
}};
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d", {{ alpha: true }});
const nodeById = new Map(GRAPH.nodes.map(n => [n.id, n]));
const adjacency = new Map(GRAPH.nodes.map(n => [n.id, []]));
const searchRows = GRAPH.nodes.map(n => `${{n.label}} ${{n.type}} ${{n.subject || ""}} ${{n.grade || ""}} ${{n.school_stage || ""}} ${{n.authority || ""}} ${{(n.related_terms || []).join(" ")}}`.toLowerCase());
for (const e of GRAPH.edges) {{
  adjacency.get(e.source)?.push([e.target, e]);
  adjacency.get(e.target)?.push([e.source, e]);
}}
const STORAGE_KEY = "oppekava_v2_curriculum_focus_edit_history_v1";
function emptyEdits() {{
  return {{ renamed: {{}}, deletedNodes: [], addedEdges: [], deletedEdges: [] }};
}}
function cloneEdits(edits) {{
  return JSON.parse(JSON.stringify(edits || emptyEdits()));
}}
function normalizeEdits(edits) {{
  edits.renamed = edits.renamed || {{}};
  edits.deletedNodes = [...new Set(edits.deletedNodes || [])];
  edits.addedEdges = edits.addedEdges || [];
  edits.deletedEdges = [...new Set(edits.deletedEdges || [])];
  return edits;
}}
function safeText(value) {{
  return String(value ?? "").replace(/[&<>"']/g, c => ({{ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }}[c]));
}}
function historySeed() {{
  return [{{ label: "Original graph", at: new Date().toISOString(), edits: emptyEdits() }}];
}}
function loadEditHistory() {{
  try {{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || !Array.isArray(saved.history)) return {{ history: historySeed(), index: 0 }};
    const history = saved.history.map(item => ({{
      label: item.label || "Edit",
      at: item.at || new Date().toISOString(),
      edits: normalizeEdits(cloneEdits(item.edits)),
    }}));
    if (!history.length) return {{ history: historySeed(), index: 0 }};
    const index = Math.max(0, Math.min(history.length - 1, Number(saved.index) || 0));
    return {{ history, index }};
  }} catch (error) {{
    return {{ history: historySeed(), index: 0 }};
  }}
}}
const loadedEdits = loadEditHistory();
const state = {{
  width: 1, height: 1, dpr: 1,
  scale: 1, tx: 0, ty: 0,
  enabledLayers: new Set(PRESETS[DEFAULT_PRESET].layers),
  enabledTypes: new Set(GRAPH.nodes.filter(n => PRESETS[DEFAULT_PRESET].layers.includes(n.kg_layer)).map(n => n.type)),
  enabledEdges: new Set(GRAPH.edges.map(e => e.type)),
  includeResources: false,
  subject: "all",
  maxNodes: Infinity,
  search: "",
  pinned: new Set(),
  selected: null,
  hover: null,
  drag: null,
  pan: null,
  editMode: false,
  history: loadedEdits.history,
  historyIndex: loadedEdits.index,
  visibleNodes: [],
  visibleEdges: [],
  particles: new Map(),
  dirty: true,
  simTicks: 0,
  capped: 0
}};
function currentEdits() {{
  return state.history[state.historyIndex]?.edits || emptyEdits();
}}
function saveEditHistory() {{
  localStorage.setItem(STORAGE_KEY, JSON.stringify({{ history: state.history, index: state.historyIndex }}));
}}
function editCounts(edits = currentEdits()) {{
  return Object.keys(edits.renamed || {{}}).length + (edits.deletedNodes || []).length + (edits.addedEdges || []).length + (edits.deletedEdges || []).length;
}}
function isNodeDeleted(id) {{
  return (currentEdits().deletedNodes || []).includes(id);
}}
function isEdgeDeleted(id) {{
  return (currentEdits().deletedEdges || []).includes(id);
}}
function effectiveLabel(n) {{
  return currentEdits().renamed?.[n.id] || n.label;
}}
function activeEdges() {{
  const edits = currentEdits();
  const deletedNodes = new Set(edits.deletedNodes || []);
  const deletedEdges = new Set(edits.deletedEdges || []);
  const base = GRAPH.edges.filter(e => !deletedEdges.has(e.id) && !deletedNodes.has(e.source) && !deletedNodes.has(e.target));
  const added = (edits.addedEdges || []).filter(e => !deletedEdges.has(e.id) && !deletedNodes.has(e.source) && !deletedNodes.has(e.target));
  return base.concat(added);
}}
function getNeighbors(id) {{
  const out = [];
  for (const e of activeEdges()) {{
    if (e.source === id) out.push([e.target, e]);
    else if (e.target === id) out.push([e.source, e]);
  }}
  return out;
}}
function commitEdit(label, mutator) {{
  const next = normalizeEdits(cloneEdits(currentEdits()));
  mutator(next);
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push({{ label, at: new Date().toISOString(), edits: next }});
  state.historyIndex = state.history.length - 1;
  saveEditHistory();
  updateHistoryUI();
  renderSelection();
  updateVisible();
}}
function updateHistoryUI() {{
  const select = document.getElementById("historySelect");
  if (!select) return;
  select.innerHTML = state.history.map((item, i) => `<option value="${{i}}">${{i}} · ${{safeText(item.label)}} · ${{editCounts(item.edits)}} edits</option>`).join("");
  select.value = String(state.historyIndex);
  document.getElementById("editCount").textContent = editCounts();
  document.getElementById("undoBtn").disabled = state.historyIndex <= 0;
  document.getElementById("redoBtn").disabled = state.historyIndex >= state.history.length - 1;
}}
function setHistoryIndex(index) {{
  state.historyIndex = Math.max(0, Math.min(state.history.length - 1, index));
  saveEditHistory();
  updateHistoryUI();
  if (state.selected && isNodeDeleted(state.selected)) state.selected = null;
  renderSelection();
  updateVisible();
  fit();
}}
function unlimitedSliderValue() {{
  const input = document.getElementById("maxNodes");
  return Number(input.max);
}}
function setSliderLimitForGraph() {{
  const input = document.getElementById("maxNodes");
  const max = Math.max(3000, GRAPH.meta.nodes + 1);
  input.max = String(max);
  input.step = max > 3000 ? "1" : "20";
}}
function isUnlimitedNodes() {{
  return !Number.isFinite(state.maxNodes);
}}
function formatMaxNodes() {{
  return isUnlimitedNodes() ? "Kõik" : String(state.maxNodes);
}}
function syncMaxNodesControl() {{
  const input = document.getElementById("maxNodes");
  if (isUnlimitedNodes()) input.value = String(unlimitedSliderValue());
  else input.value = String(state.maxNodes);
  document.getElementById("maxNodesLabel").textContent = formatMaxNodes();
}}
function labelType(type) {{ return TYPE_LABELS[type] || type || "Muu"; }}
function shortLabel(text, max = 56) {{
  text = String(text || "");
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}}
function radiusFor(n) {{
  if (n.type === "NationalCurriculum") return 17;
  if (n.type === "CurriculumDomain" || n.type === "Subject") return 14;
  if (n.type === "SchoolStage") return 12;
  if (n.type === "Grade") return 10;
  if (n.type === "Material") return 4.8;
  if (n.type === "SourceDocument" || n.type === "EvidenceSpan") return 4.2;
  if (TYPE_GROUPS.canonical.includes(n.type)) return 6.1;
  if (TYPE_GROUPS.assessment.includes(n.type)) return 5.9;
  if (TYPE_GROUPS.cross.includes(n.type)) return 6.8;
  return 5.8;
}}
function initialPos(n, i) {{
  const x = GROUP_X[n.type] ?? (TYPE_ORDER.indexOf(n.type) * 90 - 500);
  let subjOffset = n.subject === "Kirjandus" ? 140 : n.subject === "Eesti keel" ? -140 : 0;
  if (n.kg_layer === "competence_overlay") subjOffset = 260;
  if (n.kg_layer === "assessment_task") subjOffset += 60;
  const wave = Math.sin(i * 1.618) * 46;
  const y = subjOffset + ((i * 73) % 520) - 260 + wave;
  return {{ x, y }};
}}
function ensureParticle(n, i = 0) {{
  let p = state.particles.get(n.id);
  if (!p) {{
    const pos = initialPos(n, i);
    p = {{ id: n.id, x: pos.x, y: pos.y, vx: 0, vy: 0, r: radiusFor(n) }};
    state.particles.set(n.id, p);
  }}
  return p;
}}
function nodeScore(n) {{
  let score = TYPE_ORDER.indexOf(n.type);
  if (score < 0) score = 99;
  score *= 10;
  score -= Math.min(n.degree || 0, 80) * .18;
  if (state.pinned.has(n.id)) score -= 1000;
  if (n.type === "NationalCurriculum" || n.type === "CurriculumDomain" || n.type === "Subject") score -= 180;
  if (n.type === "SchoolStage" || n.type === "Grade") score -= 110;
  if (n.type === "SkillUnit") score -= 210;
  if (n.type === "CompetenceUnit") score -= 205;
  if (n.type === "KnowledgeUnit") score -= 200;
  if (n.type === "LearningOutcome") score -= 120;
  if (n.type === "Topic") score -= 80;
  if (n.type === "SourceDocument" || n.type === "EvidenceSpan") score += 90;
  return score;
}}
function filteredNodes() {{
  const q = state.search.trim().toLowerCase();
  let candidates = [];
  let hitIds = null;
  if (q) {{
    hitIds = new Set();
    for (let i = 0; i < GRAPH.nodes.length; i++) {{
      if (searchRows[i].includes(q) || effectiveLabel(GRAPH.nodes[i]).toLowerCase().includes(q)) {{
        const id = GRAPH.nodes[i].id;
        hitIds.add(id);
        for (const [neighbor] of getNeighbors(id)) hitIds.add(neighbor);
      }}
    }}
  }}
  for (const n of GRAPH.nodes) {{
    if (isNodeDeleted(n.id)) continue;
    if (!state.enabledLayers.has(n.kg_layer) && !state.pinned.has(n.id)) continue;
    if (!state.includeResources && RESOURCE_TYPES.has(n.type) && !state.pinned.has(n.id)) continue;
    if (!state.enabledTypes.has(n.type) && !state.pinned.has(n.id)) continue;
    if (state.subject !== "all" && n.subject && n.subject !== state.subject) continue;
    if (hitIds && !hitIds.has(n.id) && !state.pinned.has(n.id)) continue;
    candidates.push(n);
  }}
  for (const id of state.pinned) {{
    const n = nodeById.get(id);
    if (n && !isNodeDeleted(n.id) && !candidates.includes(n)) candidates.push(n);
    for (const [neighbor] of getNeighbors(id)) {{
      const nn = nodeById.get(neighbor);
      if (!nn) continue;
      if (isNodeDeleted(nn.id)) continue;
      if (!state.enabledLayers.has(nn.kg_layer) && !state.pinned.has(nn.id)) continue;
      if (!state.includeResources && RESOURCE_TYPES.has(nn.type) && !state.pinned.has(nn.id)) continue;
      if ((state.enabledTypes.has(nn.type) || state.pinned.has(nn.id)) && !candidates.includes(nn)) candidates.push(nn);
    }}
  }}
  candidates.sort((a, b) => nodeScore(a) - nodeScore(b));
  if (isUnlimitedNodes()) {{
    state.capped = 0;
    return candidates;
  }}
  state.capped = Math.max(0, candidates.length - state.maxNodes);
  return candidates.slice(0, state.maxNodes);
}}
function updateVisible() {{
  state.visibleNodes = filteredNodes();
  const ids = new Set(state.visibleNodes.map(n => n.id));
  state.visibleEdges = activeEdges().filter(e => ids.has(e.source) && ids.has(e.target) && state.enabledEdges.has(e.type) && (state.enabledLayers.has(e.kg_layer) || e.authority === "expert_edit"));
  state.visibleNodes.forEach(ensureParticle);
  state.simTicks = Math.min(120, Math.max(35, Math.round(state.visibleNodes.length / 8)));
  document.getElementById("visibleStats").textContent = `${{state.visibleNodes.length}} / ${{GRAPH.meta.nodes}} sõlme · ${{state.visibleEdges.length}} / ${{GRAPH.meta.edges}} seost`;
  const meter = document.getElementById("visibleMeter");
  meter.style.width = `${{Math.min(100, state.visibleNodes.length / GRAPH.meta.nodes * 100)}}%`;
  const cap = document.getElementById("capNotice");
  if (state.capped > 0) {{
    cap.hidden = false;
    cap.textContent = `Piir peidab veel ${{state.capped}} sobivat sõlme`;
  }} else {{
    cap.hidden = true;
  }}
  selectedConnectionSummary();
  requestDraw();
}}
function simulate() {{
  if (state.simTicks <= 0) return;
  state.simTicks--;
  const visible = state.visibleNodes.map(n => state.particles.get(n.id)).filter(Boolean);
  const visibleSet = new Set(state.visibleNodes.map(n => n.id));
  for (const p of visible) {{
    if (state.drag === p.id) continue;
    const n = nodeById.get(p.id);
    const targetX = GROUP_X[n.type] ?? 0;
    let targetY = n.subject === "Kirjandus" ? 135 : n.subject === "Eesti keel" ? -135 : 0;
    if (n.kg_layer === "competence_overlay") targetY = 260;
    if (n.kg_layer === "assessment_task") targetY += 60;
    p.vx += (targetX - p.x) * .0011;
    p.vy += (targetY - p.y) * .0008;
  }}
  const edgeLimit = Math.min(state.visibleEdges.length, 2500);
  for (let i = 0; i < edgeLimit; i++) {{
    const e = state.visibleEdges[i];
    const a = state.particles.get(e.source), b = state.particles.get(e.target);
    if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ideal = e.type === "extracted_from" ? 80 : e.type === "has_subject" ? 115 : 135;
    const f = (dist - ideal) * .0015;
    const fx = dx / dist * f, fy = dy / dist * f;
    a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
  }}
  const grid = new Map();
  const cell = 60;
  for (const p of visible) {{
    const key = `${{Math.round(p.x / cell)}},${{Math.round(p.y / cell)}}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(p);
  }}
  for (const p of visible) {{
    const gx = Math.round(p.x / cell), gy = Math.round(p.y / cell);
    for (let x = gx - 1; x <= gx + 1; x++) for (let y = gy - 1; y <= gy + 1; y++) {{
      for (const o of grid.get(`${{x}},${{y}}`) || []) {{
        if (o === p || o.id < p.id) continue;
        const dx = o.x - p.x, dy = o.y - p.y;
        const d2 = dx * dx + dy * dy || 1;
        if (d2 > 3600) continue;
        const d = Math.sqrt(d2);
        const densityBoost = Math.min(1.45, 1 + visible.length / 2600);
        const push = (1 - d / 60) * .052 * densityBoost;
        const fx = dx / d * push, fy = dy / d * push;
        p.vx -= fx; p.vy -= fy; o.vx += fx; o.vy += fy;
      }}
    }}
  }}
  for (const p of visible) {{
    if (state.drag === p.id) continue;
    p.vx *= .86; p.vy *= .86;
    p.x += Math.max(-7, Math.min(7, p.vx));
    p.y += Math.max(-7, Math.min(7, p.vy));
  }}
  requestDraw();
}}
function worldToScreen(p) {{ return {{ x: p.x * state.scale + state.tx, y: p.y * state.scale + state.ty }}; }}
function screenToWorld(x, y) {{ return {{ x: (x - state.tx) / state.scale, y: (y - state.ty) / state.scale }}; }}
function stableHash(value) {{
  let hash = 2166136261;
  const text = String(value || "");
  for (let i = 0; i < text.length; i++) {{
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }}
  return (hash >>> 0) / 4294967295;
}}
function labelPriority(n) {{
  if (n.type === "Subject") return 100;
  if (n.type === "NationalCurriculum" || n.type === "CurriculumDomain") return 92;
  if (n.type === "GeneralCompetence" || n.type === "DomainCompetence") return 82;
  if (n.type === "Topic") return 70;
  if (n.type === "LearningOutcome") return 58;
  if (n.type === "CompetenceUnit") return 52;
  if (n.type === "SkillUnit" || n.type === "KnowledgeUnit") return 44;
  return 30;
}}
function labelCapForZoom() {{
  if (state.scale < .55) return 10;
  if (state.scale < .9) return 18;
  if (state.scale < 1.25) return 30;
  if (state.scale < 1.7) return 50;
  if (state.scale < 2.25) return 85;
  return 150;
}}
function buildLabelSet(selectedNeighbors) {{
  const labels = new Set();
  const candidates = [];
  const cx = state.width / 2;
  const cy = state.height / 2;
  const diag = Math.hypot(state.width, state.height) || 1;
  const focusRadius = state.scale < 1 ? diag * .72 : state.scale < 1.7 ? diag * .48 : diag * .34;
  for (const n of state.visibleNodes) {{
    const p = state.particles.get(n.id);
    if (!p) continue;
    const s = worldToScreen(p);
    if (s.x < -120 || s.x > state.width + 120 || s.y < -80 || s.y > state.height + 80) continue;
    const isAnchor = n.type === "Subject" || n.type === "NationalCurriculum";
    const isHot = n.id === state.selected || n.id === state.hover;
    if (isAnchor || isHot) {{
      labels.add(n.id);
      continue;
    }}
    const centerDist = Math.hypot(s.x - cx, s.y - cy);
    const inFocus = centerDist <= focusRadius;
    const hash = stableHash(n.id);
    if (state.scale < .9 && hash > .035 && !selectedNeighbors.has(n.id)) continue;
    if (state.scale >= .9 && !inFocus && hash > .018 && !selectedNeighbors.has(n.id)) continue;
    const neighborBoost = selectedNeighbors.has(n.id) ? 55 : 0;
    const score = labelPriority(n) + neighborBoost + (1 - Math.min(1, centerDist / focusRadius)) * 35 + (1 - hash) * 10;
    candidates.push({{ id: n.id, score, inFocus }});
  }}
  candidates.sort((a, b) => b.score - a.score);
  const cap = labelCapForZoom();
  let added = 0;
  for (const item of candidates) {{
    if (added >= cap) break;
    labels.add(item.id);
    added++;
  }}
  if (state.scale >= 2.25) {{
    let localAdded = 0;
    for (const n of state.visibleNodes) {{
      if (localAdded >= 110) break;
      const p = state.particles.get(n.id);
      if (!p) continue;
      const s = worldToScreen(p);
      if (Math.hypot(s.x - cx, s.y - cy) <= focusRadius * .62) {{
        labels.add(n.id);
        localAdded++;
      }}
    }}
  }}
  return labels;
}}
function selectedConnectionSummary() {{
  const node = nodeById.get(state.selected);
  const box = document.getElementById("selectedSummary");
  if (!node || !box) {{
    if (box) box.hidden = true;
    return;
  }}
  const visibleIds = new Set(state.visibleNodes.map(n => n.id));
  const links = state.visibleEdges
    .filter(e => e.source === state.selected || e.target === state.selected)
    .map(e => {{
      const otherId = e.source === state.selected ? e.target : e.source;
      const other = nodeById.get(otherId);
      return other && visibleIds.has(otherId) ? `${{e.type}}: ${{shortLabel(effectiveLabel(other), 34)}}` : null;
    }})
    .filter(Boolean);
  const shown = links.slice(0, 5).join(" · ");
  box.textContent = `${{shortLabel(effectiveLabel(node), 42)}} → ${{links.length}} seost${{shown ? ": " + shown : ""}}${{links.length > 5 ? " · ..." : ""}}`;
  box.hidden = false;
}}
function drawScreenLabels(labelItems) {{
  if (!labelItems.length) return;
  ctx.save();
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  for (const item of labelItems) {{
    const fontSize = item.selected ? 12.5 : item.hover ? 12 : 10.5;
    ctx.font = `${{fontSize}}px Inter, Segoe UI, sans-serif`;
    const label = shortLabel(effectiveLabel(item.node), item.selected ? 76 : 44);
    const x = item.screen.x + item.radius * state.scale + 6;
    const y = item.screen.y;
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "rgba(255,255,255,.86)";
    ctx.strokeText(label, x, y);
    ctx.fillStyle = item.selected ? "#0f766e" : "#17202c";
    ctx.fillText(label, x, y);
  }}
  ctx.restore();
}}
function draw() {{
  state.dirty = false;
  ctx.clearRect(0, 0, state.width, state.height);
  ctx.save();
  ctx.translate(state.tx, state.ty);
  ctx.scale(state.scale, state.scale);
  ctx.lineCap = "round";
  const dimEdges = state.visibleEdges.length > 1800;
  const drawEdgeLimit = Math.min(state.visibleEdges.length, 6500);
  const selectedNeighbors = new Set();
  if (state.selected) {{
    for (const e of state.visibleEdges) {{
      if (e.source === state.selected) selectedNeighbors.add(e.target);
      if (e.target === state.selected) selectedNeighbors.add(e.source);
    }}
  }}
  for (let edgeIndex = 0; edgeIndex < drawEdgeLimit; edgeIndex++) {{
    const e = state.visibleEdges[edgeIndex];
    const a = state.particles.get(e.source), b = state.particles.get(e.target);
    if (!a || !b) continue;
    const hot = state.selected && (e.source === state.selected || e.target === state.selected);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = hot ? "rgba(15,118,110,.64)" : dimEdges ? "rgba(76,88,105,.08)" : "rgba(76,88,105,.14)";
    ctx.lineWidth = hot ? 1.7 / state.scale : 1 / state.scale;
    ctx.stroke();
  }}
  const labelSet = buildLabelSet(selectedNeighbors);
  const labelItems = [];
  for (const n of state.visibleNodes) {{
    const p = state.particles.get(n.id);
    if (!p) continue;
    const selected = state.selected === n.id;
    const hover = state.hover === n.id;
    const connected = selectedNeighbors.has(n.id);
    const color = COLORS[n.type] || COLORS.Unknown;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + (selected ? 4 : hover ? 2.5 : connected ? 2 : 0), 0, Math.PI * 2);
    ctx.fillStyle = selected ? "rgba(15,118,110,.20)" : hover ? "rgba(37,99,235,.15)" : connected ? "rgba(15,118,110,.11)" : "rgba(255,255,255,.68)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = (selected || connected ? 1.7 : 1.1) / state.scale;
    ctx.strokeStyle = selected ? "rgba(15,118,110,.92)" : connected ? "rgba(15,118,110,.72)" : "rgba(255,255,255,.95)";
    ctx.stroke();
    if (labelSet.has(n.id)) labelItems.push({{ node: n, screen: worldToScreen(p), radius: p.r, selected, hover }});
  }}
  ctx.restore();
  drawScreenLabels(labelItems);
}}
function tick() {{
  simulate();
  if (state.dirty) draw();
  requestAnimationFrame(tick);
}}
function requestDraw() {{ state.dirty = true; }}
function resize() {{
  const rect = canvas.getBoundingClientRect();
  state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  state.width = Math.max(1, rect.width);
  state.height = Math.max(1, rect.height);
  canvas.width = Math.round(state.width * state.dpr);
  canvas.height = Math.round(state.height * state.dpr);
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  fit();
  requestDraw();
}}
function fit() {{
  const points = state.visibleNodes.map(n => state.particles.get(n.id)).filter(Boolean);
  if (!points.length) return;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs) - 90, maxX = Math.max(...xs) + 240;
  const minY = Math.min(...ys) - 90, maxY = Math.max(...ys) + 90;
  const scale = Math.max(.22, Math.min(1.35, Math.min(state.width / (maxX - minX), state.height / (maxY - minY))));
  state.scale = scale;
  state.tx = (state.width - (minX + maxX) * scale) / 2;
  state.ty = (state.height - (minY + maxY) * scale) / 2;
  requestDraw();
}}
function nearestNode(x, y) {{
  const w = screenToWorld(x, y);
  let best = null, bestD = Infinity;
  for (const n of state.visibleNodes) {{
    const p = state.particles.get(n.id);
    if (!p) continue;
    const d = Math.hypot(p.x - w.x, p.y - w.y);
    if (d < p.r + 8 / state.scale && d < bestD) {{ best = n; bestD = d; }}
  }}
  return best;
}}
function renderSelection() {{
  const box = document.getElementById("selection");
  const n = nodeById.get(state.selected);
  if (!n || isNodeDeleted(n.id)) {{
    box.innerHTML = '<div class="empty">Klõpsa sõlmel, et näha metaandmeid ja avada naabrus.</div>';
    selectedConnectionSummary();
    return;
  }}
  const neighbors = getNeighbors(n.id);
  const urlRow = n.source_url
    ? `<div>Allikas</div><div><a class="link" href="${{safeText(n.source_url)}}" target="_blank" rel="noreferrer">${{safeText(n.source_url)}}</a></div>`
    : "";
  const editBadge = currentEdits().renamed?.[n.id] ? '<span class="edit-badge">renamed</span>' : "";
  const editTools = state.editMode ? renderNodeEditTools(n, neighbors) : "";
  box.innerHTML = `
    <div class="selection-title">${{safeText(effectiveLabel(n))}}${{editBadge}}</div>
    <div class="kv">
      <div>Tüüp</div><div>${{labelType(n.type)}}</div>
      <div>Kiht</div><div>${{safeText(LAYER_LABELS[n.kg_layer] || n.kg_layer || "—")}}</div>
      <div>Õppeaine</div><div>${{safeText(n.subject || "—")}}</div>
      <div>Klass</div><div>${{safeText(n.grade || "—")}}</div>
      <div>Autoriteet</div><div>${{safeText(n.authority || "—")}}</div>
      <div>Seotud</div><div>${{safeText((n.related_terms || []).slice(0, 3).join(", ") || "—")}}</div>
      <div>Seoseid</div><div>${{neighbors.length}}</div>
      ${{urlRow}}
    </div>
    <div class="row-actions">
      <button class="button strong" id="expandBtn">Laienda</button>
      <button class="button" id="focusBtn">Fookus</button>
    </div>
    ${{editTools}}`;
  document.getElementById("expandBtn").onclick = () => {{
    state.pinned.add(n.id);
    for (const [id] of neighbors) state.pinned.add(id);
    if (!isUnlimitedNodes()) {{
      state.maxNodes = Math.max(state.maxNodes, Math.min(unlimitedSliderValue() - 1, state.pinned.size + 260));
      syncMaxNodesControl();
    }}
    updateVisible();
  }};
  document.getElementById("focusBtn").onclick = () => {{
    state.pinned = new Set([n.id, ...neighbors.map(([id]) => id)]);
    updateVisible();
    fit();
  }};
  bindNodeEditTools(n, neighbors);
  selectedConnectionSummary();
}}
function renderNodeEditTools(n, neighbors) {{
  const nodeOptions = GRAPH.nodes
    .filter(node => node.id !== n.id && !isNodeDeleted(node.id))
    .sort((a, b) => effectiveLabel(a).localeCompare(effectiveLabel(b), "et"))
    .map(node => `<option value="${{safeText(node.id)}}">${{safeText(shortLabel(effectiveLabel(node), 72))}} · ${{safeText(labelType(node.type))}}</option>`)
    .join("");
  const edgeTypes = [...new Set([...GRAPH.edges.map(e => e.type), ...currentEdits().addedEdges.map(e => e.type), "related_to"])]
    .sort()
    .map(type => `<option value="${{safeText(type)}}">${{safeText(type)}}</option>`)
    .join("");
  const edgeRows = neighbors.slice(0, 14).map(([neighborId, edge]) => {{
    const other = nodeById.get(neighborId);
    const otherLabel = other ? effectiveLabel(other) : neighborId;
    return `<div class="edge-row">
      <span>${{safeText(edge.type)}} → ${{safeText(shortLabel(otherLabel, 48))}}</span>
      <button class="mini danger" data-delete-edge="${{safeText(edge.id)}}">Remove</button>
    </div>`;
  }}).join("") || '<div class="empty">No visible links to edit.</div>';
  return `
    <div class="edit-tools edit-panel">
      <div class="edit-grid">
        <label>Rename node</label>
        <input id="renameInput" value="${{safeText(effectiveLabel(n))}}">
        <button class="button strong" id="renameBtn">Save rename</button>
        <button class="button danger" id="deleteNodeBtn">Delete node</button>
      </div>
      <div class="edit-grid">
        <label>Add link from selected node</label>
        <select id="linkTarget">${{nodeOptions}}</select>
        <select id="linkType">${{edgeTypes}}</select>
        <button class="button strong" id="addLinkBtn">Add link</button>
      </div>
      <div class="edit-grid">
        <label>Remove links</label>
        <div class="edge-list">${{edgeRows}}</div>
      </div>
    </div>`;
}}
function bindNodeEditTools(n, neighbors) {{
  if (!state.editMode) return;
  const renameBtn = document.getElementById("renameBtn");
  if (renameBtn) renameBtn.onclick = () => {{
    const value = document.getElementById("renameInput").value.trim();
    if (!value || value === effectiveLabel(n)) return;
    commitEdit(`Rename: ${{shortLabel(value, 36)}}`, edits => {{
      edits.renamed[n.id] = value;
    }});
  }};
  const deleteBtn = document.getElementById("deleteNodeBtn");
  if (deleteBtn) deleteBtn.onclick = () => {{
    if (!confirm("Delete this node from the editable view? You can undo this.")) return;
    commitEdit(`Delete node: ${{shortLabel(effectiveLabel(n), 36)}}`, edits => {{
      edits.deletedNodes.push(n.id);
    }});
    state.selected = null;
    renderSelection();
  }};
  const addBtn = document.getElementById("addLinkBtn");
  if (addBtn) addBtn.onclick = () => {{
    const target = document.getElementById("linkTarget").value;
    const type = document.getElementById("linkType").value || "related_to";
    if (!target || target === n.id) return;
    state.enabledEdges.add(type);
    commitEdit(`Add link: ${{shortLabel(effectiveLabel(n), 24)}} → ${{shortLabel(effectiveLabel(nodeById.get(target)), 24)}}`, edits => {{
      edits.addedEdges.push({{
        id: `edit_edge:${{Date.now()}}:${{Math.random().toString(16).slice(2)}}`,
        source: n.id,
        target,
        type,
        kg_layer: "expert_edit",
        confidence: 1,
        authority: "expert_edit",
        source_url: null,
      }});
    }});
  }};
  for (const btn of document.querySelectorAll("[data-delete-edge]")) {{
    btn.onclick = () => {{
      const edgeId = btn.dataset.deleteEdge;
      commitEdit(`Remove link: ${{edgeId}}`, edits => {{
        edits.deletedEdges.push(edgeId);
      }});
    }};
  }}
}}
function renderFilters() {{
  const supportEdgeCount = GRAPH.edges.filter(e => DEFAULT_HIDDEN_EDGE_TYPES.has(e.type)).length;
  document.getElementById("supportEdgeCount").textContent = supportEdgeCount;
  const subjects = ["all", ...Array.from(new Set(GRAPH.nodes.map(n => n.subject).filter(Boolean))).sort()];
  document.getElementById("subjectFilter").innerHTML = subjects.map(s => `<option value="${{s}}">${{s === "all" ? "Kõik" : s}}</option>`).join("");
  const layerNodeCounts = new Map();
  const layerEdgeCounts = new Map();
  for (const n of GRAPH.nodes) layerNodeCounts.set(n.kg_layer, (layerNodeCounts.get(n.kg_layer) || 0) + 1);
  for (const e of GRAPH.edges) layerEdgeCounts.set(e.kg_layer, (layerEdgeCounts.get(e.kg_layer) || 0) + 1);
  const layerList = [...new Set([...LAYER_ORDER, ...layerNodeCounts.keys(), ...layerEdgeCounts.keys()])]
    .filter(layer => layerNodeCounts.has(layer) || layerEdgeCounts.has(layer));
  document.getElementById("layerFilters").innerHTML = layerList.map(layer => `
    <label class="check">
      <input type="checkbox" data-layer="${{layer}}" ${{state.enabledLayers.has(layer) ? "checked" : ""}}>
      <span>${{LAYER_LABELS[layer] || layer}}</span>
      <span class="count">${{layerNodeCounts.get(layer) || 0}}/${{layerEdgeCounts.get(layer) || 0}}</span>
    </label>`).join("");
  const typeCounts = new Map();
  for (const n of GRAPH.nodes) typeCounts.set(n.type, (typeCounts.get(n.type) || 0) + 1);
  const typeList = [...new Set([...TYPE_ORDER, ...typeCounts.keys()])].filter(t => typeCounts.has(t));
  document.getElementById("typeFilters").innerHTML = typeList.map(t => `
    <label class="check">
      <input type="checkbox" data-type="${{t}}" ${{state.enabledTypes.has(t) ? "checked" : ""}}>
      <span><span class="legend" style="background:${{COLORS[t] || COLORS.Unknown}}"></span>${{labelType(t)}}</span>
      <span class="count">${{typeCounts.get(t)}}</span>
    </label>`).join("");
  const edgeCounts = new Map();
  for (const e of GRAPH.edges) edgeCounts.set(e.type, (edgeCounts.get(e.type) || 0) + 1);
  document.getElementById("edgeFilters").innerHTML = [...edgeCounts.entries()].sort((a, b) => b[1] - a[1]).map(([t, c]) => `
    <label class="check">
      <input type="checkbox" data-edge="${{t}}" ${{state.enabledEdges.has(t) ? "checked" : ""}}>
      <span>${{t.replaceAll("_", " ")}}</span>
      <span class="count">${{c}}</span>
    </label>`).join("");
  setSliderLimitForGraph();
  syncMaxNodesControl();
}}
function syncTypeChecks() {{
  for (const input of document.querySelectorAll("[data-type]")) input.checked = state.enabledTypes.has(input.dataset.type);
}}
function syncLayerChecks() {{
  for (const input of document.querySelectorAll("[data-layer]")) input.checked = state.enabledLayers.has(input.dataset.layer);
}}
function syncEdgeChecks() {{
  for (const input of document.querySelectorAll("[data-edge]")) input.checked = state.enabledEdges.has(input.dataset.edge);
  document.getElementById("supportEdgesToggle").checked = [...DEFAULT_HIDDEN_EDGE_TYPES].some(type => state.enabledEdges.has(type));
}}
function setEdgePreset(mode) {{
  const allTypes = new Set(GRAPH.edges.map(e => e.type));
  if (mode === "all") {{
    state.enabledEdges = allTypes;
  }} else if (mode === "support") {{
    state.enabledEdges = allTypes;
  }} else if (mode === "subjects") {{
    state.enabledEdges = new Set(["contains", "has_subject"]);
  }} else if (mode === "canonical") {{
    state.enabledEdges = new Set(GRAPH.edges.filter(e => e.kg_layer !== "competence_overlay" || !DEFAULT_HIDDEN_EDGE_TYPES.has(e.type)).map(e => e.type));
    for (const e of GRAPH.edges) if (e.kg_layer === "canonicalization") state.enabledEdges.add(e.type);
  }} else {{
    state.enabledEdges = new Set(GRAPH.edges.filter(e => !DEFAULT_HIDDEN_EDGE_TYPES.has(e.type)).map(e => e.type));
  }}
}}
function applyPreset(name) {{
  if (name === "custom") return;
  const preset = PRESETS[name] || PRESETS.default_layers;
  state.enabledLayers = new Set(preset.layers);
  state.enabledTypes = new Set(preset.types || GRAPH.nodes.filter(n => state.enabledLayers.has(n.kg_layer)).map(n => n.type));
  state.maxNodes = preset.maxNodes === "all" ? Infinity : (preset.maxNodes || 1100);
  syncMaxNodesControl();
  setEdgePreset(preset.edges);
  state.includeResources = false;
  state.pinned.clear();
  state.selected = null;
  state.search = "";
  document.getElementById("search").value = "";
  syncLayerChecks();
  syncTypeChecks();
  syncEdgeChecks();
  renderSelection();
  updateVisible();
  fit();
}}
canvas.addEventListener("pointerdown", e => {{
  const n = nearestNode(e.offsetX, e.offsetY);
  canvas.setPointerCapture(e.pointerId);
  if (n) {{
    state.drag = n.id;
    state.selected = n.id;
    renderSelection();
    requestDraw();
  }} else {{
    state.pan = {{ x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty }};
    canvas.classList.add("dragging");
  }}
}});
canvas.addEventListener("pointermove", e => {{
  if (state.drag) {{
    const p = state.particles.get(state.drag);
    const w = screenToWorld(e.offsetX, e.offsetY);
    p.x = w.x; p.y = w.y; p.vx = 0; p.vy = 0;
    state.simTicks = Math.max(state.simTicks, 16);
    requestDraw();
    return;
  }}
  if (state.pan) {{
    state.tx = state.pan.tx + e.clientX - state.pan.x;
    state.ty = state.pan.ty + e.clientY - state.pan.y;
    requestDraw();
    return;
  }}
  const n = nearestNode(e.offsetX, e.offsetY);
  const id = n ? n.id : null;
  if (id !== state.hover) {{ state.hover = id; requestDraw(); }}
}});
canvas.addEventListener("pointerup", () => {{
  state.drag = null;
  state.pan = null;
  canvas.classList.remove("dragging");
}});
canvas.addEventListener("wheel", e => {{
  e.preventDefault();
  const before = screenToWorld(e.offsetX, e.offsetY);
  state.scale = Math.max(.15, Math.min(3.2, state.scale * (e.deltaY < 0 ? 1.1 : .9)));
  state.tx = e.offsetX - before.x * state.scale;
  state.ty = e.offsetY - before.y * state.scale;
  requestDraw();
}}, {{ passive: false }});
document.getElementById("searchBtn").onclick = () => {{
  state.search = document.getElementById("search").value;
  updateVisible();
  fit();
}};
document.getElementById("search").addEventListener("keydown", e => {{
  if (e.key === "Enter") document.getElementById("searchBtn").click();
}});
window.addEventListener("keydown", e => {{
  const tag = e.target?.tagName;
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
  const delta = e.shiftKey ? 90 : 42;
  let dx = 0, dy = 0;
  if (e.key === "ArrowLeft") dx = delta;
  else if (e.key === "ArrowRight") dx = -delta;
  else if (e.key === "ArrowUp") dy = delta;
  else if (e.key === "ArrowDown") dy = -delta;
  else return;
  e.preventDefault();
  state.tx += dx;
  state.ty += dy;
  requestDraw();
}});
document.getElementById("fitBtn").onclick = fit;
document.getElementById("resetBtn").onclick = () => {{
  document.getElementById("preset").value = DEFAULT_PRESET;
  state.subject = "all";
  document.getElementById("subjectFilter").value = "all";
  applyPreset(DEFAULT_PRESET);
}};
document.getElementById("preset").onchange = e => applyPreset(e.target.value);
document.getElementById("editModeToggle").onchange = e => {{
  state.editMode = e.target.checked;
  document.getElementById("editPanel").hidden = !state.editMode;
  renderSelection();
}};
document.getElementById("historySelect").onchange = e => setHistoryIndex(Number(e.target.value));
document.getElementById("undoBtn").onclick = () => setHistoryIndex(state.historyIndex - 1);
document.getElementById("redoBtn").onclick = () => setHistoryIndex(state.historyIndex + 1);
document.getElementById("originalBtn").onclick = () => setHistoryIndex(0);
document.getElementById("exportPatchBtn").onclick = () => {{
  const payload = {{
    snapshot: GRAPH.meta.snapshot,
    exported_at: new Date().toISOString(),
    history_index: state.historyIndex,
    current_patch: currentEdits(),
    history: state.history,
  }};
  const blob = new Blob([JSON.stringify(payload, null, 2)], {{ type: "application/json" }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `oppekava_kg_edits_${{GRAPH.meta.snapshot}}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}};
document.getElementById("clearSavedBtn").onclick = () => {{
  if (!confirm("Clear all saved edit history and return to the original graph?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state.history = historySeed();
  state.historyIndex = 0;
  state.selected = null;
  saveEditHistory();
  updateHistoryUI();
  renderSelection();
  updateVisible();
  fit();
}};
document.getElementById("supportEdgesToggle").onchange = e => {{
  for (const type of DEFAULT_HIDDEN_EDGE_TYPES) {{
    if (e.target.checked) state.enabledEdges.add(type);
    else state.enabledEdges.delete(type);
  }}
  document.getElementById("preset").value = "custom";
  syncEdgeChecks();
  renderSelection();
  updateVisible();
  fit();
}};
document.getElementById("subjectFilter").onchange = e => {{ state.subject = e.target.value; updateVisible(); fit(); }};
document.getElementById("maxNodes").oninput = e => {{
  const value = Number(e.target.value);
  state.maxNodes = value >= unlimitedSliderValue() ? Infinity : value;
  syncMaxNodesControl();
  updateVisible();
}};
document.getElementById("cleanGraphBtn").onclick = () => {{
  document.getElementById("preset").value = "custom";
  state.enabledLayers = new Set(["curriculum_backbone"]);
  state.enabledTypes = new Set(["NationalCurriculum"]);
  state.enabledEdges = new Set();
  state.subject = "all";
  state.selected = null;
  state.pinned.clear();
  document.getElementById("subjectFilter").value = "all";
  syncLayerChecks();
  syncTypeChecks();
  syncEdgeChecks();
  renderSelection();
  updateVisible();
  fit();
}};
document.addEventListener("change", e => {{
  if (e.target.matches("[data-layer]")) {{
    document.getElementById("preset").value = "custom";
    if (e.target.checked) state.enabledLayers.add(e.target.dataset.layer); else state.enabledLayers.delete(e.target.dataset.layer);
    updateVisible();
  }}
  if (e.target.matches("[data-type]")) {{
    document.getElementById("preset").value = "custom";
    if (e.target.checked) state.enabledTypes.add(e.target.dataset.type); else state.enabledTypes.delete(e.target.dataset.type);
    updateVisible();
  }}
  if (e.target.matches("[data-edge]")) {{
    if (e.target.checked) state.enabledEdges.add(e.target.dataset.edge); else state.enabledEdges.delete(e.target.dataset.edge);
    syncEdgeChecks();
    updateVisible();
  }}
}});
renderFilters();
updateHistoryUI();
document.getElementById("preset").value = DEFAULT_PRESET;
syncLayerChecks();
syncTypeChecks();
syncEdgeChecks();
syncMaxNodesControl();
updateVisible();
window.addEventListener("resize", resize);
resize();
fit();
window.graphEditor = {{ state, GRAPH, currentEdits, commitEdit, setHistoryIndex, renderSelection, updateVisible, fit }};
tick();
</script>
</body>
</html>
"""


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html_doc(load_graph()), encoding="utf-8")
    print(OUT)


if __name__ == "__main__":
    main()
