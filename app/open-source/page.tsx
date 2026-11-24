import CalculatorExample from "@/components/CalculatorExample";
import { calculatorSource, methods, METHODS_REVISION } from "@/lib/calculator-methods";
import { SITE } from "@/lib/site";
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
        <code>blend.ts</code>, <code>blend-screen.ts</code>, and <code>pharmacokinetics.ts</code>. The screen module
        records the american-peptide commit it was checked against. Catalog lookup belongs to the product and stays
        on americanpeptide.com. The arithmetic here is the reference those tools are written to match.
        License: MIT. The written method, including edge cases the types do not express, is under{" "}
        <Link href="/methods">/methods</Link>.
      </p>
      <pre className="formula">{`node --experimental-strip-types --test packages/calculators/calculators.test.ts`}</pre>
      {methods.map((method) => <section key={method.id} id={method.id}>
        <h3>{method.title}</h3>
        <p><a href={calculatorSource(method.id)} download>Download {method.id}.ts</a>{" · "}
          <Link href={`/methods/${method.id}`}>Method</Link>{" · "}
          <a href={`${REPO}/blob/${METHODS_REVISION}/app/methods/${method.id}/page.tsx`}>Revision <code>{METHODS_REVISION.slice(0, 12)}</code></a>{" · "}
          <a href={`/calculators/${METHODS_REVISION}/LICENSE`}>License</a>
        </p>
        <CalculatorExample id={method.id} />
      </section>)}
      <h2>Evidence tier schema</h2>
      <p>Use this badge after checking a record against the <Link href="/standards/evidence-tier/0.1.1">0.1.1 release</Link>.
        The badge refers to JSON Schema validation.</p>
      <img src="/badges/evidence-tier-0.1.1.svg" width="346" height="30" alt="Validated against americanpeptide.org v0.1.1" />
      <pre className="formula">{`<a href="${SITE}/standards/evidence-tier/0.1.1"><img src="${SITE}/badges/evidence-tier-0.1.1.svg" alt="Validated against americanpeptide.org v0.1.1"></a>`}</pre>
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
        Worked records that pass the required fields are on{" "}
        <Link href="/standards/evidence-tier/examples">example claims</Link>. The schema documents are{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>, like the spec
        prose. Normative rules — when a scope note is required, how windows combine, when supersession is blocked —
        live in the <Link href="/standards/evidence-tier/v0.1">spec</Link>, which a validator will not check for you
        beyond the required fields.
      </p>
      <h2>What is not in this tree</h2>
      <p>
        The research agent, vendor trust scores, and the rendered catalog are the product itself and live in the
        application repository behind americanpeptide.com. This project publishes the methods and standards they
        follow; the dataset exports on <Link href="/data">/data</Link> are the part of that catalog it openly
        redistributes.
      </p>
    </article>
  );
}
