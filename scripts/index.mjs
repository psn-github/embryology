// Register-driven documentation INDEX → dist/index.html (+ dist/index.css).
//
// The single on-screen "front door" to the controlled embryology suite. It is
// driven entirely from loadAllDocs() (the same source of truth the register and
// every document footer point to), so it always reflects the live controlled
// set and is never a hand-maintained list.
//
// Surface: the Clinical-tools / Web brand track (Inter Tight, neutral
// high-contrast, emerald as the single accent) — NOT the monochrome Document
// print track in styles/brand.css. Colour is pulled from the vendored brand
// token file (assets/brand/palette.json), never hard-coded.
//
// Output is fully self-contained and uses RELATIVE links only, so it works both
// locally from file:// and when hosted behind access control.

import fs from "node:fs";
import path from "node:path";
import { loadAllDocs, indexDocs, DIST_DIR, ROOT } from "./lib/load.mjs";

const MANUAL_ID = "OMK-MAN-EMB-0001";

// Status → chip class + visible word + non-colour icon. Mirrors the Document
// track mapping (render-html.mjs) so the index agrees with each document's own
// metadata block. Colour is NEVER the only signal — word + icon always present.
const STATUS = {
  Approved:    { cls: "approved",   word: "Approved",    icon: "✓" },
  "In Review": { cls: "review",     word: "In Review",   icon: "◷" },
  Draft:       { cls: "draft",      word: "Draft",       icon: "✎" },
  Superseded:  { cls: "superseded", word: "Superseded",  icon: "⤺" },
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// --- token → CSS custom properties ----------------------------------------
// Flatten the brand palette groups we use into `--name: #hex;` declarations so
// the screen stylesheet (styles/index.css) can var() them. Single source of
// truth = the vendored palette.json (copied from brand-assets, v2.4).
function paletteToCssVars() {
  const palette = JSON.parse(fs.readFileSync(path.join(ROOT, "assets", "brand", "palette.json"), "utf8"));
  const groups = ["brandNeutrals", "ink", "surfaces", "accents", "data", "dataSoftFills", "lines"];
  const decls = [];
  for (const g of groups) {
    const obj = palette[g];
    if (!obj || typeof obj !== "object") continue;
    for (const [name, val] of Object.entries(obj)) {
      if (val && typeof val === "object" && typeof val.hex === "string") {
        decls.push(`  --${name}: ${val.hex};`);
      }
    }
  }
  return `:root {\n${decls.join("\n")}\n}\n`;
}

// --- section grouping ------------------------------------------------------
// manual.config.yml carries the lab's controlled grouping (A Quality &
// governance, B Andrology, …, Appendices) in its comment markers, above a flat
// `order:` list. Parse those markers so the index reuses the exact same
// ordering/grouping without a second hand-maintained source.
function loadSections() {
  const raw = fs.readFileSync(path.join(ROOT, "manual.config.yml"), "utf8");
  const sections = [];
  let cur = null;
  for (const line of raw.split("\n")) {
    const lettered = line.match(/^\s*#\s*([A-F])\.\s*(.+?)\s*$/);
    const appendix = line.match(/^\s*#\s*Appendices\b/);
    const item = line.match(/^\s*-\s*([A-Za-z0-9-]+)/);
    if (lettered) {
      cur = { key: lettered[1], label: lettered[2].replace(/\s*\(.*\)\s*$/, "").trim(), ids: [] };
      sections.push(cur);
    } else if (appendix) {
      cur = { key: "—", label: "Appendices", ids: [] };
      sections.push(cur);
    } else if (item && cur) {
      cur.ids.push(item[1]);
    }
  }
  return sections;
}

function isoToday() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// --- row + section rendering ----------------------------------------------
function renderRow(doc) {
  const d = doc.data;
  const st = STATUS[d.status] || { cls: "superseded", word: d.status || "—", icon: "•" };
  const id = esc(d.docId);
  const search = esc([d.docId, d.title, d.category, d.status].filter(Boolean).join(" ").toLowerCase());
  return `      <tr data-status="${esc(d.status)}" data-search="${search}">
        <td class="cell-id" data-label="ID">${id}</td>
        <td class="cell-title" data-label="Title">${esc(d.title)}</td>
        <td data-label="Status"><span class="chip chip--${st.cls}"><span class="ico" aria-hidden="true">${st.icon}</span>${esc(st.word)}</span></td>
        <td class="cell-ver" data-label="Version">v${esc(d.version)}</td>
        <td class="cell-date" data-label="Effective">${esc(d.effectiveDate)}</td>
        <td class="cell-date" data-label="Next review">${esc(d.nextReviewDate)}</td>
        <td class="cell-links" data-label="Open">
          <a href="html/${id}.html">HTML</a><a href="pdf/${id}.pdf">PDF</a>
        </td>
      </tr>`;
}

function renderSection(sec) {
  if (!sec.docs.length) return "";
  const rows = sec.docs.map(renderRow).join("\n");
  return `    <section class="section" data-section>
      <div class="section__head">
        <span class="section__key" aria-hidden="true">${esc(sec.key)}</span>
        <h2 id="sec-${esc(sec.key)}">${esc(sec.label)}</h2>
        <span class="section__n"><span class="seen">${sec.docs.length}</span>/${sec.docs.length}</span>
      </div>
      <table class="doctable" aria-labelledby="sec-${esc(sec.key)}">
        <thead>
          <tr>
            <th scope="col">Document ID</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Version</th>
            <th scope="col">Effective</th>
            <th scope="col">Next review</th>
            <th scope="col">Open</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </section>`;
}

export function buildIndex() {
  const docs = loadAllDocs();
  indexDocs(docs);
  const byId = new Map(docs.map((d) => [d.data.docId, d]));

  // Group by the manual's controlled sections; append any controlled doc not
  // listed in manual.config.yml so the index can never silently drop a record.
  const sections = loadSections().map((s) => ({
    key: s.key,
    label: s.label,
    docs: s.ids.map((id) => byId.get(id)).filter(Boolean),
  }));
  const placed = new Set(sections.flatMap((s) => s.docs.map((d) => d.data.docId)));
  const unlisted = docs.filter((d) => !placed.has(d.data.docId));
  if (unlisted.length) sections.push({ key: "•", label: "Other controlled documents", docs: unlisted });

  const count = docs.length;
  const generated = isoToday();

  // Status filter buttons — only for statuses actually present.
  const presentStatuses = [...new Set(docs.map((d) => d.data.status))].filter(Boolean);
  const orderedStatuses = ["Approved", "In Review", "Draft", "Superseded"].filter((s) => presentStatuses.includes(s));
  const statusButtons = orderedStatuses
    .map((s) => {
      const st = STATUS[s];
      const n = docs.filter((d) => d.data.status === s).length;
      return `<button type="button" class="fbtn" data-filter-status="${esc(s)}" aria-pressed="false">${st ? st.icon + " " : ""}${esc(s)} (${n})</button>`;
    })
    .join("\n        ");

  const sectionsHtml = sections.map(renderSection).join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Embryology Laboratory — Controlled Document Index · Oxford Medical Kuwait</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="icon" href="assets/oxmed-03-monogram.png" />
  <link rel="stylesheet" href="index.css" />
</head>
<body>
  <a class="skip-link" href="#docs">Skip to documents</a>

  <header class="masthead">
    <div class="wrap masthead__inner">
      <img class="masthead__logo" src="assets/oxmed-01-horizontal.png" alt="Oxford Medical Kuwait" />
      <div class="masthead__titles">
        <p class="eyebrow">Oxford Medical Kuwait · Embryology Laboratory</p>
        <h1>Controlled Document Index</h1>
        <p class="masthead__stamp">Generated <time datetime="${generated}">${generated}</time> · <span class="count">${count}</span> controlled documents. Refer to the controlled register for the current version of any document.</p>
      </div>
    </div>
  </header>

  <div class="wrap">
    <nav class="keylinks" aria-label="Suite-level documents">
      <a class="keylink keylink--primary" href="html/${MANUAL_ID}.html"><span class="ico" aria-hidden="true">▣</span> Bound Manual (HTML)</a>
      <a class="keylink" href="pdf/${MANUAL_ID}.pdf"><span class="ico" aria-hidden="true">▤</span> Bound Manual (PDF)</a>
      <a class="keylink" href="html/register.html"><span class="ico" aria-hidden="true">☰</span> Document Register</a>
      <a class="keylink" href="register.csv"><span class="ico" aria-hidden="true">⤓</span> Register (CSV)</a>
    </nav>

    <p class="govnote">
      <span class="ico" aria-hidden="true">⚠</span>
      <span><strong>Controlled clinical documents.</strong> SOPs, policies, consent forms and logs for the Embryology Laboratory. For internal, access-controlled use only — do not redistribute. The register is the authority for the current approved version.</span>
    </p>
  </div>

  <div class="controls wrap" role="search">
    <label class="search">
      <span class="ico" aria-hidden="true">⌕</span>
      <input id="q" type="search" placeholder="Filter by ID, title, category or status…" aria-label="Filter documents by ID, title, category or status" autocomplete="off" />
    </label>
    <div class="statusfilter" role="group" aria-label="Filter by status">
        ${statusButtons}
    </div>
    <span class="resultcount" id="resultcount" aria-live="polite">${count} of ${count} shown</span>
  </div>

  <main id="docs" class="wrap">
${sectionsHtml}
    <p class="noresults" id="noresults">No documents match your filter. <button type="button" id="clearfilter" class="fbtn">Clear filter</button></p>
  </main>

  <footer class="foot">
    <div class="wrap">
      Oxford Medical Kuwait — Embryology Laboratory · Controlled-document suite ·
      Index generated ${generated} from the live document register (${count} documents).
      Source of truth: the controlled register (<a href="html/register.html">register.html</a> / <a href="register.csv">register.csv</a>).
    </div>
  </footer>

  <script>
  (function () {
    var q = document.getElementById("q");
    var rows = Array.prototype.slice.call(document.querySelectorAll("tbody tr"));
    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
    var statusBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filter-status]"));
    var resultcount = document.getElementById("resultcount");
    var noresults = document.getElementById("noresults");
    var total = rows.length;
    var activeStatus = null;

    function apply() {
      var term = (q.value || "").trim().toLowerCase();
      var shown = 0;
      rows.forEach(function (tr) {
        var hay = tr.getAttribute("data-search") || "";
        var matchText = !term || hay.indexOf(term) !== -1;
        var matchStatus = !activeStatus || tr.getAttribute("data-status") === activeStatus;
        var visible = matchText && matchStatus;
        tr.hidden = !visible;
        if (visible) shown++;
      });
      sections.forEach(function (sec) {
        var visibleRows = sec.querySelectorAll("tbody tr:not([hidden])").length;
        sec.hidden = visibleRows === 0;
        var seen = sec.querySelector(".seen");
        if (seen) seen.textContent = visibleRows;
      });
      resultcount.textContent = shown + " of " + total + " shown";
      noresults.classList.toggle("show", shown === 0);
    }

    q.addEventListener("input", apply);
    statusBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var s = btn.getAttribute("data-filter-status");
        activeStatus = activeStatus === s ? null : s;
        statusBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-filter-status") === activeStatus ? "true" : "false");
        });
        apply();
      });
    });
    var clear = document.getElementById("clearfilter");
    if (clear) clear.addEventListener("click", function () {
      q.value = ""; activeStatus = null;
      statusBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      apply(); q.focus();
    });
  })();
  </script>
</body>
</html>
`;

  return { html, count, generated, sections };
}

// --- writer ----------------------------------------------------------------
export function writeIndex() {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, "assets"), { recursive: true });

  // Self-contained, relative-link stylesheet: token vars + the screen rules.
  const css = paletteToCssVars() + "\n" + fs.readFileSync(path.join(ROOT, "styles", "index.css"), "utf8");
  fs.writeFileSync(path.join(DIST_DIR, "index.css"), css);

  // Copy the brand assets the page references (relative paths, hosting-safe).
  for (const f of ["oxmed-01-horizontal.png", "oxmed-03-monogram.png"]) {
    const src = path.join(ROOT, "assets", "brand", f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(DIST_DIR, "assets", f));
  }

  const { html, count } = buildIndex();
  fs.writeFileSync(path.join(DIST_DIR, "index.html"), html);
  return count;
}

function main() {
  const count = writeIndex();
  console.log(`✓ Index written: dist/index.html + dist/index.css (${count} controlled documents).`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
