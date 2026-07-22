import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume } from "@/lib/schema/resume";
import { SectionRenderer } from "../shared/SectionRenderer";
import type { SectionStyleContract } from "../shared/styleContract";

const rawStyles: SectionStyleContract & Record<string, Style> = {
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 14,
    borderBottom: "1pt solid #333333",
    paddingBottom: 8,
  },
  name: { fontSize: 20, fontFamily: "Times-Bold" },
  headline: { fontSize: 11, marginTop: 2, color: "#444444" },
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 8 },
  contactItem: { fontSize: 9, color: "#444444" },

  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 4,
  },
  itemBlock: { marginBottom: 6 },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: { fontSize: 10.5, fontFamily: "Times-Bold" },
  itemSubtitle: { fontSize: 9.5, fontStyle: "italic", marginTop: 1 },
  itemMeta: { fontSize: 9, color: "#555555" },
  paragraph: { fontSize: 10, lineHeight: 1.4 },
  bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
  bulletDot: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.35 },
  skillGroupRow: { flexDirection: "row", marginBottom: 2 },
  skillGroupLabel: { fontSize: 10, fontFamily: "Times-Bold" },
  skillGroupItems: { fontSize: 10, flex: 1 },
};

const styles = StyleSheet.create(rawStyles);

export const ClassicDocument: React.FC<{ resume: Resume }> = ({ resume }) => {
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
