import { releasePath } from "@/lib/releases";
import styles from "./PublicationVisuals.module.css";

const spec = releasePath("0.1.1");
const tiers = [
  { id: "reference", weight: 60, hue: "teal", note: "Registry lookup or arithmetic from stated inputs. A scope note is recommended." },
  { id: "clinical", weight: 50, hue: "teal", note: "Human trial data. A scope note is optional." },
  { id: "preclinical", weight: 40, hue: "slate", note: "Non-human data. Document limits on applying the finding to humans." },
  { id: "third_party", weight: 30, hue: "slate", note: "One independent assay of one lot. Document the lot-specific scope." },
  { id: "vendor_reported", weight: 20, hue: "amber", note: "Supplier-reported. Disclose the absence of independent verification." },
  { id: "community", weight: 10, hue: "amber", note: "Aggregated user reports. State what those reports can establish." },
] as const;

export function EvidenceTierDiagram() {
  return (
    <figure className={styles.panel}>
      <figcaption>
        <h2>Provenance tiers and weights</h2>
        <p>Open a tier to see its scope-note guidance. A scope note is required below clinical.</p>
      </figcaption>
      <ol className={styles.tiers}>
        {tiers.map(({ id, weight, hue, note }) => (
          <li key={id} className={styles[hue]}>
            <details>
              <summary>
                <code>{id}</code>
                <svg viewBox="0 0 60 8" aria-hidden="true" focusable="false">
                  <rect width="60" height="8" rx="4" className={styles.track} />
                  <rect width={weight} height="8" rx="4" fill="currentColor" />
                </svg>
                <span>{weight}</span>
              </summary>
              <p>{note}</p>
            </details>
          </li>
        ))}
      </ol>
      <a href={`${spec}#5-scope-notes`}>Scope-note rules in Evidence Tier Schema 0.1.1</a>
    </figure>
  );
}
