---
docId: OMK-LOG-EMB-0063
title: Calibration Log
category: LOG
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
relatedDocuments: [OMK-SOP-EMB-0064, OMK-SOP-EMB-0065, OMK-SOP-EMB-0061, OMK-SOP-EMB-0060, OMK-SOP-EMB-0005, OMK-APP-EMB-A]
guidelineRefs: ["ISO 15189", "ESHRE 2015"]
bilingual: false
changeHistory:
  - version: "1.0"
    date: 2026-07-01
    author: ""
    summary: "Initial issue."
---

> **TODO(no-tfp-source): author to ISO 15189.** This document has no TFP source; the content below is an unverified first draft carried over for structure and must be authored/validated under OMK governance before issue.

## Purpose

To record the calibration and calibration-verification of measuring equipment in the Embryology Laboratory — thermometers and temperature probes (OMK-SOP-EMB-0064), the pH meter (OMK-SOP-EMB-0065) and other measuring devices — against a reference standard whose own traceability is documented. The log provides the metrological traceability required by ISO 15189.

## Scope

Applies to every device whose reading is used to accept a clinical setpoint: reference and working thermometers, incubator and fridge/freezer probes, the pH meter and its buffers. Calibration intervals and acceptance limits are defined in Appendix A. Gas-analyser verification is recorded separately (OMK-LOG-EMB-0062).

## Fields recorded

| Field | Entry | Units / notes |
|---|---|---|
| Date | | YYYY-MM-DD |
| Device ID / serial | | as labelled |
| Device type | | thermometer / probe / pH meter |
| Operator initials | | |
| Reference standard ID | | the certified standard used |
| Reference standard traceability / cert no. | | external calibration certificate |
| Reference standard cert expiry | | YYYY-MM-DD |
| Calibration point(s) | | e.g. 37.0 °C; pH 4.01 / 7.00 |
| Reference value | | °C / pH |
| Device reading | | °C / pH |
| Deviation / correction applied | | °C / pH units |
| Within acceptance? | | Y / N — limit per Appendix A 🔧 |
| Result | | pass / adjusted / fail |
| Next calibration due | | YYYY-MM-DD |
| Deviation ref | | OMK-SOP-EMB-0005 entry no. if any |

> **Traceability is the point of this log.** Every device is calibrated against a reference standard that is itself traceable to a recognised standard, with the certificate identified here. A device that fails calibration is removed from service until corrected and re-verified.

## Completion instructions

1. Complete one row per device per calibration event, at the interval set in Appendix A (🔧) and after any repair or suspected drift.
2. Record the reference standard, its certificate number and expiry; do not calibrate against an expired standard.
3. For the pH meter, record buffer lots and the calibration points used (OMK-SOP-EMB-0065).
4. Record the device reading, the deviation and any correction applied, then mark pass / adjusted / fail against the Appendix A acceptance limit.
5. On failure, quarantine the device, raise a deviation (OMK-SOP-EMB-0005 / OMK-SOP-EMB-0005) and do not return it to clinical use until it passes.

## Sign-off

| Reviewed by (senior embryologist) | Date |
|---|---|
| | |

## Records & retention

Controlled metrological record under OMK-SOP-EMB-0004 and ISO 15189. Retain per the laboratory retention schedule together with the external calibration certificates for the reference standards.
