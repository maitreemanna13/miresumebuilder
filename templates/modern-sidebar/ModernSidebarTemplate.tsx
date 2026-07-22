import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { SkillsList } from "../shared/SkillsList";
import { formatDateRange } from "../shared/formatDateRange";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import type { SectionStyleContract } from "../shared/styleContract";

const DEFAULT_ACCENT = "#2b3a55";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Vertical-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination, so this is what
    // gives every generated page consistent top/bottom margins. Horizontal
    // stays 0 here so the sidebar's colored panel can bleed to the true
    // left/right edges.
    page: { fontFamily: "Helvetica", fontSize: 9.5, color: "#1a1a1a", paddingVertical: 28 },
    // A normal-flow row (not `position: absolute` + `fixed`) — the sidebar
    // (photo/contact/skills) is only meant to appear once, on whichever
    // page it naturally falls on. An absolutely positioned `fixed` sidebar
    // would redraw that same content on every generated page instead.
    columns: { flexDirection: "row" },
    sidebar: {
      width: "34%",
      backgroundColor: accent,
      color: "#ffffff",
      padding: 24,
    },
    main: { flex: 1, paddingHorizontal: 28 },
    photo: { width: 70, height: 70, borderRadius: 35, marginBottom: 12, objectFit: "cover" },
    name: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#ffffff" },
    headline: { fontSize: 10, marginTop: 3, color: "#c9d2e3" },
    contactItem: { fontSize: 8.5, color: "#dde3f0", marginBottom: 4 },
    sidebarSectionTitle: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#ffffff",
      marginTop: 16,
      marginBottom: 6,
      borderBottom: "0.75pt solid #5c6a86",
      paddingBottom: 3,
    },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Helvetica-Bold",
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
    itemTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 2 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 6 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#c9d2e3", marginBottom: 2 },
    skillGroupItems: { fontSize: 8.5, color: "#ffffff", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow sidebar.
    sideItemBlock: { marginBottom: 6 },
    sideItemTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#ffffff", lineHeight: 1.3 },
    sideItemMeta: { fontSize: 8, color: "#dde3f0", marginTop: 1 },
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

export const ModernSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}

            {contactItems.length > 0 ? (
              <View style={{ marginTop: 14 }}>
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

          <View style={styles.main}>
            {mainSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
