// TFP .docx → OMK Markdown ingest pipeline (PLAN v2 §7–§8).
//
//   npm run ingest -- --file "TFP ICSI SOP.docx" --as OMK-SOP-EMB-0024 [--title "..."]
//
// Pipeline:
//   1. mammoth converts the .docx → HTML (tables + embedded dish-layout images
//      preserved; images written out as files and linked).
//   2. turndown (+ GFM tables) converts HTML → Markdown.
//   3. The §8 transformation rules are applied line-by-line: Q-Pulse / HFEA /
//      donor / surrogacy / multi-site framing is STRIPPED or FLAGGED; clinical
//      values, dish layouts, media, timings and witnessing steps are KEPT
//      VERBATIM.
//   4. Front-matter is pre-filled (incl. sourceDoc provenance) and the draft
//      .md is written to the correct content/ subfolder.
//   5. A *.transform.md report lists EVERY stripped or flagged line for
//      embryologist sign-off.
//
// NOTHING AUTO-PUBLISHES: status is forced to Draft and a human must review the
// transform report and approve before the document is issued.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mammoth from "mammoth";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const SOURCE_DIR = path.join(ROOT, "source", "tfp");
const CONTENT_DIRS = { SOP: "sops", POL: "policies", FORM: "forms", LOG: "logs", APP: "appendices" };

// ---------------------------------------------------------------------------
// §8 transformation rules — declarative table. Each rule has a matcher and a
// mode: "strip" (remove the line, log it) or "flag" (keep the line but annotate
// it inline AND log it for human confirmation).
// ---------------------------------------------------------------------------
const RULES = [
  {
    id: "qpulse",
    mode: "replace",
    test: /q[\s-]?pulse/i,
    replacement:
      "PRINTED COPIES ARE UNCONTROLLED — refer to the controlled register for the current version.",
    note: "TFP Q-Pulse controlled-copy reference replaced with OMK controlled-copy notice (§8 STRIP/REPLACE).",
  },
  {
    id: "hfea",
    mode: "flag",
    test: /\bHFEA\b|Human Fertilisation (and|&) Embryology Authority|licence condition|Code of Practice/i,
    note: "HFEA / UK licence-condition reference — re-base to Kuwait MoH equivalent or remove (§8). NEEDS SCOTT.",
  },
  {
    id: "donor_surrogacy",
    mode: "strip",
    test: /\bdonor\b|donation|surrogac|donor[:\s-]*partner|recipient cycle/i,
    note: "Donor/surrogacy content — OUT OF SCOPE (Kuwait); removed (§1, §5.0, §8).",
  },
  {
    id: "multisite",
    mode: "replace",
    test: /TFP\s*GROUP\s*UK|TFP Group|across (all )?(our )?(TFP )?(sites|clinics)|multi-?site/i,
    replacement: "Oxford Medical Kuwait",
    note: "TFP multi-site / 'TFP GROUP UK' language → single-site Oxford Medical Kuwait (§8).",
  },
  {
    id: "tfp_brand",
    mode: "replace",
    test: /\bTFP\b|The Fertility Partnership/i,
    replacement: "Oxford Medical Kuwait",
    note: "TFP organisation reference → Oxford Medical Kuwait (§8). Verify each occurrence is org-framing, not a source-ID.",
  },
  {
    id: "coopersurgical",
    mode: "flag",
    test: /CooperSurgical|Igenomix|genetics provider|reference laborator/i,
    note: "Named UK genetics/reference provider — Kuwait provider TBC; leave as [LOCAL: provider TBC] (§8). NEEDS SCOTT.",
  },
  {
    id: "tfp_author",
    mode: "flag",
    test: /Zujovic|Lyndsey/i,
    note: "TFP author/owner — move to sourceDoc provenance; OMK author/reviewer/approver set in front-matter (§8).",
  },
];

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function parseDocId(docId) {
  const m = /^OMK-(SOP|POL|FORM|LOG|APP|MAN)-(EMB|AND)-(\d{4})$/.exec(docId);
  if (!m) throw new Error(`docId "${docId}" must match OMK-<TYPE>-<DEPT>-#### (e.g. OMK-SOP-EMB-0024).`);
  return { type: m[1], dept: m[2], seq: m[3] };
}

// Apply the §8 rules to the markdown body. Returns { body, report[] }.
function applyRules(markdown, docId) {
  const lines = markdown.split("\n");
  const out = [];
  const report = [];
  lines.forEach((line, idx) => {
    if (line.trim() === "") {
      out.push(line);
      return;
    }
    let working = line;
    let dropped = false;
    // §8 exception: the TFP scope line "…donation and surrogacy are prohibited
    // in Kuwait" is KEPT and standardised as the scope statement, not stripped.
    if (/prohibited in Kuwait/i.test(working)) {
      report.push({ line: idx + 1, rule: "donor_surrogacy", action: "REPLACED", note: "Donor/surrogacy scope line standardised as the OMK scope statement (§8 — kept, not stripped).", text: working.trim() });
      out.push("Gamete/embryo donation and surrogacy are out of scope (prohibited in Kuwait).");
      return;
    }
    for (const rule of RULES) {
      if (!rule.test.test(working)) continue;
      if (rule.mode === "strip") {
        report.push({ line: idx + 1, rule: rule.id, action: "STRIPPED", note: rule.note, text: line.trim() });
        dropped = true;
        break;
      } else if (rule.mode === "replace") {
        const before = working;
        working = working.replace(rule.test, rule.replacement);
        report.push({ line: idx + 1, rule: rule.id, action: "REPLACED", note: rule.note, text: `${before.trim()}  →  ${working.trim()}` });
      } else if (rule.mode === "flag") {
        report.push({ line: idx + 1, rule: rule.id, action: "FLAGGED", note: rule.note, text: line.trim() });
        working = `${working}  <!-- TODO(§8 ${rule.id}): ${rule.note} -->`;
      }
    }
    if (!dropped) out.push(working);
  });
  return { body: out.join("\n"), report };
}

function frontMatter({ docId, title, dept, sourceDoc, bilingual }) {
  const deptName = dept === "AND" ? "Andrology" : "Embryology Laboratory";
  return `---
docId: ${docId}
title: ${title}
category: ${parseDocId(docId).type}
department: ${deptName}
site: Oxford Medical Kuwait
version: "1.0"
status: Draft
effectiveDate: 2026-07-01
nextReviewDate: 2028-07-01
author: ""
reviewedBy: ""
approvedBy: "Prof Scott M Nelson, Medical Director"
supersedes: ""
sourceDoc: ${JSON.stringify(sourceDoc)}
relatedDocuments: []
guidelineRefs: ["ESHRE IVF lab", "ASRM", "Istanbul Consensus", "ISO 15189"]
witnessSystem: "RI Witness"
bilingual: ${bilingual ? "true" : "false"}
changeHistory:
  - version: "1.0"
    date: 2026-07-01
    author: ""
    summary: "Initial issue; adapted from TFP SOP for Oxford Medical Kuwait (single-site, MoH, autologous-only)."
---
`;
}

function renderReport({ docId, srcFile, report, imageCount }) {
  const byAction = (a) => report.filter((r) => r.action === a);
  const section = (title, rows) =>
    rows.length
      ? `\n## ${title} (${rows.length})\n\n| Src line | Rule | Note | Content |\n|---|---|---|---|\n` +
        rows.map((r) => `| ${r.line} | ${r.rule} | ${r.note} | ${r.text.replace(/\|/g, "\\|").slice(0, 300)} |`).join("\n") +
        "\n"
      : `\n## ${title} (0)\n\n_None._\n`;
  return `# Transformation report — ${docId}

**Source:** \`${srcFile}\`
**Generated:** ${new Date().toISOString().slice(0, 10)} by \`scripts/ingest.mjs\` (PLAN v2 §8)
**Embedded figures extracted:** ${imageCount}

> Review every entry below before approving this document for issue. STRIPPED
> lines were removed (donor/surrogacy/Q-Pulse); FLAGGED lines were kept with an
> inline \`TODO(§8 …)\` and need Scott's decision (HFEA→MoH mapping, provider TBC).
> Clinical values, dish layouts, media, volumes, timings and witnessing steps are
> preserved verbatim and are NOT listed here.
${section("Stripped (removed)", byAction("STRIPPED"))}${section("Flagged (kept, needs decision)", byAction("FLAGGED"))}${section("Replaced (rebased to OMK)", byAction("REPLACED"))}
`;
}

async function main() {
  const file = arg("--file");
  const docId = arg("--as");
  const titleOverride = arg("--title");
  const bilingual = process.argv.includes("--bilingual");
  if (!file || !docId) {
    console.error('Usage: npm run ingest -- --file "TFP X SOP.docx" --as OMK-SOP-EMB-0024 [--title "..."] [--bilingual]');
    process.exit(2);
  }
  const { dept, type } = parseDocId(docId);
  const srcPath = path.isAbsolute(file) ? file : path.join(SOURCE_DIR, file);
  if (!fs.existsSync(srcPath)) {
    console.error(`✗ Source file not found: ${srcPath}`);
    console.error(`  Place the TFP corpus in source/tfp/ (gitignored). See source/README.md.`);
    process.exit(1);
  }

  // Extract images (dish-layout figures) to an assets folder beside the draft.
  const imgDir = path.join(ROOT, "assets", "tfp", docId);
  fs.mkdirSync(imgDir, { recursive: true });
  let imageCount = 0;
  const convertImage = mammoth.images.imgElement(async (image) => {
    const ext = (image.contentType || "image/png").split("/")[1].replace("jpeg", "jpg");
    const name = `fig-${++imageCount}.${ext}`;
    const buf = await image.read("base64");
    fs.writeFileSync(path.join(imgDir, name), Buffer.from(buf, "base64"));
    return { src: path.relative(ROOT, path.join(imgDir, name)) };
  });

  const { value: html, messages } = await mammoth.convertToHtml({ path: srcPath }, { convertImage });
  if (messages.length) console.warn(`  mammoth: ${messages.length} message(s) (style/structure notes).`);

  const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
  td.use(gfm);
  const markdownRaw = td.turndown(html);

  const { body, report } = applyRules(markdownRaw, docId);
  const title = titleOverride || docId;
  const sourceDoc = `TFP — ${path.basename(srcPath)} (revision per source footer)`;
  const md = frontMatter({ docId, title, dept, sourceDoc, bilingual }) + "\n" + body + "\n";

  const outDir = path.join(ROOT, "content", CONTENT_DIRS[type]);
  fs.mkdirSync(outDir, { recursive: true });
  const outMd = path.join(outDir, `${docId}.md`);
  const outReport = path.join(outDir, `${docId}.transform.md`);
  fs.writeFileSync(outMd, md);
  fs.writeFileSync(outReport, renderReport({ docId, srcFile: path.basename(srcPath), report, imageCount }));

  console.log(`✓ Ingested ${path.basename(srcPath)} → ${path.relative(ROOT, outMd)}`);
  console.log(`  Transform report: ${path.relative(ROOT, outReport)} (${report.length} rule hits, ${imageCount} figures)`);
  console.log(`  status: Draft — review the transform report and complete front-matter before issue.`);
}

main().catch((e) => {
  console.error("✗ ingest failed:", e.message);
  process.exit(1);
});
