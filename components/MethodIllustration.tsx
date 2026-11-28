import { AssetPicture } from "./AssetPicture";
import { calculatorSource, methods } from "@/lib/calculator-methods";
import styles from "./PublicationVisuals.module.css";

export default function MethodIllustration({ id }: { id: (typeof methods)[number]["id"] }) {
  const method = methods.find((entry) => entry.id === id)!;
  const rules = id === "blend-screen";

  return (
    <figure className={styles.panel}>
      <div className={styles.methodOverview}>
        <div className="method-art">
          <AssetPicture name={`method-${id}`} width={480} height={220} alt={method.imageAlt} />
        </div>
        <dl className={styles.traceFields}>
          <div><dt>Inputs</dt><dd>{method.inputs}</dd></div>
          <div><dt>Output</dt><dd>{method.output}</dd></div>
          <div><dt>Assumptions</dt><dd>{method.assumptions}</dd></div>
        </dl>
      </div>
      <figcaption>
        <ul className={styles.releaseLinks}>
          <li><a href={rules ? "#rules" : "#formulas"}>{rules ? "Rules" : "Formulas"}</a></li>
          <li><a href={calculatorSource(id)} download>Pinned TypeScript module</a></li>
          <li><a href="/assets/LICENSE.md">Artwork license</a></li>
        </ul>
      </figcaption>
    </figure>
  );
}
