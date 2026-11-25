import fs from "node:fs";
import path from "node:path";
import { headingSlug, Markdown } from "@/lib/markdown";
import { publisher, SITE, website } from "@/lib/site";

export function SpecPage({
  file,
  version,
  canonical,
}: {
  file: string;
  version: string;
  canonical: string;
}) {
  const source = fs.readFileSync(path.join(process.cwd(), "content", file), "utf8");
  const sections = source
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const title = line.slice(3);
      return { title, id: headingSlug(title) };
    });
  const ld = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `American Peptide Evidence Tier Schema ${version}`,
    version,
    datePublished: "2026-11-18",
    inLanguage: "en",
    url: `${SITE}${canonical}`,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    author: publisher,
    publisher: { "@id": publisher["@id"] },
    isPartOf: website,
    "@id": `${SITE}${canonical}#article`,
    citation: `American Peptide Project. Evidence Tier Schema, version ${version}. 18 November 2026. ${SITE}${canonical}`,
  };
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="meta">
        Canonical URL <a href={canonical}>{canonical}</a>
        {" · "}
        <a href={`/standards/evidence-tier/${version === "0.1.0" ? "0.1.0" : "v0.1"}/schema.json`}>JSON Schema</a>
        {" · "}
        <a href="/cite">How to cite</a>
      </p>
      <div className="cite">
        <p>
          American Peptide Project. Evidence Tier Schema, version {version}. 18 November 2026. {SITE}
          {canonical}
        </p>
      </div>
      <nav className="toc" aria-label="Sections">
        <p className="kicker">Sections</p>
        <ol>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title.replace(/[`*]/g, "")}</a>
            </li>
          ))}
        </ol>
      </nav>
      <Markdown source={source} />
    </article>
  );
}
