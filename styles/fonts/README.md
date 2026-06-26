# Fonts — Document track (brand v2.4)

This suite is **written documentation**, so it uses the brand's **Document
track** typeface: **Arial**. Arial reproduces through photocopy/fax/greyscale
and covers Latin *and* Khaleeji Arabic in one family — see
`brand-assets/design/documents.md` §2.

**No font files are embedded.** Arial is present on every Mac/Windows machine;
on Linux/VPS/CI build boxes it is replaced automatically by **Liberation Sans**,
the open, metrically-identical substitute listed next in every font stack in
`../brand.css`. Nothing needs to be dropped into this folder.

On a build box, install it once:

```bash
apt-get install fonts-liberation     # Liberation Sans / Serif / Mono
```

If `fonts-liberation` is missing the build still succeeds — the stack falls
back to the next system sans — but the PDF will not be metrically brand-true.

> Bilingual forms render Arabic through the same Arial/Liberation Sans family
> (`--font-arabic` in `brand.css`), with `Noto Naskh Arabic` as a fallback for
> boxes that ship a separate Naskh face.
