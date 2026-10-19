import { EMPTY_RESUME, SECTION_IDS, type Resume } from "@/lib/schema/resume";
import type { ExtractionResult } from "@/lib/ai/extract";

function sanitizeUrl(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    new URL(withProtocol);
    return withProtocol;
  } catch {
    return undefined;
  }
}

function sanitizeEmail(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : undefined;
}

// The extraction schema carries no length limits (see lib/ai/extract.ts),
// but ResumeSchema does — every field is clamped here so one over-long
// value doesn't fail validation and reject the whole upload.
function clip(value: string | undefined, maxLength: number): string | undefined {
  return value?.trim().slice(0, maxLength) || undefined;
}

function clampList(values: string[], maxItems: number, maxLength: number): string[] {
  return values
    .map((v) => v.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

// Converts the AI's lenient extraction output into the app's canonical
// Resume shape: assigns client-safe ids, sanitizes contact fields that the
// real ResumeSchema validates strictly (email/url format), and fills in the
// sections the extraction schema deliberately omits (projects,
// certifications) as empty so the user can add them by hand.
export function buildResumeFromExtraction(extraction: ExtractionResult): Resume {
  return {
    ...EMPTY_RESUME,
    contact: {
      fullName: clip(extraction.contact.fullName, 120) ?? "",
      headline: clip(extraction.contact.headline, 160),
      email: sanitizeEmail(extraction.contact.email),
      phone: clip(extraction.contact.phone, 40),
      location: clip(extraction.contact.location, 120),
      website: sanitizeUrl(extraction.contact.website),
      linkedin: sanitizeUrl(extraction.contact.linkedin),
      github: sanitizeUrl(extraction.contact.github),
    },
    summary: clip(extraction.summary, 2000) ?? "",
    experience: extraction.experience.map((entry) => ({
      id: crypto.randomUUID(),
      company: clip(entry.company, 160) ?? "",
      role: clip(entry.role, 160) ?? "",
      location: clip(entry.location, 120),
      startDate: clip(entry.startDate, 20),
      endDate: clip(entry.endDate, 20),
      current: entry.current ?? false,
      bullets: clampList(entry.bullets, 12, 400),
      projects: entry.projects.slice(0, 10).map((project) => ({
        id: crypto.randomUUID(),
        name: clip(project.name, 160) ?? "",
        client: clip(project.client, 160),
        role: clip(project.role, 160),
        startDate: clip(project.startDate, 20),
        endDate: clip(project.endDate, 20),
        bullets: clampList(project.bullets, 15, 400),
        technologies: clampList(project.technologies, 20, 40),
      })),
    })),
    education: extraction.education.map((entry) => ({
      id: crypto.randomUUID(),
      institution: clip(entry.institution, 160) ?? "",
      degree: clip(entry.degree, 160) ?? "",
      fieldOfStudy: clip(entry.fieldOfStudy, 160),
      startDate: clip(entry.startDate, 20),
      endDate: clip(entry.endDate, 20),
      gpa: clip(entry.gpa, 20),
      bullets: [],
    })),
    skills: extraction.skills.map((group) => ({
      id: crypto.randomUUID(),
      label: clip(group.label, 60) ?? "",
      items: clampList(group.items, 30, 40),
    })),
    projects: [],
    certifications: [],
    awards: [],
    sectionOrder: [...SECTION_IDS],
  };
}
