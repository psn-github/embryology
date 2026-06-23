// Shared content loading + front-matter parsing for the Embryology suite.
// Single source of truth: Markdown + YAML front-matter under /content.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

export const ROOT = path.resolve(fileURLToPath(import.meta.url), "../../..");
export const CONTENT_DIR = path.join(ROOT, "content");
export const DIST_DIR = path.join(ROOT, "dist");

export const CATEGORY_DIRS = {
  SOP: "sops",
  POL: "policies",
  FORM: "forms",
  LOG: "logs",
  APP: "appendices",
  MAN: ".", // manual config lives at repo root
};

const MANDATORY_FIELDS = [
  "docId",
  "title",
  "category",
  "department",
  "site",
  "version",
  "status",
  "effectiveDate",
  "nextReviewDate",
  "approvedBy",
];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_CATEGORIES = ["SOP", "POL", "FORM", "LOG", "APP", "MAN"];
const VALID_STATUSES = ["Draft", "In Review", "Approved", "Superseded"];

// Recursively collect all .md files under /content.
export function listContentFiles() {
  const files = [];
  for (const sub of Object.values(CATEGORY_DIRS)) {
    if (sub === ".") continue;
    const dir = path.join(CONTENT_DIR, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".md")) files.push(path.join(dir, f));
    }
  }
  return files.sort();
}

// YAML parses unquoted ISO dates into JS Date objects; coerce them back to
// 'YYYY-MM-DD' strings everywhere so furniture and the validator see ISO text.
function isoString(d) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function normalizeDates(value) {
  if (value instanceof Date) return isoString(value);
  if (Array.isArray(value)) return value.map(normalizeDates);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = normalizeDates(v);
    return out;
  }
  return value;
}

// Parse a single document file into { data, body, filePath }.
export function loadDoc(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { data: normalizeDates(data), body: content, filePath, fileName: path.basename(filePath) };
}

// Load every document in the suite.
export function loadAllDocs() {
  return listContentFiles().map(loadDoc);
}

// Validate one document's front-matter. Returns array of error strings.
export function validateDoc(doc, allIds) {
  const errs = [];
  const { data, fileName } = doc;
  const tag = data.docId || fileName;

  for (const field of MANDATORY_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      errs.push(`${tag}: missing mandatory field "${field}"`);
    }
  }

  if (data.category && !VALID_CATEGORIES.includes(data.category)) {
    errs.push(`${tag}: invalid category "${data.category}"`);
  }
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errs.push(`${tag}: invalid status "${data.status}"`);
  }
  for (const dateField of ["effectiveDate", "nextReviewDate"]) {
    const v = data[dateField];
    if (v && !ISO_DATE.test(String(v))) {
      errs.push(`${tag}: ${dateField} "${v}" is not ISO YYYY-MM-DD`);
    }
  }
  // Cross-reference resolution
  if (Array.isArray(data.relatedDocuments)) {
    for (const ref of data.relatedDocuments) {
      if (!allIds.has(ref)) {
        errs.push(`${tag}: relatedDocuments entry "${ref}" does not resolve to a known docId`);
      }
    }
  }
  return errs;
}

// Build a Set of all docIds (for cross-ref checks + duplicate detection).
export function indexDocs(docs) {
  const ids = new Set();
  const dupes = [];
  for (const d of docs) {
    const id = d.data.docId;
    if (!id) continue;
    if (ids.has(id)) dupes.push(id);
    ids.add(id);
  }
  return { ids, dupes };
}
