import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import type { SectionStyleContract } from "../shared/styleContract";

const DEFAULT_ACCENT = "#27272a";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Border lives on the Page itself, not a child View, so it's redrawn
    // consistently on every generated page.
    page: {
      padding: 30,
      border: `3pt solid ${accent}`,
      fontFamily: "Times-Roman",
      fontSize: 10,
      color: "#1a1a1a",
    },
    inner: { padding: 16 },
    header: { marginBottom: 14, alignItems: "center", textAlign: "center" },
    name: {
      fontSize: 21,
      fontFamily: "Times-Bold",
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    headline: { fontSize: 10.5, marginTop: 3, fontStyle: "italic", color: accent },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 8,
      gap: 10,
    },
    contactItem: { fontSize: 9, color: "#444444" },
    headerRule: { borderBottom: `1pt solid ${accent}`, marginTop: 10 },

    sectionTitle: {
      fontSize: 11,
      fontFamily: "Times-Bold",
      textTransform: "uppercase",
      letterSpacing: 1.5,
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
    itemTitle: { fontSize: 10.5, fontFamily: "Times-Bold" },
    itemSubtitle: { fontSize: 9.5, fontStyle: "italic", marginTop: 1 },
    itemMeta: { fontSize: 9, color: "#555555" },
    paragraph: { fontSize: 10, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 10, fontSize: 10, color: accent },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 10, fontFamily: "Times-Bold" },
    skillGroupItems: { fontSize: 10, flex: 1 },
  };
}

export const BorderedFrameDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
        <View style={styles.inner}>
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
            <View style={styles.headerRule} />
          </View>

          {resume.sectionOrder.map((section) => (
            <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
          ))}
        </View>
      </Page>
    </Document>
  );
};
