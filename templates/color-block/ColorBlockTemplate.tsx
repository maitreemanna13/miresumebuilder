import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#c026d3";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 40, fontFamily: "Lato", fontSize: 9.5, color: "#1f2937" },
    header: { marginBottom: 16 },
    nameBlock: {
      alignSelf: "flex-start",
      backgroundColor: accent,
      borderRadius: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    name: { fontSize: 22, fontFamily: "Lato-Bold", color: "#ffffff" },
    headline: { fontSize: 11, marginTop: 6, color: accent, fontFamily: "Lato-Bold" },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 6 },
    contactPill: {
      fontSize: 8,
      color: accent,
      backgroundColor: withAlpha(accent, 0.12),
      borderRadius: 8,
      paddingVertical: 3,
      paddingHorizontal: 8,
    },

    sectionTitle: {
      alignSelf: "flex-start",
      fontSize: 9,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: "#ffffff",
      backgroundColor: accent,
      borderRadius: 9,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginTop: 13,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: accent },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 2 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 5 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: accent, marginBottom: 2 },
    skillGroupItems: { fontSize: 9, lineHeight: 1.4 },
  };
}

export const ColorBlockDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
          </View>
          {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
          {contactItems.length > 0 ? (
            <View style={styles.contactRow}>
              {contactItems.map((item, i) => (
                <Text key={i} style={styles.contactPill}>
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
