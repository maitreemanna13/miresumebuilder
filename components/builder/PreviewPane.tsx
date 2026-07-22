"use client";

import "@/lib/browserPolyfills";
import dynamic from "next/dynamic";
import { useResumeStore } from "@/store/resumeStore";
import { getTemplate } from "@/templates/registry";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

// @react-pdf/renderer's viewer touches browser-only APIs (Blob/iframe), so
// it must never be evaluated during SSR.
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <PreviewLoading /> }
);

function PreviewLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
      Loading preview…
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

  if (!hasHydrated) return <PreviewLoading />;

  const { Document } = getTemplate(templateId);

  return (
    <PDFViewer style={{ width: "100%", height: "100%", border: "none" }} showToolbar={false}>
      <Document resume={debouncedResume} accentColor={accentColor ?? undefined} />
    </PDFViewer>
  );
}
