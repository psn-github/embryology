---
docId: ELB-SOP-002
title: Witnessing Workflow (Manual and RI Witness Electronic Witnessing)
category: SOP
department: Embryology Laboratory
site: Oxford Medical Kuwait — Bneid Al-Qar
version: "1.0"
status: Draft
effectiveDate: "2026-07-01"
nextReviewDate: "2028-07-01"
author: ""
reviewedBy: ""
approvedBy: "Prof Scott M Nelson, Medical Director"
supersedes: ""
relatedDocuments: [ELB-SOP-016, ELB-SOP-017, ELB-SOP-001, ELB-POL-006, ELB-POL-005, ELB-LOG-023, ELB-APP-A]
guidelineRefs: ["ESHRE 2015", "ASRM 2022", "ISO 15189", "RI Witness"]
bilingual: false
changeHistory:
  - version: "1.0"
    date: "2026-07-01"
    author: ""
    summary: "Initial issue."
---

## 1. Purpose

To define the witnessing workflow that prevents the misidentification or mismatching of patients, gametes and embryos at every point where biological material is identified, labelled, combined, moved between vessels, or transferred. This SOP is the witnessing backbone for the suite: all procedural SOPs reference its witness checkpoints. It describes both the **RI Witness electronic witnessing (EW)** system and the **manual two-person** method used as fallback.

## 2. Scope

Applies to every laboratory step involving the **patient couple's own gametes and embryos** (autologous only) where a mismatch could occur — receipt, labelling, preparation, insemination, ICSI, culture transfers, biopsy, vitrification, warming, transfer and storage. Applies to all staff who handle or witness specimens. Donor and surrogacy workflows are out of scope and are not performed. Witnessing of identity at sample receipt and chain of custody is detailed in ELB-SOP-016 and ELB-SOP-017 and is governed by the checkpoints below.

## 3. Responsibilities

- **Performing embryologist (operator)** — initiates each witness event, presents the correct labels/tags, and does not proceed until the match is confirmed.
- **Witness** — a second competent embryologist, or the RI Witness electronic system, that independently confirms identity. A manual witness must be trained and signed off (ELB-SOP-005) and must personally verify the material in front of them, not rely on the operator's word.
- **Laboratory Lead** — ensures adequate witnessing cover, maintains the EW system, and reviews all witness-related deviations.
- **Quality Manager** — audits witnessing compliance and EW downtime records.

## 4. Definitions & abbreviations

| Term | Definition |
|---|---|
| Witness event | A defined point at which identity is independently confirmed before proceeding |
| EW | Electronic witnessing — the RI Witness system, using RFID-tagged dishes and an automatic identity match |
| Manual witness | A second trained person performing an independent read-back identity check |
| Read-back | The witness reads the identifiers aloud from the label/tag and confirms them against the worklist and the operator |
| Mismatch / no-match | The system or witness cannot confirm that all material at the workstation belongs to one patient/couple |
| W-checkpoint | A numbered witness checkpoint (W1, W2…) referenced by procedural SOPs |

## 5. Equipment, materials & media

- RI Witness workstation reader, RFID tags/labels, and the EW database (access-controlled, backed up per vendor IFU).
- Pre-printed, controlled identity labels carrying the patient/couple identifiers (ELB-SOP-016).
- The cycle worklist and the manual witnessing fields on the relevant log (e.g. ELB-LOG-008 for ICSI).

> **IFU cross-reference.** The RI Witness system is configured, tagged and maintained strictly per the vendor instructions. Only validated tag types are used. Do not modify reader placement or workflow assignments outside the configured setup.

## 6. Pre-procedure checks

1. Confirm the EW system is online and the workstation reader is responding before starting a session.
2. Confirm the worklist and the labels match the patients scheduled.
3. Confirm only **one patient's / one couple's** material is open at a workstation at any time.
4. If EW is unavailable, confirm a second trained witness is present **before** starting, and that manual witnessing fields are ready on the record.

> **CRITICAL — single-identity workstation.** Two patients' gametes or embryos are **never** open, uncapped or unlabelled at the same workstation simultaneously. Complete and re-store one patient's material before bringing the next to the bench.

## 7. Procedure

### 7A. Electronic witnessing (RI Witness) — primary method

1. Assign tagged dishes/vessels to the correct patient in the EW system at the start of the cycle.
2. At each witness checkpoint, place the relevant dishes/vessels on the reader.
3. The system performs an automatic identity match and signals a **confirmed match** or a **no-match alarm**.
4. On a **confirmed match**, proceed. The event is logged automatically with operator, time and material.
5. On a **no-match**, stop immediately. Do not proceed. Resolve identity (Section 8), then re-witness.

### 7B. Manual two-person witnessing — fallback method

1. The operator presents the labelled material and states the step about to be performed.
2. The **witness independently reads** the identifiers from each label/tag aloud (read-back), and checks them against the worklist and against the second container being combined or transferred.
3. The witness confirms verbally and **signs the record** at that checkpoint; the operator also signs.
4. Only after the witness has signed does the operator proceed.
5. A witness signs **only** what they have personally verified; signing without checking is a reportable failure.

## 8. Critical control points & witnessing

Witnessing is mandatory at every point where material is identified, labelled, combined, moved between vessels, or transferred. The numbered checkpoints below are the suite-wide reference set; individual SOPs map their steps to these.

| Checkpoint | What is verified | Typical procedural use |
|---|---|---|
| **W1** | Patient/couple identity matches before two specimens are combined (e.g. sperm + oocytes) | Insemination, ICSI (ELB-SOP-025, ELB-SOP-027) |
| **W2** | Material returned to the correctly labelled vessel/position | Culture transfers, post-injection return |
| **W3** | Dish/tag labelling matches the worklist at session end | End-of-session reconciliation |
| **W4** | Identity at receipt and at every change of custody | Sample receipt, chain of custody (ELB-SOP-016, ELB-SOP-017) |
| **W5** | Identity at cryostorage in and out, and at transfer | Vitrification, warming, storage (ELB-SOP-033/034/035) |

> **CRITICAL CONTROL POINT.** A failed, absent or ambiguous witness match is a **stop condition**. Do not proceed on assumption or memory. Halt, secure and re-store the material, resolve the identity question with a second person, then re-witness. Treat any genuine mismatch as a potential adverse event (ELB-POL-005).

### EW downtime fallback

If the RI Witness system fails or is unavailable mid-session:

1. Stop initiating new witness events on the affected workstation.
2. Switch to **manual two-person witnessing** (Section 7B) for all subsequent checkpoints; a second trained witness must be physically present.
3. Record the downtime — start time, reason, affected cycles, and the manual fallback used — as a deviation (ELB-LOG-023).
4. Do not perform identity-critical steps single-handed. If no second witness is available, hold the procedure where clinically safe.
5. Resume EW only after the system is confirmed restored; reconcile any tags assigned during downtime.

## 9. Acceptance / rejection criteria

- **Proceed** only on a confirmed EW match, or a completed and co-signed manual witness check.
- **Reject / stop** on any no-match, any unsigned manual checkpoint, any unlabelled or ambiguously labelled vessel, or any situation where more than one patient's material is open at the workstation.

## 10. Deviations

EW downtime, a no-match event, a missed witness signature, or a single-handed identity step are all managed under the deviation and CAPA policy (ELB-POL-006) and logged in the deviation log (ELB-LOG-023). A confirmed misidentification or mismatch is a reportable adverse event (ELB-POL-005) and triggers root-cause analysis (ELB-SOP-004).

## 11. Records generated

- Automatic EW event log (RI Witness database).
- Manual witnessing signatures captured on the relevant procedural log (e.g. ELB-LOG-008) and the cycle record (ELB-SOP-001).
- EW downtime / no-match deviation entries — **ELB-LOG-023**.

## 12. Guideline-linked & locally-defined values

The **principle** of independent double-witnessing at every identity-critical step is **guideline-anchored** (ESHRE 2015; ASRM 2022; ISO 15189). The defined **W-checkpoint set**, the EW downtime escalation timing, and the minimum witnessing cover are **locally defined** and recorded in **Appendix A (ELB-APP-A)** (flagged 🔧, requiring Medical Director sign-off).

## 13. References

- ESHRE. *Revised guidelines for good practice in IVF laboratories (2015)* — labelling and witnessing.
- ASRM/SART. *Comprehensive embryology and andrology laboratory committee opinion (2022).*
- ISO 15189 — Medical laboratories: requirements for quality and competence (identification, traceability).
- RI Witness electronic witnessing system — vendor configuration and operating instructions.

## 14. Teaching point

Witnessing exists for one reason: the gamete and embryo mix-up is the error that cannot be undone and cannot be hidden behind a result that still looks normal. Electronic witnessing reduces the chance of a missed check, but it does not replace the discipline of one patient at the bench at a time. When the system goes down, the risk does not — it shifts to you. A witness who signs without looking has not witnessed; they have only added a signature to an error.
