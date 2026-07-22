"use client";

import "@/lib/browserPolyfills";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TEMPLATES } from "@/templates/registry";
import { SAMPLE_RESUME } from "@/lib/sampleResume";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
        Loading…
      </div>
    ),
  }
);

// A curated subset keeps the slideshow varied without cycling through all 9.
const SLIDES = TEMPLATES.filter((t) =>
  ["classic", "modern-sidebar", "bold-header", "executive", "timeline"].includes(t.id)
);

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const { Document, name } = SLIDES[index];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-[420px] w-[320px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
        <PDFViewer style={{ width: "100%", height: "100%", border: "none" }} showToolbar={false}>
          <Document resume={SAMPLE_RESUME} />
        </PDFViewer>
      </div>
      <div className="flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show ${slide.name} template`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? "bg-indigo-600" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-zinc-400">{name} template</span>
    </div>
  );
}
