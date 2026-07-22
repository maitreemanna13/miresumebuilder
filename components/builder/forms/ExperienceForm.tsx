"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { ExperienceEntry } from "@/lib/schema/resume";
import { SortableItemList } from "./SortableItemList";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function newExperience(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    bullets: [],
  };
}

export function ExperienceForm() {
  const experience = useResumeStore((s) => s.resume.experience);
  const updateResume = useResumeStore((s) => s.updateResume);

  function updateEntry(id: string, patch: Partial<ExperienceEntry>) {
    updateResume((draft) => ({
      ...draft,
      experience: draft.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }

  return (
    <SortableItemList
      items={experience}
      addLabel="Add experience"
      onAdd={() =>
        updateResume((draft) => ({ ...draft, experience: [...draft.experience, newExperience()] }))
      }
      onRemove={(id) =>
        updateResume((draft) => ({
          ...draft,
          experience: draft.experience.filter((e) => e.id !== id),
        }))
      }
      onReorder={(items) => updateResume((draft) => ({ ...draft, experience: items }))}
      renderItem={(entry) => (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role">
              <Input value={entry.role} onChange={(e) => updateEntry(entry.id, { role: e.target.value })} />
            </Field>
            <Field label="Company">
              <Input
                value={entry.company}
                onChange={(e) => updateEntry(entry.id, { company: e.target.value })}
              />
            </Field>
            <Field label="Location">
              <Input
                value={entry.location ?? ""}
                onChange={(e) => updateEntry(entry.id, { location: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start">
                <Input
                  value={entry.startDate ?? ""}
                  onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })}
                  placeholder="Jan 2022"
                />
              </Field>
              <Field label="End">
                <Input
                  value={entry.endDate ?? ""}
                  disabled={entry.current}
                  onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
                  placeholder="Present"
                />
              </Field>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={entry.current}
              onChange={(e) => updateEntry(entry.id, { current: e.target.checked })}
            />
            I currently work here
          </label>
          <Field label="Bullets (one per line)">
            <Textarea
              rows={4}
              value={entry.bullets.join("\n")}
              onChange={(e) => updateEntry(entry.id, { bullets: e.target.value.split("\n") })}
            />
          </Field>
        </div>
      )}
    />
  );
}
