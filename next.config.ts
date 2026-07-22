import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for pdf-parse's worker files to resolve correctly when
  // running inside the Next.js server bundle.
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  // templates/shared/fonts.ts loads these .ttf files via a path built at
  // runtime (`${process.cwd()}/public/fonts/...`), which Next's static
  // file tracer can't detect — without this, the font files are missing
  // from the deployed serverless function even though they exist in
  // public/, and @react-pdf/renderer's server-side renderToBuffer (used
  // by /api/export/pdf) throws when it can't read them.
  outputFileTracingIncludes: {
    "/api/export/pdf": ["./public/fonts/**/*"],
  },
};

export default nextConfig;
