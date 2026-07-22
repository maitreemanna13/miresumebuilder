"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { CertificationEntry } from "@/lib/schema/resume";
import { SortableItemList } from "./SortableItemList";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

function newCertification(): CertificationEntry {
  return { id: crypto.randomUUID(), name: "", issuer: "", date: "", credentialUrl: "" };
}

export function CertificationsForm() {
  const certifications = useResumeStore((s) => s.resume.certifications);
  const updateResume = useResumeStore((s) => s.updateResume);

  function updateEntry(id: string, patch: Partial<CertificationEntry>) {
    updateResume((draft) => ({
      ...draft,
      certifications: draft.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }

  return (
    <SortableItemList
      items={certifications}
      addLabel="Add certification"
      onAdd={() =>
        updateResume((draft) => ({
          ...draft,
          certifications: [...draft.certifications, newCertification()],
        }))
      }
      onRemove={(id) =>
        updateResume((draft) => ({
          ...draft,
          certifications: draft.certifications.filter((c) => c.id !== id),
        }))
      }
      onReorder={(items) => updateResume((draft) => ({ ...draft, certifications: items }))}
      renderItem={(entry) => (
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
          <Field label="Credential URL">
            <Input
              value={entry.credentialUrl ?? ""}
              onChange={(e) => updateEntry(entry.id, { credentialUrl: e.target.value })}
            />
          </Field>
        </div>
      )}
    />
  );
}
