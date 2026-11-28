import claim from "@/public/data/examples/glutathione-formula-2026-11-28.json";
import styles from "./PublicationVisuals.module.css";

const { provenance } = claim;
const sourceData = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${provenance.source_id}/property/MolecularFormula/JSON`;

export function ClaimSourceTrace() {
  return (
    <figure id="glutathione-formula" className={styles.panel}>
      <figcaption>
        <h2>From source to claim</h2>
        <p>Glutathione’s molecular formula, traced from a registry entry to an Evidence Tier claim.</p>
      </figcaption>
      <div className={styles.relationship}>
        <section className={styles.node}>
          <h3>Registry record</h3>
          <dl className={styles.traceFields}>
            <div><dt>Compound</dt><dd>Glutathione</dd></div>
            <div>
              <dt>Registry identifier</dt>
              <dd><a href={provenance.source_url}>{provenance.source_name} CID {provenance.source_id}</a></dd>
            </div>
            <div><dt>Reported formula</dt><dd><code>{claim.value}</code></dd></div>
          </dl>
          <p><a href={sourceData}>View the PubChem property response</a></p>
        </section>
        <svg viewBox="0 0 40 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M3 12h32m-8-7 8 7-8 7" stroke="currentColor" strokeWidth="2" />
        </svg>
        <section className={styles.node}>
          <h3>Evidence Tier record</h3>
          <dl className={styles.traceFields}>
            <div><dt><code>{claim.field}</code></dt><dd><code>{claim.value}</code> · copied from the registry</dd></div>
            <div><dt>Provenance tier</dt><dd><code>{claim.tier}</code> · registry lookup</dd></div>
            <div><dt>Retrieved</dt><dd><time dateTime={provenance.retrieved_at}>{provenance.retrieved_at.slice(0, 10)} UTC</time> · logged at lookup</dd></div>
            <div><dt>Scope note</dt><dd>{claim.scope_note}</dd></div>
          </dl>
        </section>
      </div>
      <p><a href={`/data/examples/glutathione-formula-${provenance.retrieved_at.slice(0, 10)}.json`} download>Download the dated claim record (JSON)</a></p>
    </figure>
  );
}
