# Embedded fonts — TODO(brand)

The build embeds three Oxford Medical v2.3 typefaces (PLAN.md §8). Drop the
licensed `.woff2` files here with **exactly** these names so the `@font-face`
rules in `../brand.css` resolve:

| Family | File |
|---|---|
| Cormorant Garamond (titles/cover) | `CormorantGaramond-Regular.woff2`, `CormorantGaramond-SemiBold.woff2` |
| Inter Tight (body) | `InterTight-Regular.woff2`, `InterTight-SemiBold.woff2` |
| Plus Jakarta Sans (tables/labels) | `PlusJakartaSans-Regular.woff2` |

For bilingual forms, an Arabic Naskh face (e.g. **Noto Naskh Arabic**) is used
via the system fallback chain in `--font-arabic`; add `NotoNaskhArabic-Regular.woff2`
and a matching `@font-face` rule if a controlled embedded copy is required.

**Until these files are present** the pipeline falls back to system
serif/sans so builds still succeed — but PDFs will not be brand-true.
