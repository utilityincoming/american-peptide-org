import assert from "node:assert/strict";
import test from "node:test";
import { blend } from "./blend.ts";
import {
  accumulationRatio,
  fractionRemaining,
  halfLifeMidpoint,
  timeToSteadyState,
} from "./pharmacokinetics.ts";
import { reconstitute, solveWaterForDraw } from "./reconstitution.ts";

test("reconstitute: 5 mg vial, 250 mcg dose, 2 mL", () => {
  const r = reconstitute({ vialAmount: 5000, dose: 250, waterMl: 2 });
  assert.equal(r.concentrationPerMl, 2500);
  assert.equal(r.concentrationPerTick, 250);
  assert.equal(r.volumePerInjectionMl, 0.1);
  assert.equal(r.unitsPerInjection, 10);
  assert.equal(r.dosesPerVial, 20);
});

test("reconstitute: zero diluent and zero dose stay defined", () => {
  const dry = reconstitute({ vialAmount: 5000, dose: 250, waterMl: 0 });
  assert.equal(dry.concentrationPerMl, 0);
  assert.equal(dry.volumePerInjectionMl, 0);
  assert.equal(dry.dosesPerVial, 20);
  const nodose = reconstitute({ vialAmount: 5000, dose: 0, waterMl: 2 });
  assert.equal(nodose.dosesPerVial, 0);
  assert.equal(solveWaterForDraw(5000, 0, 10), 0);
});

test("solveWaterForDraw inverts a 10-unit draw", () => {
  assert.equal(solveWaterForDraw(5000, 250, 10), 2);
});

test("blend: proportioned vials match intended doses", () => {
  const b = blend(2, [
    { massMg: 5, doseMcg: 250 },
    { massMg: 10, doseMcg: 500 },
  ]);
  assert.equal(b.doses, 20);
  assert.equal(b.drawMl, 0.1);
  assert.equal(b.units, 10);
  assert.ok(b.components.every((c) => c.overFraction === 0));
});

test("blend: the scarcest peptide sets the count and the other runs over", () => {
  const b = blend(2, [
    { massMg: 5, doseMcg: 250 },
    { massMg: 5, doseMcg: 500 },
  ]);
  assert.equal(b.doses, 10);
  assert.equal(b.components[0].deliveredMcg, 500);
  assert.equal(b.components[0].overFraction, 1);
  assert.equal(b.components[1].overFraction, 0);
});

test("pharmacokinetics: one half-life leaves half", () => {
  assert.equal(fractionRemaining(168, 168), 0.5);
  assert.equal(halfLifeMidpoint(150, 184), 167);
  const hours = timeToSteadyState(168);
  assert.ok(Math.abs(hours / 168 - Math.log2(1 / 0.03)) < 1e-9);
  assert.ok(accumulationRatio(168, 168 * 20) < 1.01);
});
