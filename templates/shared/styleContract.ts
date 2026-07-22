import type { Style } from "@react-pdf/types";

/**
 * Style keys every template must provide so `SectionRenderer` can render
 * any section consistently. Templates own layout/color/typography by
 * defining these via their own `StyleSheet.create()`; only the visual
 * values differ per template, not the render logic.
 */
export interface SectionStyleContract {
  sectionTitle: Style;
  itemBlock: Style;
  itemHeaderRow: Style;
  itemTitle: Style;
  itemSubtitle: Style;
  itemMeta: Style;
  paragraph: Style;
  bulletRow: Style;
  bulletDot: Style;
  bulletText: Style;
  skillGroupRow: Style;
  skillGroupLabel: Style;
  skillGroupItems: Style;
}
