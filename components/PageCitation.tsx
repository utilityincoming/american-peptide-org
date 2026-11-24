"use client";

import { usePathname } from "next/navigation";
import { citation, citationFile } from "@/lib/citations";
import { DATASET_SNAPSHOT } from "@/lib/releases";

export default function PageCitation() {
  const path = usePathname();
  const record = citation(path);
  if (!record) return null;
  return <p>
    <a href={citationFile(record.key, "bib")} download>Cite this page (BibTeX)</a>{" · "}
    <a href={citationFile(record.key, "json")}>DataCite metadata</a>{" · "}
    Schema {record.version} · Snapshot {DATASET_SNAPSHOT}
  </p>;
}
