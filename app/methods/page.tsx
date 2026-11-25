import { SectionHero, AssetPicture } from "@/components/AssetPicture";
import { methods } from "@/lib/calculator-methods";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calculator methods",
  description: "Methodology for the American Peptide reconstitution, blend, and pharmacokinetic calculators.",
  openGraph: { type: "website", siteName: SITE_NAME, url: "/methods", images: [{ url: "/assets/og-methods.png", width: 1200, height: 630, alt: "Calculator methods. Public methods and standards." }] },
  twitter: { card: "summary_large_image", images: ["/assets/og-methods.png"] },
  alternates: { canonical: "/methods" },
};

export default function MethodsPage() {
  return (
    <article className="prose">
      <p className="kicker">Methods</p>
      <h1>How the calculators work</h1>
      <SectionHero name="methods" />
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
          <AssetPicture name={`method-${method.id}`} width={480} height={220} alt="" />
          {method.title}
        </Link>)}
      </div>
      <p>
        Reference implementations: <Link href="/open-source">open-source modules</Link>. Worked numbers in the tests
        match the examples on these pages.
      </p>
    </article>
  );
}
