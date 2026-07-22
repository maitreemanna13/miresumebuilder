"use client";

import "@/lib/browserPolyfills";
import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { useResumeStore } from "@/store/resumeStore";
import { getTemplate } from "@/templates/registry";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

// Rendering each page to a plain <canvas> via pdf.js — not <PDFViewer>'s
// <iframe> pointing at a blob URL — because that relies on the browser's
// own embedded PDF viewer plugin, which desktop Chrome/Edge/Firefox have
// but most mobile browsers (iOS Safari, Android Chrome) don't reliably
// support inside an iframe. Canvas rendering works identically on every
// device since it's pure JS, no native viewer involved.
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

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
        const blob = await pdf(
          <Document resume={debouncedResume} accentColor={accentColor ?? undefined} />
        ).toBlob();
        const arrayBuffer = await blob.arrayBuffer();
        if (cancelled) return;

        const pdfDoc = await getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;

        const container = containerRef.current;
        if (!container) return;
        container.replaceChildren();

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          // Render at 2x the PDF's native scale for crisp text on
          // high-DPI/mobile screens, then let CSS scale the canvas back
          // down to fit the container width.
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.className = "mb-4 block rounded shadow-sm";
          const context = canvas.getContext("2d");
          if (!context) continue;

          await page.render({ canvas, canvasContext: context, viewport }).promise;
          if (cancelled) return;
          container.appendChild(canvas);
        }

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
