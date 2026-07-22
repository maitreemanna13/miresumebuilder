import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for pdf-parse's worker files to resolve correctly when
  // running inside the Next.js server bundle.
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
};

export default nextConfig;
