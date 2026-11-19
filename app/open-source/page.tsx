import type { Metadata } from "next";
import Link from "next/link";
import { REPO } from "@/lib/site";

export const metadata: Metadata = {
  title: "Open source",
  description: "Reference modules for the American Peptide calculators and the evidence-tier JSON Schema.",
  alternates: { canonical: "/open-source" },
};

export default function OpenSourcePage() {
  return (
    <article className="prose">
      <p className="kicker">Project</p>
      <h1>Open-source home</h1>
      <p>
        The repository is <a href={REPO}>{REPO}</a>. Two trees are meant to be reused. The website around them is the
        reading copy.
      </p>
      <h2>Calculators</h2>
      <p>
        <code>packages/calculators</code> is dependency-free TypeScript: <code>reconstitution.ts</code>,{" "}
        <code>blend.ts</code>, and <code>pharmacokinetics.ts</code>. They are the same formulas the .com tools run.
        License: MIT. The written method, including edge cases the types do not express, is under{" "}
        <Link href="/methods">/methods</Link>.
      </p>
      <pre className="formula">{`node --experimental-strip-types --test packages/calculators/calculators.test.ts`}</pre>
      <h2>Evidence tier schema</h2>
      <p>
        <code>packages/evidence-tier</code> holds JSON Schema draft 2020-12 for a claim.{" "}
        <code>schema-0.1.1.json</code> is the text of record. <code>schema-0.1.0.json</code> is the archived shape
        without <code>scope</code>. The same files are served at:
      </p>
      <ul>
        <li>
          <a href="/standards/evidence-tier/v0.1/schema.json">/standards/evidence-tier/v0.1/schema.json</a>
        </li>
        <li>
          <a href="/standards/evidence-tier/0.1.1/schema.json">/standards/evidence-tier/0.1.1/schema.json</a>
        </li>
        <li>
          <a href="/standards/evidence-tier/0.1.0/schema.json">/standards/evidence-tier/0.1.0/schema.json</a>
        </li>
      </ul>
      <p>
        The schema documents are <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>, like the spec
        prose. Normative rules — when a scope note is required, how windows combine, when supersession is blocked —
        live in the <Link href="/standards/evidence-tier/v0.1">spec</Link>, which a validator will not check for you
        beyond the required fields.
      </p>
      <h2>What is not in this tree</h2>
      <p>
        The research agent, vendor trust scores, and the rendered catalog stay in the application repository behind
        americanpeptide.com. Dataset exports on <Link href="/data">/data</Link> are the part of that catalog this
        project redistributes.
      </p>
    </article>
  );
}
