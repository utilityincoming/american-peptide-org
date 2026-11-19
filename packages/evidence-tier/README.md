# @americanpeptide/evidence-tier

JSON Schema for a claim under the [Evidence Tier Schema](https://americanpeptide.org/standards/evidence-tier/v0.1).

| File | What it is |
| --- | --- |
| `schema-0.1.1.json` | Text of record. Cite version 0.1.1. |
| `schema-0.1.0.json` | Archived shape. See erratum E-001 before using it. |

The normative prose is the HTML spec, not this README. Tier weights, freshness windows, and the scope guard are specified there.

```
CC BY 4.0 for the schema documents.
```

Validate a claim with any draft 2020-12 validator. `provenance.retrieved_at` is required. `scope_note` is required when `tier` is `preclinical`, `third_party`, `vendor_reported`, or `community`.
