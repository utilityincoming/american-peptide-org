import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pharmacokinetic calculator method",
  description:
    "Single-compartment half-life math used by American Peptide: remaining fraction, steady state, accumulation, and what the model leaves out.",
  alternates: { canonical: "/methods/pharmacokinetics" },
};

export default function Page() {
  return (
    <article className="prose">
      <p className="kicker">Method</p>
      <h1>Pharmacokinetics</h1>
      <p className="meta">
        Module: <code>packages/calculators/pharmacokinetics.ts</code>
        {" · "}
        Half-life inputs: <Link href="/data/pk-half-lives.json">pk-half-lives.json</Link>
      </p>
      <h2>What it answers</h2>
      <p>
        Given one elimination half-life in hours, the helpers answer four teaching questions. What fraction of a
        single dose remains. How long until repeated dosing is near steady state. How much repeated dosing
        accumulates. How long until a single dose has effectively cleared.
      </p>
      <h2>Formulas</h2>
      <p>Time <code>t</code>, interval <code>τ</code>, and half-life <code>t½</code> are hours. Decay uses base 2, which is the same as <code>e^(−ln 2 · t / t½)</code>.</p>
      <pre className="formula">{`fraction remaining          0.5 ^ (t / t½)
time to fraction f          t½ × log2(1 / f)          for f in (0, 1)
time to steady state        time to fraction (1 − 0.97)     default 97%
accumulation ratio          1 / (1 − 0.5 ^ (τ / t½))
peak-to-trough              2 ^ (τ / t½)
clearance time              time to fraction 0.03`}</pre>
      <p>
        A reported range is collapsed with the midpoint <code>(low + high) / 2</code> before any of the formulas run.
        The curve is drawn against that single number. The range itself is not a confidence interval.
      </p>
      <h2>Worked example</h2>
      <p>
        Semaglutide’s stored range is 150–184 hours, midpoint 167. One half-life later, fraction remaining is 0.5 by
        construction. Time to 97% of steady state is <code>t½ × log2(1 / 0.03)</code>, about 5.06 half-lives, and it
        does not depend on whether the dose is weekly. An interval many half-lives long gives an accumulation ratio
        indistinguishable from 1.
      </p>
      <h2>Assumptions</h2>
      <ul>
        <li>One compartment, first-order elimination, instantaneous input. No absorption delay, no flip-flop kinetics, no two-compartment distribution.</li>
        <li>The half-life is constant. Saturable clearance, target-mediated disposition, and albumin binding that changes with concentration are outside the model even when they matter for the molecule.</li>
        <li>Time to steady state is independent of dose and of interval because the approach of the trough (and of the average, in this linear model) follows the same exponential as single-dose decay. The accumulation ratio does depend on the interval.</li>
        <li>97% and 3% are conventions (about five half-lives). They are not a biological threshold.</li>
        <li>Where the table stores <code>null</code>, no curve is drawn. A missing human half-life is not filled with a preclinical number. BPC-157, TB-500, and GHK-Cu are stored that way on purpose.</li>
      </ul>
      <h2>Edge cases</h2>
      <ul>
        <li>Non-positive half-life or interval returns <code>NaN</code>. A negative elapsed time returns <code>NaN</code>.</li>
        <li>A target fraction outside (0, 1) returns <code>NaN</code>. The function will not solve “time to more than the dose” or “time to zero,” which this model never reaches.</li>
        <li>Class-overlap notes on the website are a separate, conservative scan of shared pharmacological labels. They are not an output of these formulas and they are not a clinical interaction database.</li>
      </ul>
      <h2>Scope note</h2>
      <p className="note">
        The half-life row keeps the tier of its source: a figure taken from an FDA label is <code>clinical</code> only
        for the population and route that label measured, and the arithmetic that follows is <code>computed</code>.
        A preclinical half-life stays preclinical. “Non-human data. Interspecies scaling of this parameter is
        unreliable and no human equivalent has been published.” None of these curves is a dosing recommendation.
      </p>
      <p>
        <Link href="/methods">All methods</Link>
      </p>
    </article>
  );
}
