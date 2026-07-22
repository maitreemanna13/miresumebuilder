export interface AccentColorOption {
  name: string;
  value: string;
}

// Presets offered in the color picker. Each template ships its own default
// accent (used when accentColor is undefined), so "value" here is only ever
// an explicit override.
export const ACCENT_COLORS: AccentColorOption[] = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Blue", value: "#2563eb" },
  { name: "Navy", value: "#2b3a55" },
  { name: "Midnight", value: "#0f172a" },
  { name: "Cobalt", value: "#1e3a8a" },
  { name: "Slate", value: "#475569" },
  { name: "Teal", value: "#0f766e" },
  { name: "Mint", value: "#10b981" },
  { name: "Emerald", value: "#059669" },
  { name: "Green", value: "#166534" },
  { name: "Lime", value: "#4d7c0f" },
  { name: "Gold", value: "#ca8a04" },
  { name: "Yellow", value: "#eab308" },
  { name: "Mustard", value: "#a16207" },
  { name: "Amber", value: "#c2660c" },
  { name: "Brown", value: "#78350f" },
  { name: "Red", value: "#b91c1c" },
  { name: "Rose", value: "#e11d48" },
  { name: "Pink", value: "#db2777" },
  { name: "Fuchsia", value: "#c026d3" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Black", value: "#27272a" },
  // Muted/dusty tones — desaturated rather than pale, so white text on a
  // solid-fill sidebar or banner stays legible.
  { name: "Dusty Blue", value: "#6b8cae" },
  { name: "Sage", value: "#6b8f71" },
  { name: "Dusty Rose", value: "#b76e79" },
  { name: "Lavender", value: "#8b7fc7" },
  { name: "Terracotta", value: "#c1666b" },
  { name: "Taupe", value: "#8a7968" },
];

export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const value = parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
