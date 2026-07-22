import { View, Text } from "@react-pdf/renderer";
import type { SectionStyleContract } from "./styleContract";

export function BulletList({
  bullets,
  styles,
}: {
  bullets: string[];
  styles: SectionStyleContract;
}) {
  if (bullets.length === 0) return null;
  return (
    <>
      {bullets.map((bullet, i) => (
        <View key={i} style={styles.bulletRow} wrap={false}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
    </>
  );
}
