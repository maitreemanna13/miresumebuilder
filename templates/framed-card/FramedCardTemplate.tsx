import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#334155";
// Only the right column carries potentially long-running content — the
// left column stays short and bounded (contact + skills + education +
// certifications) so its shaded background box (sized to its own content,
// not full page height) never looks cut off by a page break. Left column
// order is fixed: skills, then education, then certifications.
const LEFT_SECTIONS: SectionId[] = ["skills", "education", "certifications"];

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // The page's own light background is what creates the "card floating
    // on a frame" look — page-level padding (not a child View's) is also
    // what react-pdf uses to budget space for automatic pagination, so
    // every generated page keeps this framing and consistent margins.
    page: {
      padding: 18,
      backgroundColor: "#eef0f4",
      fontFamily: "Lato",
      fontSize: 9.5,
      color: "#242424",
    },
    card: {
      flex: 1,
      backgroundColor: "#ffffff",
      border: "1pt solid #e2e4e9",
      padding: 24,
    },
    header: { flexDirection: "row", justifyContent: "center", marginBottom: 18 },
    nameplate: {
      alignItems: "center",
      border: `1pt solid ${accent}`,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    name: {
      fontSize: 13,
      fontFamily: "Lato-Bold",
      color: "#1a1a1a",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    headline: { fontSize: 8.5, marginTop: 2, color: "#666666", textTransform: "uppercase" },

    columns: { flexDirection: "row", gap: 20 },
    leftColumn: {
      width: "30%",
      backgroundColor: "#f4f5f7",
      padding: 14,
    },
    rightColumn: { flex: 1 },
    detailsLabel: {
      fontSize: 8.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: "#1a1a1a",
      marginBottom: 6,
      marginTop: 10,
    },
    contactItem: { fontSize: 8.5, color: "#444444", marginBottom: 5 },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      borderBottom: "0.75pt solid #d4d6db",
      paddingBottom: 3,
      marginTop: 12,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 9.5, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 8.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 6 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", marginBottom: 1 },
    skillGroupItems: { fontSize: 8.5, color: "#444444", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow column.
    sideItemBlock: { marginBottom: 6 },
    sideItemTitle: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#1a1a1a", lineHeight: 1.3 },
    sideItemMeta: { fontSize: 8, color: "#555555", marginTop: 1 },
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
        <View key={entry.id} style={styles.sideItemBlock} wrap={false}>
          <Text style={styles.sideItemTitle}>
            {entry.degree}
            {entry.fieldOfStudy &&
            entry.fieldOfStudy.trim().toLowerCase() !== entry.degree.trim().toLowerCase()
              ? `, ${entry.fieldOfStudy}`
              : ""}
          </Text>
          <Text style={styles.sideItemMeta}>{entry.institution}</Text>
          <Text style={styles.sideItemMeta}>{formatDateRange(entry.startDate, entry.endDate)}</Text>
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
        <View key={entry.id} style={styles.sideItemBlock} wrap={false}>
          <Text style={styles.sideItemTitle}>{entry.name}</Text>
          {entry.issuer ? <Text style={styles.sideItemMeta}>{entry.issuer}</Text> : null}
          {entry.date ? <Text style={styles.sideItemMeta}>{entry.date}</Text> : null}
        </View>
      ))}
    </>
  );
}

export const FramedCardDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  // Sorted by the fixed LEFT_SECTIONS order above, not by resume.sectionOrder
  // — only membership (has the user kept this section at all?) comes from
  // sectionOrder.
  const leftSections = LEFT_SECTIONS.filter((s) => resume.sectionOrder.includes(s));
  const rightSections = resume.sectionOrder.filter((s) => !LEFT_SECTIONS.includes(s));

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.nameplate}>
              <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
              {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
            </View>
          </View>

          <View style={styles.columns}>
            <View style={styles.leftColumn}>
              {contactItems.length > 0 ? (
                <View>
                  <Text style={styles.detailsLabel}>Details</Text>
                  {contactItems.map((item, i) => (
                    <Text key={i} style={styles.contactItem}>
                      {item}
                    </Text>
                  ))}
                </View>
              ) : null}
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
                if (section === "certifications") {
                  if (resume.certifications.length === 0) return null;
                  return (
                    <View key={section}>
                      <Text style={styles.sectionTitle}>Certifications</Text>
                      <CompactCertificationList resume={resume} styles={styles} />
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
