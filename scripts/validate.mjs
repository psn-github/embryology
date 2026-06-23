// Front-matter + cross-reference validator (PLAN.md §3.2).
// Refuses to pass if any document has missing mandatory fields, a non-ISO
// date, a duplicate docId, or an unresolved relatedDocuments entry.
// Pure Node — no Chromium — so it runs in CI and locally.

import { loadAllDocs, validateDoc, indexDocs } from "./lib/load.mjs";

const docs = loadAllDocs();
const { ids, dupes } = indexDocs(docs);

const errors = [];
for (const id of dupes) errors.push(`Duplicate docId: ${id}`);
for (const doc of docs) errors.push(...validateDoc(doc, ids));

if (!docs.length) {
  console.warn("⚠  No documents found under /content.");
}

if (errors.length) {
  console.error(`\n✗ Validation failed — ${errors.length} issue(s):\n`);
  for (const e of errors) console.error("  • " + e);
  console.error("");
  process.exit(1);
}

console.log(`✓ Validation passed — ${docs.length} document(s), all front-matter and cross-references resolve.`);
