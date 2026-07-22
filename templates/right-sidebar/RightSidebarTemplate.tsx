import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { SkillsList } from "../shared/SkillsList";
import { formatDateRange } from "../shared/formatDateRange";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#1f4d3a";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Vertical-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination, so this is what
    // gives every generated page consistent top/bottom margins. Horizontal
    // stays 0 here so the sidebar's colored panel can bleed to the true
    // left/right edges.
    page: { fontFamily: "Crimson Text", fontSize: 10.5, color: "#242424", paddingVertical: 30 },
    // A normal-flow row (not `position: absolute` + `fixed`) — the sidebar
    // (photo/contact/skills) is only meant to appear once, on whichever
    // page it naturally falls on. An absolutely positioned `fixed` sidebar
    // would redraw that same content on every generated page instead.
    columns: { flexDirection: "row" },
    main: { flex: 1, paddingHorizontal: 30 },
    sidebar: {
      width: "32%",
      backgroundColor: accent,
      color: "#f3efe6",
      padding: 22,
    },
    photo: { width: 72, height: 72, borderRadius: 36, marginBottom: 12, objectFit: "cover" },
    name: { fontSize: 20, fontFamily: "Crimson Text-Bold", color: "#1a1a1a" },
    headline: { fontSize: 11, marginTop: 3, fontFamily: "Crimson Text-Italic", color: accent },
    contactItem: { fontSize: 9, color: "#f0ece0", marginBottom: 4 },
    sidebarSectionTitle: {
      fontSize: 10.5,
      fontFamily: "Crimson Text-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#ffffff",
      marginTop: 16,
      marginBottom: 6,
      borderBottom: "0.75pt solid #4f7361",
      paddingBottom: 3,
    },

    sectionTitle: {
      fontSize: 12,
      fontFamily: "Crimson Text-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      marginTop: 12,
      marginBottom: 5,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 11, fontFamily: "Crimson Text-Bold" },
    itemSubtitle: { fontSize: 10, fontFamily: "Crimson Text-Italic", marginTop: 1 },
    itemMeta: { fontSize: 9, color: "#666666" },
    paragraph: { fontSize: 10.5, lineHeight: 1.5 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 10, fontSize: 10, color: accent },
    bulletText: { flex: 1, fontSize: 10.5, lineHeight: 1.4 },
    skillGroupRow: { flexDirection: "column", marginBottom: 6 },
    skillGroupLabel: { fontSize: 9, fontFamily: "Crimson Text-Bold", color: "#f0ece0", marginBottom: 2 },
    skillGroupItems: { fontSize: 9, color: "#ffffff", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow sidebar.
    sideItemBlock: { marginBottom: 6 },
    sideItemTitle: { fontSize: 9, fontFamily: "Crimson Text-Bold", color: "#ffffff", lineHeight: 1.3 },
    sideItemMeta: { fontSize: 8.5, color: "#f0ece0", marginTop: 1 },
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

export const RightSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
          <View style={styles.main}>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
            <View style={{ marginTop: 10 }}>
              {mainSections.map((section) => (
                <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
              ))}
            </View>
          </View>

          <View style={styles.sidebar}>
            <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
            {contactItems.length > 0 ? (
              <View>
                {contactItems.map((item, i) => (
                  <Text key={i} style={styles.contactItem}>
                    {item}
                  </Text>
                ))}
              </View>
            ) : null}

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

            {sectionHasContent("certifications", resume) ? (
              <View>
                <Text style={styles.sidebarSectionTitle}>Certifications</Text>
                <CompactCertificationList resume={resume} styles={styles} />
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
};
