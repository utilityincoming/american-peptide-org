import claim from "@/public/standards/evidence-tier/0.1.1/examples/rodent-half-life.json";
import { releasePath } from "@/lib/releases";
import styles from "./PublicationVisuals.module.css";

const spec = releasePath(claim.provenance.schema_version);
const retrieved = new Date(claim.provenance.retrieved_at).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Chicago",
});

export function WorkedExample() {
  return (
    <section className={styles.panel}>
      <h2>Rodent half-life</h2>
      <p>Illustrative schema fixture · Version {claim.provenance.schema_version}</p>
      <dl className={styles.facts}>
        <div><dt>Fixture value</dt><dd>{claim.value} {claim.unit}</dd></div>
        <div><dt>Provenance tier</dt><dd><code>{claim.tier}</code></dd></div>
        <div><dt>Scope</dt><dd><code>{claim.scope}</code></dd></div>
        <div><dt>Freshness in fixture</dt><dd>{claim.freshness}</dd></div>
        <div><dt>Retrieved</dt><dd><time dateTime={claim.provenance.retrieved_at}>{retrieved}</time></dd></div>
      </dl>
      <p className={styles.scope}><strong>Scope note.</strong> {claim.scope_note}</p>
      <p>No kind override applies. The revalidation window is 24 months. A human subcutaneous claim has a different scope, so it cannot supersede this record.</p>
      <a href={`${spec}/examples/rodent-half-life.json`}>Cite the versioned example record (JSON)</a>
    </section>
  );
}
