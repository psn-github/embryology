// Build every document → dist/html/*.html and dist/pdf/*.pdf (PLAN.md §7).
// Also regenerates the register. Runs validation first; refuses to build a
// suite that fails the linter.

import { execFileSync } from "node:child_process";
import { loadAllDocs, indexDocs } from "./lib/load.mjs";
import { renderOne } from "./render.mjs";
import { buildRegister } from "./register.mjs";
import { writeIndex } from "./index.mjs";
import fs from "node:fs";
import path from "node:path";
import { DIST_DIR, ROOT } from "./lib/load.mjs";
import { applyTemplate } from "./lib/render-html.mjs";

async function main() {
  // Validate first (hard gate).
  try {
    execFileSync("node", [path.join(ROOT, "scripts", "validate.mjs")], { stdio: "inherit" });
  } catch {
    console.error("✗ Build aborted: validation failed.");
    process.exit(1);
  }

  const docs = loadAllDocs();
  indexDocs(docs);

  let pdfCount = 0;
  for (const doc of docs) {
    const r = await renderOne(doc);
    if (r.pdf) pdfCount++;
  }

  // Register
  fs.mkdirSync(path.join(DIST_DIR, "html"), { recursive: true });
  const { csv, tableHtml, count } = buildRegister();
  fs.writeFileSync(path.join(DIST_DIR, "register.csv"), csv);
  const tpl = fs.readFileSync(path.join(ROOT, "templates", "register.html"), "utf8");
  fs.writeFileSync(
    path.join(DIST_DIR, "html", "register.html"),
    applyTemplate(tpl, {
      title: "Document Register",
      site: "Oxford Medical Kuwait — Bneid Al-Qar",
      department: "Embryology Laboratory",
      cssHref: "file://" + path.join(ROOT, "styles", "brand.css"),
      register: tableHtml,
    })
  );

  // Documentation index — the on-screen front door (register-driven).
  const indexCount = writeIndex();

  console.log(`\n✓ Build complete — ${docs.length} documents (${pdfCount} PDF, ${docs.length - pdfCount} HTML-only), register: ${count} entries, index: ${indexCount} documents.`);
}

main();
