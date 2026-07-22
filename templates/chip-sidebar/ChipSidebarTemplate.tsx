import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { SkillsList } from "../shared/SkillsList";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#1f4e96";
// Only the side column carries short/bounded content (skills, education,
// awards) — summary/experience/projects (potentially long) stay in the
// wide main column, so a mismatched-column-height pagination glitch
// can't happen. Side column order is fixed: skills, then education, then
// certifications.

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // The left edge stripe lives on an absolutely positioned, `fixed`
    // sibling (see `edgeStripe` below) rather than a Page border, so it
    // stays a thin accent line rather than framing the whole page.
    page: { paddingVertical: 34, paddingRight: 34, paddingLeft: 46, fontFamily: "Lato", fontSize: 9.5, color: "#242424" },
    edgeStripe: { position: "absolute", top: 0, left: 0, height: "100%", width: 8, backgroundColor: accent },

    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
    firstName: { fontSize: 17, fontFamily: "Lato", color: "#1a1a1a" },
    lastName: { fontSize: 21, fontFamily: "Lato-Bold", color: "#1a1a1a", marginTop: -2 },
    contactChip: { backgroundColor: accent, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
    contactItem: { fontSize: 8, color: "#ffffff", marginBottom: 3 },

    columnsRow: { flexDirection: "row", gap: 24 },
    mainColumn: { flex: 1 },
    sideColumn: { width: "28%" },
    sidebarListItem: { fontSize: 8.5, color: "#333333", marginBottom: 4, lineHeight: 1.3 },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      borderBottom: "0.75pt solid #d8dadf",
      paddingBottom: 3,
      marginTop: 13,
      marginBottom: 7,
    },
    itemBlock: { marginBottom: 8 },
    itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, color: "#666666", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
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

export const ChipSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const styles = StyleSheet.create(buildStyles(accentColor ?? DEFAULT_ACCENT));
  const { contact } = resume;
  const contactItems = [
    contact.phone,
    contact.email,
    contact.location,
    contact.website,
    contact.linkedin,
    contact.github,
  ].filter((v): v is string => Boolean(v && v.trim()));

  const nameParts = (contact.fullName || "Your Name").trim().split(/\s+/);
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const awardItems = resume.certifications.map((entry) =>
    entry.date ? `${entry.name}, ${entry.date}` : entry.name
  );

  const mainSections = resume.sectionOrder.filter(
    (section) => section !== "skills" && section !== "education" && section !== "certifications"
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.edgeStripe} fixed />

        <View style={styles.header}>
          <View>
            <Text style={styles.firstName}>{firstName}</Text>
            {lastName ? <Text style={styles.lastName}>{lastName}</Text> : null}
          </View>
          {contactItems.length > 0 ? (
            <View style={styles.contactChip}>
              {contactItems.map((item, i) => (
                <Text key={i} style={styles.contactItem}>
                  {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.columnsRow}>
          <View style={styles.mainColumn}>
            {mainSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
          <View style={styles.sideColumn}>
            {sectionHasContent("skills", resume) ? (
              <View>
                <Text style={styles.sectionTitle}>Skills</Text>
                <SkillsList resume={resume} styles={styles} />
              </View>
            ) : null}
            {sectionHasContent("education", resume) ? (
              <View>
                <Text style={styles.sectionTitle}>Education</Text>
                <CompactEducationList resume={resume} styles={styles} />
              </View>
            ) : null}
            {awardItems.length > 0 ? (
              <View>
                <Text style={styles.sectionTitle}>Certifications</Text>
                <DotList items={awardItems} styles={styles} />
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
};
