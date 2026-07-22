"use client";

import { SECTION_IDS, type SectionId } from "@/lib/schema/resume";

export type NavSectionId = "template" | "contact" | SectionId | "ai";

export const SECTION_LABELS: Record<NavSectionId, string> = {
  template: "Template",
  contact: "Contact",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
  ai: "AI Assistant",
};

const NAV_ITEMS: NavSectionId[] = ["template", "contact", ...SECTION_IDS, "ai"];

export function SectionNav({
  active,
  onSelect,
}: {
  active: NavSectionId;
  onSelect: (id: NavSectionId) => void;
}) {
  return (
    <nav className="flex flex-wrap gap-1 border-b border-zinc-200 px-4">
      {NAV_ITEMS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
            active === id
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {SECTION_LABELS[id]}
        </button>
      ))}
    </nav>
  );
}
