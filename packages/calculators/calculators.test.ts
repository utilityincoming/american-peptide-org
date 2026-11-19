import assert from "node:assert/strict";
import test from "node:test";
import { blend, overDeliveryNote } from "./blend.ts";
import { screenBlend } from "./blend-screen.ts";
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
  assert.equal(
    overDeliveryNote(b.components[0].overFraction),
    "The shared draw delivers more than the intended dose of a non-limiting peptide because the dose count follows the scarcest component.",
  );
  assert.equal(overDeliveryNote(0), null);
});

const GLUCAGON = "HSQGTFTSDYSKYLDSRRAQDFVQWLMNT";
const PRAMLINTIDE = "KCNTATCATQRLANFLVHSSNNFGPILPPTNVGSNTY";
const GHK = "GHK";
const BPC = "GEPPPGKPADDAGLV";

test("blend screen: labeled pramlintide–insulin pair and glucagon fibrillation", () => {
  const labeled = screenBlend(
    [
      { slug: "pramlintide", name: "Pramlintide", sequence: PRAMLINTIDE },
      { slug: "insulin", name: "Insulin (human)", sequence: "GIVEQCCTSICSLYQLENYCNFVNQHLCGSHLVEALYLVCGERGFFYTPKT" },
    ],
    5.7,
  );
  const pair = labeled.flags.filter((f) => f.code === "labeled-incompatibility");
  assert.equal(pair.length, 1);
  assert.equal(pair[0].level, "warn");
  assert.match(pair[0].detail, /Symlin/);
  assert.ok(labeled.peptides.find((p) => p.slug === "pramlintide")!.cysteines > 0);

  const fibril = screenBlend(
    [
      { slug: "glucagon", name: "Glucagon", sequence: GLUCAGON },
      { slug: "pramlintide", name: "Pramlintide", sequence: PRAMLINTIDE },
    ],
    5.7,
  );
  assert.ok(fibril.flags.some((f) => f.code === "fibril" && f.level === "warn"));
  assert.ok(fibril.flags.some((f) => f.code === "cysteine"));
});

test("blend screen: opposite charge, near-pI, copper–thiol, and unknown names", () => {
  const atNeutral = screenBlend(
    [
      { slug: "ghk-cu", name: "GHK-Cu", sequence: GHK, copper: true },
      { slug: "bpc-157", name: "BPC-157", sequence: BPC },
    ],
    7.4,
  );
  const ghk = atNeutral.peptides.find((p) => p.slug === "ghk-cu")!;
  const bpc = atNeutral.peptides.find((p) => p.slug === "bpc-157")!;
  assert.notEqual(Math.sign(ghk.charge!), Math.sign(bpc.charge!));
  assert.ok(atNeutral.flags.some((f) => f.code === "opposite-charge"));
  assert.equal(atNeutral.flags.some((f) => f.code === "copper-thiol"), false);

  const onPi = screenBlend([{ slug: "bpc-157", name: "BPC-157", sequence: BPC }], bpc.pi!);
  assert.ok(onPi.flags.some((f) => f.code === "near-pi"));

  const mixed = screenBlend(
    [
      { slug: "ghk-cu", name: "GHK-Cu", sequence: GHK, copper: true },
      { name: "Pramlintide", sequence: PRAMLINTIDE },
      { name: "not a peptide" },
    ],
    5.7,
  );
  assert.ok(mixed.flags.some((f) => f.code === "copper-thiol"));
  assert.deepEqual(mixed.unresolved, ["not a peptide"]);
  assert.deepEqual(
    mixed.notes.map((n) => n.code),
    ["no-costore", "no-shake", "separate-syringes"],
  );

  const same = screenBlend(
    [
      { slug: "glucagon", sequence: GLUCAGON },
      { slug: "glucagon", sequence: GLUCAGON },
    ],
    5.7,
  );
  assert.equal(same.flags.some((f) => f.code === "opposite-charge"), false);
});

test("pharmacokinetics: one half-life leaves half", () => {
  assert.equal(fractionRemaining(168, 168), 0.5);
  assert.equal(halfLifeMidpoint(150, 184), 167);
  const hours = timeToSteadyState(168);
  assert.ok(Math.abs(hours / 168 - Math.log2(1 / 0.03)) < 1e-9);
  assert.ok(accumulationRatio(168, 168 * 20) < 1.01);
});
