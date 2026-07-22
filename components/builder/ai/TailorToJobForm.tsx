"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const MAX_JOB_DESCRIPTION_LENGTH = 8000;

export function TailorToJobForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (instruction: string, jobDescription: string) => void;
  disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  function handleSubmit() {
    const trimmed = jobDescription.trim();
    if (!trimmed || disabled) return;

    const title = jobTitle.trim();
    const companyName = company.trim();
    const instruction =
      title || companyName
        ? `Tailor resume for ${title || "this role"}${companyName ? ` at ${companyName}` : ""}`
        : "Tailor resume for pasted job description";

    onSubmit(instruction, trimmed);
    setJobTitle("");
    setCompany("");
    setJobDescription("");
    setExpanded(false);
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="self-start text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Tailor to a job posting
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">Tailor to a job posting</p>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs text-zinc-500 hover:text-zinc-700"
        >
          Cancel
        </button>
      </div>

      <div className="flex gap-2">
        <Field label="Job title (optional)">
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Senior Backend Engineer"
          />
        </Field>
        <Field label="Company (optional)">
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Corp"
          />
        </Field>
      </div>

      <Field label="Job description">
        <Textarea
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          maxLength={MAX_JOB_DESCRIPTION_LENGTH}
          placeholder="Paste the full job description here..."
        />
      </Field>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !jobDescription.trim()}
        className="self-end rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Tailor resume
      </button>
    </div>
  );
}
