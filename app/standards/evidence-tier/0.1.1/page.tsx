import type { Metadata } from "next";
import { SpecPage } from "@/components/SpecPage";

export const metadata: Metadata = {
  title: "Evidence Tier Schema 0.1.1",
  description: "Patch pin for Evidence Tier Schema 0.1.1. Same frozen text as /standards/evidence-tier/v0.1.",
  alternates: { canonical: "/standards/evidence-tier/0.1.1" },
};

export default function Page() {
  return <SpecPage file="evidence-tier-0.1.1.md" version="0.1.1" canonical="/standards/evidence-tier/0.1.1" />;
}
