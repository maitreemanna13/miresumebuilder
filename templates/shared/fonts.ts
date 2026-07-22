import { Font } from "@react-pdf/renderer";

// On the client, /public is served from the site root; on the server
// (used later for PDF export in a Route Handler) there is no origin to
// resolve a relative URL against, so we point at the file on disk instead.
const FONT_BASE = typeof window === "undefined" ? `${process.cwd()}/public/fonts` : "/fonts";

let registered = false;

// Each weight/style is registered as its own named family (rather than
// relying on react-pdf's fontWeight-based face matching) so templates can
// reference exactly the face they want and font resolution failures are
// easy to trace back to a specific `fontFamily` string.
export function registerResumeFonts() {
  if (registered) return;
  registered = true;

  Font.register({ family: "Lato", src: `${FONT_BASE}/Lato-Regular.ttf` });
  Font.register({ family: "Lato-Bold", src: `${FONT_BASE}/Lato-Bold.ttf` });

  Font.register({ family: "Crimson Text", src: `${FONT_BASE}/CrimsonText-Regular.ttf` });
  Font.register({ family: "Crimson Text-Bold", src: `${FONT_BASE}/CrimsonText-Bold.ttf` });
  Font.register({ family: "Crimson Text-Italic", src: `${FONT_BASE}/CrimsonText-Italic.ttf` });

  Font.register({ family: "PT Sans", src: `${FONT_BASE}/PTSans-Regular.ttf` });
  Font.register({ family: "PT Sans-Bold", src: `${FONT_BASE}/PTSans-Bold.ttf` });

  Font.register({ family: "Space Mono", src: `${FONT_BASE}/SpaceMono-Regular.ttf` });
  Font.register({ family: "Space Mono-Bold", src: `${FONT_BASE}/SpaceMono-Bold.ttf` });
}
