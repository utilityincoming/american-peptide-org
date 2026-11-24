export const EVIDENCE_ROOT = "/standards/evidence-tier";
export const DATASET_SNAPSHOT = "2026-11-18";

export const releases = [
  { version: "0.1.0", date: "2026-11-18", notes: "evidence-tier-0.1.0", terms: {} },
  {
    version: "0.1.1", date: "2026-11-18", notes: "evidence-tier-0.1.1",
    terms: {
      scope: { status: "added", anchor: "3-the-claim-record" },
      "estimate_kind.commercial": { status: "changed", anchor: "4-freshness-and-revalidation", erratum: "e-001" },
      freshness: { status: "changed", anchor: "4-freshness-and-revalidation", erratum: "e-001" },
    },
  },
] as const satisfies readonly {
  version: string;
  date: string;
  notes: string;
  terms: Record<string, { status: "added" | "changed" | "deprecated"; anchor: string; erratum?: string }>;
}[];

export const CURRENT_SCHEMA = releases[releases.length - 1].version;
export const releasePath = (version: string) => `${EVIDENCE_ROOT}/${version}`;
