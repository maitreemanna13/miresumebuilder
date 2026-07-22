import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#7c3aed";
const RIBBON_WIDTH = 14;

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Extra left padding clears the ribbon; page-level (not a child View's)
    // padding is what react-pdf uses to budget space for automatic
    // pagination, so every generated page keeps consistent margins.
    page: {
      fontFamily: "PT Sans",
      fontSize: 9.5,
      color: "#242424",
      paddingVertical: 40,
      paddingRight: 40,
      paddingLeft: RIBBON_WIDTH + 32,
    },
    // Absolutely positioned so it ignores the Page's own padding and still
    // bleeds to the true left/top/bottom edges on every generated page.
    ribbon: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: RIBBON_WIDTH,
      backgroundColor: accent,
    },
    header: { marginBottom: 14 },
    name: { fontSize: 22, fontFamily: "PT Sans-Bold" },
    headline: { fontSize: 11, marginTop: 3, color: accent, fontFamily: "PT Sans-Bold" },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 12 },
    contactItem: { fontSize: 9, color: "#555555" },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
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
    itemTitle: { fontSize: 10, fontFamily: "PT Sans-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 9.5, fontFamily: "PT Sans-Bold" },
    skillGroupItems: { fontSize: 9.5, flex: 1 },
  };
}

export const RibbonDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
        <View style={styles.ribbon} fixed />

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
