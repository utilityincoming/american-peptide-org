import { cp } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
// next build writes the site to out/ and refuses to start if public/_next
// already exists. Copy only after that build. Production is serving `public/`,
// so the export has to land there as well as in `out/`.
await cp(path.join(root, "out"), path.join(root, "public"), { recursive: true });
