import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Public changelog for americanpeptide.org specifications, methods, and dataset snapshots.",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return (
    <article className="prose">
      <p className="kicker">Changelog</p>
      <h1>What changed, in public</h1>
      <p>
        Spec versions are frozen at their URLs. This log is append-only. Corrections to a published spec are also
        recorded under <Link href="/errata">errata</Link> and do not rewrite the old page.
      </p>
      <h2>2026-11-19 — method section anchors</h2>
      <ul>
        <li>
          Reconstitution, blend, and pharmacokinetic method pages list their sections and give each heading a
          fragment. The reconstitution formulas are{" "}
          <Link href="/methods/reconstitution#formulas">/methods/reconstitution#formulas</Link>.
        </li>
      </ul>
      <h2>2026-11-19 — example claims</h2>
      <ul>
        <li>
          Published two records that satisfy schema 0.1.1:{" "}
          <a href="/standards/evidence-tier/0.1.1/examples/vendor-price.json">a vendor price</a> and{" "}
          <a href="/standards/evidence-tier/0.1.1/examples/rodent-half-life.json">a rodent half-life</a>. The reading
          copy is <Link href="/standards/evidence-tier/examples">example claims</Link>.
        </li>
      </ul>
      <h2>2026-11-19 — section anchors</h2>
      <ul>
        <li>
          Spec headings now have stable fragment ids, and each spec page lists them. A section can be cited as{" "}
          <a href="/standards/evidence-tier/v0.1#4-freshness-and-revalidation">
            /standards/evidence-tier/v0.1#4-freshness-and-revalidation
          </a>
          .
        </li>
      </ul>
      <h2>2026-11-18 — citation forms</h2>
      <ul>
        <li>
          Published <Link href="/cite">how to cite</Link>, with BibTeX for Evidence Tier Schema 0.1.1 and the
          2026-11-18 dataset snapshot. The suggested citation also sits at the top of each spec page.
        </li>
      </ul>
      <h2>2026-11-18 — site opens</h2>
      <ul>
        <li>
          Published <Link href="/standards/evidence-tier/v0.1">Evidence Tier Schema v0.1</Link>, frozen to patch
          0.1.1, with JSON Schema. Patch pins:{" "}
          <Link href="/standards/evidence-tier/0.1.1">0.1.1</Link> and archived{" "}
          <Link href="/standards/evidence-tier/0.1.0">0.1.0</Link>.
        </li>
        <li>
          Recorded erratum <Link href="/errata#e-001">E-001</Link>: the 0.1.0 freshness table mixed an estimate kind
          into the tier column. 0.1.1 states that the kind override wins and <code>commercial</code> is 30 days.
        </li>
        <li>
          Published methods for <Link href="/methods/reconstitution">reconstitution</Link>,{" "}
          <Link href="/methods/blend">blends</Link>, and{" "}
          <Link href="/methods/pharmacokinetics">pharmacokinetics</Link>, matching the reference modules.
        </li>
        <li>
          Released dataset snapshot 2026-11-18: compound identity (111 rows), half-life inputs (44 rows), trials
          index (25 studies), and structured references. License CC BY 4.0.
        </li>
      </ul>
      <h2>Before this site</h2>
      <ul>
        <li>
          Schema 0.1.0 existed as code in the americanpeptide.com repository (<code>SCHEMA_VERSION</code>) without a
          citable URL. The written spec begins with the 0.1.1 text published here.
        </li>
      </ul>
    </article>
  );
}
