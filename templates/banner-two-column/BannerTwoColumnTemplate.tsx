import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

const DEFAULT_ACCENT = "#0e7490";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Bottom-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination, so this is what
    // gives every generated page a real bottom margin. No paddingTop here —
    // the banner is a normal-flow child (not absolutely positioned like the
    // sidebar templates), so page-level top padding would push it away
    // from page 1's true top edge, breaking its full-bleed look.
    page: { fontFamily: "Helvetica", fontSize: 9.5, color: "#1f2937", paddingBottom: 40 },
    banner: {
      backgroundColor: accent,
      paddingVertical: 24,
      paddingHorizontal: 40,
    },
    name: { fontSize: 21, fontFamily: "Helvetica-Bold", color: "#ffffff" },
    headline: { fontSize: 10.5, marginTop: 3, color: "#ffffff", opacity: 0.9 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 10 },
    contactItem: { fontSize: 8.5, color: "#ffffff" },

    // Horizontal only — the banner only exists on page 1, so continuation
    // pages need their own top spacing; that comes from the `fixed` spacer
    // rendered as `body`'s first child instead of padding here.
    body: { paddingHorizontal: 40 },
    topSpacer: { height: 28 },

    sectionTitle: {
      fontSize: 9.5,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.75,
      color: accent,
      backgroundColor: withAlpha(accent, 0.1),
      paddingVertical: 3,
      paddingHorizontal: 6,
      borderRadius: 3,
      marginTop: 12,
      marginBottom: 5,
      alignSelf: "flex-start",
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
    skillGroupItems: { fontSize: 9.5, flex: 1 },
  };
}

export const BannerTwoColumnDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
        <View style={styles.banner}>
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
