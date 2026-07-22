import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer, sectionHasContent } from "../shared/SectionRenderer";
import { BulletList } from "../shared/BulletList";
import { formatDateRange } from "../shared/formatDateRange";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#4338ca";
const RAIL_WIDTH = 14;

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 42, fontFamily: "Lato", fontSize: 10, color: "#1f2937" },
    header: { marginBottom: 16, borderBottom: `2pt solid ${accent}`, paddingBottom: 10 },
    name: { fontSize: 20, fontFamily: "Lato-Bold" },
    headline: { fontSize: 11, marginTop: 2, color: accent },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 10 },
    contactItem: { fontSize: 9, color: "#555555" },

    sectionTitle: {
      fontSize: 11,
      fontFamily: "Lato-Bold",
      textTransform: "uppercase",
      letterSpacing: 1,
      color: accent,
      marginTop: 14,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10.5, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9.5, color: "#555555", marginTop: 1 },
    itemMeta: { fontSize: 9, color: "#777777" },
    paragraph: { fontSize: 10, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 10, fontSize: 10, color: accent },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 10, fontFamily: "Lato-Bold" },
    skillGroupItems: { fontSize: 10, flex: 1 },
  };
}

function TimelineExperienceList({
  resume,
  styles,
  accent,
}: {
  resume: Resume;
  styles: SectionStyleContract;
  accent: string;
}) {
  return (
    <>
      {resume.experience.map((entry, index) => (
        <View key={entry.id} style={{ flexDirection: "row", marginBottom: 4 }} wrap={false}>
          <View style={{ width: RAIL_WIDTH, alignItems: "center" }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: accent,
                marginTop: 3,
              }}
            />
            {index < resume.experience.length - 1 ? (
              <View style={{ flex: 1, width: 1, backgroundColor: "#c7d2fe", marginTop: 2 }} />
            ) : null}
          </View>
          <View style={{ flex: 1, paddingLeft: 8, paddingBottom: 8 }}>
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemTitle}>
                {entry.role}
                {entry.company ? `, ${entry.company}` : ""}
              </Text>
              <Text style={styles.itemMeta}>
                {formatDateRange(entry.startDate, entry.endDate, entry.current)}
              </Text>
            </View>
            {entry.location ? <Text style={styles.itemSubtitle}>{entry.location}</Text> : null}
            <BulletList bullets={entry.bullets} styles={styles} />
          </View>
        </View>
      ))}
    </>
  );
}

export const TimelineDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const accent = accentColor ?? DEFAULT_ACCENT;
  const styles = StyleSheet.create(buildStyles(accent));
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

        {resume.sectionOrder.map((section) => {
          if (section === "experience") {
            if (!sectionHasContent("experience", resume)) return null;
            return (
              <View key={section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                <TimelineExperienceList resume={resume} styles={styles} accent={accent} />
              </View>
            );
          }
          return <SectionRenderer key={section} section={section} resume={resume} styles={styles} />;
        })}
      </Page>
    </Document>
  );
};
