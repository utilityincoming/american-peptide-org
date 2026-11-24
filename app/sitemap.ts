import { paths } from "@/lib/citations";
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${SITE}${path === "/" ? "/" : path}`,
    lastModified: "2026-11-18",
    changeFrequency: path.includes("0.1") ? "yearly" : "monthly",
    priority: path === "/" || path.endsWith("v0.1") ? 1 : 0.6,
  }));
}
