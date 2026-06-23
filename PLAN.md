# Oxford Medical Kuwait — Embryology Laboratory Document Suite
### Build plan for Claude Code

**Repository (proposed):** `psn-github/embryology`
**Owner / Approver:** Prof Scott M Nelson, BSc MBChB PhD MRCOG — Medical Director, Oxford Medical Kuwait
**Output:** A4 controlled documents (PDF primary, DOCX optional), individually and as a bound manual, fully branded to Oxford Medical v2.3, version-controlled in Git.
**Status of this document:** Master build brief. Hand to Claude Code to scaffold the repo and Phase 0. SOP content to be supplied incrementally by Scott.

---

## 1. Purpose and design principles

Build a maintainable, auditable suite of embryology/IVF-laboratory SOPs, policies, forms and logs for Oxford Medical Kuwait that:

1. **Separates content from presentation.** Each document is authored once as Markdown + YAML front-matter (the single source of truth). A render pipeline applies Oxford Medical branding and all document-control furniture. We never hand-format a PDF.
2. **Diffs cleanly in Git.** Markdown source means every wording change is reviewable in a pull request. (This is why we do *not* lead with the Node/`docx` approach used for the IC-01→IC-60 suite — binary `.docx` does not diff. DOCX is retained only as an optional export target for editable handoff, see §7.)
3. **Makes adding an SOP trivial.** Drop a new `.md` file in `/content/sops/`, fill the front-matter, run `npm run build`. The manual, the table of contents, the cross-references and the document register all regenerate automatically.
4. **Is print-true to A4** with correct margins, headers, footers, page-of-total numbering and a "controlled copy" stamp.
5. **Anchors every clinical value to a published guideline** and flags every value that must be set locally (the source manual's Appendix A pattern — kept and strengthened).

**Scope boundary.** The suite covers autologous ART using the couple's own gametes. Third-party gamete donation and surrogacy are out of scope and no donor/surrogacy SOPs, forms or workflows are generated.

---

## 2. Regulatory and best-practice framework

Anchor the suite to international best practice and a chosen laboratory-quality standard rather than to the US framework the source manual uses (it cites FDA 21 CFR 1271, OSHA, HIPAA and CLIA — none of which apply here):

| Layer | Reference |
|---|---|
| IVF laboratory best practice | ESHRE Revised guidelines for good practice in IVF laboratories (2015); ASRM comprehensive embryology/andrology laboratory committee opinion (2022) |
| Oocyte / zygote / embryo morphology & grading | ESHRE/ALPHA Istanbul Consensus (current version) |
| Laboratory quality management | ISO 15189 — and/or the JCI accreditation pathway |
| Hazard communication | GHS labelling and safety-data-sheet standard |
| Electronic witnessing | RI Witness (the installed system) |
| Local regulatory requirements | Applied as required by the authority under which the clinic is licensed |

Every quantitative value in the suite is either (a) traceable to one of the best-practice references above, or (b) explicitly set locally and recorded in Appendix A. No value is left implicit.

### 2.1 Localisation decision for sign-off

**Bilingual scope.** SOPs, policies and internal logs stay **English** (technical, staff-facing). Patient-facing forms and consents (cryopreservation consent, procedure consent acknowledgments, disposition election) should be **bilingual EN / Khaleeji Arabic**, run through the bilingual clinical formatter with RTL layout. The build pipeline supports a `bilingual: true` front-matter flag that switches the form template to a stacked/two-column RTL layout.

---

## 3. Document-control system

### 3.1 Numbering scheme (category-prefixed — configurable)

Forms and SOPs maintain **separate registers**, so IDs carry a category. Proposed prefix root `ELB` (Embryology LaBoratory):

| Category | Prefix | Example | Notes |
|---|---|---|---|
| Bound manual | `ELB-MAN` | `ELB-MAN-001` | The assembled manual as a controlled document in its own right |
| Standard operating procedure | `ELB-SOP` | `ELB-SOP-027` (ICSI) | Zero-padded to 3 digits |
| Policy | `ELB-POL` | `ELB-POL-006` | |
| Form (fillable) | `ELB-FORM` | `ELB-FORM-012` | |
| Log / worksheet | `ELB-LOG` | `ELB-LOG-003` | |
| Appendix | `ELB-APP` | `ELB-APP-A` | |

> Numbers are assigned by **category sequence**, not by manual chapter order — so inserting a new SOP later does not renumber existing ones. Manual ordering is controlled separately in `manual.config.yml` (§6).

### 3.2 Front-matter schema (every document)

```yaml
---
docId: ELB-SOP-027
title: Intracytoplasmic Sperm Injection (ICSI)
category: SOP                 # SOP | POL | FORM | LOG | APP | MAN
department: Embryology Laboratory
site: Oxford Medical Kuwait — Bneid Al-Qar
version: "1.0"
status: Draft                 # Draft | In Review | Approved | Superseded
effectiveDate: 2026-07-01
nextReviewDate: 2028-07-01     # default 2-year cycle; sooner on guideline change
author: ""
reviewedBy: ""                # Quality Manager / senior embryologist
approvedBy: "Prof Scott M Nelson, Medical Director"
supersedes: ""                # docId + version of prior, if any
relatedDocuments: [ELB-FORM-012, ELB-LOG-006, ELB-POL-007]
guidelineRefs: ["ESHRE 2015", "ASRM 2022", "Istanbul Consensus"]
bilingual: false
changeHistory:
  - version: "1.0"
    date: 2026-07-01
    author: ""
    summary: "Initial issue"
---
```

A **validator** (`npm run lint`) refuses to build any document with missing mandatory fields, a non-ISO date, a duplicate `docId`, or a `relatedDocuments` entry that doesn't resolve to a real file.

### 3.3 Page furniture (applied automatically by the template)

- **Header:** Oxford Medical horizontal logo (left); document title + `docId` (right); thin Porcini rule beneath.
- **Footer:** `docId` · `v{version}` · `Effective {effectiveDate}` · `Page X of Y` · `CONTROLLED DOCUMENT — printed copies are uncontrolled unless stamped`.
- **First page block:** title, full metadata table (owner, approver, version, effective/review dates, status), and the **change-history table** rendered from front-matter.
- **Signature block:** Authored / Reviewed / Approved rows with name, role, signature space, date.
- **Watermark:** `status: Draft` → faint "DRAFT" diagonal; `Superseded` → "SUPERSEDED". `Approved` → clean.
- **Cross-references** to `relatedDocuments` render as live links in the manual PDF and as plain `docId` in standalone PDFs.

### 3.4 Auto-generated document register

`npm run register` reads the front-matter of every file and emits `dist/register.csv` and a printable `ELB-MAN` front-section table: docId, title, category, version, status, effective date, next review date, approver. This is the master index and the audit artefact.

---

## 4. Standard SOP anatomy (house template)

Standardised section order, adapted from the source manual and tightened for ISO 15189 expectations:

1. **Purpose**
2. **Scope** (which cases/specimens/areas)
3. **Responsibilities** (who is trained/authorised/competent to perform)
4. **Definitions & abbreviations** (only where needed)
5. **Equipment, materials & media** (with IFU cross-reference)
6. **Pre-procedure checks** ("what to confirm before you begin")
7. **Procedure** (numbered, imperative voice)
8. **Critical control points & witnessing** (explicit witness checkpoints; RI Witness steps)
9. **Acceptance / rejection criteria** (where applicable)
10. **Deviations** (link to `ELB-POL` deviation policy + `ELB-LOG` deviation log)
11. **Records generated** (which forms/logs this SOP produces)
12. **Guideline-linked values** (Appendix A pointer) and **locally-defined values** (explicit, with current local setpoints)
13. **References**
14. **Teaching point** (retained — good for training; keeps the source manual's "what trainees should understand" flavour)

A `templates/sop.html` partial enforces this order; authors fill the Markdown body under fixed headings.

---

## 5. Embryology SOP register (proposed)

Mapped from the source manual, regrouped into seven domains. This is the target backlog; Claude Code scaffolds the files as stubs, you supply content.

### A. Quality & governance
| docId | Title |
|---|---|
| ELB-SOP-001 | Recordkeeping and documentation |
| ELB-SOP-002 | Witnessing workflow (manual + RI Witness electronic witnessing) |
| ELB-SOP-003 | Deviation handling and corrective/preventive action |
| ELB-SOP-004 | Adverse events and root-cause analysis |
| ELB-SOP-005 | Embryologist training and competency assessment |
| ELB-SOP-006 | Quality control and equipment maintenance (overview) |
| ELB-SOP-007 | Inventory and consumables control |

### B. Laboratory environment & safety
| docId | Title |
|---|---|
| ELB-SOP-008 | Laboratory daily opening, preparation and closing |
| ELB-SOP-009 | Sterile technique |
| ELB-SOP-010 | Sterile filtration |
| ELB-SOP-011 | Glassware sterilisation |
| ELB-SOP-012 | Sterilisation guidelines |
| ELB-SOP-013 | Air quality and VOC/TVOC monitoring |
| ELB-SOP-014 | Chemical hygiene |
| ELB-SOP-015 | Biohazardous waste handling |

### C. Identification, labelling & traceability
| docId | Title |
|---|---|
| ELB-SOP-016 | Patient, gamete and embryo identification and labelling |
| ELB-SOP-017 | Chain of custody |

### D. Andrology
| docId | Title |
|---|---|
| ELB-SOP-018 | Semen sample receipt and tracking |
| ELB-SOP-019 | Sperm preparation — ejaculated samples |
| ELB-SOP-020 | Sperm preparation — frozen samples |
| ELB-SOP-021 | Sperm preparation — surgical/testicular sperm |
| ELB-SOP-022 | Sperm preparation — intrauterine insemination (IUI) |
| ELB-SOP-023 | Sperm cryopreservation |

### E. Oocyte & embryo procedures
| docId | Title |
|---|---|
| ELB-SOP-024 | Oocyte retrieval |
| ELB-SOP-025 | Conventional insemination |
| ELB-SOP-026 | Hyaluronidase treatment and oocyte denudation |
| ELB-SOP-027 | Intracytoplasmic sperm injection (ICSI) |
| ELB-SOP-028 | Determination of fertilisation |
| ELB-SOP-029 | Oocyte, zygote and embryo morphology grading (Istanbul Consensus) |
| ELB-SOP-030 | Assisted hatching |
| ELB-SOP-031 | Embryo biopsy for PGT |
| ELB-SOP-032 | Embryo transfer |

### F. Cryobiology
| docId | Title |
|---|---|
| ELB-SOP-033 | Embryo cryopreservation / vitrification |
| ELB-SOP-034 | Oocyte vitrification |
| ELB-SOP-035 | Embryo and oocyte warming |
| ELB-SOP-036 | Liquid nitrogen storage tanks |
| ELB-SOP-037 | LN₂ storage, use, transport and tank monitoring |

### G. Equipment & monitoring
| docId | Title |
|---|---|
| ELB-SOP-038 | Temperature monitoring |
| ELB-SOP-039 | Incubator temperature and CO₂ checks |
| ELB-SOP-040 | Digital gas analyser use |
| ELB-SOP-041 | Thermometer calibration |
| ELB-SOP-042 | pH meter calibration and use |
| ELB-SOP-043 | CO₂ incubator operation |
| ELB-SOP-044 | Laminar flow hood operation |

### Policies (`ELB-POL`)
Exposure control · Occupational safety & hazard communication · Latex allergy · Manufacturer recalls & product alerts · Adverse events · Deviation & CAPA · Cryostorage security & access · Patient confidentiality · Informed consent.

### Forms & logs (`ELB-FORM` / `ELB-LOG`)
Patient/cycle documentation; lab cycle checklist; cryopreservation consent (bilingual); procedure consent acknowledgments (bilingual); semen receipt log; semen analysis worksheet; sperm prep worksheets; sperm cryo + post-thaw record; oocyte retrieval worksheet; insemination/ICSI record; fertilisation assessment record; embryo culture & development record; assisted-hatching record; biopsy record; transfer record; vitrification records (embryo/oocyte); warming record; cryostorage inventory; specimen disposition/transfer record; QC logs (incubator, gas analyser, calibration, LN₂ fill, air quality); deviation log; recall log; adverse-event report.

### Appendices (`ELB-APP`)
- **APP-A** — Guideline-linked values vs locally-defined completion points (incubation gas mix, pH, temperature setpoints, equilibration times, post-thaw survival thresholds, TVOC range, etc.). **The strongest feature of the source manual — kept.**
- **APP-B** — Source documents / reference bibliography.

---

## 6. Repository structure

```
embryology/
├── README.md                 # how to author + build (for staff/contributors)
├── PLAN.md                   # this document
├── package.json
├── manual.config.yml         # manual front-matter + ordered list of docIds for the bound manual
├── content/
│   ├── sops/        ELB-SOP-###.md
│   ├── policies/    ELB-POL-###.md
│   ├── forms/       ELB-FORM-###.md
│   ├── logs/        ELB-LOG-###.md
│   └── appendices/  ELB-APP-*.md
├── templates/
│   ├── sop.html      # Handlebars/EJS — wraps body, injects furniture
│   ├── form.html     # supports bilingual RTL layout
│   ├── manual.html   # cover + auto-TOC + concatenated docs + register
│   └── register.html
├── styles/
│   ├── brand.css     # Oxford Medical v2.3 tokens + @page A4 rules
│   └── fonts/        # Cormorant Garamond, Inter Tight, Plus Jakarta Sans
├── assets/brand/
│   ├── Logo_01_RGB.svg   # horizontal (header)
│   ├── Logo_02_RGB.svg   # vertical (cover)
│   └── watermarks/
├── scripts/
│   ├── build.mjs        # build all → dist/pdf
│   ├── render.mjs        # build one: --doc ELB-SOP-027
│   ├── manual.mjs        # assemble bound manual
│   ├── register.mjs      # generate document register
│   └── validate.mjs      # front-matter + cross-ref linter
├── dist/                 # gitignored; PDFs, DOCX, register.csv
└── .github/workflows/
    └── build.yml         # CI: lint + build on push; attach PDFs to release
```

---

## 7. Render pipeline

**Primary:** Markdown → HTML (via `markdown-it` + template) → **A4 PDF** via headless Chromium (`puppeteer`) with **Paged.js** for correct page boxes, running headers/footers and `Page X of Y`. This gives pixel control over A4 furniture and brand typography that `docx` cannot match.

**Secondary (optional):** the same Markdown → `.docx` via `pandoc` with an Oxford reference template, for anyone who needs an editable Word file. Triggered by `npm run build:docx`. Not the source of truth.

### npm scripts
```
npm run lint            # validate all front-matter + cross-references
npm run build           # all documents → dist/pdf/*.pdf
npm run build:doc -- --doc ELB-SOP-027   # single document
npm run build:manual    # bound manual ELB-MAN-001.pdf (cover, TOC, register, all docs)
npm run build:register  # dist/register.csv + printable index
npm run build:docx      # optional Word export
npm run watch           # rebuild on save (authoring)
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

## 8. Branding (Oxford Medical v2.3)

Apply the existing brand system — no new tokens.

- **Palette:** Enoki `#E0D6C9`, Oyster `#BDB6AD`, Porcini `#908375`, Morel `#7A736A`; data accents Garnet / Emerald / Lapis / Saffron (used only for status chips and caution callouts).
- **Type:** Cormorant Garamond (document titles / cover), Inter Tight (body and UI), Plus Jakarta Sans (tables/labels). Embed fonts in the PDF.
- **Logos:** `Logo_01_RGB` horizontal in the running header; `Logo_02_RGB` vertical on the manual cover.
- **Tone:** clinical and quiet. Porcini hairline rules, generous margins, no heavy fills. Caution/critical-step callouts use a thin Garnet left-border, not a filled box.

---

## 9. Governance and review

- **Approval roles:** Author (embryologist) → Reviewer (Quality Manager / senior embryologist) → Approver (Medical Director, Scott). All three recorded in front-matter and on the signature block.
- **Review cycle:** 2 years default; immediate review on guideline change (e.g., new Istanbul Consensus), equipment change, or post-incident.
- **Version rule:** minor wording → x.1; material change to procedure → whole-number increment + `supersedes` set + change-history row.
- **Training:** issuing/revising an SOP generates a training-acknowledgment requirement; tracked via the training SOP (ELB-SOP-005) and its log.
- **Controlled-copy discipline:** the footer states printed copies are uncontrolled; a physical stamp/register controls any printed master.

---

## 10. Phased delivery

| Phase | Scope | Definition of done |
|---|---|---|
| **0 — Scaffold** | Repo, brand template, furniture, front-matter schema, validator, build + register pipeline, CI. Ship with **one fully worked example of each type**: ELB-SOP-027 (ICSI), ELB-POL (consent), ELB-FORM (ICSI record, bilingual), ELB-APP-A, ELB-APP-B. | `npm run build` produces branded A4 PDFs; `npm run build:manual` produces a bound manual with auto-TOC and register; CI green. |
| **1 — Governance layer** | ELB-SOP-001→007 + all policies | Authored, reviewed, approved |
| **2 — Environment & traceability** | ELB-SOP-008→017 | " |
| **3 — Andrology** | ELB-SOP-018→023 | " |
| **4 — Oocyte & embryo** | ELB-SOP-024→032 | " |
| **5 — Cryobiology & equipment** | ELB-SOP-033→044 | " |
| **6 — Forms, logs, binding, QA** | Full form/log set; final manual assembly; register sign-off | Manual ELB-MAN-001 issued v1.0 |

Scott supplies SOP content per phase; Claude Code converts to the house template, wires cross-references, and builds.

---

## 11. Kickoff prompt for Claude Code (paste this)

> Create a new repository `embryology` implementing the build system specified in `PLAN.md` (in repo root). Do **Phase 0 only**.
>
> 1. Scaffold the directory structure in §6.
> 2. Implement the render pipeline in §7 (Markdown + YAML front-matter → A4 PDF via Puppeteer + Paged.js), the front-matter validator (§3.2), the document register generator (§3.4), and the manual assembler.
> 3. Implement the brand CSS (§8) using Oxford Medical v2.3 tokens; embed Cormorant Garamond, Inter Tight, Plus Jakarta Sans; place `Logo_01_RGB` in the header and `Logo_02_RGB` on the manual cover. Brand assets are in `assets/brand/` — if absent, create labelled placeholders and a TODO.
> 4. Implement page furniture per §3.3: header band, footer with `docId · version · effective date · Page X of Y · controlled-copy notice`, first-page metadata + change-history tables, signature block, and the DRAFT/SUPERSEDED watermark logic.
> 5. Author the house SOP template (§4) and produce these worked documents as proof: `ELB-SOP-027` ICSI, one consent policy, one bilingual form `ELB-FORM-001` (EN / Khaleeji Arabic, RTL), `ELB-APP-A`, `ELB-APP-B`. Use the uploaded IVF Store manual only as a structural reference — rewrite content in Oxford Medical voice and use the framework in §2. Do **not** copy its text. Do **not** generate any donor or surrogacy content (out of scope, §1).
> 6. Create remaining SOP/policy/form/log files from §5 as **stubs** (front-matter complete, body = section headings + `TODO`).
> 7. Add the GitHub Actions workflow (lint + build, attach PDFs to a release).
> 8. Provide `npm run` scripts per §7 and a `README.md` explaining how to author a new SOP and build.
>
> Confirm the numbering scheme and the `ELB` prefix before generating IDs. Stop after Phase 0 and report what was built.

---

## 12. Open items for Scott

1. Confirm prefix root (`ELB`) and numbering style, or give the house convention used by the IC-01 suite for consistency.
2. Confirm accreditation target (ISO 15189 vs JCI) so Appendix A maps cleanly to its evidence requirements.
3. Confirm bilingual scope for patient-facing forms (§2.1).
4. Confirm RI Witness specifics for the witnessing SOP.
5. Confirm review cycle (2 years assumed) and approval roles/names.
