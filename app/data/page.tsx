import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Open data",
  description: "CC BY 4.0 exports: compound identity table, half-lives, trials index snapshot, and structured references.",
  alternates: { canonical: "/data" },
};

const FILES = [
  {
    href: "/data/compounds.json",
    title: "compounds.json",
    body: "111 catalog entries. Slug, name, aliases, categories, formula, molecular weight, sequence, CAS, PubChem CID, UniProt, approval flag, and synthesis features. The full narrative monographs live with the catalog on americanpeptide.com.",
  },
  {
    href: "/data/compounds.csv",
    title: "compounds.csv",
    body: "The same table. List fields are joined with a vertical bar.",
  },
  {
    href: "/data/pk-half-lives.json",
    title: "pk-half-lives.json",
    body: "44 half-life rows the pharmacokinetic helpers read, including nulls where no human figure is stored, plus the source note beside each row.",
  },
  {
    href: "/data/trials-index.json",
    title: "trials-index.json",
    body: "25-study snapshot from the ClinicalTrials.gov API v2, five studies for each of five query terms, retrieved 18 November 2026 (America/Chicago). Status fields go stale; re-query upstream before citing one.",
  },
  {
    href: "/data/references.json",
    title: "references.json",
    body: "Structured labels, PMIDs, and registries named by the methods pages and the half-life notes.",
  },
];

export default function DataPage() {
  return (
    <article>
      <p className="kicker">Data · CC BY 4.0</p>
      <h1 className="page-title">Dataset exports</h1>
      <p className="lede">
        Identity tables and the inputs the calculators actually use — the same records that feed the catalog and
        tools on americanpeptide.com. You can copy them, with attribution to the American Peptide Project and a link
        to the file’s version.
      </p>
      <div className="cite">
        <p>
          American Peptide Project. Compound identity table. Version 2026-11-18.{" "}
          <a href="https://americanpeptide.org/data/compounds.json">https://americanpeptide.org/data/compounds.json</a>
        </p>
        <p className="meta">
          License <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. PubChem and ClinicalTrials.gov
          remain the authoritative upstream records; these files are a reduced extract.
        </p>
      </div>
      <div className="grid">
        {FILES.map((file) => (
          <a key={file.href} href={file.href} className="card">
            <h2>{file.title}</h2>
            <p>{file.body}</p>
          </a>
        ))}
      </div>
      <p style={{ marginTop: "1.6rem" }}>
        Schema for claims, not rows: <Link href="/standards/evidence-tier/v0.1">Evidence Tier Schema v0.1</Link>.
      </p>
    </article>
  );
}
