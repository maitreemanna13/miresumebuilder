import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { renderSectionBody, sectionHasContent } from "../shared/SectionRenderer";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#3f3f46";

const SECTION_TITLES: Record<SectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
};

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 40, fontFamily: "Lato", fontSize: 9.5, color: "#242424" },
    header: { marginBottom: 20 },
    name: {
      fontSize: 24,
      fontFamily: "Lato-Bold",
      color: "#111111",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    headline: { fontSize: 10.5, marginTop: 4, color: "#555555" },

    columnsRow: { flexDirection: "row", gap: 26 },
    sideColumn: { width: "30%" },
    mainColumn: { flex: 1 },
    titleBar: { width: 22, height: 2, backgroundColor: accent, marginTop: 4, marginBottom: 8 },
    contactItem: { fontSize: 8.5, color: "#444444", marginBottom: 5 },
    skillLine: { fontSize: 8, color: "#333333", marginBottom: 5, lineHeight: 1.3 },
    skillLabel: { fontFamily: "Lato-Bold", color: "#111111" },
    // Stacked (not side-by-side) so degree title and dates never collide in
    // the narrow 30%-width sidebar — the shared itemHeaderRow contract style
    // used by the main column assumes a much wider row to lay title/date
    // out side by side.
    sideEduBlock: { marginBottom: 8 },
    sideEduTitle: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#111111", lineHeight: 1.25 },
    sideEduMeta: { fontSize: 8, color: "#666666", marginTop: 2 },
    sideCertBlock: { marginBottom: 8 },
    sideCertTitle: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#111111", lineHeight: 1.25 },
    sideCertMeta: { fontSize: 8, color: "#666666", marginTop: 2 },

    sectionTitle: {
      fontSize: 9.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#111111",
      marginTop: 14,
    },
    itemBlock: { marginBottom: 8 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", marginBottom: 1 },
    skillGroupItems: { fontSize: 8.5, lineHeight: 1.4 },
  };
}

function CompactEducationList({
  resume,
  styles,
}: {
  resume: Resume;
  styles: SectionStyleContract & Record<string, Style>;
}) {
  if (resume.education.length === 0) return null;
  return (
    <>
      {resume.education.map((entry) => (
        <View key={entry.id} style={styles.sideEduBlock} wrap={false}>
          <Text style={styles.sideEduTitle}>
            {entry.degree}
            {entry.fieldOfStudy &&
            entry.fieldOfStudy.trim().toLowerCase() !== entry.degree.trim().toLowerCase()
              ? `, ${entry.fieldOfStudy}`
              : ""}
          </Text>
          <Text style={styles.sideEduMeta}>{entry.institution}</Text>
          <Text style={styles.sideEduMeta}>{formatDateRange(entry.startDate, entry.endDate)}</Text>
        </View>
      ))}
    </>
  );
}

function CompactCertificationList({
  resume,
  styles,
}: {
  resume: Resume;
  styles: SectionStyleContract & Record<string, Style>;
}) {
  if (resume.certifications.length === 0) return null;
  return (
    <>
      {resume.certifications.map((entry) => (
        <View key={entry.id} style={styles.sideCertBlock} wrap={false}>
          <Text style={styles.sideCertTitle}>{entry.name}</Text>
          {entry.issuer ? <Text style={styles.sideCertMeta}>{entry.issuer}</Text> : null}
          {entry.date ? <Text style={styles.sideCertMeta}>{entry.date}</Text> : null}
        </View>
      ))}
    </>
  );
}

// Keeps each group's label (e.g. "AWS:", "Language:") instead of flattening
// every group into one undifferentiated list — losing the label was the
// bug: a grouped skill list reads as organized expertise, a flat list of
// terms reads as a keyword dump.
function GroupedSkillList({
  resume,
  styles,
}: {
  resume: Resume;
  styles: SectionStyleContract & Record<string, Style>;
}) {
  if (resume.skills.length === 0) return null;
  return (
    <>
      {resume.skills.map((group) => (
        <Text key={group.id} style={styles.skillLine}>
          {group.label ? <Text style={styles.skillLabel}>{group.label}: </Text> : null}
          {group.items.join(", ")}
        </Text>
      ))}
    </>
  );
}

export const UnderlineSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const styles = StyleSheet.create(buildStyles(accentColor ?? DEFAULT_ACCENT));
  const { contact } = resume;
  const contactItems = [
    contact.location,
    contact.phone,
    contact.email,
    contact.website,
    contact.linkedin,
    contact.github,
  ].filter((v): v is string => Boolean(v && v.trim()));

  const mainSections = resume.sectionOrder.filter(
    (section) =>
      section !== "skills" &&
      section !== "education" &&
      section !== "certifications" &&
      sectionHasContent(section, resume)
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
          {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
        </View>

        <View style={styles.columnsRow}>
          <View style={styles.sideColumn}>
            {contactItems.length > 0 ? (
              <View>
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.titleBar} />
                {contactItems.map((item, i) => (
                  <Text key={i} style={styles.contactItem}>
                    {item}
                  </Text>
                ))}
              </View>
            ) : null}
            {sectionHasContent("skills", resume) ? (
              <View>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.titleBar} />
                <GroupedSkillList resume={resume} styles={styles} />
              </View>
            ) : null}
            {sectionHasContent("education", resume) ? (
              <View>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.education}</Text>
                <View style={styles.titleBar} />
                <CompactEducationList resume={resume} styles={styles} />
              </View>
            ) : null}
            {sectionHasContent("certifications", resume) ? (
              <View>
                <Text style={styles.sectionTitle}>{SECTION_TITLES.certifications}</Text>
                <View style={styles.titleBar} />
                <CompactCertificationList resume={resume} styles={styles} />
              </View>
            ) : null}
          </View>

          <View style={styles.mainColumn}>
            {mainSections.map((section) => (
              <View key={section}>
                <Text style={styles.sectionTitle}>{SECTION_TITLES[section]}</Text>
                <View style={styles.titleBar} />
                {renderSectionBody(section, resume, styles)}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
