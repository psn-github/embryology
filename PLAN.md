# Oxford Medical Kuwait — Embryology Laboratory Document Suite
### Build plan for Claude Code · **v2 (TFP-sourced)**

**Repository (proposed):** `psn-github/embryology`
**Owner / Approver:** Prof Scott M Nelson, BSc MBChB PhD MRCOG — Medical Director, Oxford Medical Kuwait
**Output:** A4 controlled documents (PDF primary, DOCX optional), individually and as a bound manual, fully branded to the Oxford Medical v2.4 **Document track** (Arial / Liberation Sans, near-monochrome), version-controlled in Git.
**Status of this document:** Master build brief, revised. Hand to Claude Code to scaffold the repo and Phase 0.

> **What changed in v2.** The original plan was reverse-engineered from a generic US "IVF Store" manual (FDA/OSHA/HIPAA/CLIA framing — none of which apply here) and assumed Scott would author every SOP from blank stubs. We now hold the **TFP (The Fertility Partnership) embryology SOP corpus** — ~25 mature, HFEA-regulated, audited SOPs already partly adapted for Kuwait. These become the **primary content source**, not a structural reference. Claude Code's job shifts from "scaffold + empty stubs" to "ingest the TFP corpus, transform it into the Oxford Medical controlled-document system, and ship fully-worked SOPs in Phase 0." The IVF Store manual is demoted to a cross-check for completeness only.

---

## 0. Decisions locked for this build

| # | Decision | Resolution |
|---|---|---|
| 1 | TFP corpus posture | **Primary source — transform it.** Phase 0 ships real, fully-worked SOPs, not placeholders. |
| 2 | Numbering scheme | **Mirror TFP:** `OMK-SOP-EMB-####` (site–doctype–dept–sequence). See §3.1. |
| 3 | Accreditation target | **Accreditation Canada Diagnostics**, which accredits to **ISO 15189 ("ISO 15189 Plus", v5.2)**. The suite is built ISO 15189-native so it maps directly onto the future Canadian assessment. See §2. |
| 4 | Scope boundary | **Autologous ART only.** Donor gametes and surrogacy are out of scope (prohibited in Kuwait); the two donor/surrogacy source files are **not** transformed. See §1 and §5.0. |
| 5 | Bilingual scope | Internal SOPs/policies/logs **English**; patient-facing consents/forms **bilingual EN / Khaleeji Arabic, RTL**. See §2.1. |

---

## 1. Purpose and design principles

Build a maintainable, auditable suite of embryology/IVF-laboratory SOPs, policies, forms and logs for Oxford Medical Kuwait that:

1. **Separates content from presentation.** Each document is authored once as Markdown + YAML front-matter (the single source of truth). A render pipeline applies Oxford Medical branding and all document-control furniture. We never hand-format a PDF.
2. **Diffs cleanly in Git.** Markdown source means every wording change is reviewable in a pull request — the central advantage over the TFP corpus's current binary `.docx`-in-Q-Pulse model. DOCX is retained only as an optional export target for editable handoff (§7).
3. **Makes adding/revising an SOP trivial.** Drop or edit a `.md` file in `/content/`, run `npm run build`; the manual, TOC, cross-references and document register regenerate automatically.
4. **Is print-true to A4** with correct margins, headers, footers, page-of-total numbering and a controlled-copy stamp.
5. **Anchors every clinical value to a source** — either a published guideline, the TFP setpoint it was adapted from, or an explicit local-completion point recorded in Appendix A. No value is left implicit.

**Scope boundary.** The suite covers **autologous ART using the couple's own gametes**. Third-party gamete donation and surrogacy are out of scope; no donor/surrogacy SOPs, forms or workflows are generated, and the donor/surrogacy source files are excluded from transformation.

---

## 2. Regulatory and best-practice framework

The suite is anchored to international laboratory best practice and the **ISO 15189** quality-management spine that the future **Accreditation Canada Diagnostics** assessment is built on. The TFP corpus already operates to UK HFEA standards; transformation re-bases the *regulatory* references from UK/HFEA to Kuwait MoH + ISO 15189, while **retaining the clinical and technical content unchanged**.

| Layer | Reference |
|---|---|
| Laboratory quality management (spine) | **ISO 15189** medical-laboratory requirements → maps to **Accreditation Canada Diagnostics "ISO 15189 Plus" v5.2** (future target) |
| IVF laboratory best practice | ESHRE Revised guidelines for good practice in IVF laboratories (current); ASRM embryology/andrology laboratory committee opinions (current) |
| Oocyte / zygote / embryo morphology & grading | ESHRE/ALPHA **Istanbul Consensus** (current revision) — cross-checked against the TFP grading SOP |
| Semen analysis | **WHO laboratory manual** (current edition) — cross-checked against TFP diagnostic-semen SOP |
| Electronic witnessing | **RI Witness** (installed system) — every witness checkpoint in the TFP SOPs is retained verbatim |
| Culture system & media | **Vitrolife** consumables as installed (G-series: GTL, G-MOPS+, G1+, OVOIL; EmbryoScope+ / time-lapse; CultActive for AOA) |
| Hazard communication | GHS labelling and safety-data-sheet standard |
| Local regulatory requirements | Kuwait Ministry of Health (MoH); other authorities as applicable (Public Authority for Manpower for staffing matters) |

Every quantitative value is either (a) traceable to a best-practice reference above, (b) inherited from the validated TFP SOP and tagged as such, or (c) explicitly set locally and recorded in Appendix A.

### 2.1 Localisation decision for sign-off

**Bilingual scope.** SOPs, policies and internal logs stay **English** (technical, staff-facing). Patient-facing forms and consents (cryopreservation consent, procedure consent acknowledgments, semen-production declaration, disposition election) are **bilingual EN / Khaleeji Arabic**, run through the bilingual clinical formatter with RTL layout. The build supports a `bilingual: true` front-matter flag that switches the form template to a stacked/two-column RTL layout.

---

## 3. Document-control system

### 3.1 Numbering scheme (mirrors TFP — locked)

OMK adopts TFP's structured ID so embryologists who trained on the TFP system recognise it immediately and source-mapping is one-to-one. TFP's footer ID format (`TFP1-SOP-EMB-0023 · Revision: 3 · Issued by: … · Revision Due: …`) is the template.

**Pattern:** `OMK-<TYPE>-<DEPT>-####`

| Component | Values |
|---|---|
| Site/group | `OMK` (Oxford Medical Kuwait) |
| Type | `SOP` · `POL` (policy) · `FORM` · `LOG` · `APP` (appendix) · `MAN` (bound manual) |
| Dept | `EMB` (embryology) · `AND` (andrology) — or single `EMB` for the whole lab if preferred |
| Sequence | Zero-padded 4 digits, assigned by **type+dept register**, not by manual order |

Examples: `OMK-SOP-EMB-0027` (ICSI) · `OMK-POL-EMB-0006` (consent) · `OMK-FORM-EMB-0012` (ICSI record) · `OMK-MAN-EMB-0001` (bound manual).

> Sequence is assigned by register order, so inserting a new SOP later never renumbers existing ones. Manual ordering is controlled separately in `manual.config.yml` (§6). Each transformed document records its **TFP source ID** in front-matter (`sourceDoc:`) for provenance and audit.

### 3.2 Front-matter schema (every document)

```yaml
---
docId: OMK-SOP-EMB-0027
title: Intracytoplasmic Sperm Injection (ICSI)
category: SOP                 # SOP | POL | FORM | LOG | APP | MAN
department: Embryology Laboratory
site: Oxford Medical Kuwait
version: "1.0"
status: Draft                 # Draft | In Review | Approved | Superseded
effectiveDate: 2026-07-01
nextReviewDate: 2028-07-01     # 2-year cycle; sooner on guideline/equipment change
author: ""
reviewedBy: ""                # Quality Manager / senior embryologist
approvedBy: "Prof Scott M Nelson, Medical Director"
supersedes: ""
sourceDoc: "TFP ICSI SOP (Rev 4.0, 19/10/2022; Zujovic, L.)"   # provenance of transformed content
relatedDocuments: [OMK-FORM-EMB-0012, OMK-LOG-EMB-0006, OMK-POL-EMB-0007]
guidelineRefs: ["ESHRE IVF lab", "ASRM", "Istanbul Consensus"]
witnessSystem: "RI Witness"
bilingual: false
changeHistory:
  - version: "1.0"
    date: 2026-07-01
    author: ""
    summary: "Initial issue; adapted from TFP SOP for Oxford Medical Kuwait (single-site, MoH, autologous-only)."
---
```

A **validator** (`npm run lint`) refuses to build any document with missing mandatory fields, a non-ISO date, a duplicate `docId`, or a `relatedDocuments` entry that doesn't resolve to a real file.

### 3.3 Page furniture (applied automatically by the template)

- **Header:** Oxford Medical horizontal logo (left); document title + `docId` (right); thin Porcini rule beneath.
- **Footer (TFP-style, rebased to OMK):** `docId · v{version} · Issued by {author} · Review due {nextReviewDate} · Page X of Y` plus the controlled-copy notice: **`PRINTED COPIES ARE UNCONTROLLED — refer to the controlled register for the current version.`** (Replaces TFP's "refer to Q Pulse".)
- **First-page block:** title, full metadata table (owner, approver, version, effective/review dates, status, **TFP source**), and the **amendment-history table** rendered from front-matter.
- **Signature block:** Authored / Reviewed / Approved rows with name, role, signature space, date.
- **Watermark:** `Draft` → faint "DRAFT" diagonal; `Superseded` → "SUPERSEDED"; `Approved` → clean.
- **Cross-references** render as live links in the manual PDF and plain `docId` in standalone PDFs.

### 3.4 Auto-generated document register

`npm run register` reads every file's front-matter and emits `dist/register.csv` and a printable `OMK-MAN` front-section table: docId, title, category, version, status, effective date, next review, approver, **TFP source**. This is the master index and the audit artefact for the ISO 15189 / Accreditation Canada document-control requirement.

---

## 4. Standard SOP anatomy (house template — TFP order, ISO-tightened)

The TFP corpus already uses a consistent, audit-proven section order. We adopt it directly (rather than imposing a new ISO-idealised order) and add two ISO 15189 touch-points. Authors fill Markdown under fixed headings; `templates/sop.html` enforces order.

1. **Purpose**
2. **Scope** (cases/specimens/areas; competency gate)
3. **Definitions & abbreviations**
4. **Responsibilities** — General Manager · Laboratory Manager · Quality Manager · All Staff (TFP's four-role block, retained)
5. **Procedure**, sub-numbered as TFP does it:
   - x.1 Equipment & consumables required
   - x.2 Equipment checks
   - x.3 **Witnessing checks** (full name, clinic number, D.O.B.; RI Witness steps — *retained verbatim, this is the patient-safety core*)
   - x.4 onward: the procedure steps, numbered, imperative voice, with embedded dish-layout figures where the source has them
6. **Acceptance / rejection & non-conformance** (where applicable; links to deviation policy + log) — *ISO touch-point*
7. **Records generated** (which forms/logs this SOP produces) — *ISO touch-point*
8. **Guideline-linked & locally-defined values** (Appendix A pointer + current local setpoints)
9. **References**

> The TFP **amendment-history table** maps to front-matter `changeHistory` and renders on page 1 — no separate section needed.

---

## 5. Embryology SOP register — mapped from the TFP corpus

This replaces the speculative register in v1. Every row below is a **real TFP document** to transform (or a defined gap to author). Claude Code ingests the `.docx`, applies the §8 transformation rules, and emits the OMK document. Out-of-scope files are listed in §5.0 and **skipped**.

### 5.0 Excluded source files (do NOT transform)
- `Alt Donor Notes.docx` — donor gametes (out of scope, Kuwait)
- `surrogate lab notes.docx` — surrogacy (out of scope, Kuwait)

### A. Quality & governance
| OMK docId | Title | TFP source |
|---|---|---|
| OMK-POL-EMB-0001 | Laboratory Code of Conduct | TFP Laboratory Code of Conduct |
| OMK-SOP-EMB-0002 | Witnessing (manual + RI Witness, three identifiers) | TFP Witnessing |
| OMK-SOP-EMB-0003 | Laboratory–patient communication | TFP Laboratory Patient Communication SOP |
| OMK-SOP-EMB-0004 | Recordkeeping & documentation control | *gap — author (ISO 15189)* |
| OMK-SOP-EMB-0005 | Deviation / non-conformance & CAPA | *gap — author (replaces Q-Pulse workflow)* |
| OMK-SOP-EMB-0006 | Training & competency assessment | derive from TFP Biopsy Training SOP + EQA scheme |

### B. Andrology
| OMK docId | Title | TFP source |
|---|---|---|
| OMK-SOP-AND-0010 | Diagnostic semen analysis & post-vasectomy | TFP Diagnostic semen analysis / Post Vasectomy SOP |
| OMK-SOP-AND-0011 | Sperm preparation for treatment | TFP Sperm Preparation for Treatment SOP |
| OMK-SOP-AND-0012 | Sperm freezing — patient's own treatment | TFP Sperm Freezing for Patients Own Treatment SOP |
| OMK-SOP-AND-0013 | Intrauterine insemination (IUI) | IUI.docx |
| OMK-FORM-AND-0014 | Semen production declaration (bilingual) | Semen production form |
| OMK-FORM-AND-0015 | Semen analysis / freeze / surgical-retrieval worksheet | Lab Notes Semen Analysis Freeze SSR |

### C. Oocyte & embryo procedures
| OMK docId | Title | TFP source |
|---|---|---|
| OMK-SOP-EMB-0020 | Dish preparation | TFP Dish Preparation SOP |
| OMK-SOP-EMB-0021 | Trans-vaginal oocyte retrieval (TVOR) | TFP TVOR SOP |
| OMK-SOP-EMB-0022 | Conventional IVF insemination | TFP IVF Insemination |
| OMK-SOP-EMB-0023 | Denudation | TFP Denudation SOP |
| OMK-SOP-EMB-0024 | Intracytoplasmic sperm injection (ICSI) incl. AOA & HOST | TFP ICSI SOP |
| OMK-SOP-EMB-0025 | Fertilisation assessment | TFP Fertilisation SOP |
| OMK-SOP-EMB-0026 | Time-lapse imaging (EmbryoScope+) | TFP Time Lapse Imaging SOP |
| OMK-SOP-EMB-0027 | Embryo & blastocyst grading (Istanbul) | TFP Embryo / Blastocyst Grading SOP |
| OMK-SOP-EMB-0028 | Blastocyst grading EQA / competency | TFP Blastocyst Grading EQA Scheme |
| OMK-SOP-EMB-0029 | Embryo transfer | TFP Embryo Transfer SOP |
| OMK-SOP-EMB-0030 | PGT & blastocyst biopsy | TFP1-SOP-EMB-0023 PGT and Blastocyst Biopsy |
| OMK-SOP-EMB-0031 | Blastocyst biopsy — training | Blastocyst Biopsy Training SOP |
| OMK-SOP-EMB-0032 | Thaw–biopsy–refreeze | Thaw Biopsy Refreeze |

### D. Cryobiology
| OMK docId | Title | TFP source |
|---|---|---|
| OMK-SOP-EMB-0040 | Blastocyst vitrification (Vitrolife) | TFP Blastocyst Vitrification Vitrolife |
| OMK-SOP-EMB-0041 | Oocyte vitrification (Vitrolife) | TFP Vitrolife Oocyte Vitrification |
| OMK-SOP-EMB-0042 | Blastocyst warming (Vitrolife) | TFP Vitrolife Blastocyst Warming |
| OMK-SOP-EMB-0043 | Oocyte warming (Vitrolife) | TFP Vitrolife Oocyte Warming |
| OMK-SOP-EMB-0044 | Egg thaw (legacy) — reconcile with 0043 | Egg Thaw.docx |
| OMK-SOP-EMB-0045 | LN₂ storage, tank monitoring & cryosecurity | *gap — author (ISO 15189 / cryostore security)* |

### E. Cycle worksheets, forms & logs
| OMK docId | Title | TFP source |
|---|---|---|
| OMK-FORM-EMB-0050 | Fresh cycle laboratory worksheet | Fresh cycle Lab Notes |
| OMK-FORM-EMB-0051 | Frozen embryo replacement (FER) worksheet | FER lab notes |
| OMK-LOG-EMB-0052 | Embryo culture continuation sheet | Embryo Culture Continuation Sheet |
| OMK-FORM-EMB-0053 | Cryopreservation consent (bilingual) | *gap — author (MoH-compliant, autologous)* |
| OMK-FORM-EMB-0054 | Specimen disposition / election (bilingual) | *gap — author* |

### Policies (`OMK-POL`)
Code of conduct (0001, above) · informed consent · patient confidentiality · cryostorage security & access · exposure control & hazard communication · manufacturer recalls & product alerts · adverse events. (Derive from TFP Code of Conduct + Communication SOP where they carry policy content; author the rest to ISO 15189.)

### Appendices (`OMK-APP`)
- **APP-A — Setpoint register.** Guideline-linked values vs locally-defined completion points: incubation gas mix & pH (TFP validates ES+ GTL to pH 7.32 at 6 h — carry as the documented setpoint, re-validate locally), temperature setpoints, equilibration times, vitrification/warming timings, post-thaw survival thresholds, laser biopsy opening size, TVOC range. **Strongest feature of the source manuals — kept and populated from the TFP validated values, each flagged "verify locally".**
- **APP-B — Source & reference bibliography**, including the TFP provenance table (OMK docId ↔ TFP source ↔ revision).

---

## 6. Repository structure

```
embryology/
├── README.md                 # how to author + build (for staff/contributors)
├── PLAN.md                   # this document
├── package.json
├── manual.config.yml         # manual front-matter + ordered docId list for the bound manual
├── source/tfp/               # the original TFP .docx corpus (read-only provenance; gitignored if licensing requires)
├── content/
│   ├── sops/        OMK-SOP-*.md
│   ├── policies/    OMK-POL-*.md
│   ├── forms/       OMK-FORM-*.md
│   ├── logs/        OMK-LOG-*.md
│   └── appendices/  OMK-APP-*.md
├── templates/
│   ├── sop.html      # wraps body, injects furniture, enforces §4 order
│   ├── form.html     # supports bilingual RTL layout
│   ├── manual.html   # cover + auto-TOC + concatenated docs + register
│   └── register.html
├── styles/
│   ├── brand.css     # Oxford Medical v2.4 Document-track tokens + @page A4 rules
│   └── fonts/        # Arial / Liberation Sans (no embedded files needed)
├── assets/brand/
│   ├── Logo_01_RGB.svg   # horizontal (header)
│   ├── Logo_02_RGB.svg   # vertical (cover)
│   └── watermarks/
├── scripts/
│   ├── ingest.mjs       # .docx → Markdown + front-matter draft (docx → md via mammoth/pandoc; applies §8 rules, flags removals)
│   ├── build.mjs        # build all → dist/pdf
│   ├── render.mjs       # build one: --doc OMK-SOP-EMB-0024
│   ├── manual.mjs       # assemble bound manual
│   ├── register.mjs     # generate document register
│   └── validate.mjs     # front-matter + cross-ref linter
├── dist/                 # gitignored; PDFs, DOCX, register.csv
└── .github/workflows/
    └── build.yml         # CI: lint + build on push; attach PDFs to a release
```

The new piece versus v1 is **`scripts/ingest.mjs`** and **`source/tfp/`**: a one-time-per-doc converter that turns each TFP `.docx` into a Markdown draft with front-matter pre-filled and a `transformation-report` of every line it stripped or flagged for human confirmation.

---

## 7. Render & ingest pipeline

**Ingest (new):** TFP `.docx` → Markdown via `mammoth` (or `pandoc`), preserving tables and the embedded dish-layout figures; `ingest.mjs` then applies the §8 transformation rules, populates front-matter (incl. `sourceDoc`), and writes both the draft `.md` and a `*.transform.md` report listing every removal/flag for embryologist sign-off. **Nothing auto-publishes** — a human approves each transformed SOP.

**Render — primary:** Markdown → HTML (`markdown-it` + template) → **A4 PDF** via headless Chromium (`puppeteer`) with **Paged.js** for page boxes, running headers/footers and `Page X of Y`.

**Render — secondary (optional):** same Markdown → `.docx` via `pandoc` with an Oxford reference template, for editable handoff. Not the source of truth.

### npm scripts
```
npm run ingest -- --file "TFP ICSI SOP.docx" --as OMK-SOP-EMB-0024   # docx → md draft + transform report
npm run lint            # validate all front-matter + cross-references
npm run build           # all documents → dist/pdf/*.pdf
npm run build:doc -- --doc OMK-SOP-EMB-0024
npm run build:manual    # bound manual OMK-MAN-EMB-0001.pdf
npm run build:register  # dist/register.csv + printable index
npm run build:docx      # optional Word export
npm run watch
```

### A4 print rules (in `brand.css`)
```css
@page {
  size: A4;
  margin: 25mm 20mm 22mm 20mm;       /* extra top for header band */
  @top-left { content: element(header); }
  @bottom-center { content: "Page " counter(page) " of " counter(pages); }
}
```

---

## 8. TFP → OMK transformation rules (the core of v2)

`ingest.mjs` and the authoring embryologist apply these rules to every transformed document. **Clinical and technical content is preserved unchanged** — only regulatory framing, org references and out-of-scope branches are altered.

**STRIP / REPLACE**
- "Refer to **Q Pulse** for the latest version" → OMK controlled-copy notice (§3.3).
- **HFEA**-specific regulatory statements and licence-condition references → Kuwait **MoH** equivalents, or remove where no equivalent exists (flag for Scott).
- **Donor and surrogacy** branches, splits and references (e.g. "Donor:Partner split", donor codes, donor witnessing steps) → removed entirely (out of scope). *Note: the TFP ICSI SOP already carries the line "Gamete/embryo donation and surrogacy are prohibited in Kuwait" — standardise this as the scope statement.*
- **TFP multi-site / "TFP GROUP UK"** language → single-site "Oxford Medical Kuwait".
- Named UK suppliers where Kuwait differs (e.g. CooperSurgical as genetics provider — TFP doc already flags "provider yet to be selected for Kuwait") → leave as explicit `[LOCAL: provider TBC]` flag.
- TFP author/owner (Lyndsey Zujovic) → moved to `sourceDoc` provenance; OMK author/reviewer/approver set in front-matter.

**KEEP VERBATIM (do not paraphrase)**
- All **witnessing checkpoints** and the three-identifier checks (full name, clinic number, D.O.B.) and RI Witness steps.
- All **dish layouts, media (Vitrolife G-series), volumes, timings, equilibration and pH setpoints, incubation conditions, grading criteria, laser settings** — these are validated values; carry them and tag in Appendix A as "verify locally".
- The four-role **Responsibilities** block (GM / Lab Manager / QM / All Staff).

**LOCALISE / ADD**
- Single-site responsibilities; MoH reporting lines for adverse events and non-conformance.
- ISO 15189 touch-points: "Records generated" and "Non-conformance" sections (§4.6–4.7).
- Bilingual EN/Khaleeji rendering for patient-facing forms only.

**GOVERNANCE / IP NOTE.** The TFP corpus is TFP intellectual property; Scott is TFP Scientific Director. Adoption for OMK should be acknowledged (the `sourceDoc` provenance field does this), and each transformed SOP must be **re-reviewed and re-approved under OMK governance** before issue — transformation does not inherit TFP's approval. Confirm any cross-entity licensing/attribution expectations with TFP before publication.

---

## 9. Branding (Oxford Medical v2.4 — Document track)

This is written documentation, so it follows the brand's **Document track**
(`brand-assets/design/documents.md`, `css/print.css`), not the web/presentation
track — no new tokens.

- **Palette:** brand neutrals only — Enoki `#E0D6C9`, Oyster `#BDB6AD`, Porcini `#908375`, Morel `#7A736A` — with near-black document text `#1A1A1A` on white. **No data/accent colour:** the logo is the only colour on the page, so every document reproduces identically in greyscale.
- **Type:** **Arial** for titles, body, tables and Arabic alike; **Liberation Sans** (metrically identical, open) substitutes on Linux/CI build boxes. No embedded web fonts.
- **Logos:** `oxmed-01-horizontal` (Morel) in the running header; `oxmed-02-vertical` on the manual cover.
- **Tone:** clinical and quiet. Porcini/Oyster hairline rules, generous margins, no heavy fills. Status, caution and witness cues are signalled by weight, the neutral palette and wording — never by hue. Caution/critical-step callouts are a quiet Enoki panel with a Morel rule. Test every document with one black-&-white print: it must look identical to colour.

---

## 10. Governance and review

- **Approval roles:** Author (embryologist) → Reviewer (Quality Manager / senior embryologist) → Approver (Medical Director, Scott). All three recorded in front-matter and on the signature block. Transformed TFP content is **re-approved under OMK**, not inherited (§8 note).
- **Review cycle:** 2 years default; immediate review on guideline change (e.g. new Istanbul Consensus / WHO manual), equipment or media change, or post-incident — and ahead of the Accreditation Canada Diagnostics assessment (4-year cycle, biennial assessment).
- **Version rule:** minor wording → x.1; material procedure change → whole-number increment + `supersedes` set + change-history row.
- **Training:** issuing/revising an SOP generates a training-acknowledgment requirement, tracked via OMK-SOP-EMB-0006 and its log.
- **Controlled-copy discipline:** footer states printed copies are uncontrolled; a physical stamp/register controls any printed master.

---

## 11. Phased delivery

| Phase | Scope | Definition of done |
|---|---|---|
| **0 — Scaffold + proof** | Repo, brand template, furniture, front-matter schema, validator, **ingest + build + register** pipeline, CI. Ship with **fully-worked, transformed real SOPs** (not stubs): `OMK-SOP-EMB-0024` ICSI, `OMK-SOP-EMB-0021` TVOR, `OMK-SOP-EMB-0040` Blastocyst vitrification, `OMK-SOP-EMB-0002` Witnessing, plus one bilingual form `OMK-FORM-AND-0014`, `OMK-APP-A`, `OMK-APP-B`. Each ships with its `*.transform.md` report. | `npm run ingest` converts a TFP `.docx` to a reviewed `.md`; `npm run build` produces branded A4 PDFs; `npm run build:manual` produces a bound manual with auto-TOC + register; CI green. |
| **1 — Quality & governance** | OMK-POL-EMB-0001, SOP-0002→0006 + policies | Transformed/authored, reviewed, approved |
| **2 — Andrology** | OMK-SOP/FORM-AND-0010→0015 | " |
| **3 — Oocyte & embryo** | OMK-SOP-EMB-0020→0032 | " |
| **4 — Cryobiology** | OMK-SOP-EMB-0040→0045 | " |
| **5 — Forms, logs, binding, QA** | OMK-FORM/LOG-EMB-0050→0054; final manual assembly; register sign-off; Appendix A locally verified | Manual OMK-MAN-EMB-0001 issued v1.0 |

For each phase Claude Code **ingests the matching TFP files, applies §8, and produces transform reports**; Scott/QM review and approve. Gaps (no TFP source) are authored to ISO 15189.

---

## 12. Kickoff prompt for Claude Code (paste this)

> Create a new repository `embryology` implementing the build system in `PLAN.md` (repo root). Do **Phase 0 only**.
>
> 1. Scaffold the directory structure in §6, including `source/tfp/` and `scripts/ingest.mjs`.
> 2. Implement the **ingest pipeline** (§7, §8): convert a TFP `.docx` to Markdown + YAML front-matter via mammoth/pandoc, preserving tables and dish-layout figures; apply the §8 transformation rules; write the draft `.md` **and** a `*.transform.md` report listing every stripped/flagged line. Nothing auto-publishes.
> 3. Implement the render pipeline (Markdown → A4 PDF via Puppeteer + Paged.js), the front-matter validator (§3.2), the document register (§3.4), and the manual assembler.
> 4. Implement brand CSS (§9) with Oxford Medical v2.4 Document-track tokens; Arial / Liberation Sans (no embedded fonts); `oxmed-01-horizontal` in header, `oxmed-02-vertical` on cover.
> 5. Implement page furniture per §3.3: header band; TFP-style footer rebased to OMK (`docId · version · issued-by · review-due · Page X of Y` + controlled-copy notice); first-page metadata + amendment-history tables; signature block; DRAFT/SUPERSEDED watermark logic.
> 6. Author the house SOP template (§4) and produce these **fully-worked transformed documents** as proof: `OMK-SOP-EMB-0024` (ICSI), `OMK-SOP-EMB-0021` (TVOR), `OMK-SOP-EMB-0040` (Blastocyst vitrification), `OMK-SOP-EMB-0002` (Witnessing), one bilingual form `OMK-FORM-AND-0014` (EN / Khaleeji Arabic, RTL), `OMK-APP-A`, `OMK-APP-B`. Transform from the TFP `.docx` sources following §8 — **keep all clinical values, dish layouts, media, timings and witnessing steps verbatim; strip Q-Pulse/HFEA/donor/surrogacy/multi-site framing; set `sourceDoc` provenance.** Do **not** generate donor or surrogacy content (§1, §5.0).
> 7. Create the remaining register entries from §5 as **front-matter-complete stubs** (body = section headings + `TODO: ingest from <TFP source>` or `TODO: author (no TFP source)`).
> 8. Add the GitHub Actions workflow (lint + build, attach PDFs to a release).
> 9. Provide the `npm run` scripts in §7 and a `README.md` covering: how to ingest a TFP doc, how to author a new SOP, and how to build.
>
> Confirm the `OMK-<TYPE>-<DEPT>-####` numbering before generating IDs. Stop after Phase 0 and report what was built, plus any §8 flags needing Scott's decision.

---

## 13. Open items for Scott

1. **Dept code:** single `EMB` for the whole lab, or split `EMB` / `AND` for andrology (register reflects the split — confirm or collapse).
2. **MoH mapping:** which TFP/HFEA regulatory statements have a Kuwait MoH equivalent vs should be removed (the ingest reports will surface each one).
3. **TFP licensing/attribution:** confirm the cross-entity expectation for adopting TFP SOPs at OMK (provenance field assumed sufficient — verify).
4. **Genetics provider** for PGT in Kuwait (TFP doc flags "yet to be selected").
5. **Approval names/roles** for the signature block and Quality Manager identity.
6. **RI Witness + Vitrolife** firmware/media versions installed, so Appendix A setpoints are tagged to the exact configuration.

---

*v2 — June 2026. Supersedes v1 (IVF-Store-sourced). Primary source: TFP embryology SOP corpus. Accreditation target: Accreditation Canada Diagnostics (ISO 15189 Plus).*
