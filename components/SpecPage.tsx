import fs from "node:fs";
import path from "node:path";
import { Markdown } from "@/lib/markdown";
import { SITE } from "@/lib/site";

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
    author: { "@type": "Organization", name: "American Peptide Project", url: SITE },
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
      <Markdown source={source} />
    </article>
  );
}
