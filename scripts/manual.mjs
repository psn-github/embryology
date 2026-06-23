// Assemble the bound manual ELB-MAN-001 (PLAN.md §6, §3.4):
// cover → auto-TOC → document register → all documents concatenated in the
// order declared in manual.config.yml. Cross-references render as live links.

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { loadAllDocs, indexDocs, DIST_DIR, ROOT } from "./lib/load.mjs";
import { renderDocumentHtml, applyTemplate } from "./lib/render-html.mjs";
import { buildRegister } from "./register.mjs";
import { htmlFileToPdf } from "./lib/pdf.mjs";

const CATEGORY_LABEL = {
  SOP: "Standard operating procedures",
  POL: "Policies",
  FORM: "Forms",
  LOG: "Logs & worksheets",
  APP: "Appendices",
};

function loadManualConfig() {
  const p = path.join(ROOT, "manual.config.yml");
  return yaml.load(fs.readFileSync(p, "utf8"));
}

function buildToc(orderedDocs) {
  // Group by category in document order, keep first-seen order of categories.
  let html = '<ol class="toc-list" style="counter-reset:none;">';
  let lastCat = null;
  for (const doc of orderedDocs) {
    const cat = doc.data.category;
    if (cat !== lastCat) {
      html += `</ol><p class="toc-cat">${CATEGORY_LABEL[cat] || cat}</p><ol class="toc-list">`;
      lastCat = cat;
    }
    html += `<li><span><a href="#${doc.data.docId}">${escapeHtml(doc.data.title)}</a></span><span class="toc-id">${escapeHtml(doc.data.docId)}</span></li>`;
  }
  html += "</ol>";
  return html;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

async function main() {
  const cfg = loadManualConfig();
  const all = loadAllDocs();
  indexDocs(all);
  const byId = new Map(all.map((d) => [d.data.docId, d]));

  // Ordered documents: those listed in manual.config.yml order; append any not listed.
  const listed = (cfg.order || []).map((id) => byId.get(id)).filter(Boolean);
  const listedIds = new Set(listed.map((d) => d.data.docId));
  const rest = all.filter((d) => !listedIds.has(d.data.docId));
  const ordered = [...listed, ...rest];

  const documentsHtml = ordered
    .map((d) => renderDocumentHtml(d, { mode: "manual" }))
    .join("\n");

  const { tableHtml } = buildRegister();
  const tpl = fs.readFileSync(path.join(ROOT, "templates", "manual.html"), "utf8");
  const html = applyTemplate(tpl, {
    title: cfg.title || "Embryology Laboratory Manual",
    subtitle: cfg.subtitle || "",
    docId: cfg.docId || "ELB-MAN-001",
    version: cfg.version || "1.0",
    effectiveDate: cfg.effectiveDate || "",
    approvedBy: cfg.approvedBy || "",
    site: cfg.site || "Oxford Medical Kuwait — Bneid Al-Qar",
    cssHref: "file://" + path.join(ROOT, "styles", "brand.css"),
    coverLogoHref: "file://" + path.join(ROOT, "assets", "brand", "Logo_02_RGB.svg"),
    toc: buildToc(ordered),
    register: tableHtml,
    documents: documentsHtml,
  });

  fs.mkdirSync(path.join(DIST_DIR, "html"), { recursive: true });
  const htmlPath = path.join(DIST_DIR, "html", `${cfg.docId || "ELB-MAN-001"}.html`);
  fs.writeFileSync(htmlPath, html);

  const pdfPath = path.join(DIST_DIR, "pdf", `${cfg.docId || "ELB-MAN-001"}.pdf`);
  const ok = await htmlFileToPdf(htmlPath, pdfPath);
  console.log(`✓ Manual assembled (${ordered.length} documents): HTML written${ok ? " + PDF" : " (PDF skipped)"}.`);
}

main();
