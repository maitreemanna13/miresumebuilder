import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#2c4870";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Bottom-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination, so this is what
    // gives every generated page a real bottom margin. No paddingTop here —
    // the header band is a normal-flow child (not absolutely positioned
    // like the sidebar templates), so page-level top padding would push it
    // away from page 1's true top edge, breaking its full-bleed look.
    page: { fontFamily: "Lato", fontSize: 10, color: "#1f2937", paddingBottom: 40 },
    headerBand: {
      backgroundColor: accent,
      paddingVertical: 26,
      paddingHorizontal: 44,
      flexDirection: "row",
      alignItems: "center",
    },
    photo: { width: 64, height: 64, borderRadius: 32, marginRight: 16, objectFit: "cover" },
    headerText: { flex: 1 },
    // Horizontal only — the header band only exists on page 1, so
    // continuation pages need their own top spacing; that comes from the
    // `fixed` spacer rendered as `body`'s first child instead of padding
    // here.
    body: { paddingHorizontal: 40 },
    topSpacer: { height: 28 },
    name: { fontSize: 22, fontFamily: "Lato-Bold", color: "#ffffff" },
    headline: { fontSize: 11, marginTop: 4, color: "#dbe4ff" },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 12 },
    contactItem: { fontSize: 9, color: "#dbe4ff" },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      marginTop: 14,
      marginBottom: 5,
      borderBottom: `2pt solid ${accent}`,
      paddingBottom: 3,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10.5, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 9, color: accent },
    paragraph: { fontSize: 10, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 10, fontSize: 10, color: accent },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 10, fontFamily: "Lato-Bold" },
    skillGroupItems: { fontSize: 10, flex: 1 },
  };
}

export const BoldHeaderDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
        <View style={styles.headerBand}>
          <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
          <View style={styles.headerText}>
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

        <View style={styles.body}>
          <View style={styles.topSpacer} fixed />
          {resume.sectionOrder.map((section) => (
            <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
          ))}
        </View>
      </Page>
    </Document>
  );
};
