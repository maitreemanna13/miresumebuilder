"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { Contact } from "@/lib/schema/resume";
import { resizePhotoToDataUrl } from "@/lib/image/resizePhoto";

// Matches the format ContactSchema enforces (lib/schema/resume.ts) so the
// hint shown here agrees with what actually blocks a valid export, instead
// of the user only finding out about a bad email/URL when Download fails.
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function ContactForm() {
  const contact = useResumeStore((s) => s.resume.contact);
  const updateResume = useResumeStore((s) => s.updateResume);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  function update<K extends keyof Contact>(key: K, value: Contact[K]) {
    updateResume((draft) => ({ ...draft, contact: { ...draft.contact, [key]: value } }));
  }

  const emailError = contact.email && !isValidEmail(contact.email) ? "Enter a valid email address." : null;
  const websiteError =
    contact.website && !isValidUrl(contact.website) ? "Include https:// (e.g. https://example.com)." : null;
  const linkedinError =
    contact.linkedin && !isValidUrl(contact.linkedin) ? "Include https:// (e.g. https://linkedin.com/in/you)." : null;
  const githubError =
    contact.github && !isValidUrl(contact.github) ? "Include https:// (e.g. https://github.com/you)." : null;

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }

    try {
      const dataUrl = await resizePhotoToDataUrl(file);
      setPhotoError(null);
      update("photoDataUrl", dataUrl);
    } catch {
      setPhotoError("Couldn't process that image. Try a different file.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!contact.fullName.trim() ? (
        <p className="rounded-md bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
          New here? Try <span className="font-medium">Load sample data</span> (top right) to see a
          template filled in, or start with the <span className="font-medium">Template</span> tab to
          pick a look first.
        </p>
      ) : null}
      <Field label="Photo (optional)">
        <div className="flex items-center gap-3">
          {contact.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- local base64 data URL, not a Next-optimizable remote asset
            <img
              src={contact.photoDataUrl}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-400">
              No photo
            </div>
          )}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="self-start rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
            >
              {contact.photoDataUrl ? "Change photo" : "Upload photo"}
            </button>
            {contact.photoDataUrl ? (
              <button
                type="button"
                onClick={() => update("photoDataUrl", undefined)}
                className="self-start text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>
        {photoError ? <p className="mt-1 text-xs text-red-600">{photoError}</p> : null}
        <p className="mt-1 text-xs text-zinc-400">
          Only shown on templates with a photo slot — look for "Photo" or sidebar-style templates.
        </p>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Full name">
          <Input value={contact.fullName} onChange={(e) => update("fullName", e.target.value)} />
        </Field>
        <Field label="Headline">
          <Input
            value={contact.headline ?? ""}
            onChange={(e) => update("headline", e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
          />
        </Field>
        <Field label="Email">
          <Input
            value={contact.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
            invalid={!!emailError}
          />
          {emailError ? <p className="text-xs text-red-600">{emailError}</p> : null}
        </Field>
        <Field label="Phone">
          <Input value={contact.phone ?? ""} onChange={(e) => update("phone", e.target.value)} />
        </Field>
        <Field label="Location">
          <Input
            value={contact.location ?? ""}
            onChange={(e) => update("location", e.target.value)}
            placeholder="City, State"
          />
        </Field>
        <Field label="Website">
          <Input
            value={contact.website ?? ""}
            onChange={(e) => update("website", e.target.value)}
            invalid={!!websiteError}
          />
          {websiteError ? <p className="text-xs text-red-600">{websiteError}</p> : null}
        </Field>
        <Field label="LinkedIn">
          <Input
            value={contact.linkedin ?? ""}
            onChange={(e) => update("linkedin", e.target.value)}
            invalid={!!linkedinError}
          />
          {linkedinError ? <p className="text-xs text-red-600">{linkedinError}</p> : null}
        </Field>
        <Field label="GitHub">
          <Input
            value={contact.github ?? ""}
            onChange={(e) => update("github", e.target.value)}
            invalid={!!githubError}
          />
          {githubError ? <p className="text-xs text-red-600">{githubError}</p> : null}
        </Field>
      </div>
    </div>
  );
}
