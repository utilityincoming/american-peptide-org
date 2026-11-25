import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { SpecPage } from "@/components/SpecPage";

export const metadata: Metadata = {
  title: "Evidence Tier Schema 0.1.1",
  description: "Patch pin for Evidence Tier Schema 0.1.1. Same frozen text as /standards/evidence-tier/v0.1.",
  openGraph: { type: "article", siteName: SITE_NAME, url: "/standards/evidence-tier/0.1.1", images: [{ url: "/assets/og-release-0.1.1.png", width: 1200, height: 630, alt: "Evidence Tier Schema. Release 0.1.1." }] },
  twitter: { card: "summary_large_image", images: ["/assets/og-release-0.1.1.png"] },
  alternates: { canonical: "/standards/evidence-tier/0.1.1" },
};

export default function Page() {
  return <SpecPage file="evidence-tier-0.1.1.md" version="0.1.1" canonical="/standards/evidence-tier/0.1.1" />;
}
