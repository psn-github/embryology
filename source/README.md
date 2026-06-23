# `source/` — TFP corpus (provenance, read-only)

The TFP (The Fertility Partnership) embryology SOP `.docx` corpus is the
**primary content source** for this suite (PLAN v2 §0, §5, §8). The transformed
OMK documents under `content/` are derived from these files by
`scripts/ingest.mjs`.

## `source/tfp/` is gitignored

Per repo policy (`.gitignore` → `source/tfp/`), the TFP `.docx` files are **not
committed** — they are TFP intellectual property held for provenance only
(PLAN v2 §8 governance note). To run an ingest you must place the corpus in
`source/tfp/` in your working copy:

```
source/tfp/
├── TFP ICSI SOP.docx
├── TFP TVOR SOP.docx
├── TFP Blastocyst Vitrification Vitrolife.docx
├── TFP Witnessing.docx
├── Semen production form.docx
└── … (see PLAN.md §5 for the full mapping)
```

Excluded files (PLAN v2 §5.0 — **do NOT transform**, out of scope in Kuwait):
- `Alt Donor Notes.docx`
- `surrogate lab notes.docx`

## Ingest

```bash
npm run ingest -- --file "TFP ICSI SOP.docx" --as OMK-SOP-EMB-0024 --title "Intracytoplasmic Sperm Injection (ICSI)"
```

This writes `content/sops/OMK-SOP-EMB-0024.md` (front-matter pre-filled, status
Draft) plus `content/sops/OMK-SOP-EMB-0024.transform.md` (every stripped/flagged
line for sign-off). Embedded dish-layout figures are extracted to
`assets/tfp/<docId>/`. **Nothing auto-publishes** — review the transform report
and complete front-matter before issue.
