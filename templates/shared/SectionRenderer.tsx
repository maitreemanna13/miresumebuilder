import { View, Text, Font } from "@react-pdf/renderer";
import type { Resume, SectionId } from "@/lib/schema/resume";
import type { SectionStyleContract } from "./styleContract";
import { BulletList } from "./BulletList";
import { formatDateRange } from "./formatDateRange";

// Imported by every template, so this runs exactly once (module caching)
// regardless of which template renders first. Without it, react-pdf's
// default hyphenation can break a long word mid-way with a trailing
// hyphen (e.g. "Engineering-" / ", Electrical Engineering" on the next
// line) whenever a narrow column forces a wrap — ugly and avoidable by
// just wrapping at whole-word boundaries instead.
Font.registerHyphenationCallback((word) => [word]);

const SECTION_TITLES: Record<SectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
};

export function sectionHasContent(section: SectionId, resume: Resume): boolean {
  switch (section) {
    case "summary":
      return resume.summary.trim().length > 0;
    case "experience":
      return resume.experience.length > 0;
    case "education":
      return resume.education.length > 0;
    case "skills":
      return resume.skills.length > 0;
    case "projects":
      return resume.projects.length > 0;
    case "certifications":
      return resume.certifications.length > 0;
    case "awards":
      return resume.awards.length > 0;
    default:
      return false;
  }
}

export function SectionRenderer({
  section,
  resume,
  styles,
}: {
  section: SectionId;
  resume: Resume;
  styles: SectionStyleContract;
}) {
  const body = renderBody(section, resume, styles);
  if (!body) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>{SECTION_TITLES[section]}</Text>
      {body}
    </View>
  );
}

// Exported so templates with a custom section-title treatment (e.g. an
// icon marker or a dashed underline that <SectionRenderer>'s plain <Text>
// can't express) can render just the body under their own title markup.
export function renderSectionBody(
  section: SectionId,
  resume: Resume,
  styles: SectionStyleContract
) {
  return renderBody(section, resume, styles);
}

function renderBody(section: SectionId, resume: Resume, styles: SectionStyleContract) {
  switch (section) {
    case "summary": {
      if (!resume.summary.trim()) return null;
      return <Text style={styles.paragraph}>{resume.summary}</Text>;
    }

    case "experience": {
      if (resume.experience.length === 0) return null;
      return (
        <>
          {resume.experience.map((entry) => (
            // Only the header cluster (title/date/location) is wrap={false}
            // — not the whole entry. Each bullet is separately protected in
            // <BulletList>. Making the *entire* entry atomic pushed it wholesale
            // to the next page whenever it didn't fit the remaining space,
            // even when that space was substantial, leaving a large blank
            // gap at the bottom of the previous page.
            <View key={entry.id} style={styles.itemBlock}>
              <View wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>
                    {entry.role}
                    {entry.company ? `, ${entry.company}` : ""}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {formatDateRange(entry.startDate, entry.endDate, entry.current)}
                  </Text>
                </View>
                {entry.location ? (
                  <Text style={styles.itemSubtitle}>{entry.location}</Text>
                ) : null}
              </View>
              <BulletList bullets={entry.bullets} styles={styles} />
            </View>
          ))}
        </>
      );
    }

    case "education": {
      if (resume.education.length === 0) return null;
      return (
        <>
          {resume.education.map((entry) => (
            // See the experience case above for why only the header cluster
            // (not the whole entry) is wrap={false}.
            <View key={entry.id} style={styles.itemBlock}>
              <View wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>
                    {entry.degree}
                    {entry.fieldOfStudy &&
                    entry.fieldOfStudy.trim().toLowerCase() !== entry.degree.trim().toLowerCase()
                      ? `, ${entry.fieldOfStudy}`
                      : ""}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {entry.institution}
                  {entry.gpa ? ` — GPA: ${entry.gpa}` : ""}
                </Text>
              </View>
              <BulletList bullets={entry.bullets} styles={styles} />
            </View>
          ))}
        </>
      );
    }

    case "skills": {
      if (resume.skills.length === 0) return null;
      return (
        <>
          {resume.skills.map((group) => (
            <View key={group.id} style={styles.skillGroupRow}>
              {group.label ? (
                <Text style={styles.skillGroupLabel}>{group.label}: </Text>
              ) : null}
              <Text style={styles.skillGroupItems}>{group.items.join(", ")}</Text>
            </View>
          ))}
        </>
      );
    }

    case "projects": {
      if (resume.projects.length === 0) return null;
      return (
        <>
          {resume.projects.map((entry) => (
            // See the experience case above for why only the header cluster
            // (not the whole entry) is wrap={false}.
            <View key={entry.id} style={styles.itemBlock}>
              <View wrap={false}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{entry.name}</Text>
                  {entry.technologies.length > 0 ? (
                    <Text style={styles.itemMeta}>{entry.technologies.join(", ")}</Text>
                  ) : null}
                </View>
                {entry.description ? (
                  <Text style={styles.itemSubtitle}>{entry.description}</Text>
                ) : null}
              </View>
              <BulletList bullets={entry.bullets} styles={styles} />
            </View>
          ))}
        </>
      );
    }

    case "certifications": {
      if (resume.certifications.length === 0) return null;
      return (
        <>
          {resume.certifications.map((entry) => (
            <View key={entry.id} style={styles.itemBlock} wrap={false}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{entry.name}</Text>
                <Text style={styles.itemMeta}>{entry.date ?? ""}</Text>
              </View>
              {entry.issuer ? (
                <Text style={styles.itemSubtitle}>{entry.issuer}</Text>
              ) : null}
            </View>
          ))}
        </>
      );
    }

    case "awards": {
      if (resume.awards.length === 0) return null;
      return (
        <>
          {resume.awards.map((entry) => (
            <View key={entry.id} style={styles.itemBlock} wrap={false}>
              <View style={styles.itemHeaderRow}>
                <Text style={styles.itemTitle}>{entry.name}</Text>
                <Text style={styles.itemMeta}>{entry.date ?? ""}</Text>
              </View>
              {entry.issuer ? (
                <Text style={styles.itemSubtitle}>{entry.issuer}</Text>
              ) : null}
              {entry.description ? (
                <Text style={styles.paragraph}>{entry.description}</Text>
              ) : null}
            </View>
          ))}
        </>
      );
    }

    default:
      return null;
  }
}
