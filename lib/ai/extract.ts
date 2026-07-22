import { z } from "zod";

// Deliberately flat and format-free (no .email()/.url()/.max() constraints,
// no projects/certifications) — a full-fidelity schema built from the app's
// canonical resume types was rejected by the API as "too complex" for
// structured outputs. Contact/date fields are sanitized separately before
// being merged into the real ResumeSchema.
const ContactExtractSchema = z.object({
  fullName: z.string().optional(),
  headline: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

const ExperienceExtractSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  bullets: z.array(z.string()),
});

const EducationExtractSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
});

const SkillGroupExtractSchema = z.object({
  label: z.string().optional(),
  items: z.array(z.string()),
});

export const ExtractionResultSchema = z.object({
  contact: ContactExtractSchema,
  summary: z.string().optional(),
  experience: z.array(ExperienceExtractSchema),
  education: z.array(EducationExtractSchema),
  skills: z.array(SkillGroupExtractSchema),
});

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

export const EXTRACT_SYSTEM_PROMPT = `You extract structured resume data from raw text that was extracted from an uploaded PDF or DOCX file. The text may have inconsistent formatting, scrambled column order, or stray line breaks from the extraction process.

Rules:
- Extract only what is actually present in the text. Do not invent names, dates, companies, or accomplishments.
- Normalize dates to a short, consistent format like "Jan 2022" where possible; if a date is genuinely ambiguous, make your best reasonable guess rather than leaving it blank.
- Split content into the correct sections: a short paragraph of prose near the top is usually the summary; a list of institutions/degrees is education; a list of companies/roles with bullet points is experience; a list of short skill terms is skills.
- If a section isn't present in the text, return an empty array for it rather than fabricating one.
- Preserve bullet point wording closely — light cleanup of stray whitespace or broken line wraps is fine, but do not rewrite or embellish the original content.
- This app does not currently import projects or certifications from uploads — ignore those sections even if present in the text.`;
