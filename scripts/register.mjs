// Document register generator (PLAN.md §3.4).
// Emits dist/register.csv and dist/html/register.html (the printable master
// index / audit artefact). Pure Node.

import fs from "node:fs";
import path from "node:path";
import { loadAllDocs, DIST_DIR, ROOT } from "./lib/load.mjs";
import { applyTemplate } from "./lib/render-html.mjs";

const COLUMNS = [
  ["docId", "Document ID"],
  ["title", "Title"],
  ["category", "Category"],
  ["version", "Version"],
  ["status", "Status"],
  ["effectiveDate", "Effective"],
  ["nextReviewDate", "Next review"],
  ["approvedBy", "Approver"],
  // sourceDoc provenance is retained in each document's front-matter for the
  // audit trail, but is not surfaced in the controlled register.
];

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildRegister() {
  const docs = loadAllDocs().sort((a, b) =>
    String(a.data.docId).localeCompare(String(b.data.docId))
  );

  // CSV
  const header = COLUMNS.map(([, label]) => csvCell(label)).join(",");
  const rows = docs.map((d) =>
    COLUMNS.map(([key]) => csvCell(d.data[key])).join(",")
  );
  const csv = [header, ...rows].join("\n") + "\n";

  // HTML table
  const thead = COLUMNS.map(([, l]) => `<th>${l}</th>`).join("");
  const tbody = docs
    .map(
      (d) =>
        "<tr>" +
        COLUMNS.map(([k]) => `<td>${escapeHtml(d.data[k])}</td>`).join("") +
        "</tr>"
    )
    .join("\n");
  const tableHtml = `<table class="register-table"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;

  return { csv, tableHtml, count: docs.length };
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function main() {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(path.join(DIST_DIR, "html"), { recursive: true });
  const { csv, tableHtml, count } = buildRegister();
  fs.writeFileSync(path.join(DIST_DIR, "register.csv"), csv);

  const tpl = fs.readFileSync(path.join(ROOT, "templates", "register.html"), "utf8");
  const html = applyTemplate(tpl, {
    title: "Document Register",
    site: "Oxford Medical Kuwait — Bneid Al-Qar",
    department: "Embryology Laboratory",
    cssHref: "file://" + path.join(ROOT, "styles", "brand.css"),
    register: tableHtml,
  });
  fs.writeFileSync(path.join(DIST_DIR, "html", "register.html"), html);
  console.log(`✓ Register written: dist/register.csv + dist/html/register.html (${count} documents).`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
