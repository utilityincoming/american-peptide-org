import { AssetPicture } from "@/components/AssetPicture";
import { releases, releasePath } from "@/lib/releases";
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
      <h2>Evidence Tier Schema releases</h2>
      <p><Link href="/standards/evidence-tier/compare">Compare released versions</Link></p>
      <div className="release-covers">{releases.map((release) => <figure key={release.version} id={release.notes}>
        <AssetPicture name={`release-${release.version}`} width={250} height={120} alt="" />
        <figcaption><Link href={releasePath(release.version)}>Evidence Tier Schema {release.version}</Link>
          {" · "}<time dateTime={release.date}>{release.date}</time>
          <ul>{Object.entries(release.terms).map(([name, term]) => <li key={name}>
            <Link href={`${releasePath(release.version)}#${term.anchor}`}><code>{name}</code></Link> · {term.status}
          </li>)}</ul>
        </figcaption>
      </figure>)}</div>
      <p className="meta"><a href="/assets/LICENSE.md">Release art · CC BY 4.0</a></p>
      <h2 id="versioning">Versioning policy</h2>
      <p>
        Versions follow <code>MAJOR.MINOR.PATCH</code>. The rule is about what a citation can rely on, not about how
        much text changed.
      </p>
      <ul>
        <li>
          <strong>Patch</strong> (<code>0.1.0</code> → <code>0.1.1</code>): clarifications and errata. No field is
          added, removed, renamed, or given a new meaning, so a record valid under the old patch is still valid. The
          frozen <Link href="/standards/evidence-tier/v0.1">v0.1</Link> URL tracks the newest patch; a path like{" "}
          <Link href="/standards/evidence-tier/0.1.1">0.1.1</Link> pins one exactly.
        </li>
        <li>
          <strong>Minor</strong> (<code>0.1.x</code> → <code>0.2.0</code>): additive and backward compatible. New
          optional fields or tiers may appear; existing ones keep their meaning. Records valid under the prior minor
          stay valid. Each minor gets its own frozen URL.
        </li>
        <li>
          <strong>Major</strong> (<code>0.x</code> → <code>1.0</code>): breaking. A field may be removed, made
          required, or redefined. A new major is published at a new URL and the previous major is marked superseded
          but is never deleted or rewritten.
        </li>
      </ul>
      <p>
        <strong>Deprecation.</strong> Before a field or tier is removed in a later major, it is marked deprecated in a
        minor release and stays accepted for at least one subsequent minor, with the replacement named here and in
        the spec text. Superseded versions remain resolvable at their URLs indefinitely; see{" "}
        <Link href="/standards/evidence-tier/0.1.0">0.1.0</Link> for an archived example. To depend on a specific
        shape, cite a pinned patch URL rather than <code>v0.1</code>.
      </p>
      <h2>2026-11-19 — blend screen</h2>
      <ul>
        <li>
          Published the beta post-reconstitution screen:{" "}
          <Link href="/methods/blend-screen">/methods/blend-screen</Link>, with{" "}
          <code>packages/calculators/blend-screen.ts</code> checked against american-peptide{" "}
          <code>d35605d66498</code> (pull request 203). The module takes a sequence and a copper flag. It does not
          ship the catalog.
        </li>
        <li>
          The blend module now returns the over-delivery sentence when the over fraction is above 0.02, the same
          highlight the website already used.
        </li>
      </ul>
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
