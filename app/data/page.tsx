import visualStyles from "@/components/PublicationVisuals.module.css";
import { SectionHero } from "@/components/AssetPicture";
import type { Metadata } from "next";
import Link from "next/link";
import { citation, citationFile } from "@/lib/citations";
import { DATASET_SNAPSHOT } from "@/lib/releases";
import { publisher, SITE, SITE_NAME, website } from "@/lib/site";
import datasets from "@/public/data/2026-11-18/manifest.json";

export const metadata: Metadata = {
  title: "Open data",
  description: "Versioned CC BY 4.0 exports with checksums and field schemas.",
  openGraph: { type: "website", siteName: SITE_NAME, url: "/data", images: [{ url: "/assets/og-data.png", width: 1200, height: 630, alt: "Dataset exports. Public methods and standards." }] },
  twitter: { card: "summary_large_image", images: ["/assets/og-data.png"] },
  alternates: { canonical: "/data" },
};

export default function DataPage() {
  const formats: Record<string, string> = {
    json: "application/json",
    csv: "text/csv",
    parquet: "application/vnd.apache.parquet",
  };
  const ld = {
    "@context": "https://schema.org",
    "@graph": datasets.map((dataset) => ({
      "@type": "Dataset",
      "@id": `${SITE}${dataset.files.json.url}#dataset`,
      url: `${SITE}/data#${dataset.id}`,
      name: dataset.title,
      description: `${dataset.title}, a versioned export with ${dataset.rowCount} rows and a published field schema.`,
      version: dataset.snapshot,
      license: dataset.license,
      creator: publisher,
      isPartOf: website,
      distribution: Object.entries(dataset.files).map(([format, file]) => ({
        "@type": "DataDownload",
        encodingFormat: formats[format],
        contentUrl: `${SITE}${file.url}`,
      })),
    })),
  };

  return <article className="prose">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <p className="kicker">Data · CC BY 4.0</p>
    <h1>Dataset exports</h1>
      <SectionHero name="data" />
    <p>Attribute the American Peptide Project and link to the snapshot you used. PubChem and ClinicalTrials.gov remain the upstream records.</p>
    <section className={visualStyles.panel} aria-label="Snapshot comparison">
      <table className={visualStyles.snapshotTable}>
        <caption>Compare dataset snapshots</caption>
        <thead>
          <tr><th scope="col">Dataset</th><th scope="col">Snapshot</th><th scope="col">Downloads</th></tr>
        </thead>
        <tbody>
          {datasets.map(({ id, title, rowCount, snapshot, files }) => (
            <tr key={id}>
              <th scope="row"><a href={`#${id}`}>{title}</a><br />{rowCount} rows</th>
              <td><time dateTime={snapshot}>{snapshot}</time></td>
              <td>
                <ul className={visualStyles.formats}>
                  {Object.entries(files).map(([format, file]) => (
                    <li key={format}>
                      <a href={file.url} download aria-label={`Download ${title} as ${format.toUpperCase()}`}>
                        {format.toUpperCase()}
                      </a>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href={`/data/${DATASET_SNAPSHOT}/manifest.json`}>Download the machine-readable manifest</a>
    </section>
    {datasets.map((dataset) => <section key={dataset.id} id={dataset.id}>
      <h2>{dataset.title}</h2>
      <p>{dataset.rowCount} rows · Snapshot <time dateTime={dataset.snapshot}>{dataset.snapshot}</time> · <a href={dataset.license}>CC BY 4.0</a></p>
      {dataset.id === "trials-index" && <p>Five results per query at retrieval. Re-query <a href="https://clinicaltrials.gov/">ClinicalTrials.gov</a> for current status.</p>}
      <p className="meta"><a href={citationFile(citation(`/data#${dataset.id}`)!.key, "bib")} download>Cite dataset (BibTeX)</a>
        {" · "}<a href={citationFile(citation(`/data#${dataset.id}`)!.key, "json")}>DataCite metadata</a></p>
      <div className="table-scroll"><table className="file-table">
        <thead><tr><th scope="col">Download</th><th scope="col">SHA-256</th></tr></thead>
        <tbody>{Object.entries(dataset.files).map(([format, file]) =>
          <tr key={format}><th scope="row"><a href={file.url} download>{format.toUpperCase()}</a></th><td><code>{file.sha256}</code></td></tr>)}</tbody>
      </table></div>
      <details>
        <summary>Field schema</summary>
        <p>JSON rows are in <code>{dataset.rowKey}</code>. CSV uses JSON arrays for list cells and empty cells for nulls. Parquet preserves native types.</p>
        <dl>{Object.entries(dataset.rowSchema.properties).map(([field, definition]) =>
          <div key={field}><dt><code>{field}</code></dt><dd><pre className="formula">{JSON.stringify(definition, null, 2)}</pre></dd></div>)}</dl>
      </details>
    </section>)}
    <p><a href="/data/references.json">Structured references</a> · <Link href="/standards/evidence-tier/v0.1">Evidence Tier Schema for claims</Link></p>
  </article>;
}
