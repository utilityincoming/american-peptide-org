import { AssetPicture } from "@/components/AssetPicture";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Errata",
  description: "Corrections to published American Peptide specifications and datasets.",
  alternates: { canonical: "/errata" },
};

export default function ErrataPage() {
  return (
    <article className="prose">
      <p className="kicker">Errata</p>
      <h1>Corrections</h1>
      <p>
        An erratum names a defect in a published version. The old URL stays up. The fix ships as a new version, linked
        from here and from the <Link href="/changelog">changelog</Link>.
      </p>

      <div className="erratum-heading">
        <AssetPicture name="erratum-marker" width={220} height={148} alt="" />
        <h2 id="e-001">E-001 — Price freshness matched two windows</h2>
      </div>
      <p className="meta">Affects schema 0.1.0 · Corrected in 0.1.1 · Filed 18 November 2026</p>
      <p>
        <strong>What was wrong.</strong> Notes accompanying schema 0.1.0 put revalidation windows in a single table
        headed as tiers, and that table included a <code>commercial</code> row of 30 days.{" "}
        <code>commercial</code> is an estimate kind, not a tier. A vendor price is{" "}
        <code>vendor_reported</code> (6 months in the same table) and <code>commercial</code> at once, so the notes
        named two windows and no rule for which one applies.
      </p>
      <p>
        <strong>What to do instead.</strong> Use{" "}
        <Link href="/standards/evidence-tier/v0.1">schema 0.1.1</Link>. Windows exist on both axes. An estimate-kind
        override wins when one is defined. <code>commercial</code> is 30 days. A vendor price therefore revalidates
        every 30 days, and the 6-month <code>vendor_reported</code> default applies only when the kind has no
        override.
      </p>
      <p>
        <strong>What did not change.</strong> Tier weights, the claim fields required in 0.1.0, and records that
        leave <code>scope</code> unset. Adding <code>scope</code> in 0.1.1 is a compatible extension, not part of this
        erratum. The archived text is{" "}
        <Link href="/standards/evidence-tier/0.1.0">/standards/evidence-tier/0.1.0</Link>.
      </p>
    </article>
  );
}
