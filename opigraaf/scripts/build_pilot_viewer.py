import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "graph" / "snapshots" / "pilot" / "cytoscape_elements.json"
OUT = ROOT / "prototypes" / "pilot_graph_viewer.html"


TYPE_ORDER = [
    "Subject",
    "SchoolStage",
    "Grade",
    "Topic",
    "LearningOutcome",
    "Knowledge",
    "Material",
    "SourceDocument",
    "EvidenceSpan",
]


def load_graph():
    raw = json.loads(SNAPSHOT.read_text(encoding="utf-8"))
    nodes = []
    for item in raw["nodes"]:
        data = item["data"]
        nodes.append(
            {
                "id": data["id"],
                "label": data.get("label_et") or data.get("label") or data["id"],
                "type": data.get("type") or "Unknown",
                "subject": data.get("subject"),
                "grade": data.get("grade"),
                "school_stage": data.get("school_stage"),
                "status": data.get("status"),
                "confidence": data.get("confidence"),
                "source_url": data.get("source_url"),
                "description": data.get("description"),
                "text": data.get("text"),
            }
        )

    edges = []
    for item in raw["edges"]:
        data = item["data"]
        edges.append(
            {
                "id": data.get("id") or f"{data.get('source')}->{data.get('target')}",
                "source": data.get("source"),
                "target": data.get("target"),
                "type": data.get("type") or "related",
                "confidence": data.get("confidence"),
                "source_url": data.get("source_url"),
            }
        )
    return {"nodes": nodes, "edges": edges}


def html_doc(graph):
    graph_json = json.dumps(graph, ensure_ascii=False, separators=(",", ":"))
    type_order = json.dumps(TYPE_ORDER, ensure_ascii=False)
    return f"""<!doctype html>
<html lang="et">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Õppekava graaf · pilot</title>
<style>
:root {{
  --bg: #f7f8fa;
  --panel: #ffffff;
  --panel-2: #f1f4f7;
  --ink: #1d2733;
  --muted: #66717f;
  --line: #dce2e8;
  --accent: #0d9488;
  --accent-2: #2563eb;
  --danger: #dc2626;
  --shadow: 0 16px 36px rgba(21, 31, 45, .10);
}}
* {{ box-sizing: border-box; }}
html, body {{ height: 100%; margin: 0; overflow: hidden; }}
body {{
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--ink);
}}
button, input, select {{ font: inherit; }}
.app {{
  display: grid;
  grid-template-columns: minmax(0, 1fr) 306px;
  height: 100vh;
}}
.stage {{
  min-width: 0;
  position: relative;
  background:
    linear-gradient(rgba(255,255,255,.86), rgba(255,255,255,.86)),
    radial-gradient(circle at 20% 0%, rgba(13,148,136,.10), transparent 32%),
    radial-gradient(circle at 80% 12%, rgba(37,99,235,.10), transparent 30%);
}}
.topbar {{
  position: absolute;
  top: 14px;
  left: 16px;
  right: 18px;
  z-index: 5;
  display: grid;
  grid-template-columns: auto minmax(240px, 520px) auto;
  gap: 12px;
  align-items: center;
  pointer-events: none;
}}
.brand, .search, .tools {{
  pointer-events: auto;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(220,226,232,.95);
  box-shadow: 0 8px 22px rgba(21, 31, 45, .08);
  backdrop-filter: blur(10px);
}}
.brand {{
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 720;
}}
.mark {{
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: conic-gradient(from 30deg, #0d9488, #2563eb, #64748b, #0d9488);
  position: relative;
}}
.mark:after {{
  content: "";
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: white;
}}
.search {{
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 7px;
  border-radius: 999px;
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
  background: transparent;
  color: var(--ink);
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 999px;
  cursor: pointer;
}}
.iconbtn:hover, .pillbtn:hover {{ background: var(--panel-2); }}
.pillbtn.primary {{ background: var(--ink); color: white; }}
#graph {{ width: 100%; height: 100%; display: block; cursor: grab; }}
#graph.dragging {{ cursor: grabbing; }}
.hud {{
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 4;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: calc(100% - 32px);
}}
.chip {{
  background: rgba(255,255,255,.92);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 7px 10px;
  color: var(--muted);
  font-size: 12px;
  box-shadow: 0 6px 18px rgba(21, 31, 45, .07);
}}
aside {{
  border-left: 1px solid var(--line);
  background: var(--panel);
  min-width: 0;
  overflow-y: auto;
}}
.side-inner {{ padding: 16px 14px 20px; }}
h2 {{ font-size: 15px; margin: 0 0 4px; letter-spacing: 0; }}
h3 {{
  font-size: 12px;
  margin: 18px 0 9px;
  color: var(--muted);
  font-weight: 760;
  text-transform: uppercase;
}}
.hint {{ color: var(--muted); font-size: 12px; line-height: 1.45; margin: 0; }}
.field {{ display: grid; gap: 6px; margin-top: 12px; }}
.field label {{ color: var(--muted); font-size: 12px; }}
select, input[type="range"] {{
  width: 100%;
}}
select {{
  border: 1px solid var(--line);
  background: var(--panel);
  border-radius: 8px;
  min-height: 34px;
  padding: 6px 8px;
}}
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
.legend {{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  vertical-align: -1px;
}}
.selection {{
  border: 1px solid var(--line);
  background: var(--panel-2);
  border-radius: 8px;
  padding: 11px;
  margin-top: 12px;
}}
.selection-title {{ font-size: 13px; font-weight: 760; line-height: 1.35; overflow-wrap: anywhere; }}
.kv {{ display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 5px 8px; margin-top: 10px; font-size: 12px; }}
.kv div:nth-child(odd) {{ color: var(--muted); }}
.link {{ color: var(--accent-2); overflow-wrap: anywhere; text-decoration: none; }}
.link:hover {{ text-decoration: underline; }}
.actions {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }}
.button {{
  border: 1px solid var(--line);
  background: white;
  min-height: 34px;
  border-radius: 8px;
  cursor: pointer;
}}
.button:hover {{ border-color: #b9c3cf; }}
.button.strong {{ background: var(--accent); border-color: var(--accent); color: white; }}
.empty {{ color: var(--muted); font-size: 12px; margin-top: 10px; line-height: 1.45; }}
@media (max-width: 860px) {{
  .app {{ grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) 260px; }}
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
      <div class="brand"><span class="mark"></span><span>Õppekava graaf</span></div>
      <div class="search">
        <input id="search" placeholder="Otsi teemat, õpiväljundit, teadmist..." autocomplete="off">
        <button id="searchBtn" class="pillbtn primary" title="Otsi">Otsi</button>
      </div>
      <div class="tools">
        <button id="fitBtn" class="iconbtn" title="Mahuta vaatesse">⌖</button>
        <button id="resetBtn" class="iconbtn" title="Taasta algvaade">↺</button>
      </div>
    </div>
    <canvas id="graph"></canvas>
    <div class="hud">
      <div id="visibleStats" class="chip"></div>
      <div class="chip">Kerimine suumib · lohistamine nihutab · klõps avab detailid</div>
    </div>
  </main>
  <aside>
    <div class="side-inner">
      <h2>Pilotgraafi vaade</h2>
      <p class="hint">Algvaade näitab õppeaineid, kooliastmeid, klasse ja teemasid. Õpiväljundid, teadmised, tõendus- ja allikasõlmed on kiiruse ning loetavuse jaoks alguses peidetud.</p>

      <div class="field">
        <label for="subjectFilter">Õppeaine</label>
        <select id="subjectFilter"></select>
      </div>
      <div class="field">
        <label for="modeFilter">Kuva</label>
        <select id="modeFilter">
          <option value="overview">Kõrgem tasand</option>
          <option value="outcomes">Õpiväljundid ja teadmised</option>
          <option value="materials">Materjalid</option>
          <option value="all">Kõik lubatud tüübid</option>
        </select>
      </div>
      <div class="field">
        <label for="maxNodes">Maksimum sõlmi: <span id="maxNodesLabel"></span></label>
        <input id="maxNodes" type="range" min="80" max="900" step="20" value="180">
      </div>

      <h3>Sõlmetüübid</h3>
      <div id="typeFilters"></div>

      <h3>Seosetüübid</h3>
      <div id="edgeFilters"></div>

      <h3>Valitud sõlm</h3>
      <div id="selection" class="selection">
        <div class="empty">Klõpsa graafil sõlmel, et näha seoseid, allikat ja laiendada naabrust.</div>
      </div>
    </div>
  </aside>
</div>
<script>
const GRAPH = {graph_json};
const TYPE_ORDER = {type_order};
const COLORS = {{
  Subject: "#0f766e",
  SchoolStage: "#334155",
  Grade: "#64748b",
  Topic: "#2563eb",
  LearningOutcome: "#7c3aed",
  Knowledge: "#c2410c",
  Material: "#16a34a",
  SourceDocument: "#94a3b8",
  EvidenceSpan: "#d97706",
  Unknown: "#475569"
}};
const TYPE_LABELS = {{
  Subject: "Õppeaine",
  SchoolStage: "Kooliaste",
  Grade: "Klass",
  Topic: "Teema",
  LearningOutcome: "Õpiväljund",
  Knowledge: "Teadmine",
  Material: "Materjal",
  SourceDocument: "Allikas",
  EvidenceSpan: "Tõendus"
}};
const DEFAULT_TYPES = new Set(["Subject", "SchoolStage", "Grade", "Topic"]);
const MODE_TYPES = {{
  overview: new Set(["Subject", "SchoolStage", "Grade", "Topic"]),
  outcomes: new Set(["Subject", "SchoolStage", "Grade", "Topic", "LearningOutcome", "Knowledge"]),
  materials: new Set(["Subject", "Topic", "LearningOutcome", "Knowledge", "Material"]),
  all: null
}};
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const nodeById = new Map(GRAPH.nodes.map(n => [n.id, n]));
const adjacency = new Map();
for (const n of GRAPH.nodes) adjacency.set(n.id, []);
for (const e of GRAPH.edges) {{
  if (adjacency.has(e.source)) adjacency.get(e.source).push([e.target, e]);
  if (adjacency.has(e.target)) adjacency.get(e.target).push([e.source, e]);
}}
const state = {{
  width: 1, height: 1, dpr: 1,
  scale: 1, tx: 0, ty: 0,
  selected: null,
  pinned: new Set(),
  hover: null,
  dragged: null,
  pan: null,
  types: new Set(DEFAULT_TYPES),
  edges: new Set(GRAPH.edges.map(e => e.type)),
  subject: "all",
  mode: "overview",
  maxNodes: 180,
  search: "",
  visibleNodes: [],
  visibleEdges: [],
  particles: new Map(),
  dirty: true,
  simTicks: 0
}};
function shortLabel(text, limit = 58) {{
  text = String(text || "");
  return text.length > limit ? text.slice(0, limit - 1) + "…" : text;
}}
function typeLabel(type) {{ return TYPE_LABELS[type] || type || "Muu"; }}
function nodeScore(n) {{
  const t = TYPE_ORDER.indexOf(n.type);
  let score = t === -1 ? 50 : t * 5;
  const deg = adjacency.get(n.id)?.length || 0;
  score -= Math.min(deg, 30) * .22;
  if (state.pinned.has(n.id)) score -= 100;
  if (n.type === "Subject") score -= 50;
  return score;
}}
function resize() {{
  const rect = canvas.getBoundingClientRect();
  state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  state.width = Math.max(1, rect.width);
  state.height = Math.max(1, rect.height);
  canvas.width = Math.round(state.width * state.dpr);
  canvas.height = Math.round(state.height * state.dpr);
  canvas.style.width = state.width + "px";
  canvas.style.height = state.height + "px";
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  fit(false);
  requestDraw();
}}
function seedParticle(n, idx, total) {{
  if (state.particles.has(n.id)) return state.particles.get(n.id);
  const col = Math.max(0, TYPE_ORDER.indexOf(n.type));
  const cols = Math.max(1, TYPE_ORDER.length - 2);
  const x = -560 + (col % cols) * 150 + ((idx * 37) % 70);
  const y = -260 + ((idx * 83) % 520) + (n.subject === "Kirjandus" ? 50 : 0);
  const p = {{ id: n.id, x, y, vx: 0, vy: 0, r: radiusFor(n), fixed: false }};
  state.particles.set(n.id, p);
  return p;
}}
function radiusFor(n) {{
  if (n.type === "Subject") return 18;
  if (n.type === "SchoolStage") return 15;
  if (n.type === "Grade") return 12;
  if (n.type === "LearningOutcome") return 8;
  if (n.type === "Knowledge") return 7;
  return 9;
}}
function filteredNodes() {{
  const q = state.search.trim().toLowerCase();
  let base = GRAPH.nodes.filter(n => state.types.has(n.type));
  if (state.subject !== "all") {{
    base = base.filter(n => n.subject === state.subject || n.type === "Subject" && n.label === state.subject || n.subject == null && state.pinned.has(n.id));
  }}
  if (q) {{
    const hits = new Set();
    for (const n of GRAPH.nodes) {{
      const hay = `${{n.label}} ${{n.type}} ${{n.subject || ""}} ${{n.grade || ""}}`.toLowerCase();
      if (hay.includes(q)) {{
        hits.add(n.id);
        for (const [neighbor] of adjacency.get(n.id) || []) hits.add(neighbor);
      }}
    }}
    base = base.filter(n => hits.has(n.id) || state.pinned.has(n.id));
  }}
  for (const id of state.pinned) {{
    const n = nodeById.get(id);
    if (n && !base.includes(n)) base.push(n);
    for (const [neighbor] of adjacency.get(id) || []) {{
      const nn = nodeById.get(neighbor);
      if (nn && state.types.has(nn.type) && !base.includes(nn)) base.push(nn);
    }}
  }}
  base.sort((a, b) => nodeScore(a) - nodeScore(b));
  return base.slice(0, state.maxNodes);
}}
function updateVisible() {{
  state.visibleNodes = filteredNodes();
  const ids = new Set(state.visibleNodes.map(n => n.id));
  state.visibleEdges = GRAPH.edges.filter(e => ids.has(e.source) && ids.has(e.target) && state.edges.has(e.type));
  state.visibleNodes.forEach(seedParticle);
  state.simTicks = 90;
  document.getElementById("visibleStats").textContent = `${{state.visibleNodes.length}} / ${{GRAPH.nodes.length}} sõlme · ${{state.visibleEdges.length}} / ${{GRAPH.edges.length}} seost`;
  requestDraw();
}}
function simulate() {{
  if (state.simTicks <= 0) return;
  state.simTicks -= 1;
  const visible = state.visibleNodes.map(n => state.particles.get(n.id));
  const ids = new Set(state.visibleNodes.map(n => n.id));
  for (const p of visible) {{
    const n = nodeById.get(p.id);
    const col = Math.max(0, TYPE_ORDER.indexOf(n.type));
    const targetX = -520 + col * 135;
    const targetY = n.subject === "Kirjandus" ? 120 : -120;
    p.vx += (targetX - p.x) * .0009;
    p.vy += (targetY - p.y) * .0009;
  }}
  for (const e of state.visibleEdges) {{
    const a = state.particles.get(e.source), b = state.particles.get(e.target);
    if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ideal = e.type === "extracted_from" ? 90 : 125;
    const f = (dist - ideal) * .0018;
    const fx = dx / dist * f, fy = dy / dist * f;
    a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
  }}
  const grid = new Map();
  const cell = 58;
  for (const p of visible) {{
    const key = `${{Math.round(p.x / cell)}},${{Math.round(p.y / cell)}}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(p);
  }}
  for (const p of visible) {{
    const gx = Math.round(p.x / cell), gy = Math.round(p.y / cell);
    for (let xx = gx - 1; xx <= gx + 1; xx++) for (let yy = gy - 1; yy <= gy + 1; yy++) {{
      for (const o of grid.get(`${{xx}},${{yy}}`) || []) {{
        if (o === p || o.id < p.id) continue;
        const dx = o.x - p.x, dy = o.y - p.y;
        const dist2 = dx * dx + dy * dy || 1;
        if (dist2 > 3200) continue;
        const dist = Math.sqrt(dist2);
        const push = (1 - dist / 58) * .045;
        const fx = dx / dist * push, fy = dy / dist * push;
        p.vx -= fx; p.vy -= fy; o.vx += fx; o.vy += fy;
      }}
    }}
  }}
  for (const p of visible) {{
    if (state.dragged === p.id) continue;
    p.vx *= .86; p.vy *= .86;
    p.x += Math.max(-8, Math.min(8, p.vx));
    p.y += Math.max(-8, Math.min(8, p.vy));
  }}
  requestDraw();
}}
function worldToScreen(p) {{ return {{ x: p.x * state.scale + state.tx, y: p.y * state.scale + state.ty }}; }}
function screenToWorld(x, y) {{ return {{ x: (x - state.tx) / state.scale, y: (y - state.ty) / state.scale }}; }}
function draw() {{
  state.dirty = false;
  ctx.clearRect(0, 0, state.width, state.height);
  ctx.save();
  ctx.translate(state.tx, state.ty);
  ctx.scale(state.scale, state.scale);
  ctx.lineCap = "round";
  for (const e of state.visibleEdges) {{
    const a = state.particles.get(e.source), b = state.particles.get(e.target);
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = state.selected && (e.source === state.selected || e.target === state.selected) ? "rgba(13, 148, 136, .62)" : "rgba(79, 92, 111, .16)";
    ctx.lineWidth = state.selected && (e.source === state.selected || e.target === state.selected) ? 1.5 / state.scale : 1 / state.scale;
    ctx.stroke();
  }}
  for (const n of state.visibleNodes) {{
    const p = state.particles.get(n.id);
    if (!p) continue;
    const selected = state.selected === n.id;
    const hover = state.hover === n.id;
    const color = COLORS[n.type] || COLORS.Unknown;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + (selected ? 4 : hover ? 2 : 0), 0, Math.PI * 2);
    ctx.fillStyle = selected ? "rgba(13, 148, 136, .18)" : hover ? "rgba(37, 99, 235, .12)" : "rgba(255,255,255,.72)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1.4 / state.scale;
    ctx.strokeStyle = "rgba(255,255,255,.92)";
    ctx.stroke();
    const alwaysLabel = n.type === "Subject" || n.type === "SchoolStage" || n.type === "Grade";
    const zoomLabel = n.type === "Topic" ? state.scale > 1.08 : state.scale > 1.22;
    if (selected || hover || alwaysLabel || zoomLabel) {{
      ctx.font = `${{selected ? 13 : 11}}px Inter, Segoe UI, sans-serif`;
      ctx.fillStyle = "#17202c";
      ctx.textBaseline = "middle";
      ctx.fillText(shortLabel(n.label, selected ? 76 : 44), p.x + p.r + 5, p.y);
    }}
  }}
  ctx.restore();
}}
function tickLoop() {{
  simulate();
  if (state.dirty) draw();
  requestAnimationFrame(tickLoop);
}}
function requestDraw() {{ state.dirty = true; }}
function fit(animated = true) {{
  if (!state.visibleNodes.length) return;
  const points = state.visibleNodes.map(n => state.particles.get(n.id)).filter(Boolean);
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs) - 90, maxX = Math.max(...xs) + 220;
  const minY = Math.min(...ys) - 90, maxY = Math.max(...ys) + 90;
  const scale = Math.max(.35, Math.min(1.25, Math.min(state.width / (maxX - minX), state.height / (maxY - minY))));
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
    const d = Math.hypot(p.x - w.x, p.y - w.y);
    if (d < p.r + 8 / state.scale && d < bestD) {{ best = n; bestD = d; }}
  }}
  return best;
}}
function renderSelection() {{
  const box = document.getElementById("selection");
  const n = nodeById.get(state.selected);
  if (!n) {{
    box.innerHTML = '<div class="empty">Klõpsa graafil sõlmel, et näha seoseid, allikat ja laiendada naabrust.</div>';
    return;
  }}
  const neighbors = adjacency.get(n.id) || [];
  const url = n.source_url ? `<a class="link" href="${{n.source_url}}" target="_blank" rel="noreferrer">${{n.source_url}}</a>` : "—";
  box.innerHTML = `
    <div class="selection-title">${{n.label}}</div>
    <div class="kv">
      <div>Tüüp</div><div>${{typeLabel(n.type)}}</div>
      <div>Õppeaine</div><div>${{n.subject || "—"}}</div>
      <div>Klass</div><div>${{n.grade || "—"}}</div>
      <div>Seoseid</div><div>${{neighbors.length}}</div>
      <div>Allikas</div><div>${{url}}</div>
    </div>
    <div class="actions">
      <button class="button strong" id="expandBtn">Laienda</button>
      <button class="button" id="focusBtn">Fookus</button>
    </div>`;
  document.getElementById("expandBtn").onclick = () => {{
    state.pinned.add(n.id);
    for (const [id] of neighbors) state.pinned.add(id);
    state.maxNodes = Math.max(state.maxNodes, Math.min(900, state.pinned.size + 180));
    document.getElementById("maxNodes").value = state.maxNodes;
    document.getElementById("maxNodesLabel").textContent = state.maxNodes;
    updateVisible();
  }};
  document.getElementById("focusBtn").onclick = () => {{
    state.pinned = new Set([n.id, ...neighbors.map(([id]) => id)]);
    updateVisible();
    fit();
  }};
}}
function renderFilters() {{
  const subjects = ["all", ...Array.from(new Set(GRAPH.nodes.map(n => n.subject).filter(Boolean))).sort()];
  document.getElementById("subjectFilter").innerHTML = subjects.map(s => `<option value="${{s}}">${{s === "all" ? "Kõik" : s}}</option>`).join("");
  const typeCounts = new Map();
  for (const n of GRAPH.nodes) typeCounts.set(n.type, (typeCounts.get(n.type) || 0) + 1);
  const typeList = [...new Set([...TYPE_ORDER, ...typeCounts.keys()])].filter(t => typeCounts.has(t));
  document.getElementById("typeFilters").innerHTML = typeList.map(t => `
    <label class="check">
      <input type="checkbox" data-type="${{t}}" ${{state.types.has(t) ? "checked" : ""}}>
      <span><span class="legend" style="background:${{COLORS[t] || COLORS.Unknown}}"></span>${{typeLabel(t)}}</span>
      <span class="count">${{typeCounts.get(t)}}</span>
    </label>`).join("");
  const edgeCounts = new Map();
  for (const e of GRAPH.edges) edgeCounts.set(e.type, (edgeCounts.get(e.type) || 0) + 1);
  document.getElementById("edgeFilters").innerHTML = [...edgeCounts.entries()].sort((a, b) => b[1] - a[1]).map(([t, c]) => `
    <label class="check">
      <input type="checkbox" data-edge="${{t}}" checked>
      <span>${{t.replaceAll("_", " ")}}</span>
      <span class="count">${{c}}</span>
    </label>`).join("");
  document.getElementById("maxNodesLabel").textContent = state.maxNodes;
}}
function applyMode(mode) {{
  state.mode = mode;
  const allowed = MODE_TYPES[mode];
  if (allowed) state.types = new Set(allowed);
  else state.types = new Set(GRAPH.nodes.map(n => n.type));
  for (const input of document.querySelectorAll("[data-type]")) input.checked = state.types.has(input.dataset.type);
  updateVisible();
}}
canvas.addEventListener("pointerdown", e => {{
  const n = nearestNode(e.offsetX, e.offsetY);
  canvas.setPointerCapture(e.pointerId);
  if (n) {{
    state.dragged = n.id;
    state.selected = n.id;
    renderSelection();
  }} else {{
    state.pan = {{ x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty }};
    canvas.classList.add("dragging");
  }}
}});
canvas.addEventListener("pointermove", e => {{
  if (state.dragged) {{
    const p = state.particles.get(state.dragged);
    const w = screenToWorld(e.offsetX, e.offsetY);
    p.x = w.x; p.y = w.y; p.vx = 0; p.vy = 0;
    state.simTicks = Math.max(state.simTicks, 20);
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
  const next = n ? n.id : null;
  if (next !== state.hover) {{ state.hover = next; requestDraw(); }}
}});
canvas.addEventListener("pointerup", e => {{
  state.dragged = null;
  state.pan = null;
  canvas.classList.remove("dragging");
}});
canvas.addEventListener("wheel", e => {{
  e.preventDefault();
  const before = screenToWorld(e.offsetX, e.offsetY);
  const factor = e.deltaY < 0 ? 1.1 : .9;
  state.scale = Math.max(.18, Math.min(3, state.scale * factor));
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
document.getElementById("fitBtn").onclick = () => fit();
document.getElementById("resetBtn").onclick = () => {{
  state.selected = null;
  state.pinned.clear();
  state.search = "";
  document.getElementById("search").value = "";
  document.getElementById("modeFilter").value = "overview";
  state.subject = "all";
  document.getElementById("subjectFilter").value = "all";
  applyMode("overview");
  renderSelection();
  fit();
}};
document.getElementById("subjectFilter").onchange = e => {{ state.subject = e.target.value; updateVisible(); fit(); }};
document.getElementById("modeFilter").onchange = e => applyMode(e.target.value);
document.getElementById("maxNodes").oninput = e => {{
  state.maxNodes = Number(e.target.value);
  document.getElementById("maxNodesLabel").textContent = state.maxNodes;
  updateVisible();
}};
document.addEventListener("change", e => {{
  if (e.target.matches("[data-type]")) {{
    if (e.target.checked) state.types.add(e.target.dataset.type); else state.types.delete(e.target.dataset.type);
    updateVisible();
  }}
  if (e.target.matches("[data-edge]")) {{
    if (e.target.checked) state.edges.add(e.target.dataset.edge); else state.edges.delete(e.target.dataset.edge);
    updateVisible();
  }}
}});
renderFilters();
updateVisible();
window.addEventListener("resize", resize);
resize();
fit(false);
tickLoop();
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
