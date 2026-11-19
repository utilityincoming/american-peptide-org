import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const PATHS = [
  "/",
  "/standards/evidence-tier",
  "/standards/evidence-tier/v0.1",
  "/standards/evidence-tier/0.1.1",
  "/standards/evidence-tier/0.1.0",
  "/methods",
  "/methods/reconstitution",
  "/methods/blend",
  "/methods/pharmacokinetics",
  "/data",
  "/changelog",
  "/errata",
  "/open-source",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE}${path === "/" ? "/" : path}`,
    lastModified: "2026-11-18",
    changeFrequency: path.includes("0.1") ? "yearly" : "monthly",
    priority: path === "/" || path.endsWith("v0.1") ? 1 : 0.6,
  }));
}
