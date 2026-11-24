import { execFileSync } from "node:child_process";
import type { NextConfig } from "next";

function sourceRevision() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    if (!execFileSync("git", ["status", "--porcelain"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()) {
      return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    }
  } catch {
    // Source archives can be built without Git metadata.
  }
  return "";
}

const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_SOURCE_REVISION: sourceRevision(),
    NEXT_PUBLIC_RELEASE_ORIGIN: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  },
};

export default nextConfig;
