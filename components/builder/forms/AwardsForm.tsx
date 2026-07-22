"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { AwardEntry } from "@/lib/schema/resume";
import { SortableItemList } from "./SortableItemList";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function newAward(): AwardEntry {
  return { id: crypto.randomUUID(), name: "", issuer: "", date: "", description: "" };
}

export function AwardsForm() {
  const awards = useResumeStore((s) => s.resume.awards);
  const updateResume = useResumeStore((s) => s.updateResume);

  function updateEntry(id: string, patch: Partial<AwardEntry>) {
    updateResume((draft) => ({
      ...draft,
      awards: draft.awards.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }

  return (
    <SortableItemList
      items={awards}
      addLabel="Add award"
      onAdd={() => updateResume((draft) => ({ ...draft, awards: [...draft.awards, newAward()] }))}
      onRemove={(id) =>
        updateResume((draft) => ({ ...draft, awards: draft.awards.filter((a) => a.id !== id) }))
      }
      onReorder={(items) => updateResume((draft) => ({ ...draft, awards: items }))}
      renderItem={(entry) => (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name">
              <Input
                value={entry.name}
                onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                title={entry.name}
              />
            </Field>
            <Field label="Issuer">
              <Input
                value={entry.issuer ?? ""}
                onChange={(e) => updateEntry(entry.id, { issuer: e.target.value })}
                title={entry.issuer}
              />
            </Field>
            <Field label="Date">
              <Input value={entry.date ?? ""} onChange={(e) => updateEntry(entry.id, { date: e.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea
              rows={2}
              value={entry.description ?? ""}
              onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
            />
          </Field>
        </div>
      )}
    />
  );
}
