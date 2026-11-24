import { bibtex, citationDownloads, dataCite } from "@/lib/citations";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return citationDownloads.flatMap(({ key }) => ["bib", "json"].map((ext) => ({ file: `${key}.${ext}` })));
}

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  const record = citationDownloads.find(({ key }) => file === `${key}.bib` || file === `${key}.json`);
  if (!record) return new Response(null, { status: 404 });
  if (file.endsWith(".json")) return Response.json(dataCite(record));
  return new Response(bibtex(record), { headers: { "content-type": "application/x-bibtex; charset=utf-8" } });
}
