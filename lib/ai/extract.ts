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

// Projects/engagements listed under a single job — kept as flat as the
// rest of this schema for the same "too complex" reason noted above.
const ExperienceProjectExtractSchema = z.object({
  name: z.string(),
  client: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  technologies: z.array(z.string()),
  bullets: z.array(z.string()),
});

const ExperienceExtractSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  bullets: z.array(z.string()),
  projects: z.array(ExperienceProjectExtractSchema),
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
- Experience "role" is the person's designation/job title at that company.
- Many resumes list named projects, engagements, or client assignments under a job (often headed "Project", "Project Details", "Client", "Engagement", or a project title followed by its own role, duration, technologies/environment, and description/responsibilities). Put each of these in that job's "projects" array: "name" is the project name, "client" is the client/customer it was delivered for if stated (if only a client is named and no project title, use the client as "name" and leave "client" empty), "role" is the person's role on that project, "startDate"/"endDate" are the project's own duration if stated, "technologies" is its tools/environment list split into individual items, and "bullets" holds its description and responsibilities, one point per entry (split a prose description into its sentences/points).
- Content that belongs to a project goes ONLY in that project's "bullets" — do not repeat it in the job's own "bullets". Use the job's own "bullets" only for points that are not part of any named project. If a job lists no named projects, return an empty "projects" array and keep its points in "bullets".
- If projects are listed in a separate section but each one clearly names the company/employer it was done for (or its dates fall inside exactly one job), attach it to that job's "projects". Otherwise ignore it.
- This app does not currently import standalone personal projects or certifications from uploads — ignore those sections even if present in the text.`;
