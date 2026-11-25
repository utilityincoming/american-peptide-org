import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { SpecPage } from "@/components/SpecPage";

export const metadata: Metadata = {
  title: "Evidence Tier Schema 0.1.0 (archived)",
  description: "Archived Evidence Tier Schema 0.1.0, including the freshness-window defect corrected in 0.1.1.",
  openGraph: { type: "article", siteName: SITE_NAME, url: "/standards/evidence-tier/0.1.0", images: [{ url: "/assets/og-release-0.1.0.png", width: 1200, height: 630, alt: "Evidence Tier Schema. Release 0.1.0." }] },
  twitter: { card: "summary_large_image", images: ["/assets/og-release-0.1.0.png"] },
  alternates: { canonical: "/standards/evidence-tier/0.1.0" },
};

export default function Page() {
  return <SpecPage file="evidence-tier-0.1.0.md" version="0.1.0" canonical="/standards/evidence-tier/0.1.0" />;
}
