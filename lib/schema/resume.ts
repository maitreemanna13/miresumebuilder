import { z } from "zod";

export const ContactSchema = z.object({
  fullName: z.string().max(120),
  headline: z.string().max(160).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  location: z.string().max(120).optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  // Base64 data URL of a client-resized profile photo (local-only, no
  // server upload). Optional — most templates don't render a photo.
  photoDataUrl: z.string().max(400_000).optional(),
});

// A project delivered as part of a job, nested under that experience entry
// — distinct from the top-level "projects" section (personal/side projects).
export const ExperienceProjectSchema = z.object({
  id: z.string(),
  name: z.string().max(160),
  client: z.string().max(160).optional(),
  // The person's role on this project (e.g. "Tech Lead") — separate from
  // their designation at the company, which lives on the parent entry.
  role: z.string().max(160).optional(),
  startDate: z.string().max(20).optional(),
  endDate: z.string().max(20).optional(),
  bullets: z.array(z.string().max(400)).max(15).default([]),
  technologies: z.array(z.string().max(40)).max(20).default([]),
});

export const ExperienceEntrySchema = z.object({
  id: z.string(),
  company: z.string().max(160),
  role: z.string().max(160),
  location: z.string().max(120).optional(),
  startDate: z.string().max(20).optional(),
  endDate: z.string().max(20).optional(),
  current: z.boolean().default(false),
  bullets: z.array(z.string().max(400)).max(12).default([]),
  projects: z.array(ExperienceProjectSchema).max(10).default([]),
});

export const EducationEntrySchema = z.object({
  id: z.string(),
  institution: z.string().max(160),
  degree: z.string().max(160),
  fieldOfStudy: z.string().max(160).optional(),
  startDate: z.string().max(20).optional(),
  endDate: z.string().max(20).optional(),
  gpa: z.string().max(20).optional(),
  bullets: z.array(z.string().max(300)).max(6).default([]),
});

export const ProjectEntrySchema = z.object({
  id: z.string(),
  name: z.string().max(160),
  link: z.string().url().optional().or(z.literal("")),
  description: z.string().max(500).optional(),
  bullets: z.array(z.string().max(300)).max(8).default([]),
  technologies: z.array(z.string().max(40)).max(20).default([]),
});

export const CertificationEntrySchema = z.object({
  id: z.string(),
  name: z.string().max(160),
  issuer: z.string().max(160).optional(),
  date: z.string().max(20).optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
});

export const AwardEntrySchema = z.object({
  id: z.string(),
  name: z.string().max(160),
  issuer: z.string().max(160).optional(),
  date: z.string().max(20).optional(),
  description: z.string().max(300).optional(),
});

export const SkillGroupSchema = z.object({
  id: z.string(),
  label: z.string().max(60),
  items: z.array(z.string().max(40)).max(30).default([]),
});

export const SECTION_IDS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "awards",
] as const;

export const SectionIdSchema = z.enum(SECTION_IDS);
export type SectionId = z.infer<typeof SectionIdSchema>;

export const ResumeSchema = z.object({
  schemaVersion: z.literal(1),
  contact: ContactSchema,
  summary: z.string().max(2000).default(""),
  experience: z.array(ExperienceEntrySchema).default([]),
  education: z.array(EducationEntrySchema).default([]),
  skills: z.array(SkillGroupSchema).default([]),
  projects: z.array(ProjectEntrySchema).default([]),
  certifications: z.array(CertificationEntrySchema).default([]),
  awards: z.array(AwardEntrySchema).default([]),
  sectionOrder: z.array(SectionIdSchema).default([...SECTION_IDS]),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export type ExperienceProject = z.infer<typeof ExperienceProjectSchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;
export type CertificationEntry = z.infer<typeof CertificationEntrySchema>;
export type AwardEntry = z.infer<typeof AwardEntrySchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const EMPTY_RESUME: Resume = {
  schemaVersion: 1,
  contact: { fullName: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  sectionOrder: [...SECTION_IDS],
};

// "Best-effort" variant for AI extraction from an uploaded resume: every
// field is optional so the model isn't forced to fabricate missing data.
export const ResumeExtractionSchema = z.object({
  contact: ContactSchema.partial(),
  summary: z.string().max(2000).optional(),
  experience: z
    .array(ExperienceEntrySchema.omit({ id: true, projects: true }).partial({ current: true }))
    .default([]),
  education: z.array(EducationEntrySchema.omit({ id: true })).default([]),
  skills: z.array(SkillGroupSchema.omit({ id: true })).default([]),
  projects: z.array(ProjectEntrySchema.omit({ id: true })).default([]),
  certifications: z.array(CertificationEntrySchema.omit({ id: true })).default([]),
});

export type ResumeExtraction = z.infer<typeof ResumeExtractionSchema>;
