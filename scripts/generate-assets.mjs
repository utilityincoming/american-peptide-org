import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const output = new URL("../public/assets/", import.meta.url);
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const palette = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\b/gi)].map(([, key, value]) => [key, value]));
const { paper, ink, navy, crimson, brass, line, muted } = palette;
const deep = palette["navy-deep"];
const secondary = palette["paper-2"];
const sourceRevision = "archival-plates-v1";
const license = "https://creativecommons.org/licenses/by/4.0/";
const manifestUrl = new URL("../assets/manifest.json", import.meta.url);
const previous = await readFile(manifestUrl, "utf8").then(JSON.parse, (error) => {
  if (error.code !== "ENOENT") throw error;
  return { files: {} };
});
const files = {};
const [release, accent = "navy"] = process.argv.slice(2);
if (release && (!/^\d+\.\d+(?:\.\d+)?$/.test(release) || !palette[accent])) {
  throw new Error("Expected a numeric release and a color token from app/globals.css");
}

const rect = (x, y, width, height, fill = "none", stroke = navy, radius = 0) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
const path = (d, stroke = navy, fill = "none") => `<path d="${d}" stroke="${stroke}" fill="${fill}"/>`;
const circle = (cx, cy, r, fill = "none", stroke = navy) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}"/>`;
const group = (x, y, scale, body) => `<g transform="translate(${x} ${y}) scale(${scale})">${body}</g>`;
const arrow = (x, y, length, color = navy) => path(`M${x} ${y}h${length}m-12-9 12 9-12 9`, color);
const lines = (count, render) => Array.from({ length: count }, (_, index) => render(index)).join("");
const text = (x, y, value, { size = 24, fill = ink, align = "start", family = "sans-serif" } = {}) =>
  `<text x="${x}" y="${y}" font-family="${family}" text-anchor="${align}" font-size="${size}" fill="${fill}" stroke="none">${value}</text>`;
const stroke = (body, width = 3) => `<g stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;

function svg(width, height, body, title, description, transparent = false) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"${title ? ' role="img" aria-labelledby="title description"' : ' aria-hidden="true"'}>${title ? `<title id="title">${title}</title><desc id="description">${description}</desc>` : ""}${transparent ? "" : rect(0, 0, width, height, paper, "none")}${stroke(body)}</svg>\n`;
}

const glyphs = [
  rect(5, 5, 38, 48, paper) + path("M13 19h22m-22 9h22m-22 9h14"),
  rect(5, 7, 33, 36, secondary) + circle(34, 31, 12, paper) + path("m43 40 12 12"),
  path("M8 45h44M15 34h30M22 23h16", navy) + rect(25, 8, 10, 6, brass, "none"),
  rect(6, 12, 29, 19, "none", navy, 9) + rect(24, 27, 29, 19, "none", brass, 9) + path("m22 35 15-13"),
];

const tier = glyphs.map((glyph, index) => group(28 + index * 92, 24 + index * 35, 1,
  rect(0, 0, 119, 136, index % 2 ? secondary : paper) + group(28, 42, 1.05, glyph))).join("");
const vessel = path("M35 20h112m-101 0v147q0 16 16 16h58q16 0 16-16V20") +
  path("M48 108h86v58q0 14-14 14H62q-14 0-14-14Z", "none", secondary) +
  lines(6, (i) => path(`M111 ${45 + i * 21}h${i % 2 ? 11 : 21}`)) + path("M49 108h84", brass);
const ruler = rect(0, 0, 54, 198, secondary) + lines(12, (i) => path(`M1 ${12 + i * 15}h${i % 3 ? 13 : 25}`));
const measures = group(75, 33, 1.25, vessel) + group(317, 35, 1, ruler);
const grid = rect(24, 26, 310, 184, paper) + rect(25, 27, 308, 37, secondary, "none") +
  rect(150, 102, 85, 37, secondary, "none") +
  lines(4, (i) => path(`M24 ${64 + i * 37}h310`, line)) + path("M150 27v182m85-182v182", line) +
  arrow(285, 121, 134, brass);
const recon = group(68, 15, 1, vessel) + arrow(232, 106, 76, brass) +
  rect(330, 61, 95, 101, paper) + path("M346 134h63", brass) + lines(4, (i) => path(`M386 ${79 + i * 18}h22`));
const blend = rect(41, 25, 79, 58, secondary) + rect(41, 131, 79, 58, paper) +
  path("M121 54h57l58 52h54m-169 54h57l58-54", brass) +
  rect(290, 52, 133, 110, paper) + path("M311 130h90M313 110h55M313 90h32", navy);
const screen = rect(54, 27, 376, 160, paper) + rect(169, 28, 144, 158, secondary, "none") +
  path("M75 145h330M85 45v112", muted) +
  path("M90 131c55 0 64-83 119-83s64 83 121 83", navy) +
  path("M148 131c57 0 67-68 126-68s68 68 125 68", brass);
const pk = rect(33, 75, 93, 71, secondary) + circle(80, 111, 13, paper) + arrow(127, 111, 58, brass) +
  path("M215 35v145h220", muted) + path("M223 51c38 78 99 111 190 117", navy);
const erratum = rect(47, 20, 91, 108, paper) + path("M62 44h56m-56 19h45m-45 19h49m-49 19h37", line) +
  path("M127 61h20v25h-20m20-12h28", crimson) + circle(181, 74, 4, crimson, "none");
const empty = rect(59, 23, 79, 101, paper) + lines(3, (i) => path(`M73 ${51 + i * 18}h50`, line));
const icon = rect(0, 0, 32, 32, deep, "none", 6) +
  `<path fill="${paper}" fill-rule="evenodd" d="M4 24 10 8h12a6 6 0 0 1 0 12h-3l1.5 4h-4.25l-1.5-4h-5L8.25 24ZM11.25 16h2l-1-2.75ZM16 12l1.5 4H22a2 2 0 0 0 0-4Z"/>`;
const marker = (color) => rect(25, 22, 200, 77, secondary, "none") + rect(41, 36, 168, 49, paper, color) +
  path("M59 49v23m-8-11h16m114-12v23m-8-11h16", color) + rect(90, 54, 70, 14, color, "none");

async function save(file, bytes, page, release, width, height, alt) {
  await writeFile(new URL(file, output), bytes);
  files[file] = { page, release, width, height, alt, source: "scripts/generate-assets.mjs", brief: "assets/STYLE.md#artwork-brief", sourceRevision, license };
}

async function raster(name, markup, width, height, page, { alt = "", release = null, formats = ["png", "webp"], densities = [1, 2] } = {}) {
  for (const density of densities) {
    const src = sharp(Buffer.from(markup), { density: 72 * density });
    for (const format of formats) {
      const file = `${name}${density === 2 ? "@2x" : ""}.${format}`;
      const bytes = await src.clone().toFormat(format, format === "webp" ? { lossless: true } : {}).toBuffer();
      await save(file, bytes, page, release, width * density, height * density, alt);
    }
  }
}

async function social(name, title, subtitle, body, page, release = null) {
  const titleLines = title === "Evidence Tier Schema" ? ["Evidence Tier", "Schema"] : [title];
  const artwork = titleLines.map((line, index) =>
    text(69, 267 + index * 66, line, { size: 59, fill: deep, family: "serif" })).join("");
  const markup = svg(1200, 630, rect(0, 0, 1200, 9, deep, "none") +
    path("M70 518h1060", line) + text(72, 169, "AMERICAN PEPTIDE", { size: 31, fill: crimson }) +
    artwork +
    text(72, titleLines.length === 2 ? 410 : 350, subtitle, { size: 33, fill: navy }) +
    text(72, 566, "americanpeptide.org", { size: 27, fill: muted }) + group(650, 173, .98, body));
  await save(`${name}.svg`, markup, page, release, 1200, 630, `${title}. ${subtitle}.`);
  await raster(name, markup, 1200, 630, page, { release, alt: `${title}. ${subtitle}.`, formats: ["png"], densities: [1] });
}

async function releaseAssets(version, token) {
  const color = palette[token];
  const pages = [`/changelog#evidence-tier-${version}`, `/standards/evidence-tier/${version}`];
  const motif = marker(color);
  const name = `release-${version}`;
  await raster(name, svg(250, 120, motif), 250, 120, pages, { release: version });
  await social(`og-${name}`, "Evidence Tier Schema", `Release ${version}`, group(8, 28, 1.65, motif), pages, version);
  for (const entry of Object.values(files)) if (entry.release === version && entry.page === pages) entry.accent = token;
}

if (!release) {
  for (const [id, title, body, page, releaseVersion] of [
    ["evidence", "Evidence Tier Schema", tier, "/standards/evidence-tier", "0.1.1"],
    ["methods", "Calculator methods", measures, "/methods", null],
    ["data", "Dataset exports", grid, "/data", "2026-11-18"],
  ]) {
    await raster(`hero-${id}`, svg(1200, 630, group(205, 70, 1.85, body)), 1200, 630, page, { release: releaseVersion });
    await social(`og-${id}`, title, "Public methods and standards", body, page, releaseVersion);
  }
  for (const [id, body, alt] of [
    ["reconstitution", recon, "A graduated vessel connects to a separate measurement chamber, illustrating concentration and volume."],
    ["blend", blend, "Two sample paths converge and feed a single graduated chamber, illustrating a shared draw."],
    ["blend-screen", screen, "Two schematic profiles overlap a shaded screening window, illustrating a comparison of blend properties."],
    ["pharmacokinetics", pk, "A single compartment points to an unnumbered plot with a falling curve that flattens over time."],
  ]) {
    await raster(`method-${id}`, svg(480, 220, body), 480, 220, ["/methods", `/methods/${id}`], { alt });
  }

  const flowAlt = "Four connected stages show the evidence pipeline in order: claim, source, tier, and citation.";
  const flowPage = "/standards/evidence-tier";
  for (const [suffix, width, height, vertical] of [["", 960, 210, false], ["-stacked", 320, 570, true]]) {
    const nodes = ["Claim", "Source", "Tier", "Citation"].map((label, i) => {
      const x = vertical ? 45 : 26 + i * 235;
      const y = vertical ? 16 + i * 142 : 34;
      if (vertical) return group(x, y, 1,
        rect(0, 0, 230, 112, secondary, navy, 5) + group(24, 28, 1, glyphs[i]) + text(105, 66, label, { size: 25 }) +
        (i === 3 ? "" : path("M115 112v25m-7-8 7 8 7-8", brass)));
      return group(x, y, 1,
        rect(0, 0, 200, 141, secondary, navy, 5) + group(70, 16, 1, glyphs[i]) +
        text(100, 110, label, { size: 24, align: "middle" }) + (i === 3 ? "" : arrow(204, 70, 28, brass)));
    }).join("");
    const markup = svg(width, height, nodes, "Evidence Tier Schema pipeline", flowAlt);
    await save(`schema-flow${suffix}.svg`, markup, flowPage, "0.1.1", width, height, flowAlt);
    await raster(`schema-flow${suffix}`, markup, width, height, flowPage, { alt: flowAlt, release: "0.1.1", formats: ["png"], densities: [2] });
  }
  await raster("erratum-marker", svg(220, 148, erratum), 220, 148, "/errata#e-001", { release: "0.1.1" });
  await raster("empty-record", svg(200, 148, empty), 200, 148, "/standards/evidence-tier/validate");
  for (const size of [16, 32, 180, 512]) {
    await raster(`icon-${size}`, svg(size, size, group(0, 0, size / 32, icon), undefined, undefined, true),
      size, size, "*", { formats: ["png"], densities: [1] });
  }
  await social("og-site", "American Peptide", "Standards, methods and research data", tier, "*");
  for (const version of (await readFile(new URL("../lib/releases.ts", import.meta.url), "utf8")).matchAll(/version: "([0-9.]+)"/g)) {
    const previousAccent = previous.files[`release-${version[1]}.png`]?.accent;
    await releaseAssets(version[1], previousAccent && palette[previousAccent] ? previousAccent :
      version[1] === "0.1.0" ? "muted" : "navy");
  }
} else {
  Object.assign(files, previous.files);
  await releaseAssets(release, accent);
}

const manifest = { license, sourceRevision, palette, files: Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) };
await writeFile(manifestUrl, JSON.stringify(manifest, null, 2) + "\n");
await writeFile(new URL("manifest.json", output), JSON.stringify(manifest, null, 2) + "\n");
