---
docId: OMK-APP-EMB-B
title: "Appendix B — Reference Framework & Bibliography"
category: APP
department: Embryology Laboratory
site: Oxford Medical Kuwait
version: "1.0"
status: Draft
effectiveDate: 2026-07-01
nextReviewDate: 2028-07-01
author: ""
reviewedBy: ""
approvedBy: "Prof Scott M Nelson, Medical Director"
supersedes: ""
sourceDoc: ""
witnessSystem: "RI Witness"
relatedDocuments: [OMK-APP-EMB-A]
guidelineRefs: ["ESHRE 2015", "ASRM 2022", "Istanbul Consensus", "ISO 15189", "GHS"]
bilingual: false
changeHistory:
  - version: "1.0"
    date: 2026-07-01
    author: ""
    summary: "Initial issue. Establishes the reference framework cited throughout the suite."
---

## 1. Purpose

To list, in one controlled place, every external reference the suite is anchored to (PLAN.md §2) and to fix the short citation tokens used in each document's `guidelineRefs`. When a referenced guideline is superseded by a new edition, this appendix is updated and every dependent SOP is flagged for review.

## 2. Reference framework

| Layer | Reference | Citation token |
|---|---|---|
| IVF laboratory best practice | ESHRE Guideline Group. *Revised guidelines for good practice in IVF laboratories.* Human Reproduction, 2015. | `ESHRE 2015` |
| Embryology/andrology laboratory practice | ASRM/SART. *Comprehensive embryology and andrology laboratory committee opinion.* 2022. | `ASRM 2022` |
| Oocyte / zygote / embryo morphology & grading | ESHRE & ALPHA Scientists in Reproductive Medicine. *Istanbul Consensus on embryo assessment* (current version). | `Istanbul Consensus` |
| Semen analysis reference values | WHO laboratory manual for the examination and processing of human semen (current edition). | `WHO` |
| Laboratory quality management | ISO 15189 — Medical laboratories: requirements for quality and competence. (JCI accreditation pathway as alternative/parallel.) | `ISO 15189` |
| Hazard communication | Globally Harmonized System of Classification and Labelling of Chemicals (GHS); safety-data-sheet standard. | `GHS` |
| Electronic witnessing | RI Witness electronic witnessing system — manufacturer documentation. | `RI Witness` |
| Local regulatory requirements | Applied as required by the authority under which the clinic is licensed. | `Local regulatory` |

## 3. Notes on use

- **No US-framework references.** This suite deliberately does **not** cite FDA 21 CFR 1271, OSHA, HIPAA or CLIA; these do not apply to Oxford Medical Kuwait (PLAN.md §2). Equivalent intent is met through ISO 15189 / JCI, GHS and local regulation.
- **Accreditation target.** ISO 15189 is the assumed quality standard; the JCI pathway is noted as an alternative. The chosen target is an open item for sign-off (PLAN.md §12) and determines how Appendix A maps to evidence requirements.
- **Manufacturer IFUs.** Media, oil, consumable and kit Instructions For Use are primary references for the procedures that use them and are cited inline in each SOP rather than listed here.

## 4. Maintenance

When any reference edition changes (e.g. a new Istanbul Consensus or WHO manual), update the row above, bump this appendix's version, and open a review of every document whose `guidelineRefs` contains the affected token. The validator (`npm run lint`) and register (`npm run build:register`) make the dependent set easy to enumerate.
