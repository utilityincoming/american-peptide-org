import fs from "node:fs/promises";
import SchemaDiff from "@/components/SchemaDiff";
import { releases, releasePath } from "@/lib/releases";

export const metadata = { title: "Compare Evidence Tier Schema releases", alternates: { canonical: "/standards/evidence-tier/compare" } };

export default async function ComparePage() {
  const schemas = Object.fromEntries(await Promise.all(releases.map(async ({ version }) => [
    version, JSON.parse(await fs.readFile(`public${releasePath(version)}/schema.json`, "utf8")),
  ])));
  return <article>
    <p className="kicker">Evidence Tier Schema</p>
    <h1 className="page-title">Compare releases</h1>
    <p className="lede">Compare published JSON Schema terms and follow changelog entries to the wording of record.</p>
    <SchemaDiff schemas={schemas} />
  </article>;
}
