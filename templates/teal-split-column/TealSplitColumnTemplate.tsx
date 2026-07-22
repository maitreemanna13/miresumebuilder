import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { SkillsList } from "../shared/SkillsList";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#0d9488";
// Only the side column carries short/bounded content (skills, education,
// awards) — experience/projects (potentially long) stay in the wide main
// column, so a mismatched-column-height pagination glitch can't happen.
// Side column order is fixed: skills, then education, then certifications.

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 40, fontFamily: "Lato", fontSize: 9.5, color: "#242424" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    name: { fontSize: 21, fontFamily: "Lato-Bold", color: "#1a1a1a" },
    contactBlock: { alignItems: "flex-end" },
    contactItem: { fontSize: 8.5, color: "#444444", marginBottom: 3, textAlign: "right" },
    summaryText: { fontSize: 9.5, lineHeight: 1.5, marginBottom: 8 },

    columnsRow: { flexDirection: "row", gap: 24 },
    sideColumn: { width: "30%" },
    mainColumn: { flex: 1 },
    sidebarSectionTitle: {
      fontSize: 9.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      borderBottom: "0.75pt solid #cfd3d8",
      paddingBottom: 3,
      marginTop: 12,
      marginBottom: 6,
    },
    sidebarListItem: { fontSize: 8.5, color: "#333333", marginBottom: 4, lineHeight: 1.3 },

    // Black (not accent-colored) so the two columns read with deliberate
    // contrast — teal on the left, neutral black on the right — matching
    // the reference's two-tone heading treatment.
    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: "#1a1a1a",
      borderBottom: "0.75pt solid #cfd3d8",
      paddingBottom: 3,
      marginTop: 13,
      marginBottom: 7,
    },
    itemBlock: { marginBottom: 8 },
    itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, fontFamily: "Lato", color: accent, marginTop: 1 },
    itemMeta: {
      fontSize: 8,
      color: "#ffffff",
      backgroundColor: accent,
      paddingVertical: 2.5,
      paddingHorizontal: 9,
      borderRadius: 8,
    },
    paragraph: { fontSize: 9.5, lineHeight: 1.5 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 6 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: accent, marginBottom: 1 },
    skillGroupItems: { fontSize: 8.5, color: "#333333", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow column.
    sideEduBlock: { marginBottom: 6 },
    sideEduTitle: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#1a1a1a", lineHeight: 1.3 },
    sideEduMeta: { fontSize: 8, color: "#333333", marginTop: 1 },
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

function DotList({
  items,
  styles,
}: {
  items: string[];
  styles: SectionStyleContract & Record<string, Style>;
}) {
  if (items.length === 0) return null;
  return (
    <>
      {items.map((item, i) => (
        <Text key={i} style={styles.sidebarListItem}>
          • {item}
        </Text>
      ))}
    </>
  );
}

export const TealSplitColumnDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const styles = StyleSheet.create(buildStyles(accentColor ?? DEFAULT_ACCENT));
  const { contact } = resume;
  const contactItems = [
    contact.phone,
    contact.email,
    contact.website,
    contact.location,
    contact.linkedin,
    contact.github,
  ].filter((v): v is string => Boolean(v && v.trim()));

  const awardItems = resume.certifications.map((entry) =>
    entry.date ? `${entry.name}, ${entry.date}` : entry.name
  );

  const mainSections = resume.sectionOrder.filter(
    (section) =>
      section !== "summary" &&
      section !== "skills" &&
      section !== "education" &&
      section !== "certifications"
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
          {contactItems.length > 0 ? (
            <View style={styles.contactBlock}>
              {contactItems.map((item, i) => (
                <Text key={i} style={styles.contactItem}>
                  {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        {resume.summary.trim() ? <Text style={styles.summaryText}>{resume.summary}</Text> : null}

        <View style={styles.columnsRow}>
          <View style={styles.sideColumn}>
            {sectionHasContent("skills", resume) ? (
              <View>
                <Text style={styles.sidebarSectionTitle}>Skills</Text>
                <SkillsList resume={resume} styles={styles} />
              </View>
            ) : null}
            {sectionHasContent("education", resume) ? (
              <View>
                <Text style={styles.sidebarSectionTitle}>Education</Text>
                <CompactEducationList resume={resume} styles={styles} />
              </View>
            ) : null}
            {awardItems.length > 0 ? (
              <View>
                <Text style={styles.sidebarSectionTitle}>Certifications</Text>
                <DotList items={awardItems} styles={styles} />
              </View>
            ) : null}
          </View>
          <View style={styles.mainColumn}>
            {mainSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
