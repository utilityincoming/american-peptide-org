import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const schema = JSON.parse(readFileSync(new URL("../../public/standards/evidence-tier/0.1.1/schema.json", import.meta.url), "utf8"));

const tiers = new Set(schema.$defs.tier.enum);
const kinds = new Set(schema.$defs.estimateKind.enum);
const freshness = new Set(schema.properties.freshness.enum);
const sourceTypes = new Set(schema.$defs.provenance.properties.source_type.enum);

function checkClaim(claim: Record<string, unknown>, file: string) {
  for (const key of schema.required) {
    assert.ok(key in claim, `${file} missing ${key}`);
  }
  for (const key of Object.keys(claim)) {
    assert.ok(key in schema.properties, `${file} unexpected ${key}`);
  }
  assert.ok(tiers.has(claim.tier), `${file} tier`);
  assert.ok(kinds.has(claim.estimate_kind), `${file} estimate_kind`);
  assert.ok(freshness.has(claim.freshness), `${file} freshness`);
  assert.equal(typeof claim.scope_note, "string");
  const belowClinical = claim.tier !== "reference" && claim.tier !== "clinical";
  if (belowClinical) assert.ok(String(claim.scope_note).length > 0, `${file} scope_note`);
  const provenance = claim.provenance as Record<string, unknown>;
  for (const key of schema.$defs.provenance.required) {
    assert.ok(key in provenance, `${file} provenance.${key}`);
  }
  for (const key of Object.keys(provenance)) {
    assert.ok(key in schema.$defs.provenance.properties, `${file} unexpected provenance.${key}`);
  }
  assert.ok(sourceTypes.has(provenance.source_type), `${file} source_type`);
  assert.equal(provenance.schema_version, "0.1.1");
  assert.match(String(provenance.retrieved_at), /^\d{4}-\d{2}-\d{2}T/);
}

test("0.1.1 examples match the published claim schema", () => {
  for (const name of ["vendor-price.json", "rodent-half-life.json"]) {
    const claim = JSON.parse(
      readFileSync(new URL(`../../public/standards/evidence-tier/0.1.1/examples/${name}`, import.meta.url), "utf8"),
    );
    checkClaim(claim, name);
  }
});

test("the sourced registry claim follows the published claim schema", () => {
  const file = "glutathione-formula-2026-11-28.json";
  const claim = JSON.parse(readFileSync(new URL(`../../public/data/examples/${file}`, import.meta.url), "utf8"));
  checkClaim(claim, file);
  assert.equal(claim.provenance.source_url, `https://pubchem.ncbi.nlm.nih.gov/compound/${claim.provenance.source_id}`);
});
