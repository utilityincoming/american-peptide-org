import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calculator methods",
  description: "Methodology for the American Peptide reconstitution, blend, and pharmacokinetic calculators.",
  alternates: { canonical: "/methods" },
};

export default function MethodsPage() {
  return (
    <article className="prose">
      <p className="kicker">Methods</p>
      <h1>How the calculators work</h1>
      <p>
        The interactive tools live on americanpeptide.com. These pages are the written method: the formula, the
        assumptions, the edge cases, and the scope note that belongs on any number the arithmetic produces.
      </p>
      <p>
        Every output of these calculators is estimate kind <code>computed</code> and tier <code>reference</code> when
        the inputs are the reader’s own figures. The canonical scope note is: “Unit arithmetic or a registry lookup
        from the stated inputs. This is a value, not a dosing recommendation.” Registry-backed inputs, such as a
        half-life copied from a label, keep the tier of that source. The arithmetic does not promote them.
      </p>
      <ul>
        <li>
          <Link href="/methods/reconstitution">Reconstitution</Link> — concentration, U-100 draw, doses per vial, and
          the reverse solve for diluent volume.
        </li>
        <li>
          <Link href="/methods/blend">Blend</Link> — one shared draw across several peptides, limited by the scarcest
          component.
        </li>
        <li>
          <Link href="/methods/pharmacokinetics">Pharmacokinetics</Link> — single-compartment elimination, steady
          state, accumulation, and clearance time.
        </li>
      </ul>
      <p>
        Reference implementations: <Link href="/open-source">open-source modules</Link>. Worked numbers in the tests
        match the examples on these pages.
      </p>
    </article>
  );
}
