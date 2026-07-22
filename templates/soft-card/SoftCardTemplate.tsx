import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#166534";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 34, fontFamily: "Lato", fontSize: 9.5, color: "#242424" },
    headerCard: {
      backgroundColor: withAlpha(accent, 0.08),
      borderRadius: 8,
      padding: 18,
      marginBottom: 14,
    },
    name: { fontSize: 20, fontFamily: "Lato-Bold", color: accent },
    headline: { fontSize: 10.5, marginTop: 2, color: "#3f3f3f" },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 10 },
    contactItem: { fontSize: 8.5, color: "#555555" },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#1a1a1a",
      marginTop: 10,
      marginBottom: 5,
    },
    itemBlock: {
      marginBottom: 7,
      borderLeft: `2pt solid ${accent}`,
      paddingLeft: 8,
    },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 9.5, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 8.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8, color: accent },
    paragraph: { fontSize: 9.5, lineHeight: 1.4 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 2 },
    bulletDot: { width: 8, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9, lineHeight: 1.3 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 9, fontFamily: "Lato-Bold" },
    skillGroupItems: { fontSize: 9, flex: 1 },
  };
}

export const SoftCardDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
        <View style={styles.headerCard}>
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

        {resume.sectionOrder.map((section) => (
          <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
        ))}
      </Page>
    </Document>
  );
};
