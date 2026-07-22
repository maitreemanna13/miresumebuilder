import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { renderSectionBody, sectionHasContent } from "../shared/SectionRenderer";
import type { SectionStyleContract } from "../shared/styleContract";

const DEFAULT_ACCENT = "#c1666b";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 42, fontFamily: "Helvetica", fontSize: 9.5, color: "#242424" },
    header: { marginBottom: 14 },
    name: { fontSize: 21, fontFamily: "Helvetica-Bold" },
    headline: { fontSize: 10.5, marginTop: 3, color: accent },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 12 },
    contactItem: { fontSize: 9, color: "#555555" },

    sectionTitleRow: { flexDirection: "row", alignItems: "center", marginTop: 13, marginBottom: 6 },
    sectionMarker: { fontSize: 11, color: accent, marginRight: 5 },
    sectionTitle: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#1a1a1a",
      flex: 1,
      borderBottom: `1pt dashed ${accent}`,
      paddingBottom: 3,
    },
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

export const DashedDividerDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
        <View style={styles.header}>
          <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
          {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
          {contactItems.length > 0 ? (
            <View style={styles.contactRow}>
              {contactItems.map((item, i) => (
                <Text key={i} style={styles.contactItem}>
                  {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        {resume.sectionOrder
          .filter((section) => sectionHasContent(section, resume))
          .map((section) => (
            <View key={section}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionMarker}>»</Text>
                <Text style={styles.sectionTitle}>{SECTION_TITLES[section]}</Text>
              </View>
              {renderSectionBody(section, resume, styles)}
            </View>
          ))}
      </Page>
    </Document>
  );
};
