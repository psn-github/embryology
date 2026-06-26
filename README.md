# Oxford Medical Kuwait — Embryology Laboratory Document Suite

A maintainable, auditable suite of embryology/IVF-laboratory SOPs, policies,
forms and logs. **Markdown + YAML front-matter is the single source of truth;**
a render pipeline applies Oxford Medical v2.4 **Document-track** branding (Arial /
Liberation Sans, near-monochrome, colour confined to the logo) and all
document-control furniture, and produces print-true A4 PDFs and a bound manual.
See `PLAN.md` for the full design brief.

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
styles/    brand.css  fonts/        ← Oxford Medical v2.4 Document-track tokens + @page A4 rules
assets/    brand/ (logos, placeholders)
scripts/   validate · build · render · manual · register · docx · watch
manual.config.yml                   ← manual metadata + ordered docId list
dist/                               ← gitignored output (HTML, PDF, register.csv)
```

## Numbering scheme (`OMK-<TYPE>-<DEPT>-####`, PLAN v2 §3.1)

| Category | Prefix | Example |
|---|---|---|
| Bound manual | `OMK-MAN-EMB` | `OMK-MAN-EMB-0001` |
| Standard operating procedure | `OMK-SOP-EMB` | `OMK-SOP-EMB-0024` (ICSI) |
| Policy | `OMK-POL-EMB` | `OMK-POL-EMB-0006` (consent) |
| Form (fillable) | `OMK-FORM-EMB` | `OMK-FORM-EMB-0053` |
| Log / worksheet | `OMK-LOG-EMB` | `OMK-LOG-EMB-0052` |
| Appendix | `OMK-APP-EMB` | `OMK-APP-EMB-A` |

Dept is a single `EMB` for the whole lab. IDs are assigned by **type+dept
register sequence**, never by manual chapter order, so inserting a document
never renumbers existing ones. Manual order lives in `manual.config.yml`.
The prior `ELB-*` scheme was migrated to `OMK-*` (see `MIGRATION.md`).

## Ingesting a TFP source document

Most clinical SOPs are **transformed from the TFP corpus** (PLAN v2 §8), not
authored from scratch. Place the `.docx` in `source/tfp/` (gitignored — see
`source/README.md`) and run:

```bash
npm run ingest -- --file "TFP ICSI SOP.docx" --as OMK-SOP-EMB-0024 --title "Intracytoplasmic Sperm Injection (ICSI)"
```

This writes the draft `content/sops/OMK-SOP-EMB-0024.md` (status Draft) and a
`OMK-SOP-EMB-0024.transform.md` report of every stripped/flagged line. Clinical
values, dish layouts, media, timings and witnessing steps are kept verbatim;
Q-Pulse/HFEA/donor/surrogacy/multi-site framing is stripped or flagged. Review
the report and complete front-matter before issue. **Nothing auto-publishes.**

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
