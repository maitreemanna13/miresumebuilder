import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { formatDateRange } from "@/templates/shared/formatDateRange";

const SECTION_TITLES: Record<SectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
};

// A single, template-independent, ATS-friendly layout — Word exports are
// used for parsing by applicant-tracking systems and further manual
// editing, not visual fidelity to the chosen on-screen template.
export async function buildResumeDocx(resume: Resume): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({ text: resume.contact.fullName || "Your Name", heading: HeadingLevel.TITLE }),
  ];

  if (resume.contact.headline) {
    children.push(new Paragraph({ text: resume.contact.headline }));
  }

  const contactLine = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.website,
    resume.contact.linkedin,
    resume.contact.github,
  ]
    .filter((v): v is string => Boolean(v && v.trim()))
    .join("   |   ");

  if (contactLine) {
    children.push(new Paragraph({ text: contactLine, spacing: { after: 200 } }));
  }

  for (const section of resume.sectionOrder) {
    const sectionParagraphs = buildSectionParagraphs(section, resume);
    if (sectionParagraphs.length === 0) continue;

    children.push(
      new Paragraph({
        text: SECTION_TITLES[section],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );
    children.push(...sectionParagraphs);
  }

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}

function buildSectionParagraphs(section: SectionId, resume: Resume): Paragraph[] {
  switch (section) {
    case "summary":
      return resume.summary.trim() ? [new Paragraph({ text: resume.summary })] : [];

    case "experience":
      return resume.experience.flatMap((entry) => {
        const paragraphs: Paragraph[] = [
          new Paragraph({
            children: [
              new TextRun({
                text: `${entry.role}${entry.company ? `, ${entry.company}` : ""}`,
                bold: true,
              }),
              new TextRun({
                text: `    ${formatDateRange(entry.startDate, entry.endDate, entry.current)}`,
                italics: true,
              }),
            ],
          }),
        ];
        if (entry.location) paragraphs.push(new Paragraph({ text: entry.location }));
        for (const bullet of entry.bullets) {
          if (bullet.trim()) paragraphs.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
        }
        return paragraphs;
      });

    case "education":
      return resume.education.flatMap((entry) => {
        const paragraphs: Paragraph[] = [
          new Paragraph({
            children: [
              new TextRun({
                text: `${entry.degree}${entry.fieldOfStudy ? `, ${entry.fieldOfStudy}` : ""}`,
                bold: true,
              }),
              new TextRun({
                text: `    ${formatDateRange(entry.startDate, entry.endDate)}`,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            text: `${entry.institution}${entry.gpa ? ` — GPA: ${entry.gpa}` : ""}`,
          }),
        ];
        for (const bullet of entry.bullets) {
          if (bullet.trim()) paragraphs.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
        }
        return paragraphs;
      });

    case "skills":
      return resume.skills.map(
        (group) =>
          new Paragraph({
            children: [
              ...(group.label ? [new TextRun({ text: `${group.label}: `, bold: true })] : []),
              new TextRun({ text: group.items.join(", ") }),
            ],
          })
      );

    case "projects":
      return resume.projects.flatMap((entry) => {
        const paragraphs: Paragraph[] = [
          new Paragraph({
            children: [
              new TextRun({ text: entry.name, bold: true }),
              ...(entry.technologies.length > 0
                ? [new TextRun({ text: `    ${entry.technologies.join(", ")}`, italics: true })]
                : []),
            ],
          }),
        ];
        if (entry.description) paragraphs.push(new Paragraph({ text: entry.description }));
        for (const bullet of entry.bullets) {
          if (bullet.trim()) paragraphs.push(new Paragraph({ text: bullet, bullet: { level: 0 } }));
        }
        return paragraphs;
      });

    case "certifications":
      return resume.certifications.map(
        (entry) =>
          new Paragraph({
            children: [
              new TextRun({ text: entry.name, bold: true }),
              ...(entry.issuer ? [new TextRun({ text: ` — ${entry.issuer}` })] : []),
              ...(entry.date ? [new TextRun({ text: `    ${entry.date}`, italics: true })] : []),
            ],
          })
      );

    case "awards":
      return resume.awards.flatMap((entry) => {
        const paragraphs: Paragraph[] = [
          new Paragraph({
            children: [
              new TextRun({ text: entry.name, bold: true }),
              ...(entry.issuer ? [new TextRun({ text: ` — ${entry.issuer}` })] : []),
              ...(entry.date ? [new TextRun({ text: `    ${entry.date}`, italics: true })] : []),
            ],
          }),
        ];
        if (entry.description) paragraphs.push(new Paragraph({ text: entry.description }));
        return paragraphs;
      });

    default:
      return [];
  }
}
