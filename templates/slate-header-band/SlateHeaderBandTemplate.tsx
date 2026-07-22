import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Resume, SectionId } from "@/lib/schema/resume";
import { renderSectionBody, sectionHasContent } from "../shared/SectionRenderer";
import { PhotoOrPlaceholder } from "../shared/PhotoOrPlaceholder";
import { registerResumeFonts } from "../shared/fonts";
import type { SectionStyleContract } from "../shared/styleContract";

registerResumeFonts();

const DEFAULT_ACCENT = "#dd6b4c";
// Fixed, not accent-driven — the dark band frames the page consistently
// regardless of which accent color is picked, the same way it stays
// unchanged in the reference regardless of theme.
const HEADER_BG = "#28303f";

const SECTION_TITLES: Record<SectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
};

function buildStyles(accent: string): SectionStyleContract & Record<string, Style> {
  return {
    // Bottom-only: react-pdf uses the Page's own padding (not a child
    // View's) to budget space for automatic pagination. No paddingTop —
    // the header band and contact bar are normal-flow children that only
    // render on page 1, so page-level top padding would push them away
    // from the true top edge.
    page: { fontFamily: "Lato", fontSize: 9.5, color: "#242424", paddingBottom: 36 },
    headerBand: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 18,
      backgroundColor: HEADER_BG,
      paddingVertical: 22,
      paddingHorizontal: 32,
    },
    headerText: { flex: 1 },
    name: { fontSize: 20, fontFamily: "Lato-Bold", color: "#ffffff" },
    summaryText: { fontSize: 9, color: "#d7dae0", marginTop: 8, lineHeight: 1.45 },
    photo: { width: 64, height: 64, objectFit: "cover" },
    contactBar: {
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: accent,
      paddingVertical: 7,
      paddingHorizontal: 32,
      gap: 18,
    },
    contactItem: { fontSize: 8.5, color: "#ffffff" },

    // Horizontal only — the header band + contact bar only exist on page
    // 1, so continuation pages need their own top spacing; that comes
    // from the `fixed` spacer rendered as `body`'s first child instead of
    // padding here.
    body: { paddingHorizontal: 32 },
    topSpacer: { height: 26 },
    sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14, marginBottom: 7 },
    sectionMarker: { width: 20, height: 20, borderRadius: 10, backgroundColor: accent },
    sectionTitle: { fontSize: 10.5, fontFamily: "Lato-Bold", color: "#1a1a1a" },

    itemBlock: { marginBottom: 8 },
    itemHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    itemTitle: { fontSize: 10, fontFamily: "Lato-Bold" },
    itemSubtitle: { fontSize: 9, color: accent, marginTop: 1 },
    itemMeta: { fontSize: 8.5, color: accent },
    paragraph: { fontSize: 9.5, lineHeight: 1.45 },
    bulletRow: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
    bulletDot: { width: 9, fontSize: 9, color: accent },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
    skillGroupRow: { flexDirection: "column", marginBottom: 4 },
    skillGroupLabel: { fontSize: 8.5, fontFamily: "Lato-Bold", color: "#1a1a1a", marginBottom: 3 },
    skillGroupItems: { fontSize: 8.5, lineHeight: 1.4 },

    tagGroup: { marginBottom: 8 },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    tag: {
      fontSize: 8.5,
      color: "#1a1a1a",
      backgroundColor: "#f4f5f7",
      border: "0.75pt solid #d8dadf",
      borderRadius: 4,
      paddingVertical: 3,
      paddingHorizontal: 8,
    },
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

export const SlateHeaderBandDocument: React.FC<{ resume: Resume; accentColor?: string }> = ({
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

  const sections = resume.sectionOrder.filter(
    (section) => section !== "summary" && sectionHasContent(section, resume)
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerBand}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{contact.fullName || "Your Name"}</Text>
            {resume.summary.trim() ? <Text style={styles.summaryText}>{resume.summary}</Text> : null}
          </View>
          <PhotoOrPlaceholder photoDataUrl={contact.photoDataUrl} style={styles.photo} />
        </View>

        {contactItems.length > 0 ? (
          <View style={styles.contactBar}>
            {contactItems.map((item, i) => (
              <Text key={i} style={styles.contactItem}>
                {item}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.body}>
          <View style={styles.topSpacer} fixed />
          {sections.map((section) => (
            <View key={section}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>{SECTION_TITLES[section]}</Text>
              </View>
              {section === "skills" ? (
                <SkillChips resume={resume} styles={styles} />
              ) : (
                renderSectionBody(section, resume, styles)
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
