import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evidence Tier Schema",
  description: "Version index for the American Peptide Evidence Tier Schema.",
  alternates: { canonical: "/standards/evidence-tier" },
};

export default function StandardsIndex() {
  return (
    <article>
      <p className="kicker">Standard</p>
      <h1 className="page-title">Evidence Tier Schema</h1>
      <p className="lede">
        Claim-level provenance for peptide reference data. A tier says where a number came from. It does not say how
        confident the prose sounds, and it is not a study-design ladder.
      </p>
      <div className="grid">
        <Link href="/standards/evidence-tier/v0.1" className="card">
          <p className="kicker">Cite this URL</p>
          <h2>v0.1</h2>
          <p>Frozen to schema 0.1.1, the first public text. JSON Schema included.</p>
        </Link>
        <Link href="/standards/evidence-tier/0.1.1" className="card">
          <p className="kicker">Patch pin</p>
          <h2>0.1.1</h2>
          <p>Same frozen text as v0.1. Use this path when a citation must name the patch.</p>
        </Link>
        <Link href="/standards/evidence-tier/examples" className="card">
          <p className="kicker">Worked records</p>
          <h2>Example claims</h2>
          <p>A vendor price, where the 30-day kind override wins, and a rodent half-life that a human figure cannot supersede.</p>
        </Link>
        <Link href="/standards/evidence-tier/0.1.0" className="card">
          <p className="kicker">Superseded</p>
          <h2>0.1.0</h2>
          <p>Archived code-stamped shape, including the freshness defect corrected in 0.1.1.</p>
        </Link>
      </div>
      <p className="lede" style={{ marginTop: "1.5rem" }}>
        <strong>Stability.</strong> Each version is frozen at its URL and never rewritten. Patch and minor releases
        stay backward compatible; a breaking change means a new major at a new URL. To depend on an exact shape, cite
        a pinned patch such as <code>0.1.1</code> rather than <code>v0.1</code>. The full rule, including the
        deprecation window, is in the <Link href="/changelog#versioning">versioning policy</Link>.
      </p>
    </article>
  );
}
