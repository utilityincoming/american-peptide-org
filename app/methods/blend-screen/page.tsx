import type { Metadata } from "next";
import Link from "next/link";
import { SectionNav } from "@/components/SectionNav";
import { COM } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blend screen method",
  description:
    "Post-reconstitution flags for the American Peptide blend calculator: charge, pI, GRAVY, cysteines, and labeled syringe incompatibilities.",
  alternates: { canonical: "/methods/blend-screen" },
};

export default function Page() {
  return (
    <article className="prose">
      <p className="kicker">Method · reference tier · beta</p>
      <h1>Blend screen</h1>
      <p className="meta">
        Tool: <a href={`${COM}/tools/blend-calculator`}>{COM}/tools/blend-calculator</a>
        {" · "}
        Module: <code>packages/calculators/blend-screen.ts</code>
        {" · "}
        Checked against american-peptide <code>d35605d66498</code>
      </p>
      <SectionNav
        items={[
          { id: "what-it-answers", label: "What it answers" },
          { id: "rules", label: "Rules" },
          { id: "worked-examples", label: "Worked examples" },
          { id: "assumptions", label: "Assumptions" },
          { id: "edge-cases", label: "Edge cases" },
          { id: "scope-note", label: "Scope note" },
        ]}
      />
      <h2 id="what-it-answers">What it answers</h2>
      <p>
        The <Link href="/methods/blend">blend draw</Link> still counts doses. This screen is the extra pass the beta
        tool runs after a catalog peptide is chosen. It estimates whether peptides that are already in solution are
        likely to associate, and it repeats the incompatibilities written on a product label.
      </p>
      <p>
        The website resolves a slug against its catalog, then passes the sequence and a copper flag into this module.
        The catalog stays in the application repository. A row with a name and no sequence is reported as unresolved.
        Charge, pI, and GRAVY are skipped for that row.
      </p>
      <h2 id="rules">Rules</h2>
      <p>
        Buffer pH defaults to 5.7 and is clamped to [0, 14]. Charge is Henderson–Hasselbalch with the Lehninger pKa
        set (N-terminus 9.69, C-terminus 2.34, C 8.33, D 3.65, E 4.25, H 6.00, K 10.53, R 12.48, Y 10.07). The
        isoelectric point is the bisection zero of that charge on [0, 14]. GRAVY is the mean Kyte–Doolittle
        hydropathy.
      </p>
      <pre className="formula">{`near the pI               |pI − pH| ≤ 1
opposite charge           both |z| ≥ 0.5 and the signs differ
strongly hydrophobic      GRAVY ≥ 0.5
fibril slugs              glucagon, amylin, insulin
labeled pair              pramlintide + insulin
copper–thiol              copper flag on one row, cysteine on the other`}</pre>
      <p>
        Levels are <code>warn</code>, then <code>caution</code>, then <code>info</code>. Three standing notes always
        travel with the result: do not co-store a blend, swirl rather than shake, and keep warned pairs in separate
        syringes. Those notes are cautions. They are not a mixing procedure.
      </p>
      <h2 id="worked-examples">Worked examples</h2>
      <p>
        Pramlintide and insulin at pH 5.7 raise <code>labeled-incompatibility</code>. The detail cites the Symlin
        prescribing information: do not mix them in the same syringe. Glucagon at the same pH raises{" "}
        <code>fibril</code>. Pramlintide’s sequence contains cysteines, so <code>cysteine</code> fires with it.
      </p>
      <p>
        GHK-Cu (sequence GHK, copper flag set) and BPC-157 at pH 7.4 carry opposite net charge, so{" "}
        <code>opposite-charge</code> fires. BPC-157 has no cysteine, so <code>copper-thiol</code> does not. Passing
        the buffer as BPC-157’s own pI raises <code>near-pi</code>. Two copies of glucagon do not raise{" "}
        <code>opposite-charge</code>.
      </p>
      <h2 id="assumptions">Assumptions</h2>
      <ul>
        <li>Each peptide is already dissolved. The screen does not choose a diluent or a mixing order.</li>
        <li>The sequence is the unmodified single-letter chain. Fatty-acid chains, disulfides, and amidation do not change the charge.</li>
        <li>A copper complex is a caller-supplied flag. GHK alone does not imply copper.</li>
        <li>Fibril and labeled-pair rules match catalog slugs, not display names.</li>
        <li>The draw math and this screen do not feed each other. An over-fraction warning does not change a charge flag, and a gel flag does not change the dose count.</li>
      </ul>
      <h2 id="edge-cases">Edge cases</h2>
      <ul>
        <li>A non-finite pH falls back to 5.7. Values outside 0–14 clamp to the nearer end.</li>
        <li>An empty sequence with a slug still participates in slug rules and records <code>no-sequence</code>.</li>
        <li>A typed name with no slug and no sequence is listed under unresolved and is skipped.</li>
        <li>Chain labels in a stored sequence are stripped to letters, so insulin’s A and B chains are scored as one string.</li>
      </ul>
      <h2 id="scope-note">Scope note</h2>
      <p className="note">
        Sequence arithmetic and a short list of labeled incompatibilities. This is a hypothesis, not a formulation
        study and not a dosing recommendation. A clear screen does not mean the peptides can share a vial.
      </p>
      <p>
        <Link href="/methods/blend">Blend draws</Link>
        {" · "}
        <Link href="/methods">All methods</Link>
      </p>
    </article>
  );
}
