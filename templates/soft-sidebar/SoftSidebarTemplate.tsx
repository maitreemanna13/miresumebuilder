import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { SkillsList } from "../shared/SkillsList";
import { formatDateRange } from "../shared/formatDateRange";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#2563eb";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Vertical-only, same reasoning as the other sidebar templates: Page's
    // own padding is what react-pdf uses to budget per-page pagination
    // space, and the sidebar's colored panel bleeds to the true edges since
    // the page has no horizontal padding.
    page: { fontFamily: "PT Sans", fontSize: 9.5, color: "#242424", paddingVertical: 32 },
    // A normal-flow row (not `position: absolute` + `fixed`) — the sidebar
    // (photo/contact/skills) is only meant to appear once, on whichever
    // page it naturally falls on. An absolutely positioned `fixed` sidebar
    // would redraw that same content on every generated page instead.
    columns: { flexDirection: "row" },
    sidebar: {
      width: "32%",
      backgroundColor: withAlpha(accent, 0.08),
      padding: 22,
      alignItems: "center",
    },
    photo: { width: 88, height: 88, borderRadius: 6, marginBottom: 14, objectFit: "cover" },
    detailsLabel: {
      alignSelf: "flex-start",
      fontSize: 8.5,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      marginBottom: 5,
      marginTop: 10,
    },
    contactItem: { alignSelf: "flex-start", fontSize: 8.5, color: "#444444", marginBottom: 4 },

    main: { flex: 1, paddingHorizontal: 30 },
    name: { fontSize: 20, fontFamily: "PT Sans-Bold", color: "#1a1a1a" },
    headline: { fontSize: 10.5, marginTop: 2, color: accent },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      marginTop: 13,
      marginBottom: 5,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10, fontFamily: "PT Sans-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 5, alignSelf: "flex-start" },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "PT Sans-Bold", color: "#1a1a1a", marginBottom: 2 },
    skillGroupItems: { fontSize: 8.5, color: "#444444", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow sidebar.
    sideItemBlock: { marginBottom: 6, alignSelf: "flex-start" },
    sideItemTitle: { fontSize: 8.5, fontFamily: "PT Sans-Bold", color: "#1a1a1a", lineHeight: 1.3 },
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

export const SoftSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
        <View style={styles.columns}>
          <View style={styles.sidebar}>
            <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />

            {contactItems.length > 0 ? (
              <>
                <Text style={styles.detailsLabel}>Details</Text>
                {contactItems.map((item, i) => (
                  <Text key={i} style={styles.contactItem}>
                    {item}
                  </Text>
                ))}
              </>
            ) : null}

            {sectionHasContent("skills", resume) ? (
              <View style={{ width: "100%" }}>
                <Text style={styles.detailsLabel}>Skills</Text>
                <SkillsList resume={resume} styles={styles} />
              </View>
            ) : null}

            {sectionHasContent("education", resume) ? (
              <View style={{ width: "100%" }}>
                <Text style={styles.detailsLabel}>Education</Text>
                <CompactEducationList resume={resume} styles={styles} />
              </View>
            ) : null}

            {sectionHasContent("certifications", resume) ? (
              <View style={{ width: "100%" }}>
                <Text style={styles.detailsLabel}>Certifications</Text>
                <CompactCertificationList resume={resume} styles={styles} />
              </View>
            ) : null}
          </View>

          <View style={styles.main}>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}

            <View style={{ marginTop: 8 }}>
              {mainSections.map((section) => (
                <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
