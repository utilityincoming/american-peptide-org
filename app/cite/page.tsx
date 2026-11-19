import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to cite",
  description:
    "Suggested citations and BibTeX for the Evidence Tier Schema, calculator methods, and the 18 November 2026 dataset snapshot.",
  alternates: { canonical: "/cite" },
};

const SPEC = `American Peptide Project. Evidence Tier Schema, version 0.1.1. 18 November 2026. https://americanpeptide.org/standards/evidence-tier/v0.1`;

const METHODS = `American Peptide Project. Calculator methods: reconstitution, blend draws, and single-compartment pharmacokinetics. 18 November 2026. https://americanpeptide.org/methods`;

const DATA = `American Peptide Project. Compound identity table. Version 2026-11-18. https://americanpeptide.org/data/compounds.json`;

export default function CitePage() {
  return (
    <article className="prose">
      <p className="kicker">Citation</p>
      <h1>How to cite this record</h1>
      <p>
        Cite the URL that names the version you used. The v0.1 path is the line. A patch path is for a sentence that
        must name 0.1.1 or the archived 0.1.0 text. Dataset files are dated snapshots, not a living table.
      </p>

      <h2>Evidence Tier Schema</h2>
      <div className="cite">
        <p>{SPEC}</p>
        <p className="meta">
          <a href="/cite/evidence-tier-0.1.1.bib">BibTeX</a>
          {" · "}
          <Link href="/standards/evidence-tier/v0.1">Spec</Link>
          {" · "}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
        </p>
      </div>
      <p>
        Patch pin, when the citation has to say 0.1.1:{" "}
        <Link href="/standards/evidence-tier/0.1.1">/standards/evidence-tier/0.1.1</Link>. The superseded shape,
        including the freshness defect in erratum <Link href="/errata#e-001">E-001</Link>, stays at{" "}
        <Link href="/standards/evidence-tier/0.1.0">/standards/evidence-tier/0.1.0</Link>.
      </p>

      <h2>Calculator methods</h2>
      <div className="cite">
        <p>{METHODS}</p>
        <p className="meta">
          <Link href="/methods/reconstitution">Reconstitution</Link>
          {" · "}
          <Link href="/methods/blend">Blend</Link>
          {" · "}
          <Link href="/methods/pharmacokinetics">Pharmacokinetics</Link>
        </p>
      </div>
      <p>
        The reference modules are MIT. Cite the method page for the written assumptions, and the repository for the
        code: <Link href="/open-source">open source</Link>.
      </p>

      <h2>Dataset snapshot, 18 November 2026</h2>
      <div className="cite">
        <p>{DATA}</p>
        <p className="meta">
          <a href="/cite/datasets-2026-11-18.bib">BibTeX for the three tables</a>
          {" · "}
          <Link href="/data">All exports</Link>
        </p>
      </div>
      <p>
        Name the file you used. Half-life inputs are{" "}
        <a href="/data/pk-half-lives.json">pk-half-lives.json</a>. The trials index is{" "}
        <a href="/data/trials-index.json">trials-index.json</a>, a reduced ClinicalTrials.gov extract that goes stale.
        PubChem and ClinicalTrials.gov remain the upstream records.
      </p>
    </article>
  );
}
