# Oxford Medical Kuwait — Embryology Laboratory Document Suite

A maintainable, auditable suite of embryology/IVF-laboratory SOPs, policies,
forms and logs. **Markdown + YAML front-matter is the single source of truth;**
a render pipeline applies Oxford Medical v2.3 branding and all document-control
furniture and produces print-true A4 PDFs and a bound manual. See `PLAN.md` for
the full design brief.

> **Scope.** Autologous ART (the couple's own gametes) only. Third-party gamete
> donation and surrogacy are out of scope — no such documents exist in this suite.

## Quick start

```bash
npm install          # runtime deps; puppeteer (PDF) is a devDependency
npm run lint         # validate front-matter + cross-references (pure Node, CI gate)
npm run build        # all documents → dist/html + dist/pdf, regenerate register
npm run build:manual # assemble the bound manual ELB-MAN-001
npm run build:register
```

If Puppeteer/Chromium is not installed (e.g. a restricted CI/container), the
build still writes branded **HTML** and the **register**, and clearly reports
that the PDF step was skipped. Install the dev dependencies for PDF output:

```bash
npm install --include=dev   # pulls puppeteer + pagedjs-cli
npm run build               # now also emits dist/pdf/*.pdf
```

## Repository layout

```
content/   sops/ policies/ forms/ logs/ appendices/   ← authored Markdown (source of truth)
templates/ sop.html form.html manual.html register.html page.html
styles/    brand.css  fonts/        ← Oxford Medical v2.3 tokens + @page A4 rules
assets/    brand/ (logos, placeholders)
scripts/   validate · build · render · manual · register · docx · watch
manual.config.yml                   ← manual metadata + ordered docId list
dist/                               ← gitignored output (HTML, PDF, register.csv)
```

## Numbering scheme (`ELB` prefix, PLAN.md §3.1)

| Category | Prefix | Example |
|---|---|---|
| Bound manual | `ELB-MAN` | `ELB-MAN-001` |
| Standard operating procedure | `ELB-SOP` | `ELB-SOP-027` |
| Policy | `ELB-POL` | `ELB-POL-009` |
| Form (fillable) | `ELB-FORM` | `ELB-FORM-001` |
| Log / worksheet | `ELB-LOG` | `ELB-LOG-008` |
| Appendix | `ELB-APP` | `ELB-APP-A` |

IDs are assigned by **category sequence**, never by manual chapter order, so
inserting a document never renumbers existing ones. Manual order lives in
`manual.config.yml`.

## Authoring a new document

1. Copy the front-matter block from any document (or `AUTHORING.md`) into a new
   file under the right `content/` subfolder; name it `<docId>.md`.
2. Fill **every mandatory field** — the validator rejects missing fields,
   non-ISO dates, duplicate `docId`s and unresolved `relatedDocuments`.
3. Write the body under the fixed house section order (PLAN.md §4 / `AUTHORING.md`).
4. `npm run lint` then `npm run build:doc -- --doc <docId>`.
5. Open a pull request — because the source is Markdown, every wording change
   diffs cleanly.

See **`AUTHORING.md`** for the front-matter schema, the house SOP section order,
the bilingual-form markup, and the Oxford Medical voice/branding notes.

## Governance

Author (embryologist) → Reviewer (Quality Manager / senior embryologist) →
Approver (Medical Director). All three are recorded in front-matter and on the
signature block. Default review cycle 2 years; immediate review on guideline
change, equipment change or post-incident. Every quantitative value is anchored
to a guideline or recorded as locally defined in **Appendix A**.
