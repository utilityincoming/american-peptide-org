"use client";

import { useEffect, useState } from "react";
import { citation, citationFile } from "@/lib/citations";
import { releases, releasePath } from "@/lib/releases";

type Schema = {
  required?: string[];
  properties: Record<string, Record<string, unknown>>;
  $defs?: Record<string, { enum?: string[]; properties?: Schema["properties"]; required?: string[] }>;
};
function terms(schema: Schema) {
  const entries = new Map<string, Record<string, unknown>>();

  function collect(fields: Schema["properties"], required: string[], prefix = "") {
    for (const [name, field] of Object.entries(fields)) {
      const key = `${prefix}${name}`;
      const reference = typeof field.$ref === "string" && field.$ref.startsWith("#/$defs/")
        ? schema.$defs?.[field.$ref.slice("#/$defs/".length)]
        : undefined;
      const definition = reference ?? field;
      const { properties, required: nestedRequired, ...attributes } = definition;
      entries.set(key, { ...attributes, required: required.includes(name) });
      if (Array.isArray(definition.enum)) {
        for (const member of definition.enum) entries.set(`${key}.${member}`, { const: member });
      }
      if (properties && typeof properties === "object") {
        collect(properties as Schema["properties"], Array.isArray(nestedRequired) ? nestedRequired : [], `${key}.`);
      }
    }
  }

  collect(schema.properties, schema.required ?? []);
  return entries;
}

const initial = [releases[0].version, releases[releases.length - 1].version];
const versionOr = (value: string | null, fallback: string) =>
  releases.some((release) => release.version === value) ? value! : fallback;

export default function SchemaDiff({ schemas }: { schemas: Record<string, Schema> }) {
  const [[left, right], setPair] = useState<string[]>(initial);
  useEffect(() => {
    function readLocation() {
      const query = new URLSearchParams(location.search);
      setPair([versionOr(query.get("from"), initial[0]), versionOr(query.get("to"), initial[1])]);
    }
    readLocation();
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, []);

  function select(from: string, to: string) {
    const url = new URL(location.href);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    history.pushState(null, "", url);
    setPair([from, to]);
  }

  const before = terms(schemas[left]);
  const after = terms(schemas[right]);
  const versions: string[] = releases.map(({ version }) => version);
  const start = Math.min(versions.indexOf(left), versions.indexOf(right));
  const end = Math.max(versions.indexOf(left), versions.indexOf(right));
  const notes = new Map<string, {
    status: "added" | "changed" | "deprecated"; anchor: string; erratum?: string;
    release: { version: string; notes: string };
  }>(releases.slice(start + 1, end + 1).flatMap((release) =>
    Object.entries(release.terms).map(([name, note]) => [name, { ...note, release }] as const)));
  const names = [...new Set([...before.keys(), ...after.keys(), ...notes.keys()])].sort();
  const record = citation("/standards/evidence-tier/compare", { from: left, to: right })!;
  return <>
    <div className="tool-controls">
      <label>Left release <select value={left} onChange={(event) => select(event.target.value, right)}>
        {versions.map((version) => <option key={version}>{version}</option>)}
      </select></label>
      <label>Right release <select value={right} onChange={(event) => select(left, event.target.value)}>
        {versions.map((version) => <option key={version}>{version}</option>)}
      </select></label>
    </div>
    <p><a href={citationFile(record.key, "bib")} download>Cite this comparison (BibTeX)</a>{" · "}<a href={citationFile(record.key, "json")}>DataCite metadata</a></p>
    <div className="table-scroll"><table className="diff-table">
      <thead><tr><th>Term</th><th><a href={releasePath(left)}>{left}</a></th><th><a href={releasePath(right)}>{right}</a></th></tr></thead>
      <tbody>{names.map((name) => {
        const a = before.get(name);
        const b = after.get(name);
        const note = notes.get(name);
        const status = !a && b ? "Added" : a && !b ? "Removed" : note?.status === "deprecated" ? "Deprecated" :
          note || JSON.stringify(a) !== JSON.stringify(b) ? "Changed" : "";
        const id = `term-${encodeURIComponent(name)}`;
        return <tr key={name} id={id} data-status={status}>
          <th scope="row"><a href={`#${id}`}><code>{name}</code></a>{status && <span className="term-status">{status}</span>}
            {note && <small><a href={`${releasePath(note.release.version)}#${note.anchor}`}>Spec</a>{" · "}
              <a href={`/changelog#${note.release.notes}`}>Log</a>
              {note.erratum && <>{" · "}<a href={`/errata#${note.erratum}`}>Erratum</a></>}
            </small>}
          </th>
          <td>{a ? <pre>{JSON.stringify(a, null, 2)}</pre> : "—"}</td>
          <td>{b ? <pre>{JSON.stringify(b, null, 2)}</pre> : "—"}</td>
        </tr>;
      })}</tbody>
    </table></div>
  </>;
}
