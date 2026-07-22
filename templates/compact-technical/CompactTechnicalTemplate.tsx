import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#0f766e";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: {
      padding: 36,
      fontFamily: "Helvetica",
      fontSize: 9,
      color: "#111111",
    },
    header: {
      marginBottom: 10,
      borderBottom: `1.5pt solid ${accent}`,
      paddingBottom: 6,
    },
    name: { fontSize: 17, fontFamily: "Helvetica-Bold" },
    headline: { fontSize: 9.5, marginTop: 1, fontFamily: "Space Mono", color: accent },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 8 },
    contactItem: { fontSize: 8, fontFamily: "Space Mono", color: "#444444" },

    sectionTitle: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: accent,
      marginTop: 8,
      marginBottom: 3,
      backgroundColor: withAlpha(accent, 0.12),
      paddingVertical: 2,
      paddingHorizontal: 4,
    },
    itemBlock: { marginBottom: 4 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
    itemSubtitle: { fontSize: 8.5, color: "#555555", marginTop: 0.5 },
    itemMeta: { fontSize: 8, fontFamily: "Space Mono", color: "#666666" },
    paragraph: { fontSize: 9, lineHeight: 1.3 },
    bulletRow: { flexDirection: "row", marginTop: 1.5, paddingLeft: 2 },
    bulletDot: { width: 8, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9, lineHeight: 1.25 },
    skillGroupRow: { flexDirection: "row", marginBottom: 1.5 },
    skillGroupLabel: { fontSize: 9, fontFamily: "Helvetica-Bold" },
    skillGroupItems: { fontSize: 9, fontFamily: "Space Mono", flex: 1, color: "#222222" },
  };
}

export const CompactTechnicalDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

        {resume.sectionOrder.map((section) => (
          <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
        ))}
      </Page>
    </Document>
  );
};
