// Build a single document: node scripts/render.mjs --doc ELB-SOP-027
// Writes dist/html/<docId>.html and dist/pdf/<docId>.pdf (PLAN.md §7).

import fs from "node:fs";
import path from "node:path";
import { loadAllDocs, indexDocs, DIST_DIR } from "./lib/load.mjs";
import { renderDocumentHtml, pageShell } from "./lib/render-html.mjs";
import { htmlFileToPdf } from "./lib/pdf.mjs";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

export async function renderOne(doc) {
  const id = doc.data.docId;
  const inner = renderDocumentHtml(doc, { mode: "standalone" });
  const html = pageShell({ title: `${id} — ${doc.data.title}`, inner });

  const htmlDir = path.join(DIST_DIR, "html");
  const pdfDir = path.join(DIST_DIR, "pdf");
  fs.mkdirSync(htmlDir, { recursive: true });
  const htmlPath = path.join(htmlDir, `${id}.html`);
  fs.writeFileSync(htmlPath, html);

  const pdfPath = path.join(pdfDir, `${id}.pdf`);
  const ok = await htmlFileToPdf(htmlPath, pdfPath);
  return { id, htmlPath, pdfPath, pdf: ok };
}

async function main() {
  const wanted = arg("--doc");
  const docs = loadAllDocs();
  indexDocs(docs); // surfaces duplicate ids early via validate; here just load
  const target = docs.find((d) => d.data.docId === wanted);
  if (!target) {
    console.error(`✗ Document "${wanted}" not found. Use --doc ELB-SOP-027 (or similar).`);
    process.exit(1);
  }
  const r = await renderOne(target);
  console.log(`✓ ${r.id}: HTML written${r.pdf ? " + PDF" : " (PDF skipped)"}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
