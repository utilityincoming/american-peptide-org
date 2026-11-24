# American Peptide · public methods

Companion site to [americanpeptide.com](https://americanpeptide.com). The .com runs the catalog and the calculators. This repository publishes how those numbers are made.

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

The citation downloads are generated during the Next.js export. On Vercel,
general page citations use the specific deployment URL and record its Git
revision. Exact schema citations use the public patch URLs. Keep the production
deployment accessible for readers following its citations.
