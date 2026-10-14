"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { ExperienceEntry, ExperienceProject } from "@/lib/schema/resume";
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
    projects: [],
  };
}

function newExperienceProject(): ExperienceProject {
  return {
    id: crypto.randomUUID(),
    name: "",
    client: "",
    role: "",
    startDate: "",
    endDate: "",
    bullets: [],
    technologies: [],
  };
}

function ExperienceProjectsEditor({
  projects,
  onChange,
}: {
  projects: ExperienceProject[];
  onChange: (projects: ExperienceProject[]) => void;
}) {
  function updateProject(id: string, patch: Partial<ExperienceProject>) {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-zinc-700">Project Details</p>
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-3"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Client name">
              <Input
                value={project.client ?? ""}
                onChange={(e) => updateProject(project.id, { client: e.target.value })}
              />
            </Field>
            <Field label="Project name">
              <Input
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <Input
                value={project.role ?? ""}
                onChange={(e) => updateProject(project.id, { role: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Start">
                <Input
                  value={project.startDate ?? ""}
                  onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                  placeholder="Jan 2022"
                />
              </Field>
              <Field label="End">
                <Input
                  value={project.endDate ?? ""}
                  onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                  placeholder="Present"
                />
              </Field>
            </div>
          </div>
          <Field label="Technologies (comma-separated)">
            <Input
              value={project.technologies.join(", ")}
              onChange={(e) =>
                updateProject(project.id, {
                  technologies: e.target.value.split(",").map((s) => s.trimStart()),
                })
              }
            />
          </Field>
          <Field label="Description (one bullet per line)">
            <Textarea
              rows={4}
              value={project.bullets.join("\n")}
              onChange={(e) => updateProject(project.id, { bullets: e.target.value.split("\n") })}
            />
          </Field>
          <button
            type="button"
            onClick={() => onChange(projects.filter((p) => p.id !== project.id))}
            className="self-start rounded-md border border-transparent px-2 py-1 text-xs font-medium text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Remove project
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...projects, newExperienceProject()])}
        className="self-start rounded-md border border-dashed border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
      >
        + Add project
      </button>
    </div>
  );
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
            <Field label="Designation">
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
          <ExperienceProjectsEditor
            projects={entry.projects}
            onChange={(projects) => updateEntry(entry.id, { projects })}
          />
        </div>
      )}
    />
  );
}
