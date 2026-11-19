import Link from "next/link";

const CARDS = [
  {
    href: "/standards/evidence-tier/v0.1",
    kicker: "Cite this",
    title: "Evidence Tier Schema 0.1.1",
    body: "A versioned spec for claim-level provenance. The public text of the 0.1 line, with a JSON Schema and a changelog.",
  },
  {
    href: "/methods",
    kicker: "How the numbers are made",
    title: "Calculator methods",
    body: "Reconstitution, blend draws, the beta blend screen, and single-compartment pharmacokinetics: formulas, assumptions, edge cases, and the unit-arithmetic scope note.",
  },
  {
    href: "/data",
    kicker: "CC BY 4.0",
    title: "Dataset exports",
    body: "Compound identity table, half-life inputs, a ClinicalTrials.gov snapshot, and structured references.",
  },
  {
    href: "/open-source",
    kicker: "MIT",
    title: "Reference modules",
    body: "The calculators as dependency-free TypeScript, and the tier schema as JSON you can validate against.",
  },
];

export default function HomePage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "American Peptide public methods",
    url: "https://americanpeptide.org/",
    description:
      "Companion site to americanpeptide.com. Publishes the evidence tier schema, calculator methodology, and open data.",
    publisher: { "@type": "Organization", name: "American Peptide Project", url: "https://americanpeptide.org/" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="hero">
        <p className="kicker">Companion to americanpeptide.com</p>
        <h1>Standards you can cite.</h1>
        <p className="lede">
          americanpeptide.com runs the catalog, the agent, and the bench calculators. This site is the record those
          tools follow: the evidence-tier schema, the math behind each calculator, and the tables under an open
          license.
        </p>
      </section>
      <div className="grid">
        {CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="card">
            <p className="kicker">{card.kicker}</p>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </Link>
        ))}
      </div>
      <section style={{ marginTop: "2.4rem", maxWidth: "46rem" }}>
        <h2 className="kicker">Current public versions</h2>
        <ul>
          <li>
            <Link href="/standards/evidence-tier/v0.1">Evidence Tier Schema v0.1</Link> — frozen to patch 0.1.1
            (18 November 2026). <Link href="/standards/evidence-tier/0.1.0">0.1.0 is archived</Link>.
          </li>
          <li>
            Open erratum <Link href="/errata#e-001">E-001</Link> records the 0.1.0 freshness ambiguity and the
            correction.
          </li>
          <li>
            Dataset snapshot <time dateTime="2026-11-18">18 November 2026</time>. See the{" "}
            <Link href="/changelog">changelog</Link> and the <Link href="/cite">citation forms</Link>.
          </li>
        </ul>
      </section>
    </>
  );
}
