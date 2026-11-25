import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const alt = "American Peptide. Standards, methods and research data.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const image = await readFile(join(process.cwd(), "public/assets/og-site.png"));
  return new Response(new Uint8Array(image), { headers: { "content-type": contentType } });
}
