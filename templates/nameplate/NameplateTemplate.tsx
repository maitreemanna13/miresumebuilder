import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { formatDateRange } from "../shared/formatDateRange";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#78350f";
// Only the right column carries potentially long-running content — the
// left column stays short and bounded (contact + skills + education +
// certifications) so a mismatched-column-height pagination glitch can't
// happen. Left column order is fixed: skills, then education, then
// certifications.
const LEFT_SECTIONS: SectionId[] = ["skills", "education", "certifications"];

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Page-level padding is what react-pdf uses to budget space for
    // automatic pagination, so every generated page keeps consistent
    // margins — safe here since nothing in this template is full-bleed.
    page: { padding: 38, fontFamily: "PT Sans", fontSize: 9.5, color: "#242424" },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    photo: {
      width: 60,
      height: 60,
      border: `1.5pt solid ${accent}`,
      objectFit: "cover",
    },
    nameplate: {
      alignItems: "flex-end",
      border: `1.5pt solid ${accent}`,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    name: { fontSize: 18, fontFamily: "PT Sans-Bold", color: "#1a1a1a" },
    headline: { fontSize: 9.5, marginTop: 2, color: accent },

    columns: { flexDirection: "row", gap: 20 },
    leftColumn: { width: "27%" },
    rightColumn: { flex: 1 },
    detailsLabel: {
      fontSize: 8.5,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      marginBottom: 5,
    },
    contactItem: { fontSize: 8.5, color: "#555555", marginBottom: 4 },

    sectionTitle: {
      fontSize: 9.5,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      marginTop: 11,
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
    paragraph: { fontSize: 9, lineHeight: 1.4 },
    bulletRow: { flexDirection: "row", marginTop: 1.5, paddingLeft: 3 },
    bulletDot: { width: 8, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9, lineHeight: 1.3 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8, fontFamily: "PT Sans-Bold", marginBottom: 1 },
    skillGroupItems: { fontSize: 8, lineHeight: 1.35 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow column.
    sideItemBlock: { marginBottom: 6 },
    sideItemTitle: { fontSize: 8, fontFamily: "PT Sans-Bold", color: "#1a1a1a", lineHeight: 1.3 },
    sideItemMeta: { fontSize: 7.5, color: "#555555", marginTop: 1 },
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

export const NameplateDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  // Sorted by the fixed LEFT_SECTIONS order above, not by resume.sectionOrder
  // — only membership (has the user kept this section at all?) comes from
  // sectionOrder.
  const leftSections = LEFT_SECTIONS.filter((s) => resume.sectionOrder.includes(s));
  const rightSections = resume.sectionOrder.filter((s) => !LEFT_SECTIONS.includes(s));

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
          <View style={styles.nameplate}>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
          </View>
        </View>

        <View style={styles.columns}>
          <View style={styles.leftColumn}>
            {contactItems.length > 0 ? (
              <View style={{ marginBottom: 10 }}>
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
      </Page>
    </Document>
  );
};
