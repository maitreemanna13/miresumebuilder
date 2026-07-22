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

const DEFAULT_ACCENT = "#c2660c";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Vertical-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination, so this is what
    // gives every generated page consistent top/bottom margins. Horizontal
    // stays 0 here so the sidebar's colored panel can bleed to the true
    // left/right edges. Bumped from 28 — the sidebar's own `padding: 22`
    // (below) does NOT repeat on continuation pages (only the Page's own
    // padding reliably does), so when the sidebar's content itself spans a
    // page break, a taller Page margin is the only thing standing between
    // its continued content and the true page edge.
    page: { fontFamily: "Lato", fontSize: 9.5, color: "#1f2937", paddingVertical: 40 },
    // A normal-flow row (not `position: absolute` + `fixed`) — the sidebar
    // (photo/contact/skills) is only meant to appear once, on whichever
    // page it naturally falls on. An absolutely positioned `fixed` sidebar
    // would redraw that same content on every generated page instead.
    columns: { flexDirection: "row" },
    sidebar: {
      width: "34%",
      backgroundColor: accent,
      color: "#ffffff",
      padding: 22,
      alignItems: "center",
    },
    photoRing: {
      width: 84,
      height: 84,
      borderRadius: 42,
      padding: 3,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    photo: { width: 78, height: 78, borderRadius: 39, objectFit: "cover" },
    sidebarSectionTitle: {
      alignSelf: "flex-start",
      fontSize: 9.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#ffffff",
      marginTop: 16,
      marginBottom: 6,
      borderBottom: "0.75pt solid rgba(255,255,255,0.4)",
      paddingBottom: 3,
      width: "100%",
    },
    contactItem: { alignSelf: "flex-start", fontSize: 8.5, color: "#fff", marginBottom: 4 },

    main: { flex: 1, paddingHorizontal: 28 },
    name: { fontSize: 21, fontFamily: "Lato-Bold", color: "#1a1a1a" },
    headline: { fontSize: 11, marginTop: 3, color: accent, fontFamily: "Lato-Bold" },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      marginTop: 14,
      marginBottom: 5,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 2 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 6, alignSelf: "flex-start" },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#ffffff", marginBottom: 2 },
    skillGroupItems: { fontSize: 8.5, color: "#fff5ea", lineHeight: 1.4 },

    // Stacked (not side-by-side) — the shared itemHeaderRow contract style
    // lays title/date out in a row, which collides in this narrow sidebar.
    sideItemBlock: { marginBottom: 6, alignSelf: "flex-start" },
    sideItemTitle: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#ffffff", lineHeight: 1.3 },
    sideItemMeta: { fontSize: 8, color: "#fff5ea", marginTop: 1 },
  };
}

function EducationEntry({
  entry,
  styles,
}: {
  entry: Resume["education"][number];
  styles: SectionStyleContract & Record<string, Style>;
}) {
  return (
    <View style={styles.sideItemBlock}>
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
  );
}

// Title grouped with the first entry in one `wrap={false}` block — without
// this, react-pdf can paginate the heading and its first entry separately,
// orphaning a bare section title at the bottom of a page with all its
// content pushed to the next one.
function CompactEducationList({
  resume,
  styles,
  title,
}: {
  resume: Resume;
  styles: SectionStyleContract & Record<string, Style>;
  title: string;
}) {
  if (resume.education.length === 0) return null;
  const [first, ...rest] = resume.education;
  return (
    <>
      <View wrap={false}>
        <Text style={styles.sidebarSectionTitle}>{title}</Text>
        <EducationEntry entry={first} styles={styles} />
      </View>
      {rest.map((entry) => (
        <View key={entry.id} wrap={false}>
          <EducationEntry entry={entry} styles={styles} />
        </View>
      ))}
    </>
  );
}

function CertificationEntry({
  entry,
  styles,
}: {
  entry: Resume["certifications"][number];
  styles: SectionStyleContract & Record<string, Style>;
}) {
  return (
    <View style={styles.sideItemBlock}>
      <Text style={styles.sideItemTitle}>{entry.name}</Text>
      {entry.issuer ? <Text style={styles.sideItemMeta}>{entry.issuer}</Text> : null}
      {entry.date ? <Text style={styles.sideItemMeta}>{entry.date}</Text> : null}
    </View>
  );
}

// Same title-orphaning fix as CompactEducationList above.
function CompactCertificationList({
  resume,
  styles,
  title,
}: {
  resume: Resume;
  styles: SectionStyleContract & Record<string, Style>;
  title: string;
}) {
  if (resume.certifications.length === 0) return null;
  const [first, ...rest] = resume.certifications;
  return (
    <>
      <View wrap={false}>
        <Text style={styles.sidebarSectionTitle}>{title}</Text>
        <CertificationEntry entry={first} styles={styles} />
      </View>
      {rest.map((entry) => (
        <View key={entry.id} wrap={false}>
          <CertificationEntry entry={entry} styles={styles} />
        </View>
      ))}
    </>
  );
}

export const CreativePhotoDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
            <View style={styles.photoRing}>
              <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
            </View>

            {contactItems.length > 0 ? (
              <View style={{ width: "100%", marginTop: 4 }}>
                {contactItems.map((item, i) => (
                  <Text key={i} style={styles.contactItem}>
                    {item}
                  </Text>
                ))}
              </View>
            ) : null}

            {sectionHasContent("skills", resume) ? (
              <View style={{ width: "100%" }}>
                <Text style={styles.sidebarSectionTitle}>Skills</Text>
                <SkillsList resume={resume} styles={styles} />
              </View>
            ) : null}

            {sectionHasContent("education", resume) ? (
              <View style={{ width: "100%" }}>
                <CompactEducationList resume={resume} styles={styles} title="Education" />
              </View>
            ) : null}

            {sectionHasContent("certifications", resume) ? (
              <View style={{ width: "100%" }}>
                <CompactCertificationList resume={resume} styles={styles} title="Certifications" />
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
