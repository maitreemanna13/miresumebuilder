"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { ProjectEntry } from "@/lib/schema/resume";
import { SortableItemList } from "./SortableItemList";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function newProject(): ProjectEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    link: "",
    description: "",
    bullets: [],
    technologies: [],
  };
}

export function ProjectsForm() {
  const projects = useResumeStore((s) => s.resume.projects);
  const updateResume = useResumeStore((s) => s.updateResume);

  function updateEntry(id: string, patch: Partial<ProjectEntry>) {
    updateResume((draft) => ({
      ...draft,
      projects: draft.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  return (
    <SortableItemList
      items={projects}
      addLabel="Add project"
      onAdd={() => updateResume((draft) => ({ ...draft, projects: [...draft.projects, newProject()] }))}
      onRemove={(id) =>
        updateResume((draft) => ({ ...draft, projects: draft.projects.filter((p) => p.id !== id) }))
      }
      onReorder={(items) => updateResume((draft) => ({ ...draft, projects: items }))}
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
            <Field label="Link">
              <Input
                value={entry.link ?? ""}
                onChange={(e) => updateEntry(entry.id, { link: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Description">
            <Input
              value={entry.description ?? ""}
              onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
            />
          </Field>
          <Field label="Technologies (comma-separated)">
            <Input
              value={entry.technologies.join(", ")}
              onChange={(e) =>
                updateEntry(entry.id, {
                  technologies: e.target.value.split(",").map((s) => s.trimStart()),
                })
              }
            />
          </Field>
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
