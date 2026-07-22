import { Image, View, Svg, Circle, Path } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

// Generic silhouette (no real person's likeness) shown in the photo slot
// until the user uploads their own picture — keeps every template's photo
// frame from looking like an empty gap on templates designed around it.
export function PhotoOrPlaceholder({
  photoDataUrl,
  style,
}: {
  photoDataUrl?: string;
  style: Style;
}) {
  if (photoDataUrl) {
    // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img
    return <Image src={photoDataUrl} style={style} />;
  }

  return (
    <View style={[style, { overflow: "hidden", backgroundColor: "#e5e7eb" }]}>
      <Svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <Circle cx="50" cy="38" r="19" fill="#9ca3af" />
        <Path d="M50 60c-23 0-40 15-40 34v6h80v-6c0-19-17-34-40-34z" fill="#9ca3af" />
      </Svg>
    </View>
  );
}
