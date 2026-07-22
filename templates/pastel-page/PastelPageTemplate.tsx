import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#6b8f71";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Page's own backgroundColor, not a child View's, so the soft tint
    // covers every generated page automatically.
    page: {
      padding: 42,
      backgroundColor: withAlpha(accent, 0.1),
      fontFamily: "Lato",
      fontSize: 9.5,
      color: "#2a2a2a",
    },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    photo: { width: 56, height: 56, borderRadius: 28, marginRight: 14, objectFit: "cover" },
    name: { fontSize: 21, fontFamily: "Lato-Bold", color: "#1a1a1a" },
    headline: { fontSize: 10.5, marginTop: 2, color: accent, fontFamily: "Lato-Bold" },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 10 },
    contactItem: { fontSize: 8.5, color: "#555555" },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      marginTop: 13,
      marginBottom: 5,
    },
    itemBlock: { marginBottom: 7, backgroundColor: "#ffffff", borderRadius: 5, padding: 8 },
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
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 9.5, fontFamily: "Lato-Bold" },
    skillGroupItems: { fontSize: 9.5, flex: 1 },
  };
}

export const PastelPageDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
          <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
          <View>
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
        </View>

        {resume.sectionOrder.map((section) => (
          <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
        ))}
      </Page>
    </Document>
  );
};
