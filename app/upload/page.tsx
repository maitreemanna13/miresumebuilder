"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resumeStore";
import { UploadModal } from "@/components/upload/UploadModal";
import type { Resume } from "@/lib/schema/resume";

type Choice = "new" | "existing" | null;

export default function UploadStartPage() {
  const router = useRouter();
  const replaceResume = useResumeStore((s) => s.replaceResume);
  const [choice, setChoice] = useState<Choice>(null);
  const [showModal, setShowModal] = useState(false);

  function handleContinue() {
    if (choice === "new") {
      router.push("/build");
    } else if (choice === "existing") {
      setShowModal(true);
    }
  }

  function handleExtracted(resume: Resume) {
    replaceResume(resume);
    router.push("/choose-template");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-zinc-900">Let&apos;s build your resume</h1>
      <p className="mt-2 text-zinc-500">Choose how you&apos;d like to get started.</p>

      <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setChoice("new")}
          className={`rounded-lg border-2 p-6 text-left transition-colors ${
            choice === "new"
              ? "border-indigo-600 bg-indigo-50"
              : "border-zinc-200 hover:border-indigo-300"
          }`}
        >
          <h3 className="text-base font-semibold text-zinc-900">Create a new resume</h3>
          <p className="mt-1 text-sm text-zinc-500">We&apos;ll help you build one step by step.</p>
        </button>

        <button
          type="button"
          onClick={() => setChoice("existing")}
          className={`relative rounded-lg border-2 p-6 text-left transition-colors ${
            choice === "existing"
              ? "border-indigo-600 bg-indigo-50"
              : "border-zinc-200 hover:border-indigo-300"
          }`}
        >
          <span className="absolute -top-3 left-4 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">
            Saves time
          </span>
          <h3 className="text-base font-semibold text-zinc-900">I already have a resume</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Upload it and we&apos;ll fill in your details automatically.
          </p>
        </button>
      </div>

      <div className="mt-10 flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:border-indigo-400"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!choice}
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>

      {showModal ? (
        <UploadModal onExtracted={handleExtracted} onClose={() => setShowModal(false)} />
      ) : null}
    </div>
  );
}
