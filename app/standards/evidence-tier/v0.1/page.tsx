import type { Metadata } from "next";
import { SpecPage } from "@/components/SpecPage";

export const metadata: Metadata = {
  title: "Evidence Tier Schema v0.1",
  description:
    "Citable public text of the American Peptide Evidence Tier Schema, version 0.1.1. Provenance tiers for factual claims.",
  alternates: { canonical: "/standards/evidence-tier/v0.1" },
};

export default function Page() {
  return <SpecPage file="evidence-tier-0.1.1.md" version="0.1.1" canonical="/standards/evidence-tier/v0.1" />;
}
