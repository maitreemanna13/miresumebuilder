"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resumeStore";
import { TipJarToast } from "./TipJarToast";

type ExportFormat = "pdf" | "docx";

export function ExportButtons() {
  const router = useRouter();
  const resume = useResumeStore((s) => s.resume);
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const selectedAccentColor = useResumeStore((s) => s.selectedAccentColor);
  const [loading, setLoading] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTipJar, setShowTipJar] = useState(false);

  async function handleExport(format: ExportFormat) {
    setLoading(format);
    setError(null);
    try {
      const res = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          templateId: selectedTemplateId,
          accentColor: selectedAccentColor ?? undefined,
        }),
      });

      if (res.status === 401) {
        // The builder is open to everyone — only downloading requires an
        // account. Resume content stays in localStorage, so it's untouched
        // when the user comes back after signing in.
        router.push("/login?callbackUrl=/build");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Export failed (${res.status})`);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const fileName = disposition.match(/filename="([^"]+)"/)?.[1] ?? `resume.${format}`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      setShowTipJar(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setLoading(null);
    }
  }

  const isNearEmpty = !resume.contact.fullName.trim();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleExport("pdf")}
        disabled={loading !== null}
        title={isNearEmpty ? "Add your name in the Contact tab first" : undefined}
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading === "pdf" ? "Exporting…" : "Download PDF"}
      </button>
      <button
        type="button"
        onClick={() => handleExport("docx")}
        disabled={loading !== null}
        title={isNearEmpty ? "Add your name in the Contact tab first" : undefined}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:border-zinc-400 disabled:opacity-50"
      >
        {loading === "docx" ? "Exporting…" : "Download Word"}
      </button>
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : isNearEmpty ? (
        <span className="text-xs text-amber-600">Add your name before exporting</span>
      ) : null}
      {showTipJar ? <TipJarToast onClose={() => setShowTipJar(false)} /> : null}
    </div>
  );
}
