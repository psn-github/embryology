# ELB → OMK migration mapping

**Status: EXECUTED (2026-06).** Approved with two decisions applied: dept code
collapsed to a single **`EMB`** (andrology ids became `OMK-SOP-EMB-00xx`), and
the **equipment/QC + identification/chain-of-custody** SOPs were **kept** as OMK
gap docs (ids `OMK-SOP-EMB-0007/0008` and `0060–0067`, logs `0061–0064`) rather
than retired. Renames done via `git mv` (history preserved); 58 ELB drafts with
no v2 home retired; 30 TFP-sourced entries created as stubs pending ingest.

_Original proposal below (kept for the audit trail)._
Per PLAN v2 §5 (the new source of truth). The v2 register is leaner than the
86-document ELB AI-draft suite and renumbers to `OMK-<TYPE>-<DEPT>-####`, so
this is a **remap**, not a 1:1 rename. Every existing ELB doc falls into one of:

- **TRANSFORM** — a v2 entry with a TFP `.docx` source. The OMK doc is produced
  by `npm run ingest` from the corpus; the matching ELB AI-draft is **superseded
  and removed** (its content was unverified). *Blocked until the corpus is present.*
- **GAP-REUSE** — a v2 entry with *no* TFP source. The best ELB AI-draft is
  renamed to the OMK id, `status: Draft`, with `TODO(no-tfp-source): author to ISO 15189`.
- **RETIRE** — an ELB doc with no v2 register home (v2 consolidates or omits it).
  Removed via `git rm` (history preserved). Content noted where it is absorbed.

> ⛔ **Blocker:** `source/tfp/` is empty in this environment (it is gitignored —
> commit `17302b3` added `source/tfp/` to `.gitignore`, so the corpus was never
> committed, and the container was cloned fresh). **No TFP `.docx` files are
> available, so no TRANSFORM row can be executed yet.** The ingest pipeline is
> built and verified on a synthetic fixture; it is ready to run the moment the
> corpus is dropped into `source/tfp/`.

---

## A. Quality & governance

| OMK docId | Title | Source | Action | From ELB |
|---|---|---|---|---|
| OMK-POL-EMB-0001 | Laboratory Code of Conduct | TFP Code of Conduct | TRANSFORM | (none) |
| OMK-SOP-EMB-0002 | Witnessing (3 identifiers + RI Witness) | TFP Witnessing | TRANSFORM | ELB-SOP-002 *(superseded)* |
| OMK-SOP-EMB-0003 | Laboratory–patient communication | TFP Lab Patient Communication | TRANSFORM | (none) |
| OMK-SOP-EMB-0004 | Recordkeeping & documentation control | *gap* | GAP-REUSE | ELB-SOP-001 |
| OMK-SOP-EMB-0005 | Deviation / non-conformance & CAPA | *gap* | GAP-REUSE | ELB-SOP-003 (+ELB-POL-006) |
| OMK-SOP-EMB-0006 | Training & competency assessment | TFP Biopsy Training + EQA (derive) | TRANSFORM (derive) | ELB-SOP-005 *(interim)* |

## B. Andrology

| OMK docId | Title | Source | Action | From ELB |
|---|---|---|---|---|
| OMK-SOP-AND-0010 | Diagnostic semen analysis & post-vasectomy | TFP Diagnostic semen analysis / PV | TRANSFORM | ELB-SOP-018 *(superseded)* |
| OMK-SOP-AND-0011 | Sperm preparation for treatment | TFP Sperm Prep for Treatment | TRANSFORM | ELB-SOP-019/020/021 *(superseded)* |
| OMK-SOP-AND-0012 | Sperm freezing — patient's own | TFP Sperm Freezing (own) | TRANSFORM | ELB-SOP-023 *(superseded)* |
| OMK-SOP-AND-0013 | Intrauterine insemination (IUI) | IUI.docx | TRANSFORM | ELB-SOP-022 *(superseded)* |
| OMK-FORM-AND-0014 | Semen production declaration (bilingual) | Semen production form | TRANSFORM | (none) |
| OMK-FORM-AND-0015 | Semen analysis / freeze / SSR worksheet | Lab Notes Semen Analysis Freeze SSR | TRANSFORM | ELB-LOG-002/003/004 *(superseded)* |

## C. Oocyte & embryo procedures

| OMK docId | Title | Source | Action | From ELB |
|---|---|---|---|---|
| OMK-SOP-EMB-0020 | Dish preparation | TFP Dish Preparation | TRANSFORM | (none) |
| OMK-SOP-EMB-0021 | Trans-vaginal oocyte retrieval (TVOR) | TFP TVOR | TRANSFORM | ELB-SOP-024 *(superseded)* |
| OMK-SOP-EMB-0022 | Conventional IVF insemination | TFP IVF Insemination | TRANSFORM | ELB-SOP-025 *(superseded)* |
| OMK-SOP-EMB-0023 | Denudation | TFP Denudation | TRANSFORM | ELB-SOP-026 *(superseded)* |
| OMK-SOP-EMB-0024 | ICSI (incl. AOA & HOST) | TFP ICSI | TRANSFORM | ELB-SOP-027 *(superseded)* |
| OMK-SOP-EMB-0025 | Fertilisation assessment | TFP Fertilisation | TRANSFORM | ELB-SOP-028 *(superseded)* |
| OMK-SOP-EMB-0026 | Time-lapse imaging (EmbryoScope+) | TFP Time Lapse Imaging | TRANSFORM | (none) |
| OMK-SOP-EMB-0027 | Embryo & blastocyst grading (Istanbul) | TFP Embryo/Blastocyst Grading | TRANSFORM | ELB-SOP-029 *(superseded)* |
| OMK-SOP-EMB-0028 | Blastocyst grading EQA / competency | TFP Blastocyst Grading EQA | TRANSFORM | (none) |
| OMK-SOP-EMB-0029 | Embryo transfer | TFP Embryo Transfer | TRANSFORM | ELB-SOP-032 *(superseded)* |
| OMK-SOP-EMB-0030 | PGT & blastocyst biopsy | TFP PGT and Blastocyst Biopsy | TRANSFORM | ELB-SOP-031 *(superseded)* |
| OMK-SOP-EMB-0031 | Blastocyst biopsy — training | Blastocyst Biopsy Training | TRANSFORM | (none) |
| OMK-SOP-EMB-0032 | Thaw–biopsy–refreeze | Thaw Biopsy Refreeze | TRANSFORM | (none) |

## D. Cryobiology

| OMK docId | Title | Source | Action | From ELB |
|---|---|---|---|---|
| OMK-SOP-EMB-0040 | Blastocyst vitrification (Vitrolife) | TFP Blastocyst Vitrification | TRANSFORM | ELB-SOP-033 *(superseded)* |
| OMK-SOP-EMB-0041 | Oocyte vitrification (Vitrolife) | TFP Oocyte Vitrification | TRANSFORM | ELB-SOP-034 *(superseded)* |
| OMK-SOP-EMB-0042 | Blastocyst warming (Vitrolife) | TFP Blastocyst Warming | TRANSFORM | ELB-SOP-035 *(part, superseded)* |
| OMK-SOP-EMB-0043 | Oocyte warming (Vitrolife) | TFP Oocyte Warming | TRANSFORM | ELB-SOP-035 *(part, superseded)* |
| OMK-SOP-EMB-0044 | Egg thaw (legacy) — reconcile w/ 0043 | Egg Thaw.docx | TRANSFORM | (none) |
| OMK-SOP-EMB-0045 | LN₂ storage, tank monitoring & cryosecurity | *gap* | GAP-REUSE | ELB-SOP-037 (+ELB-SOP-036) |

## E. Cycle worksheets, forms & logs

| OMK docId | Title | Source | Action | From ELB |
|---|---|---|---|---|
| OMK-FORM-EMB-0050 | Fresh cycle laboratory worksheet | Fresh cycle Lab Notes | TRANSFORM | ELB-FORM-005 / LOG-005-009 *(superseded)* |
| OMK-FORM-EMB-0051 | Frozen embryo replacement (FER) worksheet | FER lab notes | TRANSFORM | (none) |
| OMK-LOG-EMB-0052 | Embryo culture continuation sheet | Embryo Culture Continuation Sheet | TRANSFORM | ELB-LOG-009 *(superseded)* |
| OMK-FORM-EMB-0053 | Cryopreservation consent (bilingual) | *gap* | GAP-REUSE | ELB-FORM-001 |
| OMK-FORM-EMB-0054 | Specimen disposition / election (bilingual) | *gap* | GAP-REUSE | ELB-FORM-003 |

## Policies (`OMK-POL-EMB`) — numbering proposed

| OMK docId | Title | Source | Action | From ELB |
|---|---|---|---|---|
| OMK-POL-EMB-0001 | Laboratory Code of Conduct | TFP | TRANSFORM | (none) |
| OMK-POL-EMB-0002 | Exposure control & hazard communication (GHS) | *gap* | GAP-REUSE | ELB-POL-001 (+ELB-POL-002) |
| OMK-POL-EMB-0003 | Manufacturer recalls & product alerts | *gap* | GAP-REUSE | ELB-POL-004 |
| OMK-POL-EMB-0004 | Adverse events | *gap* | GAP-REUSE | ELB-POL-005 (+ELB-SOP-004) |
| OMK-POL-EMB-0005 | Patient confidentiality | *gap* | GAP-REUSE | ELB-POL-008 |
| OMK-POL-EMB-0006 | Informed consent | *gap* | GAP-REUSE | ELB-POL-009 |
| OMK-POL-EMB-0007 | Cryostorage security & access | *gap* | GAP-REUSE | ELB-POL-007 |

*(0006/0007 chosen to match the PLAN §3.1/§3.2 examples for consent/cryo policy.)*

## Appendices & manual

| OMK docId | Title | Action | From ELB |
|---|---|---|---|
| OMK-APP-EMB-A | Setpoint register (guideline vs local, TFP-validated values) | GAP-REUSE + repopulate from TFP | ELB-APP-A |
| OMK-APP-EMB-B | Source & reference bibliography (+ TFP provenance table) | GAP-REUSE | ELB-APP-B |
| OMK-MAN-EMB-0001 | Bound manual | rename | ELB-MAN-001 (manual.config.yml) |

---

## RETIRE — ELB drafts with no v2 register home (proposed `git rm`)

v2's register omits the speculative environment/equipment/standalone-log layer
the ELB AI-draft suite invented. Proposed for retirement (content absorbed as noted):

| ELB doc | Disposition |
|---|---|
| ELB-SOP-004 Adverse events & RCA | → folds into OMK-POL-EMB-0004 + OMK-SOP-EMB-0005 |
| ELB-SOP-006 QC & equipment overview | retire (no v2 entry) |
| ELB-SOP-007 Inventory & consumables | retire (no v2 entry) |
| ELB-SOP-008 Daily opening/closing | retire |
| ELB-SOP-009 Sterile technique | retire |
| ELB-SOP-010 Sterile filtration | retire |
| ELB-SOP-011 Glassware sterilisation | retire |
| ELB-SOP-012 Sterilisation guidelines | retire |
| ELB-SOP-013 Air quality / TVOC | retire (TVOC range carried in OMK-APP-EMB-A) |
| ELB-SOP-014 Chemical hygiene | → folds into OMK-POL-EMB-0002 |
| ELB-SOP-015 Biohazardous waste | retire |
| ELB-SOP-016 Identification & labelling | → folds into OMK-SOP-EMB-0002 (witnessing/3-ID) |
| ELB-SOP-017 Chain of custody | → folds into OMK-SOP-EMB-0002 / records |
| ELB-SOP-030 Assisted hatching | retire (no standalone v2 entry; AH within ICSI/biopsy as applicable) |
| ELB-SOP-033/034/035 cryo | superseded by TFP OMK-SOP-EMB-0040–0044 |
| ELB-SOP-036 LN₂ tanks | → folds into OMK-SOP-EMB-0045 |
| ELB-SOP-038 Temperature monitoring | retire (setpoints in OMK-APP-EMB-A) |
| ELB-SOP-039 Incubator temp/CO₂ checks | retire |
| ELB-SOP-040 Gas analyser use | retire |
| ELB-SOP-041 Thermometer calibration | retire |
| ELB-SOP-042 pH meter calibration | retire |
| ELB-SOP-043 CO₂ incubator operation | retire |
| ELB-SOP-044 Laminar flow hood operation | retire |
| ELB-POL-003 Latex allergy | → folds into OMK-POL-EMB-0002, or retire |
| ELB-POL-006 Deviation & CAPA | → becomes OMK-SOP-EMB-0005 |
| ELB-LOG-001 Semen receipt | → absorbed into OMK-FORM-AND-0015 |
| ELB-LOG-002/003/004 semen worksheets | → OMK-FORM-AND-0015 |
| ELB-LOG-005/006/007/008 retrieval/insem/fert/ICSI | → OMK-FORM-EMB-0050 (fresh cycle worksheet) |
| ELB-LOG-009 culture & development | → OMK-LOG-EMB-0052 |
| ELB-LOG-010 assisted-hatching record | retire |
| ELB-LOG-011 biopsy record | → within OMK-SOP-EMB-0030 records |
| ELB-LOG-012 transfer record | → OMK-FORM-EMB-0050/0051 |
| ELB-LOG-013/014/015 vitrification/warming | → within OMK-SOP-EMB-0040–0044 records |
| ELB-LOG-016 cryostorage inventory | → within OMK-SOP-EMB-0045 |
| ELB-LOG-017 disposition/transfer | → OMK-FORM-EMB-0054 |
| ELB-LOG-018–022 QC logs | retire (equipment layer not in v2) |
| ELB-LOG-023 deviation log | → within OMK-SOP-EMB-0005 |
| ELB-LOG-024 recall log | → within OMK-POL-EMB-0003 |
| ELB-LOG-025 adverse-event report | → within OMK-POL-EMB-0004 |
| ELB-LOG-026 training acknowledgment | → within OMK-SOP-EMB-0006 |

**Net effect:** of 86 ELB drafts → ~13 reused (gap or interim), ~35 superseded by
TFP transforms, ~38 retired. The OMK suite is ~36 controlled documents.

---

## Open decisions blocking execution (need Scott)

1. **The TFP corpus.** Provide `source/tfp/*.docx` (or confirm an alternative).
   Without it, every TRANSFORM row is blocked.
2. **Dept code (PLAN §13.1):** keep the `EMB` / `AND` split (as above), or collapse
   all to `EMB`.
3. **Retirement list:** approve removing the ~38 ELB drafts above, or keep any as
   OMK gap docs (e.g. equipment-QC SOPs, identification/chain-of-custody).
4. **Policy numbering** (0001–0007 proposed above).
5. **Appendix id style:** `OMK-APP-EMB-A/-B` (letters, matches PLAN §5) vs `-0001/-0002`.
