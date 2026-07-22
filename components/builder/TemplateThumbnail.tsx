"use client";

import { useEffect, useRef, useState } from "react";
import type { Resume } from "@/lib/schema/resume";
import type { ResumeTemplate } from "@/templates/types";
import { renderPdfToCanvases } from "@/lib/pdf/renderPdfPreview";

// Rendering all 42 templates' PDFs to canvas up front (unlike a single
// live-preview pane) would be a real perf hit, especially on mobile — so
// each thumbnail only renders once it's scrolled near the viewport,
// via IntersectionObserver, rather than all at once on page load.
export function TemplateThumbnail({
  template,
  resume,
  accentColor,
}: {
  template: ResumeTemplate;
  resume: Resume;
  accentColor?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearViewport) return;
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;

    async function render() {
      setStatus("loading");
      try {
        await renderPdfToCanvases(
          <template.Document resume={resume} accentColor={accentColor} />,
          container!,
          { maxPages: 1, scale: 1.5, canvasClassName: "block w-full" }
        );
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- template.Document identity is stable per template
  }, [isNearViewport, resume, accentColor]);

  return (
    <div ref={wrapperRef} className="h-72 w-full overflow-hidden bg-zinc-100">
      {status !== "ready" ? (
        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
          {status === "error" ? "Couldn't render preview" : "Loading…"}
        </div>
      ) : null}
      <div ref={containerRef} className={status === "ready" ? "" : "hidden"} />
    </div>
  );
}
