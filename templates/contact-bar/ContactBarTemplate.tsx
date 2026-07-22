import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#1f4e96";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 40, fontFamily: "Lato", fontSize: 9.5, color: "#242424" },
    header: { marginBottom: 14 },
    name: { fontSize: 21, fontFamily: "Lato-Bold", color: accent },
    contactBar: {
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: withAlpha(accent, 0.08),
      borderRadius: 4,
      paddingVertical: 8,
      paddingHorizontal: 14,
      marginTop: 10,
      gap: 16,
    },
    contactItem: { fontSize: 8.5, color: "#333333" },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: {
      fontSize: 8.5,
      color: "#1a1a1a",
      backgroundColor: "#ffffff",
      border: "0.75pt solid #c7d2e3",
      borderRadius: 4,
      paddingVertical: 3,
      paddingHorizontal: 8,
    },

    sectionTitle: {
      fontSize: 11,
      fontFamily: "Lato-Bold",
      color: accent,
      marginTop: 13,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 8 },
    itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold", color: "#1a1a1a" },
    itemSubtitle: { fontSize: 9, color: "#666666", marginTop: 1 },
    // A rounded, filled badge (not plain text) so dates read as a distinct
    // marker at a glance, matching the reference's pill-style date chips.
    itemMeta: {
      fontSize: 8,
      color: "#ffffff",
      backgroundColor: accent,
      paddingVertical: 2.5,
      paddingHorizontal: 9,
      borderRadius: 8,
    },
    paragraph: { fontSize: 9.5, lineHeight: 1.5 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#1a1a1a", marginBottom: 3 },
    skillGroupItems: { fontSize: 8.5, lineHeight: 1.4 },
    tagGroup: { marginBottom: 8 },
  };
}

// One chip row per skill group, each under its own label — never flatten
// every group into a single undifferentiated row of chips.
function SkillChips({
  resume,
  styles,
}: {
  resume: Resume;
  styles: SectionStyleContract & Record<string, Style>;
}) {
  if (resume.skills.length === 0) return null;
  return (
    <>
      {resume.skills.map((group) => (
        <View key={group.id} style={styles.tagGroup}>
          {group.label ? <Text style={styles.skillGroupLabel}>{group.label}</Text> : null}
          <View style={styles.tagRow}>
            {group.items.map((item, i) => (
              <Text key={i} style={styles.tag}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </>
  );
}

export const ContactBarDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const styles = StyleSheet.create(buildStyles(accentColor ?? DEFAULT_ACCENT));
  const { contact } = resume;
  const contactItems = [
    contact.phone,
    contact.email,
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
          {contactItems.length > 0 ? (
            <View style={styles.contactBar}>
              {contactItems.map((item, i) => (
                <Text key={i} style={styles.contactItem}>
                  {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        {resume.sectionOrder.map((section) => {
          if (section === "skills") {
            if (!sectionHasContent("skills", resume)) return null;
            return (
              <View key={section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <SkillChips resume={resume} styles={styles} />
              </View>
            );
          }
          return <SectionRenderer key={section} section={section} resume={resume} styles={styles} />;
        })}
      </Page>
    </Document>
  );
};
