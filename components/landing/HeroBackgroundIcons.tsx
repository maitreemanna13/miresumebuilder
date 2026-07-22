const ICONS = [
  // briefcase
  "M20.25 14.15v4.098a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25v-4.098M3.75 14.15v-2.4c0-1.036.84-1.875 1.875-1.875h12.75c1.035 0 1.875.84 1.875 1.875v2.4M3.75 14.15 12 16.5m0 0 8.25-2.35M12 16.5v2.25m-4.5-8.25h9M15 6.75V4.5a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5v2.25",
  // document-text
  "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  // check-badge
  "M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z",
  // academic-cap
  "M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443",
  // chart-bar
  "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  // pencil-square
  "M16.862 4.487 18.549 2.8a2.118 2.118 0 1 1 2.998 2.998l-1.687 1.688m-1.988-4.184-10.61 10.61c-.31.31-.52.7-.6 1.126l-.834 3.3 3.3-.834c.426-.08.816-.294 1.127-.604l10.61-10.61m-1.988-4.184 1.988 4.184",
];

// Kept out of the center band where the headline text and the opaque
// template-preview card sit — those would fully cover an icon placed
// behind them, which is why earlier placements were invisible.
const PLACEMENTS = [
  { top: "4%", left: "18%", size: 60, rotate: -8, animate: "animate-drift-a" },
  { top: "4%", left: "68%", size: 64, rotate: 6, animate: "animate-drift-c" },
  { top: "90%", left: "22%", size: 56, rotate: -12, animate: "animate-drift-b" },
  { top: "90%", left: "72%", size: 60, rotate: 10, animate: "animate-drift-a" },
  { top: "46%", left: "1%", size: 52, rotate: 4, animate: "animate-drift-b" },
  { top: "46%", left: "96%", size: 52, rotate: -6, animate: "animate-drift-c" },
];

export function HeroBackgroundIcons() {
  return (
    <>
      {PLACEMENTS.map((p, i) => (
        // Drift animation lives on this outer element; the static rotation
        // lives on the inner svg. Both set `transform`, and putting them on
        // the same element would let the animation's keyframes silently
        // overwrite (and hide) the rotation.
        <div key={i} className={`absolute ${p.animate}`} style={{ top: p.top, left: p.left }}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
            className="text-indigo-600/50"
            style={{ width: p.size, height: p.size, transform: `rotate(${p.rotate}deg)` }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[i % ICONS.length]} />
          </svg>
        </div>
      ))}
    </>
  );
}
