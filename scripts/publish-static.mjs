import { cp, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const pub = path.join(root, "public");

// The live project currently serves `public/` and does not run the Next builder,
// so the exported HTML has to land there. Next already copied `public/` into `out/`.
await rm(path.join(pub, "_next"), { recursive: true, force: true });
await cp(out, pub, { recursive: true });
