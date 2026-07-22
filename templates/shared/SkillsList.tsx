import { View, Text } from "@react-pdf/renderer";
import type { Resume } from "@/lib/schema/resume";
import type { SectionStyleContract } from "./styleContract";

// Renders just the skills body (no section title) so sidebar-style
// templates can draw their own differently-styled title above it.
export function SkillsList({ resume, styles }: { resume: Resume; styles: SectionStyleContract }) {
  return (
    <>
      {resume.skills.map((group) => (
        <View key={group.id} style={styles.skillGroupRow}>
          {group.label ? <Text style={styles.skillGroupLabel}>{group.label}</Text> : null}
          <Text style={styles.skillGroupItems}>{group.items.join(", ")}</Text>
        </View>
      ))}
    </>
  );
}
