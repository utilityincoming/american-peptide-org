"use client";

import { useState } from "react";
import { reconstitute } from "@/packages/calculators/reconstitution";
import { blend } from "@/packages/calculators/blend";
import { screenBlend } from "@/packages/calculators/blend-screen";
import { fractionRemaining } from "@/packages/calculators/pharmacokinetics";
import type { methods } from "@/lib/calculator-methods";

type Field = { label: string; initial: string; min?: number };
const examples = {
  reconstitution: {
    fields: [{ label: "Sample amount (arbitrary units)", initial: "18", min: 0 }, { label: "Solvent volume (mL)", initial: "3", min: 0.000001 }],
    run: ([amount, volume]: string[]) => ({
      "Concentration (arbitrary units/mL)": reconstitute({ vialAmount: Number(amount), waterMl: Number(volume), dose: 0 }).concentrationPerMl,
    }),
  },
  blend: {
    fields: [
      { label: "Sample A mass (mg)", initial: "2", min: 0.000001 },
      { label: "Sample B mass (mg)", initial: "3", min: 0.000001 },
      { label: "Sample A target per aliquot (µg)", initial: "200", min: 0.000001 },
      { label: "Sample B target per aliquot (µg)", initial: "300", min: 0.000001 },
      { label: "Total volume (mL)", initial: "5", min: 0.000001 },
    ],
    run: ([a, b, targetA, targetB, volume]: string[]) => {
      const result = blend(Number(volume), [
        { massMg: Number(a), doseMcg: Number(targetA) },
        { massMg: Number(b), doseMcg: Number(targetB) },
      ]);
      return { "Whole aliquots": result.doses, "Volume per aliquot (mL)": result.drawMl };
    },
  },
  "blend-screen": {
    fields: [{ label: "Model sequence A", initial: "EASDE" }, { label: "Model sequence B", initial: "KASRK" },
      { label: "Buffer pH", initial: "5.7", min: 0, max: 14 }],
    run: ([a, b, ph]: string[]) => screenBlend([{ name: "Sample A", sequence: a }, { name: "Sample B", sequence: b }], Number(ph)),
  },
  pharmacokinetics: {
    fields: [{ label: "Model half-life (hours)", initial: "2", min: 0.000001 }, { label: "Elapsed time (hours)", initial: "6", min: 0 }],
    run: ([halfLife, time]: string[]) => ({ "Fraction remaining": fractionRemaining(Number(halfLife), Number(time)) }),
  },
} satisfies Record<(typeof methods)[number]["id"], {
  fields: (Field & { max?: number })[];
  run: (values: string[]) => unknown;
}>;

export default function CalculatorExample({ id }: { id: keyof typeof examples }) {
  const example = examples[id];
  const [result, setResult] = useState("");
  const fields: (Field & { max?: number })[] = example.fields;
  return <form onChange={() => setResult("")} onSubmit={(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setResult(JSON.stringify(example.run(fields.map((_, index) => String(data.get(String(index))))), null, 2));
  }}>
    <div className="tool-controls">
      {fields.map((field, index) => <label key={field.label}>{field.label}
        <input name={String(index)} type={field.min === undefined ? "text" : "number"} step="any"
          min={field.min} max={field.max} defaultValue={field.initial}
          pattern={field.min === undefined ? "[ACDEFGHIKLMNPQRSTVWYacdefghiklmnpqrstvwy]+" : undefined}
          maxLength={field.min === undefined ? 120 : undefined} required />
      </label>)}
    </div>
    <button type="submit">Run example</button>
    <div role="status">{result && <pre className="formula">{result}</pre>}</div>
  </form>;
}
