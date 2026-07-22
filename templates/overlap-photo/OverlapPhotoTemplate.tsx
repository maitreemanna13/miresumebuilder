import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#1e3a8a";
const HEADER_HEIGHT = 90;
const PHOTO_SIZE = 76;

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Bottom-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination. No paddingTop —
    // the header band is a normal-flow child only on page 1, so page-level
    // top padding would push it away from the true top edge.
    page: { fontFamily: "Lato", fontSize: 9.5, color: "#1f2937", paddingBottom: 40 },
    headerBand: {
      height: HEADER_HEIGHT,
      backgroundColor: accent,
      flexDirection: "row",
      alignItems: "flex-end",
      paddingLeft: PHOTO_SIZE + 56,
      paddingBottom: 14,
      paddingRight: 40,
    },
    // Painted after the header band in document order, so it layers on top
    // and straddles the band/body seam — centered on the band's bottom edge.
    photoRing: {
      position: "absolute",
      top: HEADER_HEIGHT - PHOTO_SIZE / 2,
      left: 40,
      width: PHOTO_SIZE + 6,
      height: PHOTO_SIZE + 6,
      borderRadius: (PHOTO_SIZE + 6) / 2,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
    },
    photo: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2, objectFit: "cover" },
    name: { fontSize: 19, fontFamily: "Lato-Bold", color: "#ffffff" },
    headline: { fontSize: 10, marginTop: 2, color: "#ffffff", opacity: 0.9 },

    body: { paddingHorizontal: 40 },
    // Tall enough to clear the photo ring, which bleeds
    // HEADER_HEIGHT/2 + a few pt below the header/body seam.
    topSpacer: { height: PHOTO_SIZE / 2 + 16 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 4 },
    contactItem: { fontSize: 8.5, color: "#555555" },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Lato-Bold",
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
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 9.5, fontFamily: "Lato-Bold" },
    skillGroupItems: { fontSize: 9.5, flex: 1 },
  };
}

export const OverlapPhotoDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
          <View>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {contact.headline ? <Text style={styles.headline}>{contact.headline}</Text> : null}
          </View>
        </View>

        <View style={styles.photoRing}>
          <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
        </View>

        <View style={styles.body}>
          <View style={styles.topSpacer} fixed />
          {contactItems.length > 0 ? (
            <View style={styles.contactRow}>
              {contactItems.map((item, i) => (
                <Text key={i} style={styles.contactItem}>
                  {item}
                </Text>
              ))}
            </View>
          ) : null}

          {resume.sectionOrder.map((section) => (
            <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
          ))}
        </View>
      </Page>
    </Document>
  );
};
