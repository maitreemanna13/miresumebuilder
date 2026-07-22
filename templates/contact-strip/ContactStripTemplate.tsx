import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { renderSectionBody, sectionHasContent } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#e11d48";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 40, fontFamily: "Helvetica", fontSize: 9.5, color: "#1f2937" },
    name: { fontSize: 24, fontFamily: "Helvetica-Bold" },
    headline: { fontSize: 11, marginTop: 3, color: "#666666" },
    contactStrip: {
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: accent,
      borderRadius: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      marginTop: 10,
      gap: 12,
    },
    contactItem: { fontSize: 8.5, color: "#ffffff" },

    sectionTitleText: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#1a1a1a",
    },
    doubleRuleOuter: { marginTop: 3, height: 1.5, backgroundColor: accent },
    doubleRuleInner: { marginTop: 1.5, height: 1.5, backgroundColor: accent },

    // Unused by this template's own JSX (titles are rendered manually via
    // the double rule above) but still required so SectionRenderer's
    // shared item-rendering code type-checks against the full contract.
    sectionTitle: { height: 0 },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: accent },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
    skillGroupItems: { fontSize: 9.5, flex: 1 },
  };
}

const SECTION_TITLES: Record<string, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
};

export const ContactStripDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
        {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
        {contactItems.length > 0 ? (
          <View style={styles.contactStrip}>
            {contactItems.map((item, i) => (
              <Text key={i} style={styles.contactItem}>
                {item}
              </Text>
            ))}
          </View>
        ) : null}

        {resume.sectionOrder
          .filter((section) => sectionHasContent(section, resume))
          .map((section) => (
            <View key={section} style={{ marginTop: 13 }}>
              <Text style={styles.sectionTitleText}>{SECTION_TITLES[section]}</Text>
              <View style={styles.doubleRuleOuter} />
              <View style={styles.doubleRuleInner} />
              <View style={{ marginTop: 6 }}>{renderSectionBody(section, resume, styles)}</View>
            </View>
          ))}
      </Page>
    </Document>
  );
};
