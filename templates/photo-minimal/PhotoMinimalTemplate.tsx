import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import type { SectionStyleContract } from "../shared/styleContract";

const DEFAULT_ACCENT = "#475569";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 46, fontFamily: "Helvetica", fontSize: 9.5, color: "#242424" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
    photo: { width: 64, height: 64, borderRadius: 32, marginRight: 16, objectFit: "cover" },
    name: { fontSize: 20, fontFamily: "Helvetica" },
    headline: { fontSize: 10.5, marginTop: 2, color: "#666666" },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 10 },
    contactItem: { fontSize: 8.5, color: "#666666" },

    sectionTitle: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 1.5,
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
    itemTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#888888" },
    paragraph: { fontSize: 9.5, lineHeight: 1.5, color: "#333333" },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 2 },
    bulletDot: { width: 9, fontSize: 9, color: "#999999" },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
    skillGroupItems: { fontSize: 9.5, flex: 1, color: "#333333" },
  };
}

export const PhotoMinimalDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
