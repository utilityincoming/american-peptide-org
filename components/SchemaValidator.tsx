"use client";

import { useEffect, useRef, useState } from "react";
import type { ErrorObject, ValidateFunction } from "ajv";
import { citation, citationFile } from "@/lib/citations";
import { CURRENT_SCHEMA, releases, releasePath } from "@/lib/releases";

function section(error: ErrorObject, version: string, provenanceOnly: boolean) {
  if (version === "0.1.0") return "what-0-1-0-defined";
  const field = error.params.missingProperty ?? error.params.additionalProperty ?? error.instancePath.split("/")[1];
  if (provenanceOnly || error.instancePath.startsWith("/provenance")) {
    return field === "retrieved_at" || error.instancePath.endsWith("/retrieved_at")
      ? "4-freshness-and-revalidation" : "3-the-claim-record";
  }
  if (field === "tier") return "2-tiers";
  if (field === "scope_note") return "5-scope-notes";
  if (field === "freshness" || error.instancePath.endsWith("/retrieved_at")) return "4-freshness-and-revalidation";
  if (field === "superseded_by") return "8-supersession";
  return "3-the-claim-record";
}

const validators = new Map<string, Promise<ValidateFunction>>();
function getValidator(version: string, provenanceOnly: boolean) {
  const key = `${version}:${provenanceOnly}`;
  const existing = validators.get(key);
  if (existing) return existing;
  const pending = Promise.all([
    import("ajv/dist/2020"), import("ajv-formats"), fetch(`${releasePath(version)}/schema.json`),
  ]).then(async ([{ default: Ajv }, { default: addFormats }, response]) => {
    if (!response.ok) throw new Error("The selected schema could not be loaded.");
    const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
    addFormats(ajv);
    const schema = await response.json();
    if (!provenanceOnly) return ajv.compile(schema);
    ajv.addSchema(schema);
    return ajv.compile({ $ref: `${schema.$id}#/properties/provenance` });
  }).catch((error: unknown) => {
    validators.delete(key);
    throw error;
  });
  validators.set(key, pending);
  return pending;
}

export default function SchemaValidator() {
  const [version, setVersion] = useState<string>(CURRENT_SCHEMA);
  const [provenanceOnly, setProvenanceOnly] = useState(false);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ErrorObject[]>([]);
  const request = useRef(0);

  useEffect(() => {
    const selected = new URLSearchParams(location.search).get("version");
    if (selected && releases.some((release) => release.version === selected)) setVersion(selected);
  }, []);

  function reset() {
    request.current++;
    setErrors([]);
    setMessage("");
  }

  async function read(file?: File) {
    if (!file) return;
    reset();
    const id = request.current;
    try {
      const content = await file.text();
      if (id === request.current) setInput(content);
    } catch {
      if (id === request.current) setMessage("The selected file could not be read.");
    }
  }

  async function validate(event: React.FormEvent) {
    event.preventDefault();
    reset();
    const id = request.current;
    let record: unknown;
    try {
      record = JSON.parse(input);
    } catch (error) {
      setMessage(`Invalid JSON. ${error instanceof Error ? error.message : ""}`);
      return;
    }
    setMessage("Checking record…");
    try {
      const check = await getValidator(version, provenanceOnly);
      if (id !== request.current) return;
      const valid = check(record);
      setErrors(check.errors ?? []);
      setMessage(valid ? `Valid under JSON Schema ${version}.` : `Invalid under JSON Schema ${version}.`);
    } catch {
      if (id === request.current) setMessage("The selected schema could not be loaded. Try again.");
    }
  }

  const record = citation("/standards/evidence-tier/validate", { to: version })!;
  return <form className="validator" onSubmit={validate}>
    <div className="tool-controls">
      <label>Schema release <select value={version} onChange={(event) => { reset(); setVersion(event.target.value); }}>
        {releases.map(({ version }) => <option key={version}>{version}</option>)}
      </select></label>
      <label>Record type <select value={provenanceOnly ? "provenance" : "claim"} onChange={(event) => {
        reset(); setProvenanceOnly(event.target.value === "provenance");
      }}>
        <option value="claim">Claim</option><option value="provenance">Provenance</option>
      </select></label>
      <label>Open JSON file <input type="file" accept=".json,application/json" onChange={(event) => {
        void read(event.target.files?.[0]);
        event.target.value = "";
      }} /></label>
    </div>
    <label htmlFor="claim-json">Paste a JSON record or drop a JSON file here.</label>
    <textarea id="claim-json" rows={14} value={input} spellCheck={false}
      onChange={(event) => { reset(); setInput(event.target.value); }}
      onDragOver={(event) => { if (event.dataTransfer.types.includes("Files")) event.preventDefault(); }}
      onDrop={(event) => { if (event.dataTransfer.files.length) { event.preventDefault(); void read(event.dataTransfer.files[0]); } }} />
    <p><a href={citationFile(record.key, "bib")} download>Cite schema selection (BibTeX)</a>{" · "}<a href={citationFile(record.key, "json")}>DataCite metadata</a></p>
    <button type="submit" disabled={!input.trim()}>Validate JSON</button>
    <p role="status">{message}</p>
    {errors.length > 0 && <ul>{errors.map((error, index) =>
      <li key={index}><code>{error.instancePath || "/"}</code> {error.message}{" · "}
        <a href={`${releasePath(version)}#${section(error, version, provenanceOnly)}`}>Spec section</a>{" · "}
        <code>{error.schemaPath}</code>
      </li>)}</ul>}
  </form>;
}
