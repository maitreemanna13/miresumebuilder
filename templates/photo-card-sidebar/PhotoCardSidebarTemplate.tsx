import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { BulletList } from "../shared/BulletList";
import { formatDateRange } from "../shared/formatDateRange";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#0f172a";
// Fixed order (not driven by resume.sectionOrder) so the left column always
// reads Skills, then Education, then Certifications, regardless of how the
// user has reordered sections elsewhere. No full-bleed color panel here
// (unlike the other sidebar templates), so plain page-level padding is
// safe without any special absolute-positioning handling.
const LEFT_SECTIONS: SectionId[] = ["skills", "education", "certifications"];

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 34, fontFamily: "Lato", fontSize: 9.5, color: "#242424" },
    columns: { flexDirection: "row", gap: 20 },
    leftColumn: { width: "30%" },
    rightColumn: { flex: 1 },

    photoCard: {
      backgroundColor: accent,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginBottom: 14,
    },
    photo: { width: 66, height: 66, borderRadius: 33, marginBottom: 10, objectFit: "cover" },
    name: { fontSize: 14, fontFamily: "Lato-Bold", color: "#ffffff", textAlign: "center" },
    headline: { fontSize: 8.5, marginTop: 3, color: "#cbd5e1", textAlign: "center" },

    detailsLabel: {
      fontSize: 8.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      marginTop: 10,
      marginBottom: 5,
    },
    contactItem: { fontSize: 8.5, color: "#444444", marginBottom: 4 },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "Lato-Bold",
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
    itemTitle: { fontSize: 9.5, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 8.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8, color: "#777777" },
    paragraph: { fontSize: 9, lineHeight: 1.4 },
    bulletRow: { flexDirection: "row", marginTop: 1.5, paddingLeft: 3 },
    bulletDot: { width: 8, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9, lineHeight: 1.3 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8, fontFamily: "Lato-Bold", marginBottom: 1 },
    skillGroupItems: { fontSize: 8, lineHeight: 1.35 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which is fine for the wide right column
    // (experience/projects) but collides in this 30%-wide left column. Used
    // only for education/certifications, which now live here exclusively.
    sideItemTitle: { fontSize: 9, fontFamily: "Lato-Bold" },
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
        <View key={entry.id} style={styles.itemBlock} wrap={false}>
          <Text style={styles.sideItemTitle}>{entry.name}</Text>
          {entry.issuer ? <Text style={styles.sideItemMeta}>{entry.issuer}</Text> : null}
          {entry.date ? <Text style={styles.sideItemMeta}>{entry.date}</Text> : null}
        </View>
      ))}
    </>
  );
}

export const PhotoCardSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  // Sorted by the fixed LEFT_SECTIONS order above, not by resume.sectionOrder
  // — only membership (has the user kept this section at all?) comes from
  // sectionOrder.
  const leftSections = LEFT_SECTIONS.filter((s) => resume.sectionOrder.includes(s));
  const rightSections = resume.sectionOrder.filter((s) => !LEFT_SECTIONS.includes(s));

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.columns}>
          <View style={styles.leftColumn}>
            <View style={styles.photoCard}>
              <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
              <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
              {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
            </View>

            {contactItems.length > 0 ? (
              <View style={{ marginBottom: 4 }}>
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
              return <SectionRenderer key={section} section={section} resume={resume} styles={styles} />;
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
