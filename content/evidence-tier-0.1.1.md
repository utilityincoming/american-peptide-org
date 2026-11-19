# Evidence Tier Schema

**Version 0.1.1** · Status: public draft · Supersedes 0.1.0
**Citation:** American Peptide Project. *Evidence Tier Schema*, version 0.1.1. 18 November 2026. https://americanpeptide.org/standards/evidence-tier/v0.1

This URL is frozen to the 0.1.1 text. A later patch will be published at its own path. The 0.1.0 shape, including the freshness defect corrected here, is archived at [/standards/evidence-tier/0.1.0](/standards/evidence-tier/0.1.0).

The schema attaches, to every factual claim, a record of where the number came from and what it does not license. The unit of tiering is the **claim**, never the compound. A molecule is never “tier 3.” Its molecular weight is `reference`; its rodent half-life is `preclinical`; a supplier’s assay figure is `vendor_reported`. The tier describes **provenance**, not confidence. Downgrade is free; upgrade needs a source.

This is not a study-design hierarchy (in vitro, then Phase 3, then approval). That question — how strong the *study* is — is a different axis. A `clinical` claim can rest on any trial phase.

Machine-readable shape: [schema.json](/standards/evidence-tier/v0.1/schema.json) (JSON Schema draft 2020-12).

## 1. Two axes

1. **Tier** — provenance. One of six values. Ordered by weight.
2. **Estimate kind** — what kind of quantity the number is (`identity`, `pharmacokinetic`, `purity`, `commercial`, and the rest of the closed list). Drives units and the revalidation window.

A vendor’s price is `tier: vendor_reported` and `estimate_kind: commercial` at the same time. Version 0.1.0 collapsed these into one table. That was a defect. See [erratum E-001](/errata#e-001).

## 2. Tiers

Six tiers, strongest to weakest. Weight orders comparison tables. A `third_party` purity figure outranks a `vendor_reported` one regardless of the number.

| Tier | Weight | Short | Meaning |
| --- | ---: | --- | --- |
| `reference` | 60 | REF | Registry lookup or unit arithmetic from stated inputs. |
| `clinical` | 50 | CLIN | Human trial data. |
| `preclinical` | 40 | PRE | Non-human data, in vitro or animal. |
| `third_party` | 30 | 3P | One independent assay of one lot. |
| `vendor_reported` | 20 | VEN | A supplier’s own claim, not independently verified. |
| `community` | 10 | COMM | Aggregated user reports. |

Display hues are data, not a judgment of error. `reference` and `clinical` are teal. `preclinical` and `third_party` are slate. `vendor_reported` and `community` are amber. A low tier is a disclosure.

## 3. The claim record

Required fields:

- `field` — stable machine name, for example `half_life_subcutaneous`.
- `value`, with optional `unit` and `range`. `range` is a reported spread, not a confidence interval unless the scope note says so.
- `tier` and `estimate_kind`.
- `freshness` — `current`, `stale`, `superseded`, or `retracted`.
- `scope_note` — mandatory below `clinical`.
- `provenance.retrieved_at` — ISO 8601, required on every claim. A claim with no retrieval date is invalid and must be rejected at ingest. Provenance also carries `source_type`, `source_name`, and `schema_version`, and may carry `source_id`, `source_url`, `method`, and `n`.

Optional from this version: `scope`, a coarse species/route/matrix key such as `human.sc` or `rat.im`. `id` and `superseded_by` name claims across a supersession.

### Evidence floor

A page may show one floor: the **lowest tier among the claims the reader actually relies on**. Identity and other `reference` scaffolding may be excluded with an explicit load-bearing predicate, so the floor reflects the empirical claims and not the molecular weight. The floor is a promise that nothing load-bearing on the page rests on anything weaker.

## 4. Freshness and revalidation

Freshness is derived, except `superseded` and `retracted`, which are set by action and always win. A claim is stale when `now − retrieved_at` exceeds its window.

Windows are defined on both axes. The estimate-kind override wins when one exists.

**Tier default.** `reference`: never. `clinical`: 24 months. `preclinical`: 24 months. `third_party`: 12 months. `vendor_reported`: 6 months. `community`: never — community signal is dated, not auto-staled. A month in this table is 30 days.

**Kind override.** `commercial`: 30 days, and it wins.

A vendor price (`vendor_reported` + `commercial`) revalidates every 30 days. There is no second matching row to consult.

## 5. Scope notes

A scope note is mandatory for every tier below `clinical`: `preclinical`, `third_party`, `vendor_reported`, `community`. `reference` and `clinical` are exempt. A `reference` claim should still carry its unit-arithmetic note; that is not enforced.

The pattern is what the data is, then what it does not license. Canonical wordings:

- **reference.** “Unit arithmetic or a registry lookup from the stated inputs. This is a value, not a dosing recommendation.”
- **preclinical.** “Non-human data. Interspecies scaling of this parameter is unreliable and no human equivalent has been published.”
- **third_party.** “Single independent assay of a single lot. Purity of one lot does not characterize a vendor.”
- **vendor_reported.** “Supplier’s own claim, not independently verified. Reproduced here as reported.”
- **community.** “Aggregated from user reports. Reflects what is commonly done, not what has been shown to be safe or effective.”
- **dose_convention** (an estimate kind, not a tier). “Reported ranges from the literature or community practice. Research use; not a protocol and not medical advice.”

## 6. Comparison

Sort by tier weight first, then by numeric value descending. A stronger provenance sits above a weaker number even when the weaker number is larger. A within-tier score, such as a vendor trust score, is a secondary key. It is not a competing ranking.

## 7. Bridges

The schema re-expresses trust signals that already exist. It does not invent a parallel score.

**Sourcing.** A vendor transparency band maps onto the tier of the purity claim that vendor can back:

| Vendor band | Purity claim tier | Because |
| --- | --- | --- |
| documented | `third_party` | Publishes an independent, per-batch certificate of analysis. |
| claimed | `vendor_reported` | States its own testing, not independently confirmed. |
| unvetted | `community` | No verifiable transparency signal supports a higher tier. |

An undated certificate yields an empty `retrieved_at`. That claim fails validation. Do not invent a date.

**Registry.** A PubChem verification record lifts into a `reference` provenance. The cross-check date is `retrieved_at`.

## 8. Supersession

A stronger claim may supersede a weaker one for the same `field` only when all three hold:

1. The same `field`.
2. A strictly higher tier weight.
3. A compatible `scope`.

If both claims set `scope` and the values differ, they coexist. A human `clinical` half-life must not overwrite a rodent `preclinical` half-life: the preclinical scope note says interspecies scaling is unreliable, so they are not the same claim. Claims that leave `scope` unset are treated as compatible, so 0.1.0 records keep working.

## 9. Ingest

Reject a claim when:

1. The tier is below `clinical` and `scope_note` is missing or blank.
2. `provenance.retrieved_at` is missing.

Default any unsourced record to `community` before validation. `community` is the floor: the honest home for a number you cannot yet source.

## 10. Changelog

### 0.1.1 — this version (18 November 2026)

- Revalidation windows are modelled on both axes. `commercial` is 30 days and wins over the `vendor_reported` default. Removes the 0.1.0 price-freshness ambiguity ([E-001](/errata#e-001)).
- Optional `scope`. A scope mismatch blocks supersession. Unset `scope` behaves as 0.1.0 did.
- First public text of the schema. The behaviors were already implemented in the americanpeptide.com source tree; `SCHEMA_VERSION` in that tree may still read `0.1.0` until that repository bumps it. New provenance records published from this site use `0.1.1`.

### 0.1.0 — initial, archived

- Six tiers with weights; claim and provenance records; mandatory `retrieved_at`; scope notes below `clinical`; page-level evidence floor; comparison by tier then value; three-hue palette; vendor and PubChem bridges.
- No separate written document. The rules lived in code. The freshness table in the working notes contained a `commercial` row inside a tier column. That row is not part of 0.1.1.

## License

This specification and the JSON Schema are available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribute the American Peptide Project and link the version you cite.
