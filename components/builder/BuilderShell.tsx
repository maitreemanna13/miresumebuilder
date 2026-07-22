"use client";

import { useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { SectionNav, SECTION_LABELS, type NavSectionId } from "./SectionNav";
import { ContactForm } from "./forms/ContactForm";
import { SummaryForm } from "./forms/SummaryForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { EducationForm } from "./forms/EducationForm";
import { SkillsForm } from "./forms/SkillsForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { CertificationsForm } from "./forms/CertificationsForm";
import { AwardsForm } from "./forms/AwardsForm";
import { TemplatePicker } from "./TemplatePicker";
import { ColorPicker } from "./ColorPicker";
import { AIPanel } from "./ai/AIPanel";
import { PreviewErrorBoundary } from "./PreviewErrorBoundary";

// pdfjs-dist (used inside PreviewPane) touches browser-only globals (e.g.
// DOMMatrix) at module-evaluation time, which crashes Next's server render
// if this is imported statically — even inside a "use client" component,
// the module still gets evaluated once during SSR. `ssr: false` keeps it
// out of the server bundle entirely.
const PreviewPane = dynamic(() => import("./PreviewPane").then((mod) => mod.PreviewPane), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
      Loading…
    </div>
  ),
});

const SECTION_FORMS: Record<NavSectionId, ComponentType> = {
  template: TemplatePicker,
  contact: ContactForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
  awards: AwardsForm,
  ai: AIPanel,
};

export function BuilderShell() {
  const [active, setActive] = useState<NavSectionId>("contact");
  // Below `md`, the two-pane layout doesn't fit a phone-width screen — only
  // one pane shows at a time there, switched via the toggle bar below,
  // instead of squeezing both into an unusably narrow column each.
  const [mobilePane, setMobilePane] = useState<"edit" | "preview">("edit");
  const ActiveForm = SECTION_FORMS[active];
  const heading = SECTION_LABELS[active];

  return (
    // 3fr/2fr (not an even 50/50) on desktop — the preview is a portrait
    // page, so an even split leaves it swimming in landscape-shaped gutter
    // space while cramping the form column, which needs the width more.
    <div className="flex h-full flex-col md:grid md:grid-cols-[3fr_2fr]">
      <div className="flex shrink-0 border-b border-zinc-200 bg-white md:hidden">
        <button
          type="button"
          onClick={() => setMobilePane("edit")}
          className={`flex-1 border-b-2 py-2 text-sm font-medium ${
            mobilePane === "edit" ? "border-indigo-600 text-indigo-700" : "border-transparent text-zinc-500"
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMobilePane("preview")}
          className={`flex-1 border-b-2 py-2 text-sm font-medium ${
            mobilePane === "preview" ? "border-indigo-600 text-indigo-700" : "border-transparent text-zinc-500"
          }`}
        >
          Preview
        </button>
      </div>

      <div
        className={`min-h-0 flex-1 flex-col overflow-hidden border-r border-zinc-200 bg-white md:flex ${
          mobilePane === "edit" ? "flex" : "hidden"
        }`}
      >
        <SectionNav active={active} onSelect={setActive} />
        {active === "ai" ? (
          <div className="flex flex-1 flex-col overflow-hidden p-4">
            <h2 className="mb-3 text-base font-semibold text-zinc-900">{heading}</h2>
            <ActiveForm />
          </div>
        ) : active === "template" ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Stays put while the template grid below scrolls — never
                scrolls out of view. Renders nothing of its own when the
                selected template has no accent color to pick. */}
            <ColorPicker />
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="mb-4 text-base font-semibold text-zinc-900">{heading}</h2>
              <ActiveForm />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="mb-4 text-base font-semibold text-zinc-900">{heading}</h2>
            <ActiveForm />
          </div>
        )}
      </div>
      <div
        className={`min-h-0 flex-1 overflow-hidden bg-zinc-100 md:block ${
          mobilePane === "preview" ? "block" : "hidden"
        }`}
      >
        <PreviewErrorBoundary>
          <PreviewPane />
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}
