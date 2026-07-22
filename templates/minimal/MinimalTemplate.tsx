import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import type { SectionStyleContract } from "../shared/styleContract";

const rawStyles: SectionStyleContract & Record<string, Style> = {
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#222222",
  },
  header: { marginBottom: 20 },
  name: { fontSize: 22, fontFamily: "Helvetica" },
  headline: { fontSize: 11, marginTop: 3, color: "#666666" },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 10 },
  contactItem: { fontSize: 9, color: "#666666" },

  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 6,
    color: "#333333",
  },
  itemBlock: { marginBottom: 8 },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  itemSubtitle: { fontSize: 9.5, color: "#555555", marginTop: 1 },
  itemMeta: { fontSize: 9, color: "#888888" },
  paragraph: { fontSize: 10, lineHeight: 1.5, color: "#333333" },
  bulletRow: { flexDirection: "row", marginTop: 3, paddingLeft: 2 },
  bulletDot: { width: 10, fontSize: 10, color: "#999999" },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.4 },
  skillGroupRow: { flexDirection: "row", marginBottom: 3 },
  skillGroupLabel: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  skillGroupItems: { fontSize: 10, flex: 1, color: "#333333" },
};

const styles = StyleSheet.create(rawStyles);

export const MinimalDocument: React.FC<{ resume: Resume }> = ({ resume }) => {
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

        {resume.sectionOrder.map((section) => (
          <SectionRenderer key={section} section={section} resume={resume} styles={styles} />
        ))}
      </Page>
    </Document>
  );
};
