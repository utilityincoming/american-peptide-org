import type { Metadata } from "next";
import Link from "next/link";
import { COM, publisher, REPO, SITE, website } from "@/lib/site";

const description =
  "What the American Peptide Project publishes, how to cite and reuse its work, and how its publications relate to the interactive tools.";

export const metadata: Metadata = {
  title: "About the American Peptide Project",
  description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE}/about#page`,
    url: `${SITE}/about`,
    name: "About the American Peptide Project",
    description,
    about: publisher,
    isPartOf: website,
  };

  return (
    <article className="prose">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1>About the American Peptide Project</h1>
      <p>
        AmericanPeptide.org publishes public evidence standards, scientific and computational methods,
        reference implementations, and versioned datasets for peptide science.
      </p>
      <h2>Publications and tools</h2>
      <p>
        AmericanPeptide.org publishes the specifications and research data.{" "}
        <a href={COM}>AmericanPeptide.com</a> provides interactive calculators and a research catalog.
        Where a published method has a corresponding tool, the method page links to it.
      </p>
      <h2>Evidence and methodology</h2>
      <p>
        The <Link href="/standards/evidence-tier">Evidence Tier Schema</Link> defines how factual claims
        record provenance. The <Link href="/methods">calculator methods</Link> document formulas,
        assumptions, and scope. The <Link href="/data">dataset exports</Link> identify upstream sources
        and provide checksums and field schemas.
      </p>
      <h2>Versions, corrections, and citations</h2>
      <p>
        Use the <Link href="/changelog">changelog</Link> to track releases and <Link href="/errata">errata</Link>{" "}
        to find documented corrections. Cite the exact specification release or dated dataset snapshot
        you used. The <Link href="/cite">citation guide</Link> explains how to find versioned links and
        download citation records.
      </p>
      <h2 id="licensing">Licensing and reuse</h2>
      <p>
        The specification, schemas, datasets, and <Link href="/assets/LICENSE.md">artwork</Link> are available under{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. The{" "}
        <Link href="/open-source">calculator modules</Link> are available under the MIT License.
      </p>
      <h2>Project record</h2>
      <p>
        The American Peptide Project is credited as the publisher. The{" "}
        <a href={REPO}>public source repository</a> contains publication sources, release artifacts,
        and revision history.
      </p>
    </article>
  );
}
