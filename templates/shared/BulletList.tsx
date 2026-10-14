import { View, Text } from "@react-pdf/renderer";
import type { SectionStyleContract } from "./styleContract";

export function BulletList({
  bullets,
  styles,
}: {
  bullets: string[];
  styles: SectionStyleContract;
}) {
  // Blank lines (an emptied textarea, a trailing newline) would otherwise
  // print as a lone bullet dot with no text.
  const visible = bullets.filter((bullet) => bullet.trim());
  if (visible.length === 0) return null;
  return (
    <>
      {visible.map((bullet, i) => (
        <View key={i} style={styles.bulletRow} wrap={false}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
    </>
  );
}
