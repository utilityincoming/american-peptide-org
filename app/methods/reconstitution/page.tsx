import type { Metadata } from "next";
import Link from "next/link";
import { SectionNav } from "@/components/SectionNav";
import { COM } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reconstitution method",
  description:
    "Dilution math for the American Peptide reconstitution calculator: formulas, U-100 units, assumptions, and edge cases.",
  alternates: { canonical: "/methods/reconstitution" },
};

export default function Page() {
  return (
    <article className="prose">
      <p className="kicker">Method · reference tier</p>
      <h1>Reconstitution</h1>
      <p className="meta">
        Tool: <a href={`${COM}/tools/reconstitution-calculator`}>{COM}/tools/reconstitution-calculator</a>
        {" · "}
        Module: <code>packages/calculators/reconstitution.ts</code>
      </p>
      <SectionNav
        items={[
          { id: "what-it-answers", label: "What it answers" },
          { id: "formulas", label: "Formulas" },
          { id: "worked-example", label: "Worked example" },
          { id: "assumptions", label: "Assumptions" },
          { id: "edge-cases", label: "Edge cases" },
          { id: "scope-note", label: "Scope note" },
        ]}
      />
      <h2 id="what-it-answers">What it answers</h2>
      <p>
        Given a vial mass, a target amount per administration, and a diluent volume, the calculator reports
        concentration, the volume to draw, that volume on a U-100 syringe, and how many whole doses the vial mass
        contains.
      </p>
      <h2 id="formulas">Formulas</h2>
      <p>Let <code>A</code> be vial amount and <code>D</code> the dose, in the same unit. Let <code>W</code> be diluent in milliliters.</p>
      <pre className="formula">{`concentration per mL     C = A / W
concentration per 0.1 mL   C / 10
draw volume, mL            V = D / C
U-100 units                V × 100
whole doses                floor(A / D)`}</pre>
      <p>The reverse solve picks <code>W</code> so a chosen unit count delivers <code>D</code>:</p>
      <pre className="formula">{`W = A × (units × 0.01) / D`}</pre>
      <h2 id="worked-example">Worked example</h2>
      <p>
        A 5 mg vial is 5000 mcg. Dose 250 mcg. Diluent 2 mL. Concentration is 2500 mcg/mL, which is 250 mcg per 0.1 mL.
        Draw volume is 0.1 mL, or 10 units. The vial mass holds 20 doses. Solving for a 10-unit draw returns 2 mL.
      </p>
      <h2 id="assumptions">Assumptions</h2>
      <ul>
        <li>The powder dissolves completely and the solution is uniform. No adsorption to the vial or stopper.</li>
        <li>The labeled mass is the mass used. No overfill, no residual powder, no dead volume in the syringe.</li>
        <li>The syringe is U-100: 100 units = 1 mL. U-40 and other scales are out of scope. One tick of 0.1 mL is ten units, which is why concentration-per-tick divides by ten.</li>
        <li>Whole doses come from mass, not from how much liquid fits in the syringe. A draw larger than the diluent volume is reported as a number; it is not clipped.</li>
        <li>The function does not convert milligrams to micrograms and does not convert IU to mass. The caller passes one unit for both vial and dose. The website multiplies milligrams by 1000 before calling it.</li>
      </ul>
      <h2 id="edge-cases">Edge cases</h2>
      <ul>
        <li>Diluent of 0 yields concentration 0 and draw volume 0. Dose count still follows the mass ratio.</li>
        <li>Dose of 0 yields dose count 0, and the reverse solve returns 0. Division by zero is not thrown.</li>
        <li>Dose larger than the vial yields a draw larger than the diluent and a dose count of 0 after <code>floor</code>.</li>
        <li>Negative inputs are not interpreted. The module does not clamp them; the website rejects non-positive fields before calling it.</li>
        <li>Results are IEEE-754 division. Display rounding on the website is not part of this method. 1/3 mL is not a repeating decimal the syringe can hit.</li>
      </ul>
      <h2 id="scope-note">Scope note</h2>
      <p className="note">
        Unit arithmetic from the stated inputs. This is a value, not a dosing recommendation. It says nothing about
        sterility, solvent choice, stability after reconstitution, or whether the mass on the label matches the mass
        in the vial.
      </p>
      <p>
        <Link href="/methods">All methods</Link>
      </p>
    </article>
  );
}
