# Evidence Tier Schema 0.1.0 (archived)

**Version 0.1.0** · Status: superseded by [0.1.1](/standards/evidence-tier/v0.1)
**Do not cite this URL for new work.** It is preserved so the correction has a stable target.

Version 0.1.0 was the schema version stamped on provenance records in the americanpeptide.com source (`SCHEMA_VERSION = '0.1.0'`). It was not published as its own document. The rules below are the 0.1.0 behavior, restated from that code and from the defect the 0.1.1 text corrects.

## What 0.1.0 defined

- Six tiers and weights: `reference` 60, `clinical` 50, `preclinical` 40, `third_party` 30, `vendor_reported` 20, `community` 10.
- A claim carries `field`, `value`, optional `unit` and `range`, `tier`, `freshness`, `estimate_kind`, `scope_note`, and `provenance`.
- `provenance.retrieved_at` is required. `scope_note` is required below `clinical`.
- There is no `scope` field. Supersession requires the same `field` and a strictly higher tier weight only.
- Comparison sorts by tier weight, then numeric value descending.
- Page floor is the lowest tier among load-bearing claims.
- Vendor bands map as documented → `third_party`, claimed → `vendor_reported`, unvetted → `community`.

The archived JSON Schema is [schema.json](/standards/evidence-tier/0.1.0/schema.json). It intentionally omits `scope`.

## The freshness defect

Working notes for 0.1.0 gave one “tier → window” table that also contained a `commercial` row. `commercial` is an estimate kind, not a tier. A vendor price matched both `vendor_reported` (6 months) and `commercial` (30 days), with no precedence rule.

That ambiguity is [erratum E-001](/errata#e-001). Version 0.1.1 states the precedence: the estimate-kind window wins, and `commercial` is 30 days.

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribute the American Peptide Project.
