import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { BulletList } from "../shared/BulletList";
import { formatDateRange } from "../shared/formatDateRange";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#b76e79";
// Left column carries short/bounded content (summary, skills, education,
// certifications) — experience/projects (potentially long) stay in the
// right column, so a mismatched-column-height pagination glitch can't
// happen. Order is fixed (skills, then education, then certifications)
// regardless of how the user has reordered sections elsewhere.
const LEFT_SECTIONS: SectionId[] = ["summary", "skills", "education", "certifications"];

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Bottom-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination. No paddingTop —
    // the header band is a normal-flow child only on page 1, so page-level
    // top padding would push it away from the true top edge.
    page: { fontFamily: "Crimson Text", fontSize: 10, color: "#242424", paddingBottom: 36 },
    headerBand: {
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
      backgroundColor: withAlpha(accent, 0.16),
      paddingVertical: 24,
      paddingHorizontal: 36,
    },
    photo: { width: 68, height: 68, borderRadius: 34, objectFit: "cover" },
    name: { fontSize: 20, fontFamily: "Crimson Text-Bold", color: "#1a1a1a" },
    headline: { fontSize: 11, marginTop: 2, fontFamily: "Crimson Text-Bold", color: "#3a3a3a" },
    contactBlock: { marginTop: 8 },
    contactItem: { fontSize: 9, color: "#444444", marginBottom: 2 },

    // Horizontal only — the header band only exists on page 1, so
    // continuation pages need their own top spacing; that comes from the
    // `fixed` spacer rendered as `body`'s first child instead of padding
    // here.
    body: { paddingHorizontal: 36 },
    topSpacer: { height: 28 },
    columnsRow: { flexDirection: "row", gap: 24 },
    leftColumn: { width: "34%" },
    rightColumn: { flex: 1 },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Crimson Text-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#1a1a1a",
      borderBottom: `1pt solid ${accent}`,
      paddingBottom: 3,
      marginTop: 13,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 8 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    // Italic role/degree above a plain company/institution line — a softer,
    // more editorial feel than the usual bold-title-plus-plain-subtitle.
    itemTitle: { fontSize: 10.5, fontFamily: "Crimson Text-Italic" },
    itemSubtitle: { fontSize: 9.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 9, fontFamily: "Crimson Text-Italic", color: accent },
    paragraph: { fontSize: 10, lineHeight: 1.5 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 9, fontFamily: "Crimson Text-Bold", marginBottom: 1 },
    skillGroupItems: { fontSize: 9, lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow left
    // column. Used only for the sidebar's education entries.
    sideItemTitle: { fontSize: 9.5, fontFamily: "Crimson Text-Italic" },
    sideItemMeta: { fontSize: 8.5, color: "#666666", marginTop: 1 },
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

export const BlushHeaderDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const styles = StyleSheet.create(buildStyles(accentColor ?? DEFAULT_ACCENT));
  const { contact } = resume;
  const contactItems = [
    contact.location,
    contact.email,
    contact.phone,
    contact.website,
    contact.linkedin,
    contact.github,
  ].filter((v): v is string => Boolean(v && v.trim()));

  // Sorted by the fixed LEFT_SECTIONS order above, not by resume.sectionOrder
  // — only membership (has the user kept this section at all?) comes from
  // sectionOrder.
  const leftSections = LEFT_SECTIONS.filter((s) => resume.sectionOrder.includes(s));
  const rightSections = resume.sectionOrder.filter((s) => !LEFT_SECTIONS.includes(s));

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerBand}>
          <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
          <View>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
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
        </View>

        <View style={styles.body}>
          <View style={styles.topSpacer} fixed />
          <View style={styles.columnsRow}>
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
        </View>
      </Page>
    </Document>
  );
};
