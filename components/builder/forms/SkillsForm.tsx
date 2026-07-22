"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { SkillGroup } from "@/lib/schema/resume";
import { SortableItemList } from "./SortableItemList";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

function newSkillGroup(): SkillGroup {
  return { id: crypto.randomUUID(), label: "", items: [] };
}

export function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills);
  const updateResume = useResumeStore((s) => s.updateResume);

  function updateGroup(id: string, patch: Partial<SkillGroup>) {
    updateResume((draft) => ({
      ...draft,
      skills: draft.skills.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
  }

  return (
    <SortableItemList
      items={skills}
      addLabel="Add skill group"
      onAdd={() => updateResume((draft) => ({ ...draft, skills: [...draft.skills, newSkillGroup()] }))}
      onRemove={(id) =>
        updateResume((draft) => ({ ...draft, skills: draft.skills.filter((g) => g.id !== id) }))
      }
      onReorder={(items) => updateResume((draft) => ({ ...draft, skills: items }))}
      renderItem={(group) => (
        <div className="flex flex-col gap-3">
          <Field label="Group label">
            <Input
              value={group.label}
              onChange={(e) => updateGroup(group.id, { label: e.target.value })}
              placeholder="e.g. Languages"
            />
          </Field>
          <Field label="Skills (comma-separated)">
            <Input
              value={group.items.join(", ")}
              onChange={(e) =>
                updateGroup(group.id, {
                  items: e.target.value.split(",").map((s) => s.trimStart()),
                })
              }
              placeholder="TypeScript, Go, Python"
            />
          </Field>
        </div>
      )}
    />
  );
}
