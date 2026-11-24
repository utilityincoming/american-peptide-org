import { methods } from "@/lib/calculator-methods";
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
        These pages document the formulas, assumptions, edge cases, and scope notes behind the calculators.
      </p>
      <p>
        Every output of these calculators is estimate kind <code>computed</code> and tier <code>reference</code> when
        the inputs are the reader’s own figures. The canonical scope note is: “Unit arithmetic or a registry lookup
        from the stated inputs. This is a value, not a dosing recommendation.” Registry-backed inputs, such as a
        half-life copied from a label, keep the tier of that source. The arithmetic does not promote them.
      </p>
      <div className="pipeline">
        {methods.map((method) => <Link key={method.id} href={`/methods/${method.id}`}>
          <img src={`/illustrations/method-${method.id}.webp`} alt="" />
          {method.title}
        </Link>)}
      </div>
      <p>
        Reference implementations: <Link href="/open-source">open-source modules</Link>. Worked numbers in the tests
        match the examples on these pages, and the same math backs the calculators a reader runs on
        americanpeptide.com.
      </p>
    </article>
  );
}
