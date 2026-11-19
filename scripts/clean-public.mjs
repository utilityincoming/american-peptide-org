import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const pub = path.join(process.cwd(), "public");

async function walk(dir) {
  let entries = [];
  try {
    entries = await readdir(dir);
  } catch {
    return;
  }
  await Promise.all(
    entries.map(async (name) => {
      const file = path.join(dir, name);
      if (name === "_next" || name.endsWith(".html")) {
        await rm(file, { recursive: true, force: true });
        return;
      }
      if ((await stat(file)).isDirectory()) await walk(file);
    }),
  );
}

await walk(pub);
