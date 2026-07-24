import { ImageResponse } from "next/og";

export const alt = "Resume Builder — Free AI-Powered Resume Maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// No custom font file here — next/og's file-loading pattern
// (readFile(join(process.cwd(), ...))) is the same runtime-path
// construction that broke PDF export's font loading in production
// (see next.config.ts's outputFileTracingIncludes comment). System
// sans-serif is enough for a simple branded card like this.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "#4f46e5",
              color: "#ffffff",
              fontSize: 52,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#18181b" }}>Resume Builder</div>
        </div>
        <div style={{ fontSize: 30, color: "#52525b" }}>
          Free, ATS-friendly resumes — built with AI in minutes
        </div>
      </div>
    ),
    { ...size }
  );
}
