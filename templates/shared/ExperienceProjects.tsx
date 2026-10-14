import { View, Text } from "@react-pdf/renderer";
import type { ExperienceProject } from "@/lib/schema/resume";
import type { SectionStyleContract } from "./styleContract";
import { BulletList } from "./BulletList";
import { formatDateRange } from "./formatDateRange";

// Labelled lines printed for each project, in this fixed order. Exported
// so the Word export prints the same labels.
export function projectDetailLines(project: ExperienceProject): Array<[string, string]> {
  const technologies = project.technologies.filter((t) => t.trim());
  const lines: Array<[string, string | undefined]> = [
    ["Client Name", project.client],
    ["Project Name", project.name],
    ["Role", project.role],
    ["Technologies", technologies.join(", ")],
  ];
  return lines
    .map(([label, value]) => [label, value?.trim() ?? ""] as [string, string])
    .filter(([, value]) => value);
}

// Projects nested under a single experience entry. Blank rows (added in
// the form but never filled in) are skipped so they don't leave a gap.
export function ExperienceProjects({
  projects,
  styles,
}: {
  projects: ExperienceProject[];
  styles: SectionStyleContract;
}) {
  const visible = projects.filter(
    (p) => p.name.trim() || p.client?.trim() || p.role?.trim() || p.bullets.some((b) => b.trim())
  );
  if (visible.length === 0) return null;

  return (
    <>
      {/* minPresenceAhead keeps the heading from being stranded at the
          bottom of a page with its first project on the next one. */}
      <Text
        // Borrow the bullet colour: it's the template's accent wherever
        // one exists and always legible on the main column's background
        // (unlike sectionTitle, which is white-on-band in some templates).
        // Faded, since this is a sub-heading inside a role and shouldn't
        // compete with the section titles.
        style={[
          styles.itemTitle,
          { marginTop: 5, color: styles.bulletDot.color ?? "#555555", opacity: 0.65 },
        ]}
        minPresenceAhead={40}
      >
        Project Details
      </Text>
      {visible.map((project) => {
        const [first, ...rest] = projectDetailLines(project);
        const duration = formatDateRange(project.startDate, project.endDate);
        return (
          // Indented so a project reads as part of the role above it rather
          // than as another job at the same level.
          <View key={project.id} style={{ marginTop: 4, paddingLeft: 10 }}>
            {/* Same rule as the entry itself: only the header cluster is
                wrap={false}, so a long project can still break across pages. */}
            <View wrap={false}>
              {/* Duration sits on the right of the first labelled line. */}
              {first || duration ? (
                <View style={styles.itemHeaderRow}>
                  {first ? <DetailLine label={first[0]} value={first[1]} styles={styles} grow /> : <Text />}
                  {duration ? <Text style={styles.itemMeta}>{duration}</Text> : null}
                </View>
              ) : null}
              {rest.map(([label, value]) => (
                <DetailLine key={label} label={label} value={value} styles={styles} />
              ))}
            </View>
            <BulletList bullets={project.bullets} styles={styles} />
          </View>
        );
      })}
    </>
  );
}

function DetailLine({
  label,
  value,
  styles,
  grow,
}: {
  label: string;
  value: string;
  styles: SectionStyleContract;
  grow?: boolean;
}) {
  return (
    // Only typography is borrowed from bulletText — its flex/width settings
    // are meant for a row next to a bullet dot and break layout here.
    <Text
      style={{
        fontFamily: styles.bulletText.fontFamily,
        fontSize: styles.bulletText.fontSize,
        color: styles.bulletText.color,
        lineHeight: 1.35,
        marginTop: 1,
        ...(grow ? { flex: 1, paddingRight: 8 } : {}),
      }}
    >
      <Text style={{ fontFamily: styles.itemTitle.fontFamily, fontWeight: styles.itemTitle.fontWeight }}>
        {label}:{" "}
      </Text>
      {value}
    </Text>
  );
}
