import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import type { SectionStyleContract } from "../shared/styleContract";

const DEFAULT_ACCENT = "#27272a";

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    page: { padding: 46, fontFamily: "Times-Roman", fontSize: 10, color: "#1a1a1a" },
    header: { alignItems: "center", marginBottom: 16 },
    name: { fontSize: 22, fontFamily: "Times-Bold", textAlign: "center" },
    contactLine: { fontSize: 9, color: "#3f3f46", textAlign: "center", marginTop: 6 },
    contactLabel: { fontFamily: "Times-Bold", color: "#1a1a1a" },
    headerRule: { borderBottom: `0.75pt solid ${accent}`, marginTop: 12, width: "100%" },

    sectionTitle: {
      fontSize: 10.5,
      fontFamily: "Times-Bold",
      textTransform: "uppercase",
      letterSpacing: 1.25,
      color: "#1a1a1a",
      borderBottom: `0.75pt solid ${accent}`,
      paddingBottom: 3,
      marginTop: 14,
      marginBottom: 6,
    },
    itemBlock: { marginBottom: 7 },
    itemHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemTitle: { fontSize: 10.5, fontFamily: "Times-Bold" },
    itemSubtitle: { fontSize: 9.5, fontStyle: "italic", marginTop: 1 },
    itemMeta: { fontSize: 9, color: "#555555" },
    paragraph: { fontSize: 10, lineHeight: 1.5 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 10, fontSize: 10 },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "row", marginBottom: 2 },
    skillGroupLabel: { fontSize: 10, fontFamily: "Times-Bold" },
    skillGroupItems: { fontSize: 10, flex: 1 },
  };
}

export const CenteredSerifDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
  resume,
  accentColor,
}) => {
  const styles = StyleSheet.create(buildStyles(accentColor ?? DEFAULT_ACCENT));
  const { contact } = resume;

  const primaryFields = [
    { label: "Address", value: contact.location },
    { label: "Email address", value: contact.email },
    { label: "Phone number", value: contact.phone },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value && f.value.trim()));

  const secondaryItems = [contact.website, contact.linkedin, contact.github].filter(
    (v): v is string => Boolean(v && v.trim())
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {contact.headline ? (
            <Text style={[styles.contactLabel, { fontSize: 9.5, marginBottom: 2 }]}>
              {contact.headline}
            </Text>
          ) : null}
          <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
          {primaryFields.length > 0 ? (
            <Text style={styles.contactLine}>
              {primaryFields.map((f, i) => (
                <Text key={f.label}>
                  <Text style={styles.contactLabel}>{f.label}: </Text>
                  {f.value}
                  {i < primaryFields.length - 1 ? "   ·   " : ""}
                </Text>
              ))}
            </Text>
          ) : null}
          {secondaryItems.length > 0 ? (
            <Text style={styles.contactLine}>{secondaryItems.join("   ·   ")}</Text>
          ) : null}
          <View style={styles.headerRule} />
        </View>

        {resume.sectionOrder.map((section) => (
          <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
        ))}
      </Page>
    </Document>
  );
};
