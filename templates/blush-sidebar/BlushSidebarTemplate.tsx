import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { SkillsList } from "../shared/SkillsList";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#c1666b";
// Only the sidebar carries short/bounded content (contact, skills,
// education, certifications/awards) — experience/projects (potentially
// long) stay in the wide main column, so a mismatched-column-height
// pagination glitch can't happen. Sidebar order is fixed: skills, then
// education, then certifications.

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Vertical-only, same reasoning as the other sidebar templates: the
    // page has no horizontal padding, so the sidebar's colored panel
    // bleeds to the true left/right edges on its own.
    page: { fontFamily: "Lato", fontSize: 9.5, color: "#242424", paddingVertical: 32 },
    // A normal-flow row (not `position: absolute` + `fixed`) — the sidebar
    // (name/contact/skills/awards) is only meant to appear once, on
    // whichever page it naturally falls on. An absolutely positioned
    // `fixed` sidebar would redraw that same content on every generated
    // page instead.
    columns: { flexDirection: "row" },
    main: { flex: 1, paddingHorizontal: 30 },
    sidebar: {
      width: "32%",
      backgroundColor: withAlpha(accent, 0.16),
      padding: 22,
    },
    name: {
      fontSize: 18,
      fontFamily: "Lato-Bold",
      color: "#1a1a1a",
      textTransform: "uppercase",
      lineHeight: 1.25,
    },
    headline: { fontSize: 9.5, marginTop: 4, color: "#4a4a4a" },
    sidebarRule: { height: 2, width: 34, backgroundColor: accent, marginTop: 9, marginBottom: 13 },
    contactItem: { fontSize: 8.5, color: "#3a3a3a", marginBottom: 5 },
    sidebarSectionTitle: {
      fontSize: 9.5,
      fontFamily: "Lato-Bold",
      color: "#1a1a1a",
      marginTop: 15,
      marginBottom: 6,
    },
    sidebarListItem: { fontSize: 8.5, color: "#3a3a3a", marginBottom: 4, lineHeight: 1.3 },

    sectionTitle: {
      fontSize: 11,
      fontFamily: "Lato-Bold",
      color: "#1a1a1a",
      marginTop: 13,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 8 },
    itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, color: "#666666", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.5 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 6 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#1a1a1a", marginBottom: 1 },
    skillGroupItems: { fontSize: 8.5, color: "#3a3a3a", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow sidebar.
    sideEduBlock: { marginBottom: 6 },
    sideEduTitle: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#1a1a1a", lineHeight: 1.3 },
    sideEduMeta: { fontSize: 8, color: "#3a3a3a", marginTop: 1 },
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
        <View key={entry.id} style={styles.sideEduBlock} wrap={false}>
          <Text style={styles.sideEduTitle}>
            {entry.degree}
            {entry.fieldOfStudy &&
            entry.fieldOfStudy.trim().toLowerCase() !== entry.degree.trim().toLowerCase()
              ? `, ${entry.fieldOfStudy}`
              : ""}
          </Text>
          <Text style={styles.sideEduMeta}>{entry.institution}</Text>
          <Text style={styles.sideEduMeta}>{formatDateRange(entry.startDate, entry.endDate)}</Text>
        </View>
      ))}
    </>
  );
}

function DashList({
  items,
  styles,
}: {
  items: string[];
  styles: SectionStyleContract & Record<string, Style>;
}) {
  if (items.length === 0) return null;
  return (
    <>
      {items.map((item, i) => (
        <Text key={i} style={styles.sidebarListItem}>
          – {item}
        </Text>
      ))}
    </>
  );
}

export const BlushSidebarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  const awardItems = resume.certifications.map((entry) =>
    entry.date ? `${entry.name}, ${entry.date}` : entry.name
  );

  const mainSections = resume.sectionOrder.filter(
    (section) => section !== "skills" && section !== "education" && section !== "certifications"
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.columns}>
          <View style={styles.sidebar}>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
            <View style={styles.sidebarRule} />
            {contactItems.length > 0 ? (
              <View style={{ marginBottom: 4 }}>
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

            {awardItems.length > 0 ? (
              <View>
                <Text style={styles.sidebarSectionTitle}>Certifications</Text>
                <DashList items={awardItems} styles={styles} />
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
