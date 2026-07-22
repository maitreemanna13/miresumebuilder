import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#8b7fc7";
// Only the center column carries potentially long-running content
// (experience/projects) — both side columns stay short and bounded so a
// mismatched-column-height pagination glitch can't happen.
const LEFT_SECTIONS: SectionId[] = ["skills"];
const RIGHT_SECTIONS: SectionId[] = ["education", "certifications"];

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 36, fontFamily: "PT Sans", fontSize: 9, color: "#242424" },
    header: { marginBottom: 14 },
    name: { fontSize: 20, fontFamily: "PT Sans-Bold" },
    headline: { fontSize: 10.5, marginTop: 2, color: accent },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 10 },
    contactItem: { fontSize: 8.5, color: "#555555" },
    headerRule: { borderBottom: `1.5pt solid ${accent}`, marginTop: 8 },

    columns: { flexDirection: "row", gap: 18 },
    leftColumn: { width: "24%" },
    centerColumn: { width: "46%" },
    rightColumn: { width: "30%" },

    sectionTitle: {
      fontSize: 9.5,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      marginTop: 10,
      marginBottom: 4,
    },
    itemBlock: { marginBottom: 6 },
    // Column not row — even the 54%-wide center column is too narrow for a
    // title and a right-aligned date to share one line without crowding or
    // overlapping; the 23%-wide side columns make a row layout unusable.
    itemHeaderRow: { flexDirection: "column" },
    itemTitle: { fontSize: 9, fontFamily: "PT Sans-Bold" },
    itemSubtitle: { fontSize: 8, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 7.5, color: "#777777", marginTop: 1 },
    paragraph: { fontSize: 9, lineHeight: 1.4 },
    bulletRow: { flexDirection: "row", marginTop: 1.5, paddingLeft: 2 },
    bulletDot: { width: 7, fontSize: 8, color: accent },
    bulletText: { flex: 1, fontSize: 8.5, lineHeight: 1.3 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8, fontFamily: "PT Sans-Bold", marginBottom: 1 },
    skillGroupItems: { fontSize: 8, lineHeight: 1.35 },
  };
}

export const ThreeColumnDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  const leftSections = resume.sectionOrder.filter((s) => LEFT_SECTIONS.includes(s));
  const rightSections = resume.sectionOrder.filter((s) => RIGHT_SECTIONS.includes(s));
  const centerSections = resume.sectionOrder.filter(
    (s) => !LEFT_SECTIONS.includes(s) && !RIGHT_SECTIONS.includes(s)
  );

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
          <View style={styles.headerRule} />
        </View>

        <View style={styles.columns}>
          <View style={styles.leftColumn}>
            {leftSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
          <View style={styles.centerColumn}>
            {centerSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
          <View style={styles.rightColumn}>
            {rightSections.map((section) => (
              <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
