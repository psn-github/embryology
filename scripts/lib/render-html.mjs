// Markdown + front-matter → branded HTML with all document-control furniture.
// Furniture (header band, footer, metadata + change-history tables, signature
// block, DRAFT/SUPERSEDED watermark) is assembled here and injected into the
// templates under /templates. See PLAN.md §3.3 and §4.

import fs from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import attrs from "markdown-it-attrs";
import { ROOT } from "./load.mjs";

const TEMPLATE_DIR = path.join(ROOT, "templates");

const md = new MarkdownIt({ html: true, linkify: true, typographer: true }).use(attrs);

// --- tiny, dependency-free templating: {{{raw}}} and {{escaped}} ----------
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
export function applyTemplate(tpl, vars) {
  return tpl
    .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, k) => String(vars[k] ?? ""))
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => esc(vars[k]));
}

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATE_DIR, name), "utf8");
}

// --- furniture fragments ---------------------------------------------------
const STATUS_CHIP = {
  Draft: "garnet",
  "In Review": "saffron",
  Approved: "emerald",
  Superseded: "oyster",
};

function metadataTable(d) {
  const rows = [
    ["Document ID", d.docId],
    ["Title", d.title],
    ["Category", d.category],
    ["Department", d.department],
    ["Site", d.site],
    ["Version", d.version],
    ["Status", `<span class="chip chip--${STATUS_CHIP[d.status] || "oyster"}">${esc(d.status)}</span>`],
    ["Effective date", d.effectiveDate],
    ["Next review date", d.nextReviewDate],
    ["Author", d.author || "—"],
    ["Reviewed by", d.reviewedBy || "—"],
    ["Approved by", d.approvedBy],
    ["Supersedes", d.supersedes || "—"],
    ["TFP source", d.sourceDoc || "—"],
    ["Witness system", d.witnessSystem || "—"],
    ["Guideline references", Array.isArray(d.guidelineRefs) ? d.guidelineRefs.join("; ") : (d.guidelineRefs || "—")],
    ["Related documents", Array.isArray(d.relatedDocuments) ? d.relatedDocuments.join(", ") : (d.relatedDocuments || "—")],
  ];
  const body = rows
    .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${k === "Status" ? v : esc(v)}</td></tr>`)
    .join("\n");
  return `<table class="meta-table"><tbody>${body}</tbody></table>`;
}

function changeHistoryTable(d) {
  const hist = Array.isArray(d.changeHistory) ? d.changeHistory : [];
  if (!hist.length) return "";
  const rows = hist
    .map(
      (h) =>
        `<tr><td>${esc(h.version)}</td><td>${esc(h.date)}</td><td>${esc(h.author || "—")}</td><td>${esc(h.summary || "")}</td></tr>`
    )
    .join("\n");
  return `<table class="change-history">
    <caption>Change history</caption>
    <thead><tr><th>Version</th><th>Date</th><th>Author</th><th>Summary of change</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}

function signatureBlock() {
  const role = (label, who) => `<tr>
      <td class="sig-role">${label}</td>
      <td class="sig-name">${esc(who)}</td>
      <td class="sig-space"></td>
      <td class="sig-date"></td>
    </tr>`;
  return `<table class="signature-block">
    <caption>Authorisation</caption>
    <thead><tr><th>Role</th><th>Name</th><th>Signature</th><th>Date</th></tr></thead>
    <tbody>
      ${role("Authored", "")}
      ${role("Reviewed", "")}
      ${role("Approved", "")}
    </tbody></table>`;
}

function watermarkClass(status) {
  if (status === "Draft") return "wm-draft";
  if (status === "Superseded") return "wm-superseded";
  return "";
}

// Render markdown body. Repo-relative asset paths (extracted dish-layout
// figures, "assets/figures/…") are rewritten to absolute file:// URLs so they
// resolve from dist/html/ where the rendered page actually lives.
function renderBody(doc) {
  const html = md.render(doc.body || "");
  return html.replaceAll('src="assets/', `src="file://${path.join(ROOT, "assets")}/`);
}

// --- public API ------------------------------------------------------------
// opts.mode: "standalone" (default) | "manual"
//   In manual mode, relatedDocuments render as live anchors; standalone shows
//   plain docIds (PLAN.md §3.3).
export function renderDocumentHtml(doc, opts = {}) {
  const d = doc.data;
  const mode = opts.mode || "standalone";
  const isForm = d.category === "FORM";
  const tplName = isForm ? "form.html" : "sop.html";
  const tpl = readTemplate(tplName);

  const vars = {
    logoHref: "file://" + path.join(ROOT, "assets", "brand", "oxmed-01-horizontal.png"),
    coverLogoHref: "file://" + path.join(ROOT, "assets", "brand", "oxmed-02-vertical.png"),
    docId: d.docId,
    title: d.title,
    version: d.version,
    effectiveDate: d.effectiveDate,
    nextReviewDate: d.nextReviewDate,
    issuedBy: d.author || "—",
    status: d.status,
    site: d.site,
    department: d.department,
    bodyClass: [isForm ? "doc--form" : "doc--sop", d.bilingual ? "is-bilingual" : "", watermarkClass(d.status)]
      .filter(Boolean)
      .join(" "),
    watermarkText: d.status === "Draft" ? "DRAFT" : d.status === "Superseded" ? "SUPERSEDED" : "",
    metadataTable: metadataTable(d),
    changeHistory: changeHistoryTable(d),
    signatureBlock: signatureBlock(),
    body: renderBody(doc),
    anchor: mode === "manual" ? `id="${esc(d.docId)}"` : "",
  };
  return applyTemplate(tpl, vars);
}

// Wrap one-or-more rendered document fragments into a full HTML page that links
// brand.css and the embedded fonts. Used by render/build/manual.
export function pageShell({ title, inner, extraHead = "" }) {
  const tpl = readTemplate("page.html");
  const cssHref = "file://" + path.join(ROOT, "styles", "brand.css");
  return applyTemplate(tpl, { title, inner, extraHead, cssHref });
}

export { md };
