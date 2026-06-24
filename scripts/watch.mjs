// Authoring watch mode: rebuild a document when its source changes (PLAN.md §7).
// Lightweight fs.watch over /content; on change, re-renders that one document.

import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, loadDoc } from "./lib/load.mjs";
import { renderOne } from "./render.mjs";

console.log("👀 Watching content/ for changes — Ctrl-C to stop.");

const dirs = ["sops", "policies", "forms", "logs", "appendices"].map((d) => path.join(CONTENT_DIR, d));
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  fs.watch(dir, async (event, filename) => {
    if (!filename || !filename.endsWith(".md")) return;
    const file = path.join(dir, filename);
    if (!fs.existsSync(file)) return;
    try {
      const doc = loadDoc(file);
      const r = await renderOne(doc);
      console.log(`↻ rebuilt ${r.id}`);
    } catch (e) {
      console.error(`✗ ${filename}: ${e.message}`);
    }
  });
}
