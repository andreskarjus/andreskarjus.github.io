const APP_DATA = window.__TIKTOK_ATLAS_DATA__;

if (!APP_DATA) {
  throw new Error("Atlas data was not loaded.");
}

const FONT_BODY = '"Aptos", "Segoe UI", sans-serif';
const FONT_DISPLAY = '"Bahnschrift", "Aptos Narrow", "Arial Narrow", "Segoe UI", sans-serif';
const ROW_COUNT = APP_DATA.meta.rows;

const BASE_CATEGORICAL_PALETTE = [
  "#4E79A7",
  "#E68613",
  "#B07AA1",
  "#59A14F",
  "#E15759",
  "#76B7B2",
  "#EDC948",
  "#9A6138",
  "#3B8EA5",
  "#F2B134",
  "#7D5BA6",
  "#D8576B",
  "#0072B2",
  "#D55E00",
  "#AF7AA1",
];

const VARIABLE_PALETTES = {
  "general_characteristics.cat_communicative_intent": ["#4E79A7", "#F28E2B", "#59A14F", "#B07AA1"],
  "general_characteristics.cat_video_format": ["#E15759", "#76B7B2", "#B07AA1", "#F28E2B", "#59A14F", "#EDC948"],
  "labov_narrative_analysis.cat_labov_abstract_hook_strategy_sp": ["#3B8EA5", "#F2B134", "#7D5BA6", "#D8576B", "#59A14F"],
  "chandler_semiotic_analysis.cat_semiotics_peirce_dominant_sign_mode": ["#0072B2", "#D55E00", "#2B153A"],
  "GRZENKOWICZ_WILDFEUER_2025_ANNOTATION.cat_audio_source_type_sp": ["#F28E2B", "#4E79A7", "#B07AA1", "#76B7B2"],
};

const COMMENT_ACTIVITY_COLORS = {
  Supportive: "#E64E92",
  Critical: "#0049E6",
  "Information-seeking": "#E6AC27",
  Neutral: "#96E398",
  "Unclear / Not coded": "#D8D8D8",
};

const VARIABLE_LOOKUP = new Map(APP_DATA.variables.map((item) => [item.key, item]));

const state = {
  mapColorKey: APP_DATA.meta.defaultColor,
  mapSizeKey: APP_DATA.meta.defaultSize,
  analysisAKey: APP_DATA.meta.defaultAnalysisA,
  analysisBKey: APP_DATA.meta.defaultAnalysisB,
  syncEnabled: true,
  sizeClipEnabled: true,
};

const selectors = {};

const plotConfig = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: [
    "lasso2d",
    "select2d",
    "autoScale2d",
    "hoverClosestCartesian",
    "hoverCompareCartesian",
    "toggleSpikelines",
  ],
};

function formatInteger(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "NA";
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "NA";
  }
  if (Math.abs(value) >= 1000) {
    return formatInteger(value);
  }
  if (Math.abs(value) >= 100) {
    return value.toFixed(0);
  }
  if (Math.abs(value) >= 10) {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}

function safeSearchText(text) {
  return (text || "").toLowerCase();
}

function finiteValues(values) {
  return values.filter((value) => typeof value === "number" && Number.isFinite(value));
}

function numericVector(key) {
  return APP_DATA.numeric[key] || null;
}

function categoricalInfo(key) {
  return APP_DATA.categorical[key] || null;
}

function isNumeric(key) {
  return Boolean(numericVector(key)) && key !== "dim1" && key !== "dim2";
}

function isCategorical(key) {
  return Boolean(categoricalInfo(key));
}

function variableLabel(key) {
  if (key === "none") {
    return "Constant Size";
  }
  return VARIABLE_LOOKUP.get(key)?.label || key;
}

function wrapLevelLabels(info) {
  return info?.wrappedLevels || info?.levels || [];
}

function quantile(sortedValues, q) {
  if (!sortedValues.length) {
    return 0;
  }
  const pos = (sortedValues.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const current = sortedValues[base];
  const next = sortedValues[base + 1] ?? current;
  return current + (next - current) * rest;
}

function clippedBounds(values, lower = 0.02, upper = 0.98, floor = null) {
  const numeric = finiteValues(values).sort((a, b) => a - b);
  if (!numeric.length) {
    return [0, 1];
  }
  let lo = quantile(numeric, lower);
  let hi = quantile(numeric, upper);
  if (floor !== null) {
    lo = Math.max(lo, floor);
  }
  if (lo === hi) {
    hi = lo + 1;
  }
  return [lo, hi];
}

function fullBounds(values) {
  const numeric = finiteValues(values);
  if (!numeric.length) {
    return [0, 1];
  }
  const lo = Math.min(...numeric);
  const hi = Math.max(...numeric);
  return lo === hi ? [lo, lo + 1] : [lo, hi];
}

function sizeArray(sizeKey) {
  if (sizeKey === "none") {
    return new Array(ROW_COUNT).fill(2.1);
  }

  const values = numericVector(sizeKey) || [];
  const [lo, hi] = state.sizeClipEnabled ? clippedBounds(values) : fullBounds(values);
  const span = Math.max(hi - lo, 1e-6);

  return values.map((value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 1.8;
    }
    const normalized = Math.max(0, Math.min(1, (value - lo) / span));
    return 1.85 + normalized * 5.4;
  });
}

function categoricalColors(key) {
  const info = categoricalInfo(key);
  if (!info) {
    return [];
  }

  const preferredPalette = VARIABLE_PALETTES[key];

  return info.levels.map((level, index) => {
    if (key === "comment_activity") {
      return COMMENT_ACTIVITY_COLORS[level] || "#8E8E8E";
    }
    if (/other|not applicable|unclear/i.test(level)) {
      return "#8E8E8E";
    }
    const palette = preferredPalette || BASE_CATEGORICAL_PALETTE;
    return palette[index % palette.length];
  });
}

function categoricalCounts(key) {
  const info = categoricalInfo(key);
  const counts = new Array(info.levels.length).fill(0);
  info.codes.forEach((code) => {
    counts[code] += 1;
  });
  return counts;
}

function decodedCategoricalValue(key, rowIndex) {
  const info = categoricalInfo(key);
  if (!info) {
    return "";
  }
  const code = info.codes[rowIndex];
  return info.levels[code] ?? "";
}

function numericValueAt(key, rowIndex) {
  const values = numericVector(key);
  return values ? values[rowIndex] : null;
}

function dataValueLabel(key, rowIndex) {
  if (key === "none") {
    return "Constant";
  }
  if (isNumeric(key)) {
    return formatNumber(numericValueAt(key, rowIndex));
  }
  if (isCategorical(key)) {
    return decodedCategoricalValue(key, rowIndex);
  }
  return "";
}

function truncateText(text, maxLength = 220) {
  if (!text || text.length <= maxLength) {
    return text || "";
  }
  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function formatHoverSummary(text, maxLength = 220, wordsPerLine = 8, maxLines = 4) {
  const truncated = truncateText((text || "").replace(/\s+/g, " ").trim(), maxLength);
  if (!truncated) {
    return "";
  }
  const words = truncated.split(" ").filter(Boolean);
  const lines = [];
  for (let index = 0; index < words.length; index += wordsPerLine) {
    if (lines.length === maxLines) {
      break;
    }
    lines.push(words.slice(index, index + wordsPerLine).join(" "));
  }
  if (words.length > wordsPerLine * maxLines && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.]{3}$/, "").trimEnd()}...`;
  }
  return lines.join("<br>");
}

function buildHeroStats() {
  const target = document.getElementById("hero-stats");
  const stats = [
    { label: "Videos", value: formatInteger(APP_DATA.meta.rows) },
    { label: "Accounts", value: formatInteger(APP_DATA.meta.accounts) },
    { label: "Coded Variables", value: formatInteger(APP_DATA.meta.codedVariables) },
    { label: "Projection", value: "Hamming t-SNE" },
  ];
  target.innerHTML = stats
    .map(
      (item) => `
        <article class="stat-card">
          <p class="stat-label">${item.label}</p>
          <p class="stat-value">${item.value}</p>
        </article>
      `,
    )
    .join("");
}

function axisStyle(title) {
  return {
    title,
    titlefont: { family: FONT_BODY, size: 12, color: "#3f3224" },
    tickfont: { family: FONT_BODY, size: 11, color: "#5f4d3c" },
    showgrid: true,
    gridcolor: "rgba(83, 63, 35, 0.1)",
    zeroline: false,
    automargin: true,
  };
}

function baseLayout(overrides = {}) {
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(255,255,255,0.72)",
    margin: { l: 56, r: 26, t: 52, b: 52 },
    font: { family: FONT_BODY, color: "#1d1712" },
    title: { font: { family: FONT_DISPLAY, size: 20 } },
    legend: {
      orientation: "h",
      x: 0,
      xanchor: "left",
      y: 1.13,
      yanchor: "bottom",
      bgcolor: "rgba(255,255,255,0.55)",
      font: { size: 11 },
      itemsizing: "constant",
    },
    hoverlabel: {
      bgcolor: "rgba(255, 251, 245, 0.97)",
      bordercolor: "rgba(77, 60, 38, 0.18)",
      font: { family: FONT_BODY, size: 11, color: "#1d1712" },
      align: "left",
    },
    ...overrides,
  };
}

function mapLayout(overrides = {}) {
  return baseLayout({
    dragmode: "pan",
    margin: { l: 24, r: 24, t: 24, b: 24 },
    xaxis: {
      visible: false,
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      visible: false,
      showgrid: false,
      zeroline: false,
      scaleanchor: "x",
      scaleratio: 1,
    },
    ...overrides,
  });
}

function buildCustomData(indices, colorKey, sizeKey) {
  const text = APP_DATA.text;
  return indices.map((rowIndex) => [
    text.username[rowIndex],
    text.video_filename[rowIndex],
    formatInteger(numericValueAt("likes", rowIndex)),
    formatInteger(numericValueAt("comments", rowIndex)),
    formatInteger(numericValueAt("shares", rowIndex)),
    formatInteger(numericValueAt("saves", rowIndex)),
    text.upload_date[rowIndex] || "NA",
    variableLabel(colorKey),
    dataValueLabel(colorKey, rowIndex),
    variableLabel(sizeKey),
    dataValueLabel(sizeKey, rowIndex),
    formatHoverSummary(text.summary[rowIndex] || text.description[rowIndex] || ""),
  ]);
}

function mapHoverTemplate() {
  return [
    "<b>%{customdata[0]}</b>",
    "%{customdata[1]}",
    "Likes: %{customdata[2]}",
    "Comments: %{customdata[3]}",
    "Shares: %{customdata[4]}",
    "Saves: %{customdata[5]}",
    "Upload: %{customdata[6]}",
    "%{customdata[7]}: %{customdata[8]}",
    "%{customdata[9]}: %{customdata[10]}",
    "Summary: %{customdata[11]}",
    "<extra></extra>",
  ].join("<br>");
}

function renderMapPlot() {
  const x = numericVector("dim1");
  const y = numericVector("dim2");
  const sizes = sizeArray(state.mapSizeKey);
  const titleTarget = document.getElementById("map-title");
  const noteTarget = document.getElementById("map-note");

  titleTarget.textContent = `${variableLabel(state.mapColorKey)} across the article map`;

  if (isNumeric(state.mapColorKey)) {
    const values = numericVector(state.mapColorKey);
    const [lo, hi] = clippedBounds(values);
    const clipped = values.map((value) => {
      if (value === null || value === undefined || Number.isNaN(value)) {
        return lo;
      }
      return Math.min(hi, Math.max(lo, value));
    });
    const indices = [...Array(ROW_COUNT).keys()];
    const data = [
      {
        type: "scattergl",
        mode: "markers",
        x,
        y,
        customdata: buildCustomData(indices, state.mapColorKey, state.mapSizeKey),
        hovertemplate: mapHoverTemplate(),
        marker: {
          size: sizes,
          color: clipped,
          colorscale: "Viridis",
          cmin: lo,
          cmax: hi,
          opacity: 0.56,
          line: { width: 0 },
          colorbar: {
            title: variableLabel(state.mapColorKey),
            thickness: 14,
            outlinewidth: 0,
            tickfont: { size: 11 },
          },
        },
      },
    ];
    Plotly.react("map-plot", data, mapLayout(), plotConfig);
    noteTarget.textContent = `${variableLabel(state.mapColorKey)} uses 2nd-98th percentile clipping for color; ${state.mapSizeKey === "none" ? "point size is constant." : `point size is ${state.sizeClipEnabled ? "also percentile-clipped" : "using the full observed range"}.`}`;
    return;
  }

  const info = categoricalInfo(state.mapColorKey);
  const colors = categoricalColors(state.mapColorKey);
  const pointTraces = [];
  const legendTraces = [];
  info.levels.forEach((level, code) => {
    const indices = [];
    info.codes.forEach((itemCode, index) => {
      if (itemCode === code) {
        indices.push(index);
      }
    });
    pointTraces.push({
      type: "scattergl",
      mode: "markers",
      name: level,
      showlegend: false,
      x: indices.map((index) => x[index]),
      y: indices.map((index) => y[index]),
      customdata: buildCustomData(indices, state.mapColorKey, state.mapSizeKey),
      hovertemplate: mapHoverTemplate(),
      marker: {
        size: indices.map((index) => sizes[index]),
        color: colors[code],
        opacity: /other|not applicable|unclear/i.test(level) ? 0.16 : 0.56,
        line: { width: 0 },
      },
    });
    legendTraces.push({
      type: "scatter",
      mode: "markers",
      name: level,
      x: [null],
      y: [null],
      hoverinfo: "skip",
      marker: {
        size: 9.5,
        color: colors[code],
        opacity: /other|not applicable|unclear/i.test(level) ? 0.6 : 0.95,
        line: { width: 0 },
      },
    });
  });
  const data = [...pointTraces, ...legendTraces];

  Plotly.react("map-plot", data, mapLayout(), plotConfig);
  noteTarget.textContent = `${variableLabel(state.mapColorKey)} is drawn as discrete groups over the article's shared coordinate space; ${state.mapSizeKey === "none" ? "point size is constant." : `point size is ${state.sizeClipEnabled ? "percentile-clipped" : "using the full observed range"}.`}`;
}

function renderPlaceholder(targetId, message) {
  document.getElementById(targetId).innerHTML = `<div class="plot-placeholder">${message}</div>`;
}

function renderDistributionPlot(targetId, key, slotLabel) {
  if (!key || key === "none") {
    renderPlaceholder(targetId, `Select ${slotLabel} to see its distribution.`);
    return;
  }

  if (isNumeric(key)) {
    const values = finiteValues(numericVector(key));
    const data = [
      {
        type: "histogram",
        x: values,
        marker: { color: "#064B83", line: { width: 0 } },
        opacity: 0.9,
        hovertemplate: "%{x}<br>Count: %{y}<extra></extra>",
      },
    ];
    const layout = baseLayout({
      title: { text: variableLabel(key), font: { family: FONT_DISPLAY, size: 15 } },
      xaxis: axisStyle(variableLabel(key)),
      yaxis: axisStyle("Count"),
      margin: { l: 56, r: 18, t: 48, b: 56 },
      showlegend: false,
    });
    Plotly.react(targetId, data, layout, plotConfig);
    return;
  }

  const info = categoricalInfo(key);
  const counts = categoricalCounts(key);
  const colors = categoricalColors(key);
  const order = info.levels.map((level, index) => ({ level, label: wrapLevelLabels(info)[index], count: counts[index], color: colors[index] }));

  const data = [
    {
      type: "bar",
      orientation: "h",
      y: order.map((item) => item.label),
      x: order.map((item) => item.count),
      marker: { color: order.map((item) => item.color), line: { width: 0 } },
      hovertemplate: "%{y}<br>Count: %{x}<extra></extra>",
    },
  ];
  const layout = baseLayout({
    title: { text: variableLabel(key), font: { family: FONT_DISPLAY, size: 15 } },
    xaxis: axisStyle("Count"),
    yaxis: {
      ...axisStyle(variableLabel(key)),
      automargin: true,
      tickfont: { family: FONT_BODY, size: 10, color: "#5f4d3c" },
    },
    margin: { l: 132, r: 18, t: 48, b: 44 },
    showlegend: false,
  });
  Plotly.react(targetId, data, layout, plotConfig);
}

function renderNumericRelationship(aKey, bKey) {
  const x = [];
  const y = [];
  const aValues = numericVector(aKey);
  const bValues = numericVector(bKey);

  for (let index = 0; index < ROW_COUNT; index += 1) {
    const a = aValues[index];
    const b = bValues[index];
    if (typeof a === "number" && Number.isFinite(a) && typeof b === "number" && Number.isFinite(b)) {
      x.push(a);
      y.push(b);
    }
  }

  const data = [
    {
      type: "scattergl",
      mode: "markers",
      x,
      y,
      marker: { color: "#B5542A", size: 5.5, opacity: 0.38 },
      hovertemplate: `${variableLabel(aKey)}: %{x}<br>${variableLabel(bKey)}: %{y}<extra></extra>`,
    },
  ];
  const layout = baseLayout({
    title: { text: `${variableLabel(aKey)} vs. ${variableLabel(bKey)}`, font: { family: FONT_DISPLAY, size: 15 } },
    xaxis: axisStyle(variableLabel(aKey)),
    yaxis: axisStyle(variableLabel(bKey)),
    margin: { l: 58, r: 22, t: 44, b: 58 },
    showlegend: false,
  });
  Plotly.react("relationship-plot", data, layout, plotConfig);
}

function renderMixedRelationship(aKey, bKey) {
  const numericKey = isNumeric(aKey) ? aKey : bKey;
  const categoricalKey = isCategorical(aKey) ? aKey : bKey;
  const info = categoricalInfo(categoricalKey);
  const wrappedLevels = wrapLevelLabels(info);
  const colors = categoricalColors(categoricalKey);

  const traces = info.levels.map((level, code) => {
    const values = [];
    info.codes.forEach((itemCode, index) => {
      const numericValue = numericValueAt(numericKey, index);
      if (itemCode === code && typeof numericValue === "number" && Number.isFinite(numericValue)) {
        values.push(numericValue);
      }
    });
    return {
      type: "box",
      name: wrappedLevels[code],
      x: values,
      orientation: "h",
      boxpoints: false,
      marker: { color: colors[code] },
      boxmean: true,
      line: { width: 1.1 },
      hovertemplate: `${variableLabel(numericKey)}: %{x}<extra>${info.levels[code]}</extra>`,
    };
  });

  const layout = baseLayout({
    title: { text: `${variableLabel(numericKey)} by ${variableLabel(categoricalKey)}`, font: { family: FONT_DISPLAY, size: 15 } },
    xaxis: axisStyle(variableLabel(numericKey)),
    yaxis: {
      ...axisStyle(variableLabel(categoricalKey)),
      automargin: true,
      tickfont: { family: FONT_BODY, size: 10, color: "#5f4d3c" },
    },
    margin: { l: 156, r: 24, t: 44, b: 60 },
    showlegend: false,
  });
  Plotly.react("relationship-plot", traces, layout, plotConfig);
}

function renderCategoricalRelationship(aKey, bKey) {
  const aInfo = categoricalInfo(aKey);
  const bInfo = categoricalInfo(bKey);
  const z = bInfo.levels.map(() => new Array(aInfo.levels.length).fill(0));

  for (let index = 0; index < ROW_COUNT; index += 1) {
    z[bInfo.codes[index]][aInfo.codes[index]] += 1;
  }

  const data = [
    {
      type: "heatmap",
      x: wrapLevelLabels(aInfo),
      y: wrapLevelLabels(bInfo),
      z,
      colorscale: [
        [0, "#f3e8d8"],
        [0.35, "#d2c1a5"],
        [0.7, "#7f9ab2"],
        [1, "#0b4f86"],
      ],
      hoverongaps: false,
      hovertemplate: `${variableLabel(aKey)}: %{x}<br>${variableLabel(bKey)}: %{y}<br>Count: %{z}<extra></extra>`,
      colorbar: { title: "Count", thickness: 14, outlinewidth: 0 },
    },
  ];

  const layout = baseLayout({
    title: { text: `${variableLabel(aKey)} vs. ${variableLabel(bKey)}`, font: { family: FONT_DISPLAY, size: 15 } },
    xaxis: {
      ...axisStyle(variableLabel(aKey)),
      tickangle: -26,
      tickfont: { family: FONT_BODY, size: 10, color: "#5f4d3c" },
    },
    yaxis: {
      ...axisStyle(variableLabel(bKey)),
      tickfont: { family: FONT_BODY, size: 10, color: "#5f4d3c" },
    },
    margin: { l: 104, r: 38, t: 44, b: 104 },
    showlegend: false,
  });
  Plotly.react("relationship-plot", data, layout, plotConfig);
}

function renderRelationshipPlot() {
  if (!state.analysisBKey || state.analysisBKey === "none") {
    renderPlaceholder("relationship-plot", "Select Variable B to add a relationship view.");
    return;
  }

  if (isNumeric(state.analysisAKey) && isNumeric(state.analysisBKey)) {
    renderNumericRelationship(state.analysisAKey, state.analysisBKey);
    return;
  }

  if ((isNumeric(state.analysisAKey) && isCategorical(state.analysisBKey)) || (isCategorical(state.analysisAKey) && isNumeric(state.analysisBKey))) {
    renderMixedRelationship(state.analysisAKey, state.analysisBKey);
    return;
  }

  renderCategoricalRelationship(state.analysisAKey, state.analysisBKey);
}

function renderAnalysisPlots() {
  const analysisTitle = document.getElementById("analysis-title");
  analysisTitle.textContent = `${variableLabel(state.analysisAKey)} + ${state.analysisBKey && state.analysisBKey !== "none" ? variableLabel(state.analysisBKey) : "optional second variable"}`;

  renderDistributionPlot("analysis-a-plot", state.analysisAKey, "Variable A");
  renderDistributionPlot("analysis-b-plot", state.analysisBKey, "Variable B");
  renderRelationshipPlot();
}

function buildOptionList(keys, includeNone = false, noneLabel = "None") {
  const allowed = new Set(keys);
  const options = [];

  if (includeNone) {
    options.push({
      key: "none",
      label: noneLabel,
      group: "Special",
      searchText: safeSearchText(noneLabel),
      description: "No variable selected.",
      hint: "No variable selected.",
    });
  }

  for (const group of APP_DATA.groups) {
    const groupOptions = [];
    for (const key of group.variables) {
      if (!allowed.has(key)) {
        continue;
      }
      const meta = VARIABLE_LOOKUP.get(key);
      if (!meta) {
        continue;
      }
      groupOptions.push({
        key,
        label: meta.label,
        group: group.label,
        searchText: safeSearchText(meta.searchText),
        description: meta.description,
        hint:
          meta.type === "numeric"
            ? "Numeric metric"
            : meta.type === "binary"
              ? "Binary coded variable"
              : "Categorical coded variable",
      });
    }
    options.push(...groupOptions);
  }

  return options;
}

function createSearchSelector(rootId, options, selectedKey, onSelect) {
  const root = document.getElementById(rootId);
  const localState = {
    selectedKey,
    query: "",
  };

  root.className = "selector";
  root.innerHTML = `
    <input id="${rootId}-input" type="text" autocomplete="off" aria-expanded="false">
    <span class="selector-arrow"></span>
    <div class="selector-dropdown"></div>
  `;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".selector-dropdown");

  function selectedLabel() {
    return options.find((item) => item.key === localState.selectedKey)?.label || "";
  }

  function open() {
    dropdown.classList.add("open");
    input.setAttribute("aria-expanded", "true");
  }

  function close(resetInput = true) {
    dropdown.classList.remove("open");
    input.setAttribute("aria-expanded", "false");
    if (resetInput) {
      localState.query = "";
      input.value = selectedLabel();
    }
  }

  function filteredOptions() {
    const query = safeSearchText(localState.query);
    if (!query) {
      return options;
    }
    return options.filter((item) => item.searchText.includes(query) || safeSearchText(item.group).includes(query));
  }

  function renderOptions() {
    const grouped = new Map();
    filteredOptions().forEach((item) => {
      if (!grouped.has(item.group)) {
        grouped.set(item.group, []);
      }
      grouped.get(item.group).push(item);
    });

    if (!grouped.size) {
      dropdown.innerHTML = `<div class="selector-empty">No variables match that search.</div>`;
      return;
    }

    dropdown.innerHTML = [...grouped.entries()]
      .map(
        ([groupLabel, items]) => `
          <div class="selector-group">
            <p class="selector-group-label">${groupLabel}</p>
            ${items
              .map(
                (item) => `
                  <button class="selector-option ${item.key === localState.selectedKey ? "is-active" : ""}" type="button" data-key="${item.key}">
                    <span class="selector-option-title">${item.label}</span>
                    <span class="selector-option-meta">${item.hint}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        `,
      )
      .join("");

    dropdown.querySelectorAll(".selector-option").forEach((button) => {
      button.addEventListener("click", () => {
        localState.selectedKey = button.dataset.key;
        onSelect(localState.selectedKey);
        close(true);
        renderOptions();
      });
    });
  }

  input.value = selectedLabel();

  input.addEventListener("focus", () => {
    input.select();
    open();
    renderOptions();
  });

  input.addEventListener("click", () => {
    open();
    renderOptions();
  });

  input.addEventListener("input", () => {
    localState.query = input.value;
    open();
    renderOptions();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close(true);
    }
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      close(true);
    }
  });

  renderOptions();

  return {
    setValue(nextKey) {
      localState.selectedKey = nextKey;
      close(true);
      renderOptions();
    },
  };
}

function syncAnalysisSelections() {
  if (!state.syncEnabled) {
    return;
  }
  state.analysisAKey = state.mapColorKey;
  state.analysisBKey = state.mapSizeKey === "none" ? "none" : state.mapSizeKey;
  selectors.analysisA.setValue(state.analysisAKey);
  selectors.analysisB.setValue(state.analysisBKey);
}

function refreshAllPlots() {
  renderMapPlot();
  renderAnalysisPlots();
}

function initSelectors() {
  const allVariableKeys = APP_DATA.variables.map((item) => item.key);
  const sizeKeys = APP_DATA.sizeEligible.filter((key) => key === "none" || isNumeric(key));

  selectors.mapColor = createSearchSelector("map-color-selector", buildOptionList(allVariableKeys), state.mapColorKey, (nextKey) => {
    state.mapColorKey = nextKey;
    syncAnalysisSelections();
    refreshAllPlots();
  });

  selectors.mapSize = createSearchSelector("map-size-selector", buildOptionList(sizeKeys.filter((key) => key !== "none"), true, "Constant Size"), state.mapSizeKey, (nextKey) => {
    state.mapSizeKey = nextKey;
    syncAnalysisSelections();
    refreshAllPlots();
  });

  selectors.analysisA = createSearchSelector("analysis-a-selector", buildOptionList(allVariableKeys), state.analysisAKey, (nextKey) => {
    state.analysisAKey = nextKey;
    refreshAllPlots();
  });

  selectors.analysisB = createSearchSelector("analysis-b-selector", buildOptionList(allVariableKeys, true, "No second variable"), state.analysisBKey, (nextKey) => {
    state.analysisBKey = nextKey;
    refreshAllPlots();
  });
}

function initSyncToggle() {
  const toggle = document.getElementById("sync-toggle");
  toggle.checked = state.syncEnabled;
  toggle.addEventListener("change", () => {
    state.syncEnabled = toggle.checked;
    if (state.syncEnabled) {
      syncAnalysisSelections();
      refreshAllPlots();
    }
  });
}

function initSizeClipToggle() {
  const toggle = document.getElementById("size-clip-toggle");
  toggle.checked = state.sizeClipEnabled;
  toggle.addEventListener("change", () => {
    state.sizeClipEnabled = toggle.checked;
    renderMapPlot();
  });
}

function init() {
  buildHeroStats();
  initSelectors();
  initSyncToggle();
  initSizeClipToggle();
  refreshAllPlots();
}

init();
