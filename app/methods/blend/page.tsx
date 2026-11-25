import MethodIllustration from "@/components/MethodIllustration";
import type { Metadata } from "next";
import Link from "next/link";
import { SectionNav } from "@/components/SectionNav";
import { COM } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blend calculator method",
  description:
    "Shared-draw math for the American Peptide blend calculator, including the scarcest-component rule and overage.",
  alternates: { canonical: "/methods/blend" },
};

export default function Page() {
  return (
    <article className="prose">
      <p className="kicker">Method · reference tier</p>
      <h1>Blend draws</h1>
      <MethodIllustration id="blend" />
      <p className="meta">
        <a href={`${COM}/tools/blend-calculator`}>Open the interactive blend calculator on AmericanPeptide.com</a>
        {" · "}
        Module: <code>packages/calculators/blend.ts</code>
      </p>
      <SectionNav
        items={[
          { id: "what-it-answers", label: "What it answers" },
          { id: "formulas", label: "Formulas" },
          { id: "worked-examples", label: "Worked examples" },
          { id: "assumptions", label: "Assumptions" },
          { id: "edge-cases", label: "Edge cases" },
          { id: "scope-note", label: "Scope note" },
        ]}
      />
      <h2 id="what-it-answers">What it answers</h2>
      <p>
        Several peptides share one vial and one diluent volume. Each has a mass in milligrams and an intended dose in
        micrograms. The method reports how many shared draws the blend can make, the volume of each draw, and the
        micrograms of each peptide that draw actually contains.
      </p>
      <h2 id="formulas">Formulas</h2>
      <p>For each component, mass <code>M</code> is in mg and intended dose <code>D</code> is in mcg. The only unit conversion in this method is 1 mg = 1000 mcg.</p>
      <pre className="formula">{`standalone doses of i     S_i = (M_i × 1000) / D_i
draws in the blend         N = floor(min S_i)     over valid rows
draw volume                W / N
U-100 units                (W / N) × 100
delivered mcg of i         (M_i × 1000) / N
over fraction              (delivered − D_i) / D_i`}</pre>
      <h2 id="worked-examples">Worked examples</h2>
      <p>
        5 mg at 250 mcg and 10 mg at 500 mcg, in 2 mL. Each component supports 20 doses. The blend makes 20 draws of
        0.1 mL (10 units). Delivered matches intended, so the over fraction is 0.
      </p>
      <p>
        5 mg at 250 mcg and 5 mg at 500 mcg. Standalone counts are 20 and 10. The blend makes 10 draws. The second
        peptide delivers 500 mcg. The first delivers 500 mcg against an intent of 250 mcg, an over fraction of 1.
        The website highlights an over fraction above 0.02. That threshold is a display rule, not part of the math.
      </p>
      <h2 id="assumptions">Assumptions</h2>
      <ul>
        <li>Every peptide is transferred in full into one vial. Losses on the spatula, the syringe, or the wall are ignored.</li>
        <li>One draw volume serves every peptide. You cannot hit two intended doses with one volume unless the masses are proportioned to the same dose count.</li>
        <li>The diluent volume is the final volume. Displacement by the powder is ignored.</li>
        <li>
          Components are independent solutes for the dose count. Compatibility is a separate{" "}
          <Link href="/methods/blend-screen">screen</Link>. It does not change <code>N</code> or the over fraction.
        </li>
        <li>
          When the over fraction is above 0.02, the reference module returns a fixed sentence: the shared draw
          delivers more than the intended dose of a non-limiting peptide because the dose count follows the scarcest
          component. The threshold is the website’s highlight rule.
        </li>
        <li>A cap of ten peptides on the website is a form limit. The function takes any list length.</li>
      </ul>
      <h2 id="edge-cases">Edge cases</h2>
      <ul>
        <li>A row with non-positive mass or dose is skipped. If no row is valid, dose count and draw volume are 0.</li>
        <li>Diluent of 0 yields a dose count from the masses and a draw volume of 0.</li>
        <li>When the minimum standalone count is not an integer, <code>floor</code> drops the partial dose. Delivered amounts are then computed from that integer, so they step up relative to the intended dose.</li>
      </ul>
      <h2 id="scope-note">Scope note</h2>
      <p className="note">
        Unit arithmetic from the stated inputs. This is a value, not a dosing recommendation. Sharing a vial is a
        handling decision this method does not endorse: it removes a per-peptide check against a certificate of
        analysis, and it says nothing about whether the peptides remain intact in one solution.
      </p>
      <p>
        <Link href="/methods">All methods</Link>
      </p>
    </article>
  );
}
