import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { BulletList } from "../shared/BulletList";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#b45309";
// Order is fixed (skills, then education, then certifications) regardless
// of how the user has reordered sections elsewhere.
const LEFT_COLUMN_SECTIONS: SectionId[] = ["summary", "skills", "education", "certifications"];

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 38, fontFamily: "PT Sans", fontSize: 9.5, color: "#212121" },
    header: { marginBottom: 14, borderBottom: `1.5pt solid ${accent}`, paddingBottom: 8 },
    name: { fontSize: 19, fontFamily: "PT Sans-Bold" },
    headline: { fontSize: 10.5, marginTop: 2, color: accent },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 10 },
    contactItem: { fontSize: 8.5, color: "#555555" },

    columns: { flexDirection: "row", gap: 20 },
    leftColumn: { width: "42%" },
    rightColumn: { flex: 1 },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      marginTop: 10,
      marginBottom: 4,
    },
    itemBlock: { marginBottom: 6 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 9.5, fontFamily: "PT Sans-Bold" },
    itemSubtitle: { fontSize: 8.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.4 },
    bulletRow: { flexDirection: "row", marginTop: 1.5, paddingLeft: 3 },
    bulletDot: { width: 8, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9, lineHeight: 1.3 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "PT Sans-Bold", marginBottom: 1 },
    skillGroupItems: { fontSize: 8.5, lineHeight: 1.35 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow left
    // column. Used only for the sidebar's education entries.
    sideItemTitle: { fontSize: 9, fontFamily: "PT Sans-Bold" },
    sideItemMeta: { fontSize: 8, color: "#666666", marginTop: 1 },
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
        <View key={entry.id} style={styles.itemBlock}>
          <View wrap={false}>
            <Text style={styles.sideItemTitle}>
              {entry.degree}
              {entry.fieldOfStudy &&
              entry.fieldOfStudy.trim().toLowerCase() !== entry.degree.trim().toLowerCase()
                ? `, ${entry.fieldOfStudy}`
                : ""}
            </Text>
            <Text style={styles.sideItemMeta}>
              {entry.institution}
              {entry.gpa ? ` — GPA: ${entry.gpa}` : ""}
            </Text>
            <Text style={styles.sideItemMeta}>
              {formatDateRange(entry.startDate, entry.endDate)}
            </Text>
          </View>
          <BulletList bullets={entry.bullets} styles={styles} />
        </View>
      ))}
    </>
  );
}

export const TwoColumnBalancedDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const styles = StyleSheet.create(buildStyles(accentColor ?? DEFAULT_ACCENT));
  const { contact } = resume;
  const contactItems = [
    contact.email,
    contact.phone,
    contact.location,
    contact.website,
    contact.linkedin,
    contact.github,
  ].filter((v): v is string => Boolean(v && v.trim()));

  // Sorted by the fixed LEFT_COLUMN_SECTIONS order above, not by
  // resume.sectionOrder — only membership (has the user kept this section
  // at all?) comes from sectionOrder.
  const leftSections = LEFT_COLUMN_SECTIONS.filter((s) => resume.sectionOrder.includes(s));
  const rightSections = resume.sectionOrder.filter((s) => !LEFT_COLUMN_SECTIONS.includes(s));

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
          {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
          {contactItems.length > 0 ? (
            <View style={styles.contactRow}>
              {contactItems.map((item, i) => (
                <Text key={i} style={styles.contactItem}>
                  {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.columns}>
          <View style={styles.leftColumn}>
            {leftSections.map((section) => {
              if (section === "education") {
                if (resume.education.length === 0) return null;
                return (
                  <View key={section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    <CompactEducationList resume={resume} styles={styles} />
                  </View>
                );
              }
              return (
                <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
              );
            })}
          </View>
          <View style={styles.rightColumn}>
            {rightSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
