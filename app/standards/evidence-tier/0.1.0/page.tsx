import type { Metadata } from "next";
import { SpecPage } from "@/components/SpecPage";

export const metadata: Metadata = {
  title: "Evidence Tier Schema 0.1.0 (archived)",
  description: "Archived Evidence Tier Schema 0.1.0, including the freshness-window defect corrected in 0.1.1.",
  alternates: { canonical: "/standards/evidence-tier/0.1.0" },
};

export default function Page() {
  return <SpecPage file="evidence-tier-0.1.0.md" version="0.1.0" canonical="/standards/evidence-tier/0.1.0" />;
}
