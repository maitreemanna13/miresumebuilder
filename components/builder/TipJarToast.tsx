"use client";

export function TipJarToast({ onClose }: { onClose: () => void }) {
  return (
    // Bottom-LEFT, not right — the preview pane's live PDF <iframe> occupies
    // the right side of the screen, and embedded PDF viewer content (the
    // browser's own plugin surface) renders in its own compositing layer
    // that sits above regular page content regardless of z-index. A toast
    // positioned on the right would be silently covered by it.
    <div className="fixed bottom-4 left-4 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-zinc-200 bg-white p-4 shadow-lg">
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-700"
      >
        ×
      </button>
      <p className="pr-4 text-sm text-zinc-700">
        🎉 Hope this resume helps you land the job! If you found it useful, feel free to reward
        us with a coffee — totally optional.
      </p>
      <div className="mt-3 flex flex-col items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element -- static public asset, not a Next-optimizable remote image */}
        <img src="/tip-qr.png" alt="Scan to pay via UPI" className="h-32 w-32" />
        <span className="text-xs text-zinc-400">Scan to pay via UPI</span>
      </div>
    </div>
  );
}
