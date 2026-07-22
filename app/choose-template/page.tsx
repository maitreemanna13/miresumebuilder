"use client";

import "@/lib/browserPolyfills";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resumeStore";
import { TEMPLATES } from "@/templates/registry";
import type { TemplateTag } from "@/templates/types";
import { ACCENT_COLORS } from "@/templates/shared/colorPalette";

const FILTERS: { id: TemplateTag | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "photo", label: "With photo" },
  { id: "sidebar", label: "Sidebar layout" },
];

// pdf.js (used inside TemplateThumbnail) touches browser-only globals at
// module-evaluation time, so it must never be evaluated during SSR — same
// reason the builder's live preview is dynamically imported this way.
const TemplateThumbnail = dynamic(
  () => import("@/components/builder/TemplateThumbnail").then((mod) => mod.TemplateThumbnail),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full items-center justify-center bg-zinc-100 text-xs text-zinc-400">
        Loading…
      </div>
    ),
  }
);

export default function ChooseTemplatePage() {
  const router = useRouter();
  const resume = useResumeStore((s) => s.resume);
  const hasHydrated = useResumeStore((s) => s.hasHydrated);
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const setSelectedTemplateId = useResumeStore((s) => s.setSelectedTemplateId);
  const selectedAccentColor = useResumeStore((s) => s.selectedAccentColor);
  const setSelectedAccentColor = useResumeStore((s) => s.setSelectedAccentColor);
  const [activeFilter, setActiveFilter] = useState<TemplateTag | "all">("all");

  const visibleTemplates =
    activeFilter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.tags?.includes(activeFilter));

  if (!hasHydrated) {
    return <div className="p-8 text-sm text-zinc-500">Loading…</div>;
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Choose your template</h1>
      <p className="mt-2 text-center text-zinc-500">
        Each preview uses the details we found in your resume. Pick your favorite — you can
        change it anytime.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedAccentColor(null)}
          aria-label="Use default color"
          className={`h-6 w-6 rounded-full border-2 bg-white bg-[linear-gradient(135deg,transparent_47%,#d4d4d8_47%,#d4d4d8_53%,transparent_53%)] ${
            selectedAccentColor === null ? "border-zinc-900" : "border-zinc-300"
          }`}
        />
        {ACCENT_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => setSelectedAccentColor(color.value)}
            aria-label={color.name}
            title={color.name}
            style={{ backgroundColor: color.value }}
            className={`h-6 w-6 rounded-full border-2 ${
              selectedAccentColor === color.value ? "border-zinc-900" : "border-transparent"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeFilter === filter.id
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-zinc-300 text-zinc-600 hover:border-indigo-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        {visibleTemplates.map((template) => {
          const isSelected = template.id === selectedTemplateId;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplateId(template.id)}
              className={`flex flex-col overflow-hidden rounded-lg border-2 text-left transition-colors ${
                isSelected ? "border-indigo-600 ring-1 ring-indigo-600" : "border-zinc-200 hover:border-indigo-300"
              }`}
            >
              <TemplateThumbnail
                template={template}
                resume={resume}
                accentColor={selectedAccentColor ?? undefined}
              />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-zinc-900">{template.name}</span>
                {isSelected ? <span className="text-xs text-indigo-600">Selected</span> : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex w-full max-w-xs items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/upload")}
          className="rounded-md border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:border-indigo-400"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => router.push("/build")}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Choose this template
        </button>
      </div>
    </div>
  );
}
