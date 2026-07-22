"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary);
  const updateResume = useResumeStore((s) => s.updateResume);

  return (
    <Field label="Professional summary">
      <Textarea
        rows={7}
        value={summary}
        onChange={(e) => updateResume((draft) => ({ ...draft, summary: e.target.value }))}
        placeholder="A few sentences on your experience and what you're looking for..."
      />
    </Field>
  );
}
