import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { indexRows, type Row } from "@/packages/compound-history/diff";

export const compoundHistoryPath = "/data/compound-history";

type Release = {
  date: string;
  previous?: string;
  notes?: Record<string, { reason: string; source: string }>;
};

export const compoundReleases: readonly Release[] = [
  { date: "2026-11-18" },
];

export function readCompoundSnapshot(date: string) {
  if (!compoundReleases.some((release) => release.date === date)) {
    throw new Error(`Unregistered compound snapshot: ${date}`);
  }
  const directory = join(process.cwd(), "public", "data", date);
  const manifest = JSON.parse(readFileSync(join(directory, "manifest.json"), "utf8")) as {
    id: string; snapshot: string; rowCount: number; files: { json: { url: string; sha256: string } };
  }[];
  const entry = manifest.find(({ id }) => id === "compounds");
  const file = readFileSync(join(directory, "compounds.json"));
  const url = `/data/${date}/compounds.json`;
  if (entry?.snapshot !== date || entry.files.json.url !== url ||
      entry.files.json.sha256 !== createHash("sha256").update(file).digest("hex")) {
    throw new Error(`Compound snapshot does not match its manifest: ${date}`);
  }
  const data = JSON.parse(file.toString("utf8")) as { version: string; compounds: Row[] };
  if (data.version !== date || indexRows(data.compounds).size !== entry.rowCount) {
    throw new Error(`Compound snapshot version or row count mismatch: ${date}`);
  }
  return { date, url, rows: data.compounds, sha256: entry.files.json.sha256, manifest: `/data/${date}/manifest.json` };
}
