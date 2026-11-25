# American Peptide · open standards, methods, and research data

This repository builds the public standards, methodology, and data publication of the American Peptide Project. See [About the project](https://americanpeptide.org/about) for the scope, licensing, and relationship to the interactive tools.

| URL | Contents |
| --- | --- |
| [/standards/evidence-tier/v0.1](https://americanpeptide.org/standards/evidence-tier/v0.1) | Evidence Tier Schema 0.1.1, the citable text |
| [/methods](https://americanpeptide.org/methods) | Reconstitution, blend, and pharmacokinetic methods |
| [/data](https://americanpeptide.org/data) | CC BY 4.0 dataset exports |
| [/changelog](https://americanpeptide.org/changelog) | Public changelog |
| [/errata](https://americanpeptide.org/errata) | Corrections, including E-001 |
| [/open-source](https://americanpeptide.org/open-source) | Calculator modules and JSON Schema |

```
npm install
npm test
npm run dev
```

Code in `packages/calculators` is MIT. The specification, schemas, and datasets are CC BY 4.0. See `LICENSE`.

## Release artifacts

Update `lib/releases.ts` with the dated release and term-level changelog
references. The comparison uses the released JSON files and these references.
Keep published patch documents and their schemas in place when adding releases.

Regenerate dataset artifacts with `python scripts/export-datasets.py` using
PyArrow. The date comes from the original JSON exports. Commit the dated files
and manifest together, and retain older snapshot directories. Dated CSVs encode
list values as JSON arrays. The existing undated URLs stay available.

The citation downloads are generated during the Next.js export. Exact schema
and dataset citations use their public patch or snapshot URLs. General page
citations use public Git commit permalinks, and the DataCite metadata also
includes the live rendered URL. Vercel supplies the build commit. Local builds
use their checked-out commit when the working tree is clean.

## Artwork

Run `npm run assets` to regenerate the illustrations from the current palette
and the SVG geometry. Generate one release with
`npm run assets -- 0.2 brass`, supplying an existing CSS color token as the
second argument. Commit its new assets and both manifest copies with the
release. See [the illustration style guide](assets/STYLE.md) and
[asset manifest](assets/manifest.json).
