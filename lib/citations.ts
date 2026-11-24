import { CURRENT_SCHEMA, DATASET_SNAPSHOT, releases, releasePath } from "./releases";
import { REPO, SITE } from "./site";

const titles = {
  "/": "American Peptide public methods",
  "/standards/evidence-tier": "Evidence Tier Schema release index",
  "/standards/evidence-tier/v0.1": "Evidence Tier Schema",
  "/standards/evidence-tier/0.1.0": "Evidence Tier Schema",
  "/standards/evidence-tier/0.1.1": "Evidence Tier Schema",
  "/standards/evidence-tier/examples": "Evidence Tier Schema example claims",
  "/standards/evidence-tier/compare": "Evidence Tier Schema release comparison",
  "/standards/evidence-tier/validate": "Evidence Tier Schema validator",
  "/methods": "Calculator methods",
  "/methods/reconstitution": "Reconstitution",
  "/methods/blend": "Blend draws",
  "/methods/blend-screen": "Beta blend screen",
  "/methods/pharmacokinetics": "Single-compartment pharmacokinetics",
  "/data": "Dataset exports",
  "/cite": "How to cite this record",
  "/changelog": "Public changelog",
  "/errata": "Errata",
  "/open-source": "Open-source reference modules",
};

const datasetTitles: Record<string, string> = {
  compounds: "Compound identity table",
  "pk-half-lives": "Half-life inputs",
  "trials-index": "ClinicalTrials.gov snapshot",
};

export const paths = Object.keys(titles);
const revision = process.env.NEXT_PUBLIC_SOURCE_REVISION;
const deployment = process.env.NEXT_PUBLIC_RELEASE_ORIGIN;
const author = "American Peptide Project";
export const citationLicense = "https://creativecommons.org/licenses/by/4.0/";

export function citation(path: string, selected?: { from?: string; to: string }) {
  const dataset = path.startsWith("/data#") ? path.slice("/data#".length) : "";
  if (!Object.hasOwn(titles, path) && !Object.hasOwn(datasetTitles, dataset)) return null;
  const patch = releases.find(({ version }) => path === releasePath(version));
  const version = selected?.to ?? patch?.version ?? CURRENT_SCHEMA;
  const pinnedPath = path.endsWith("/v0.1") ? releasePath(version) : path;
  const title = dataset ? datasetTitles[dataset] : titles[path as keyof typeof titles];
  const query = new URLSearchParams();
  if (selected?.from) query.set("from", selected.from);
  if (selected) query.set(selected.from ? "to" : "version", selected.to);
  const key = [path === "/" ? "home" : path.slice(1).replace(/[\/#]/g, "-"),
    selected?.from, version, DATASET_SNAPSHOT].filter(Boolean).join("--");
  const frozenSpec = /^\/standards\/evidence-tier\/\d+\.\d+\.\d+$/.test(pinnedPath);
  const url = dataset
    ? `${SITE}/data/${DATASET_SNAPSHOT}/${dataset}.json`
    : `${frozenSpec || !deployment ? SITE : deployment}${pinnedPath}${query.size ? `?${query}` : ""}`;
  const source = revision && `${REPO}/blob/${revision}/app${path === "/" ? "" : path.split("#")[0]}/page.tsx`;
  const versionNote = revision && !frozenSpec && !dataset ? `; source revision ${revision}` : "";
  const versions = selected?.from ? `${selected.from} and ${version}` : version;
  const text = `${author}. ${title}. Evidence Tier Schema ${versions}; dataset snapshot ${DATASET_SNAPSHOT}${versionNote}. ${url}`;
  return { key, title, version, versions, from: selected?.from, url, text, path, source, versionNote, dataset };
}

const compare = "/standards/evidence-tier/compare";
const validate = "/standards/evidence-tier/validate";
export const citations = paths.flatMap((path) =>
  citation(path, path === validate ? { to: CURRENT_SCHEMA } : undefined) ?? []);

export const citationDownloads = [
  ...citations,
  ...Object.keys(datasetTitles).map((id) => citation(`/data#${id}`)!),
  ...releases.flatMap(({ version }) => [
    ...releases.map(({ version: from }) => citation(compare, { from, to: version })!),
    ...(version === CURRENT_SCHEMA ? [] : [citation(validate, { to: version })!]),
  ]),
];

export function bibtex(record: NonNullable<ReturnType<typeof citation>>) {
  return `@${record.dataset ? "dataset" : "misc"}{${record.key},
  author = {{${author}}},
  title = {{${record.title}}},
  publisher = {${author}},
  year = {${DATASET_SNAPSHOT.slice(0, 4)}},
  version = {${record.dataset ? DATASET_SNAPSHOT : record.versions}},
  note = {Dataset snapshot ${DATASET_SNAPSHOT}${record.versionNote}},
  url = {${record.url}}
}
`;
}

export function dataCite(record: NonNullable<ReturnType<typeof citation>>) {
  return {
    creators: [{ name: author, nameType: "Organizational" }],
    titles: [{ title: record.title }],
    publisher: author,
    publicationYear: Number(DATASET_SNAPSHOT.slice(0, 4)),
    types: { resourceTypeGeneral: record.dataset ? "Dataset" : "Text" },
    version: record.dataset ? DATASET_SNAPSHOT : record.versions,
    url: record.url,
    alternateIdentifiers: [{ alternateIdentifier: record.url, alternateIdentifierType: "URL" }],
    relatedIdentifiers: [
      ...(record.source ? [{ relatedIdentifier: record.source, relatedIdentifierType: "URL", relationType: "IsDerivedFrom" }] : []),
      ...[...new Set([record.from, record.version])].flatMap((version) => version ? [
        { relatedIdentifier: `${SITE}${releasePath(version)}`, relatedIdentifierType: "URL", relationType: "References" },
      ] : []),
      { relatedIdentifier: `${SITE}/data/${DATASET_SNAPSHOT}/manifest.json`, relatedIdentifierType: "URL", relationType: "References" },
    ],
    rightsList: [{ rights: "Creative Commons Attribution 4.0 International", rightsUri: citationLicense, rightsIdentifier: "CC-BY-4.0" }],
  };
}

export const citationFile = (key: string, ext: "bib" | "json") => `/cite/records/${key}.${ext}`;
