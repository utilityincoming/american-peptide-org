import { WorkedExample } from "@/components/WorkedExample";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Example claims",
  description: "Two Evidence Tier Schema 0.1.1 claims: a vendor price and a rodent half-life, with the freshness window each one uses.",
  alternates: { canonical: "/standards/evidence-tier/examples" },
};

export default function ExamplesPage() {
  return (
    <article className="prose">
      <p className="kicker">Schema 0.1.1</p>
      <h1>Example claims</h1>
      <p>
        These are not catalog rows. They are the smallest records that satisfy{" "}
        <a href="/standards/evidence-tier/0.1.1/schema.json">schema 0.1.1</a>, written so the two axes and erratum{" "}
        <Link href="/errata#e-001">E-001</Link> can be checked against a file.
      </p>

      <h2>Vendor price</h2>
      <p>
        <a href="/standards/evidence-tier/0.1.1/examples/vendor-price.json">vendor-price.json</a> is{" "}
        <code>vendor_reported</code> and <code>commercial</code>. The tier default would wait 6 months. The kind
        override is 30 days, and the override wins. Retrieved 18 November 2026, the claim is stale on 18 December
        2026.
      </p>
      <pre className="formula">{`tier           vendor_reported
estimate_kind  commercial
window         30 days`}</pre>

      <WorkedExample />

      <p>
        Normative rules: <Link href="/standards/evidence-tier/v0.1#4-freshness-and-revalidation">freshness</Link> and{" "}
        <Link href="/standards/evidence-tier/v0.1#5-scope-notes">scope notes</Link>.
      </p>
    </article>
  );
}
