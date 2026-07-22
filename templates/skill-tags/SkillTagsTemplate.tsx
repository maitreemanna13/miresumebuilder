import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { registerResumeFonts } from "../shared/fonts";
import { withAlpha } from "../shared/colorPalette";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#7c3aed";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 40, fontFamily: "PT Sans", fontSize: 9.5, color: "#212121" },
    header: { marginBottom: 12 },
    name: { fontSize: 21, fontFamily: "PT Sans-Bold" },
    headline: { fontSize: 10.5, marginTop: 2, color: accent, fontFamily: "PT Sans-Bold" },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 10 },
    contactItem: { fontSize: 8.5, color: "#555555" },
    headerRule: { height: 2, backgroundColor: accent, marginTop: 10, width: 48 },

    sectionTitle: {
      fontSize: 10,
      fontFamily: "PT Sans-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: "#1a1a1a",
      marginTop: 12,
      marginBottom: 5,
    },
    itemBlock: { marginBottom: 6 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 9.5, fontFamily: "PT Sans-Bold" },
    itemSubtitle: { fontSize: 8.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 8, color: "#777777" },
    paragraph: { fontSize: 9.5, lineHeight: 1.4 },
    bulletRow: { flexDirection: "row", marginTop: 1.5, paddingLeft: 3 },
    bulletDot: { width: 8, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9, lineHeight: 1.3 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "PT Sans-Bold", color: accent, marginBottom: 3 },
    skillGroupItems: { fontSize: 8.5, lineHeight: 1.35 },

    tagGroup: { marginBottom: 7 },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: {
      fontSize: 8.5,
      color: accent,
      backgroundColor: withAlpha(accent, 0.12),
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 10,
    },
  };
}

// One tag row per skill group, each under its own label — never flatten
// every group into a single undifferentiated row of tags.
function SkillTags({ resume, styles }: { resume: Resume; styles: SectionStyleContract & Record<string, Style> }) {
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

export const SkillTagsDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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
          <View style={styles.headerRule} />
        </View>

        {resume.sectionOrder.map((section) => {
          if (section === "skills") {
            if (!sectionHasContent("skills", resume)) return null;
            return (
              <View key={section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <SkillTags resume={resume} styles={styles} />
              </View>
            );
          }
          return <SectionRenderer key={section} section={section} resume={resume} styles={styles} />;
        })}
      </Page>
    </Document>
  );
};
