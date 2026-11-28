import { COM } from "@/lib/site";
import styles from "./PublicationVisuals.module.css";

export function PropertyRelationship() {
  return (
    <figure className={styles.panel}>
      <figcaption>
        <h2>Publications and tools</h2>
        <p>Published specifications, methods, and data inform corresponding tools.</p>
      </figcaption>
      <div className={styles.relationship}>
        <section className={styles.node}>
          <h3>AmericanPeptide.org</h3>
          <ul>
            <li><a href="/standards/evidence-tier">Evidence standards</a></li>
            <li><a href="/methods">Published methods</a></li>
            <li><a href="/data">Versioned datasets</a></li>
          </ul>
        </section>
        <svg viewBox="0 0 40 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M3 12h32m-8-7 8 7-8 7" stroke="currentColor" strokeWidth="2" />
        </svg>
        <section className={styles.node}>
          <h3><a href={COM}>AmericanPeptide.com</a></h3>
          <ul>
            <li>Live catalog</li>
            <li>Peptide Agent</li>
            <li>Interactive tools</li>
          </ul>
        </section>
      </div>
    </figure>
  );
}
