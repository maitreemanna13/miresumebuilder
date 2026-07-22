"use client";

import "@/lib/browserPolyfills";
import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { getTemplate } from "@/templates/registry";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { renderPdfToCanvases } from "@/lib/pdf/renderPdfPreview";

function PreviewLoading({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
      {label}
    </div>
  );
}

function PreviewEmptyState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-sm font-medium text-zinc-600">Your resume preview will appear here</p>
      <p className="max-w-xs text-xs text-zinc-400">
        Start filling in your details on the left — this updates live as you type.
      </p>
    </div>
  );
}

function PreviewErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-red-500">
      {message}
    </div>
  );
}

export function PreviewPane() {
  const resume = useResumeStore((s) => s.resume);
  const templateId = useResumeStore((s) => s.selectedTemplateId);
  const accentColor = useResumeStore((s) => s.selectedAccentColor);
  const hasHydrated = useResumeStore((s) => s.hasHydrated);

  // Regenerating the PDF on every keystroke is wasteful; wait until the
  // user pauses briefly before re-rendering the live preview.
  const debouncedResume = useDebouncedValue(resume, 400);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const isEmpty = !debouncedResume.contact.fullName.trim();

  useEffect(() => {
    if (!hasHydrated || isEmpty) return;
    let cancelled = false;

    async function renderPreview() {
      setStatus("loading");
      try {
        const { Document } = getTemplate(templateId);
        const container = containerRef.current;
        if (!container) return;

        // Render at 2x the PDF's native scale for crisp text on
        // high-DPI/mobile screens, then let CSS scale the canvas back
        // down to fit the container width.
        await renderPdfToCanvases(
          <Document resume={debouncedResume} accentColor={accentColor ?? undefined} />,
          container,
          { scale: 2, canvasClassName: "mb-4 block rounded shadow-sm" }
        );
        if (cancelled) return;

        if (!cancelled) setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Couldn't render preview.");
        }
      }
    }

    renderPreview();
    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isEmpty, debouncedResume, templateId, accentColor]);

  if (!hasHydrated) return <PreviewLoading label="Loading…" />;
  if (isEmpty) return <PreviewEmptyState />;

  return (
    <div className="relative h-full w-full overflow-y-auto p-4">
      {status === "loading" ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100/70 text-sm text-zinc-400">
          Rendering preview…
        </div>
      ) : null}
      {status === "error" ? <PreviewErrorState message={errorMessage} /> : null}
      <div ref={containerRef} className="mx-auto max-w-2xl" />
    </div>
  );
}
