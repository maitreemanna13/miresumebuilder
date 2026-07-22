import type { Resume } from "@/lib/schema/resume";
import type { RefineUpdates } from "@/lib/ai/refine";

const FIELD_LABELS: Record<keyof RefineUpdates, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
};

function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

export function DiffField({
  field,
  before,
  after,
}: {
  field: keyof RefineUpdates;
  before: Resume;
  after: RefineUpdates;
}) {
  if (field === "summary") {
    if (after.summary === undefined) return null;
    return (
      <div className="rounded-md border border-zinc-200 p-3 text-sm">
        <p className="mb-1 font-medium text-zinc-700">{FIELD_LABELS.summary}</p>
        {before.summary ? <p className="mb-1 text-zinc-400 line-through">{before.summary}</p> : null}
        <p className="text-zinc-900">{after.summary}</p>
      </div>
    );
  }

  if (field === "skills") {
    if (!after.skills || after.skills.length === 0) return null;
    return (
      <div className="rounded-md border border-zinc-200 p-3 text-sm">
        <p className="mb-1 font-medium text-zinc-700">{FIELD_LABELS.skills}</p>
        {after.skills.map((patch) => {
          const oldGroup = findById(before.skills, patch.id);
          return (
            <div key={patch.id} className="mb-2 last:mb-0">
              {oldGroup ? (
                <p className="text-zinc-400 line-through">
                  {oldGroup.label}: {oldGroup.items.join(", ")}
                </p>
              ) : null}
              <p className="text-zinc-900">
                {patch.label}: {patch.items.join(", ")}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  if (field === "experience") {
    const patches = after.experience;
    if (!patches || patches.length === 0) return null;
    return (
      <div className="rounded-md border border-zinc-200 p-3 text-sm">
        <p className="mb-1 font-medium text-zinc-700">{FIELD_LABELS.experience}</p>
        {patches.map((patch) => {
          const oldEntry = findById(before.experience, patch.id);
          const title = oldEntry
            ? `${oldEntry.role}${oldEntry.company ? ` at ${oldEntry.company}` : ""}`
            : null;
          return (
            <div key={patch.id} className="mb-2 last:mb-0">
              {title ? <p className="text-xs font-medium text-zinc-500">{title}</p> : null}
              {oldEntry ? (
                <p className="text-zinc-400 line-through">{oldEntry.bullets.join(" · ")}</p>
              ) : null}
              <p className="text-zinc-900">{patch.bullets.join(" · ")}</p>
            </div>
          );
        })}
      </div>
    );
  }

  if (field === "education") {
    const patches = after.education;
    if (!patches || patches.length === 0) return null;
    return (
      <div className="rounded-md border border-zinc-200 p-3 text-sm">
        <p className="mb-1 font-medium text-zinc-700">{FIELD_LABELS.education}</p>
        {patches.map((patch) => {
          const oldEntry = findById(before.education, patch.id);
          const title = oldEntry
            ? `${oldEntry.degree}${oldEntry.institution ? ` — ${oldEntry.institution}` : ""}`
            : null;
          return (
            <div key={patch.id} className="mb-2 last:mb-0">
              {title ? <p className="text-xs font-medium text-zinc-500">{title}</p> : null}
              {oldEntry ? (
                <p className="text-zinc-400 line-through">{oldEntry.bullets.join(" · ")}</p>
              ) : null}
              <p className="text-zinc-900">{patch.bullets.join(" · ")}</p>
            </div>
          );
        })}
      </div>
    );
  }

  // projects
  const patches = after.projects;
  if (!patches || patches.length === 0) return null;
  return (
    <div className="rounded-md border border-zinc-200 p-3 text-sm">
      <p className="mb-1 font-medium text-zinc-700">{FIELD_LABELS.projects}</p>
      {patches.map((patch) => {
        const oldEntry = findById(before.projects, patch.id);
        return (
          <div key={patch.id} className="mb-2 last:mb-0">
            {oldEntry ? <p className="text-xs font-medium text-zinc-500">{oldEntry.name}</p> : null}
            {oldEntry?.description ? (
              <p className="text-zinc-400 line-through">{oldEntry.description}</p>
            ) : null}
            {patch.description ? <p className="text-zinc-900">{patch.description}</p> : null}
            {oldEntry ? <p className="text-zinc-400 line-through">{oldEntry.bullets.join(" · ")}</p> : null}
            <p className="text-zinc-900">{patch.bullets.join(" · ")}</p>
          </div>
        );
      })}
    </div>
  );
}
