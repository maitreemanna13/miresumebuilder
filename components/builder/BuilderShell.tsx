"use client";

import { useState, type ComponentType } from "react";
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
import { PreviewPane } from "./PreviewPane";
import { PreviewErrorBoundary } from "./PreviewErrorBoundary";

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
  const ActiveForm = SECTION_FORMS[active];
  const heading = SECTION_LABELS[active];

  return (
    // 3fr/2fr (not an even 50/50) — the preview is a portrait page, so an
    // even split leaves it swimming in landscape-shaped gutter space while
    // cramping the form column, which needs the width more.
    <div className="grid h-full grid-cols-[3fr_2fr]">
      <div className="flex flex-col overflow-hidden border-r border-zinc-200 bg-white">
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
      <div className="overflow-hidden bg-zinc-100">
        <PreviewErrorBoundary>
          <PreviewPane />
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}
