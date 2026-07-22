import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import type { SectionStyleContract } from "../shared/styleContract";

const DEFAULT_ACCENT = "#9c7a3c";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: {
      padding: 44,
      fontFamily: "Times-Roman",
      fontSize: 10,
      color: "#1a1a1a",
    },
    header: { marginBottom: 16, alignItems: "center", textAlign: "center" },
    name: {
      fontSize: 22,
      fontFamily: "Times-Bold",
      letterSpacing: 3,
      textTransform: "uppercase",
      color: "#2a2a2a",
    },
    headline: { fontSize: 11, marginTop: 4, fontStyle: "italic", color: accent },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 8,
      gap: 10,
    },
    contactItem: { fontSize: 9, color: "#444444" },

    sectionTitle: {
      fontSize: 11,
      fontFamily: "Times-Bold",
      textTransform: "uppercase",
      letterSpacing: 2.5,
      textAlign: "center",
      color: accent,
      marginTop: 14,
      marginBottom: 2,
    },
    sectionRule: {
      borderBottom: `0.75pt solid ${accent}`,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10.5, fontFamily: "Times-Bold" },
    itemSubtitle: { fontSize: 9.5, fontStyle: "italic", marginTop: 1 },
    itemMeta: { fontSize: 9, color: "#555555" },
    paragraph: { fontSize: 10, lineHeight: 1.45, textAlign: "center" },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 6 },
    bulletDot: { width: 10, fontSize: 10, color: accent },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2, justifyContent: "center" },
    skillGroupLabel: { fontSize: 10, fontFamily: "Times-Bold" },
    skillGroupItems: { fontSize: 10 },
  };
}

export const ExecutiveDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
              <SectionRenderer section={section} resume={resume} styles={styles} />
              <View style={styles.sectionRule} />
            </View>
          ))}
      </Page>
    </Document>
  );
};
