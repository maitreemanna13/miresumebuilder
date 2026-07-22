import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { SkillsList } from "../shared/SkillsList";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#1e3a5f";
// Only the sidebar carries short/bounded content (contact, skills,
// education, certifications) — experience/projects (potentially long)
// stay in the main column, so a mismatched-column-height pagination
// glitch can't happen. Sidebar order is fixed: skills, then education,
// then certifications.
const SIDEBAR_SECTIONS: SectionId[] = ["skills", "education", "certifications"];

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Vertical-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination, so this is what
    // gives every generated page consistent top/bottom margins. Horizontal
    // stays 0 so the sidebar's colored panel can bleed to the true
    // left/right edges.
    page: { fontFamily: "Lato", fontSize: 9.5, color: "#242424", paddingVertical: 30 },
    // A normal-flow row (not `position: absolute` + `fixed`) — the sidebar
    // (name/contact/skills) is only meant to appear once, on whichever page
    // it naturally falls on. An absolutely positioned `fixed` sidebar would
    // redraw that same content on every generated page instead.
    columns: { flexDirection: "row" },
    main: { flex: 1, paddingHorizontal: 28 },
    sidebar: {
      width: "33%",
      backgroundColor: accent,
      color: "#e7ecf5",
      padding: 22,
    },
    name: { fontSize: 18, fontFamily: "Lato-Bold", color: "#ffffff", lineHeight: 1.2 },
    headline: { fontSize: 9.5, marginTop: 4, color: "#bcd0ec" },
    contactBlock: { marginTop: 10 },
    contactItem: { fontSize: 8, color: "#dbe4f2", marginBottom: 5 },
    sidebarSectionTitle: {
      fontSize: 9.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: "#ffffff",
      marginTop: 14,
      marginBottom: 6,
      borderBottom: "0.75pt solid #3f5b81",
      paddingBottom: 3,
    },

    // A full-width filled banner (not plain colored text) for each main
    // section title — react-pdf's Text nodes support the same box model
    // as View, so `width: "100%"` alone is enough to stretch it.
    sectionTitle: {
      width: "100%",
      fontSize: 10,
      fontFamily: "Lato-Bold",
      color: "#ffffff",
      backgroundColor: accent,
      paddingVertical: 6,
      paddingHorizontal: 10,
      marginTop: 13,
      marginBottom: 7,
    },
    itemBlock: { marginBottom: 8 },
    itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold", color: "#1a1a1a" },
    itemSubtitle: { fontSize: 9, color: "#666666", marginTop: 1 },
    itemMeta: {
      fontSize: 8,
      color: "#ffffff",
      backgroundColor: accent,
      paddingVertical: 2.5,
      paddingHorizontal: 9,
      borderRadius: 8,
    },
    paragraph: { fontSize: 9.5, lineHeight: 1.5 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 6 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#ffffff", marginBottom: 1 },
    skillGroupItems: { fontSize: 8.5, color: "#dbe4f2", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow sidebar.
    sideItemBlock: { marginBottom: 6 },
    sideItemTitle: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#ffffff", lineHeight: 1.3 },
    sideItemMeta: { fontSize: 8, color: "#dbe4f2", marginTop: 1 },
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

export const NavyBannerSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  const mainSections = resume.sectionOrder.filter((s) => !SIDEBAR_SECTIONS.includes(s));

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.columns}>
          <View style={styles.main}>
            {mainSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>

          <View style={styles.sidebar}>
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
