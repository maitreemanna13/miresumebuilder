"use client";

import Link from "next/link";
import { useResumeStore } from "@/store/resumeStore";
import { BuilderShell } from "@/components/builder/BuilderShell";
import { ExportButtons } from "@/components/builder/ExportButtons";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { UserMenu } from "@/components/auth/UserMenu";
import { SAMPLE_RESUME } from "@/lib/sampleResume";
import type { Resume } from "@/lib/schema/resume";

export default function BuildPage() {
  const hasHydrated = useResumeStore((s) => s.hasHydrated);
  const fullName = useResumeStore((s) => s.resume.contact.fullName);
  const replaceResume = useResumeStore((s) => s.replaceResume);

  if (!hasHydrated) {
    return <div className="p-8 text-sm text-zinc-500">Loading…</div>;
  }

  function handleExtracted(resume: Resume) {
    if (fullName.trim()) {
      const confirmed = window.confirm(
        "This will replace your current resume with the uploaded one. Continue?"
      );
      if (!confirmed) return;
    }
    replaceResume(resume);
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
            R
          </span>
          <h1 className="text-lg font-semibold text-zinc-900">Resume Builder</h1>
        </Link>
        <div className="flex items-center gap-2">
          <UploadDropzone onExtracted={handleExtracted} />
          <button
            type="button"
            onClick={() => replaceResume(SAMPLE_RESUME)}
            className="rounded-md px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-indigo-700"
          >
            Load sample data
          </button>
          <ExportButtons />
          <UserMenu />
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <BuilderShell />
      </div>
    </div>
  );
}
