import type { ReactNode } from "react";
import styles from "./PublicationVisuals.module.css";

export function ReleasePanel({ title, version, license, children }: {
  title: string;
  version: ReactNode;
  license: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby="release-heading" className={styles.panel}>
      <h2 id="release-heading">{title}</h2>
      <p>{version} · <a href={license}>CC BY 4.0</a></p>
      {children}
    </section>
  );
}
