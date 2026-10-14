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
// but ResumeSchema does — clamp here so one over-long project doesn't fail
// validation and reject the whole upload.
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
      fullName: extraction.contact.fullName?.trim() ?? "",
      headline: extraction.contact.headline?.trim() || undefined,
      email: sanitizeEmail(extraction.contact.email),
      phone: extraction.contact.phone?.trim() || undefined,
      location: extraction.contact.location?.trim() || undefined,
      website: sanitizeUrl(extraction.contact.website),
      linkedin: sanitizeUrl(extraction.contact.linkedin),
      github: sanitizeUrl(extraction.contact.github),
    },
    summary: extraction.summary?.trim() ?? "",
    experience: extraction.experience.map((entry) => ({
      id: crypto.randomUUID(),
      company: entry.company,
      role: entry.role,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      current: entry.current ?? false,
      bullets: entry.bullets,
      projects: entry.projects.slice(0, 10).map((project) => ({
        id: crypto.randomUUID(),
        name: project.name.trim().slice(0, 160),
        client: project.client?.trim().slice(0, 160) || undefined,
        role: project.role?.trim().slice(0, 160) || undefined,
        startDate: project.startDate?.trim().slice(0, 20) || undefined,
        endDate: project.endDate?.trim().slice(0, 20) || undefined,
        bullets: clampList(project.bullets, 8, 400),
        technologies: clampList(project.technologies, 20, 40),
      })),
    })),
    education: extraction.education.map((entry) => ({
      id: crypto.randomUUID(),
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.fieldOfStudy,
      startDate: entry.startDate,
      endDate: entry.endDate,
      gpa: entry.gpa,
      bullets: [],
    })),
    skills: extraction.skills.map((group) => ({
      id: crypto.randomUUID(),
      label: group.label ?? "",
      items: group.items,
    })),
    projects: [],
    certifications: [],
    awards: [],
    sectionOrder: [...SECTION_IDS],
  };
}
