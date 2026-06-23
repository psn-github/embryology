// Optional Word export (PLAN.md §7, secondary target — NOT the source of truth).
// Markdown → .docx via pandoc with an Oxford reference template, for editable
// handoff. No-op with a clear message if pandoc is not installed.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { listContentFiles, DIST_DIR, ROOT } from "./lib/load.mjs";

function hasPandoc() {
  try {
    execFileSync("pandoc", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (!hasPandoc()) {
    console.warn("⚠  pandoc not installed — DOCX export skipped. Install pandoc to enable `npm run build:docx`.");
    process.exit(0);
  }
  const outDir = path.join(DIST_DIR, "docx");
  fs.mkdirSync(outDir, { recursive: true });
  const refDoc = path.join(ROOT, "templates", "reference.docx");
  const refArgs = fs.existsSync(refDoc) ? ["--reference-doc", refDoc] : [];

  let n = 0;
  for (const file of listContentFiles()) {
    const base = path.basename(file, ".md");
    const out = path.join(outDir, `${base}.docx`);
    execFileSync("pandoc", [file, "-o", out, "--from", "markdown+yaml_metadata_block", ...refArgs]);
    n++;
  }
  console.log(`✓ DOCX export complete — ${n} document(s) → dist/docx/.`);
}

main();
