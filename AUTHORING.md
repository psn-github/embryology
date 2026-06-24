# Authoring guide — Embryology Laboratory document suite

This guide is the contract every document follows. Read it before adding or
editing content. It exists so that documents written by different authors (or
at different times) are indistinguishable in structure, voice and furniture.

## 1. Front-matter schema (every document)

```yaml
---
docId: ELB-SOP-027                 # ELB-<CAT>-<seq>; CAT ∈ SOP|POL|FORM|LOG|APP|MAN
title: Intracytoplasmic Sperm Injection (ICSI)
category: SOP                      # SOP | POL | FORM | LOG | APP | MAN
department: Embryology Laboratory
site: Oxford Medical Kuwait — Bneid Al-Qar
version: "1.0"
status: Draft                      # Draft | In Review | Approved | Superseded
effectiveDate: 2026-07-01          # ISO YYYY-MM-DD (quote to keep it a string)
nextReviewDate: 2028-07-01         # default +2 years
author: ""                         # left blank for Scott / QM to fill on sign-off
reviewedBy: ""
approvedBy: "Prof Scott M Nelson, Medical Director"
supersedes: ""
relatedDocuments: [ELB-LOG-008, ELB-APP-A]   # MUST resolve to real docIds
guidelineRefs: ["ESHRE 2015", "ASRM 2022", "Istanbul Consensus"]
bilingual: false                   # true → bilingual EN/Arabic RTL form layout
changeHistory:
  - version: "1.0"
    date: 2026-07-01
    author: ""
    summary: "Initial issue."
---
```

**Validator rules (`npm run lint`):** mandatory fields present; `category`/`status`
from the allowed sets; `effectiveDate`/`nextReviewDate` ISO; no duplicate `docId`;
every `relatedDocuments` entry resolves. Dates are best quoted (`"2026-07-01"`).

## 2. House SOP section order (PLAN.md §4)

Author the Markdown body under these fixed `##` headings, in this order. Omit a
heading only where it genuinely does not apply (e.g. *Acceptance/rejection* for a
purely administrative SOP).

1. Purpose
2. Scope
3. Responsibilities
4. Definitions & abbreviations *(only where needed)*
5. Equipment, materials & media *(with IFU cross-reference)*
6. Pre-procedure checks
7. Procedure *(numbered, imperative voice)*
8. Critical control points & witnessing *(explicit witness checkpoints; RI Witness)*
9. Acceptance / rejection criteria *(where applicable)*
10. Deviations *(link ELB-POL-006 + the deviation log ELB-LOG-023)*
11. Records generated
12. Guideline-linked & locally-defined values *(point to Appendix A)*
13. References
14. Teaching point

Policies use a lighter order: Purpose · Scope · Policy statements · Responsibilities ·
Records · Deviations · Guideline-linked & locally-defined values · References · Teaching point.

## 3. Numbering registers (fixed — do not renumber)

| Category | Range used |
|---|---|
| SOP | ELB-SOP-001 … ELB-SOP-044 (PLAN.md §5) |
| Policy | ELB-POL-001 … ELB-POL-009 |
| Form (patient-facing, several bilingual) | ELB-FORM-001 … |
| Log / worksheet (internal, English) | ELB-LOG-001 … |
| Appendix | ELB-APP-A, ELB-APP-B |

**Convention decided for this suite:** patient-facing fillable documents are
`ELB-FORM`; internal lab worksheets/records/logs are `ELB-LOG`. (So the ICSI
injection record is `ELB-LOG-008`, not a form.) See `manual.config.yml` and the
register for the live list.

## 4. Voice & branding (Oxford Medical, PLAN.md §8)

- **Clinical and quiet.** Short, declarative sentences. Imperative voice in
  procedures ("Confirm…", "Transfer…"). No filler, no marketing tone.
- **Caution / critical steps** use a Markdown blockquote (`>`), which renders as a
  thin Garnet left-border callout — never a heavy filled box. Reserve it for
  genuine safety/identity/critical-control points.
- **Witness checkpoints** are explicit and numbered (W1, W2…) and tie to ELB-SOP-002.
- **Every number** is either guideline-anchored or marked locally-defined and put
  in Appendix A (ELB-APP-A). Never bury a setpoint in prose as a bare number with
  no source — point to Appendix A and add the row there (flag local values 🔧).
- **No donor / surrogacy content.** Autologous gametes only.

## 5. Bilingual forms (EN / Khaleeji Arabic, PLAN.md §2.1)

Set `bilingual: true`. Author paired content as HTML tables with `class="bi"`,
one `.en` cell and one `.ar` cell per row; `brand.css` renders `.ar` RTL in the
Arabic face. Add `TODO(translation)` — Arabic must be verified by a qualified
medical translator before clinical use.

## 6. Build

```bash
npm run lint
npm run build:doc -- --doc ELB-SOP-027
npm run build           # everything + register
npm run build:manual    # bound manual
```
