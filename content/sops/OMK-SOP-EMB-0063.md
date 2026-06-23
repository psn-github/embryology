---
docId: OMK-SOP-EMB-0063
title: Digital Gas Analyser Use
category: SOP
department: Embryology Laboratory
site: Oxford Medical Kuwait
version: "1.0"
status: Draft
effectiveDate: "2026-07-01"
nextReviewDate: "2028-07-01"
author: ""
reviewedBy: ""
approvedBy: "Prof Scott M Nelson, Medical Director"
supersedes: ""
sourceDoc: ""
witnessSystem: "RI Witness"
relatedDocuments: [OMK-SOP-EMB-0060, OMK-SOP-EMB-0062, OMK-SOP-EMB-0066, OMK-SOP-EMB-0065, OMK-LOG-EMB-0062, OMK-LOG-EMB-0063, OMK-SOP-EMB-0005, OMK-APP-EMB-A]
guidelineRefs: ["ESHRE 2015", "ISO 15189"]
bilingual: false
changeHistory:
  - version: "1.0"
    date: "2026-07-01"
    author: ""
    summary: "Initial issue."
---

> **TODO(no-tfp-source): author to ISO 15189.** This document has no TFP source; the content below is an unverified first draft carried over for structure and must be authored/validated under OMK governance before issue.

## 1. Purpose

To define the correct use of the digital gas analyser for independent verification of incubator CO₂ (and, where applicable, O₂) concentration, so that incubator gas conditions are confirmed against a traceable instrument rather than the incubator's own sensor alone. Correct sampling technique and a current verification status are what make the analyser's reading trustworthy.

## 2. Scope

Applies to all use of the digital gas analyser to verify incubators and gas conditions in the Embryology Laboratory supporting culture of the patient couple's own gametes and embryos (autologous only). Covers measurement, recording and the analyser's own verification. The incubator checks the analyser supports are detailed in OMK-SOP-EMB-0062; overarching QC in OMK-SOP-EMB-0060. Donor and surrogacy material is out of scope.

## 3. Responsibilities

- **Embryologist on duty** — operates the analyser per this SOP and its IFU, records the result on OMK-LOG-EMB-0062 and signs the entry.
- **Quality Manager** — ensures the analyser is verified/serviced at the defined interval and that its verification status is current (OMK-LOG-EMB-0063) before use.
- **Senior embryologist / Laboratory Lead** — reviews readings, investigates discrepancies between analyser and incubator sensor.

## 4. Definitions & abbreviations

| Term | Definition |
|---|---|
| Gas analyser | Portable digital instrument measuring CO₂ (± O₂) concentration in a gas sample |
| Verification | Confirmation that the analyser reads correctly, by check against a reference gas or per IFU service |
| Sensor drift | Gradual change in a sensor's reading over time, corrected by verification/calibration |
| QC | Quality control |

## 5. Equipment, materials & media

- Digital gas analyser with current verification status (interval per Appendix A 🔧 and IFU).
- Sampling line/probe and any required filters or moisture traps, fitted per IFU.
- Reference/span gas of known concentration where the IFU specifies a pre-use check.
- Gas analyser QC log — OMK-LOG-EMB-0062; calibration/verification status — OMK-LOG-EMB-0063.

> **IFU cross-reference.** Sampling flow rate, line length, warm-up time, moisture handling and the verification routine are defined by the manufacturer IFU. Departing from the IFU sampling method invalidates the reading; follow it exactly.

## 6. Pre-procedure checks

1. Confirm the analyser is within its verification interval (OMK-LOG-EMB-0063); do not use an overdue instrument.
2. Power on and allow full warm-up/self-test per the IFU before any measurement.
3. Where the IFU requires it, confirm the analyser against a reference gas or the built-in check, and record the result.
4. Inspect the sampling line, connectors and filter for damage, moisture or kinking.

## 7. Procedure

1. Connect the sampling probe to the incubator sampling port per the incubator and analyser IFU, minimising the time the chamber is open or disturbed.
2. Start sampling and allow the displayed CO₂ (and O₂, if measured) to **stabilise** for the time specified in the IFU.
3. Record the stabilised value, the incubator's displayed value, the chamber identity, the date and time on **OMK-LOG-EMB-0062**.
4. Compare the measured CO₂ against the acceptable range — set to achieve target media pH **7.2–7.4** (ESHRE 2015) — with the locally defined tolerance 🔧 (Appendix A), and against the incubator's own sensor.
5. Disconnect, purge the line if required by the IFU, and return the analyser to its charging/storage state.
6. If the measured value is out of range, or disagrees with the incubator sensor beyond tolerance, follow Section 10.
7. Use the analyser at the verification frequency for incubator checks defined in Appendix A 🔧 and OMK-SOP-EMB-0062, and additionally after any gas-cylinder change or suspected incubator gas fault.

## 8. Critical control points & witnessing

Gas-analyser QC does not require a second-person identity witness; every measurement record must nonetheless be **signed and timed** (OMK-SOP-EMB-0004).

> **CRITICAL CONTROL POINT.** A measured CO₂ outside the acceptable range, or an analyser reading that disagrees with the incubator sensor beyond tolerance, is a stop condition for that chamber (OMK-SOP-EMB-0062). Confirm gas adequacy ultimately against media pH (OMK-SOP-EMB-0065), and do not return the chamber to culture use until reconfirmed in range.

| Checkpoint | What is verified | Method |
|---|---|---|
| **C1** | Analyser is within verification interval before use | OMK-LOG-EMB-0063 check |
| **C2** | Measured CO₂ agrees with incubator sensor within tolerance | Comparison recorded on OMK-LOG-EMB-0062 |
| **C3** | Result reviewed and signed | Log entry on OMK-LOG-EMB-0062 |

## 9. Acceptance / rejection criteria

- **Accept** the reading when the analyser is in-verification, the value has stabilised and it falls within the acceptable range and agrees with the incubator sensor within tolerance.
- **Reject** the reading when the analyser is overdue for verification, has not stabilised, or shows moisture/line faults; reject the **chamber** when the verified measured CO₂ is out of range.

## 10. Deviations

An out-of-range measurement, analyser-versus-incubator disagreement beyond tolerance, or a failed pre-use verification is managed under the deviation and CAPA policy (OMK-SOP-EMB-0005) and logged in the deviation log (OMK-SOP-EMB-0005). Withdraw a faulty analyser from service, arrange verification/repair, and record the action. Where culture material may have been affected, escalate per OMK-POL-EMB-0004.

## 11. Records generated

- Gas analyser QC log (measurements, comparisons) — **OMK-LOG-EMB-0062**.
- Analyser calibration/verification status — **OMK-LOG-EMB-0063**.
- Any deviation entry — **OMK-SOP-EMB-0005**.

## 12. Guideline-linked & locally-defined values

The target media pH **7.2–7.4** to which CO₂ is set is **guideline-anchored** (ESHRE 2015). The analyser **verification interval**, the acceptable CO₂ percentage and **tolerance**, and the verification frequency for incubator checks are **locally defined** (flagged 🔧 in **Appendix A (OMK-APP-EMB-A)**). Calibration traceability of the analyser is maintained per ISO 15189.

## 13. References

- ESHRE Guideline Group on Good Practice in IVF Labs. *Revised guidelines for good practice in IVF laboratories (2015).*
- ISO 15189 — Medical laboratories: requirements for quality and competence (equipment calibration, traceability, QC records).

## 14. Teaching point

A gas analyser is only as good as its last verification and its sampling discipline. Moisture in the line, a reading taken before stabilisation, or an analyser overdue for service will all give a confident number that means nothing. Use the analyser to challenge the incubator sensor, not to confirm it — and remember the embryo cares about pH, which the gas reading only predicts.
