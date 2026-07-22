import type { InputHTMLAttributes } from "react";

// `invalid` swaps the border/ring color variant in this same class string
// rather than letting a caller pass a conflicting `border-*`/`ring-*`
// override className — same-specificity Tailwind utilities don't reliably
// let source order decide the winner, so two border-color classes on one
// element is a real bug, not just a style choice.
export function Input({
  className,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const colorClasses = invalid
    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
    : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500";
  return (
    <input
      {...props}
      className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${colorClasses} ${className ?? ""}`}
    />
  );
}
