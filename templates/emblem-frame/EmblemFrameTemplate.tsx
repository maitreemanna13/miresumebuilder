import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#166534";
// Only the side column carries short/bounded content (contact details,
// skill pills, education, certifications) — summary/experience/projects
// (potentially long) stay in the wide main column, so a mismatched-
// column-height pagination glitch can't happen. Side column order is
// fixed: skills, then education, then certifications.

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Border + padding both live on the Page itself (not a child View), so
    // react-pdf redraws the frame consistently and budgets pagination
    // correctly on every generated page.
    page: {
      padding: 28,
      border: `3pt solid ${accent}`,
      fontFamily: "Lato",
      fontSize: 9.5,
      color: "#242424",
    },
    headerBlock: { marginBottom: 18 },
    badge: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: accent,
      alignItems: "center",
      justifyContent: "center",
      padding: 6,
      marginBottom: 8,
    },
    badgeName: {
      fontSize: 11,
      fontFamily: "Lato-Bold",
      color: "#ffffff",
      textAlign: "center",
      lineHeight: 1.2,
    },
    headline: {
      fontSize: 10.5,
      fontFamily: "Lato-Bold",
      color: accent,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    columnsRow: { flexDirection: "row", gap: 24 },
    mainColumn: { flex: 1 },
    sideColumn: { width: "30%" },
    detailsLabel: {
      fontSize: 8.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      marginBottom: 6,
      marginTop: 12,
    },
    contactItem: { fontSize: 8.5, color: "#444444", marginBottom: 5 },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: {
      fontSize: 8,
      color: "#ffffff",
      backgroundColor: accent,
      paddingVertical: 3,
      paddingHorizontal: 9,
      borderRadius: 9,
    },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      borderBottom: "0.75pt solid #d9dce1",
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
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#1a1a1a", marginBottom: 3 },
    skillGroupItems: { fontSize: 8.5, lineHeight: 1.4 },
    tagGroup: { marginBottom: 8 },

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

// One pill row per skill group, each under its own label — never flatten
// every group into a single undifferentiated row of pills.
function SkillPills({
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
        <View key={group.id} style={styles.tagGroup}>
          {group.label ? <Text style={styles.skillGroupLabel}>{group.label}</Text> : null}
          <View style={styles.tagRow}>
            {group.items.map((item, i) => (
              <Text key={i} style={styles.tag}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </>
  );
}

export const EmblemFrameDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
    (s) => s !== "skills" && s !== "education" && s !== "certifications"
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerBlock}>
          <View style={styles.badge}>
            <Text style={styles.badgeName}>{contact.fullName || "Your Name"}</Text>
          </View>
          {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
        </View>

        <View style={styles.columnsRow}>
          <View style={styles.mainColumn}>
            {mainSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
          <View style={styles.sideColumn}>
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
            {sectionHasContent("skills", resume) ? (
              <View>
                <Text style={styles.detailsLabel}>Skills</Text>
                <SkillPills resume={resume} styles={styles} />
              </View>
            ) : null}

            {sectionHasContent("education", resume) ? (
              <View>
                <Text style={styles.detailsLabel}>Education</Text>
                <CompactEducationList resume={resume} styles={styles} />
              </View>
            ) : null}

            {sectionHasContent("certifications", resume) ? (
              <View>
                <Text style={styles.detailsLabel}>Certifications</Text>
                <CompactCertificationList resume={resume} styles={styles} />
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
};
