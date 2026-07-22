"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { EducationEntry } from "@/lib/schema/resume";
import { SortableItemList } from "./SortableItemList";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function newEducation(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    gpa: "",
    bullets: [],
  };
}

export function EducationForm() {
  const education = useResumeStore((s) => s.resume.education);
  const updateResume = useResumeStore((s) => s.updateResume);

  function updateEntry(id: string, patch: Partial<EducationEntry>) {
    updateResume((draft) => ({
      ...draft,
      education: draft.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }

  return (
    <SortableItemList
      items={education}
      addLabel="Add education"
      onAdd={() =>
        updateResume((draft) => ({ ...draft, education: [...draft.education, newEducation()] }))
      }
      onRemove={(id) =>
        updateResume((draft) => ({
          ...draft,
          education: draft.education.filter((e) => e.id !== id),
        }))
      }
      onReorder={(items) => updateResume((draft) => ({ ...draft, education: items }))}
      renderItem={(entry) => (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Degree">
              <Input
                value={entry.degree}
                onChange={(e) => updateEntry(entry.id, { degree: e.target.value })}
                placeholder="B.S."
                title={entry.degree}
              />
            </Field>
            <Field label="Field of study">
              <Input
                value={entry.fieldOfStudy ?? ""}
                onChange={(e) => updateEntry(entry.id, { fieldOfStudy: e.target.value })}
                title={entry.fieldOfStudy}
              />
            </Field>
            <Field label="Institution">
              <Input
                value={entry.institution}
                onChange={(e) => updateEntry(entry.id, { institution: e.target.value })}
                title={entry.institution}
              />
            </Field>
            <Field label="GPA">
              <Input value={entry.gpa ?? ""} onChange={(e) => updateEntry(entry.id, { gpa: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start">
                <Input
                  value={entry.startDate ?? ""}
                  onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })}
                />
              </Field>
              <Field label="End">
                <Input
                  value={entry.endDate ?? ""}
                  onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
                />
              </Field>
            </div>
          </div>
          <Field label="Bullets (one per line)">
            <Textarea
              rows={3}
              value={entry.bullets.join("\n")}
              onChange={(e) => updateEntry(entry.id, { bullets: e.target.value.split("\n") })}
            />
          </Field>
        </div>
      )}
    />
  );
}
