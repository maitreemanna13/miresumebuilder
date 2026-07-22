"use client";

import { useResumeStore } from "@/store/resumeStore";
import { TEMPLATES } from "@/templates/registry";

export function TemplatePicker() {
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const setSelectedTemplateId = useResumeStore((s) => s.setSelectedTemplateId);

  return (
    <div className="grid grid-cols-2 gap-3">
      {TEMPLATES.map((template) => {
        const isSelected = template.id === selectedTemplateId;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => setSelectedTemplateId(template.id)}
            className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors ${
              isSelected
                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                : "border-zinc-200 hover:border-indigo-300"
            }`}
          >
            <span className="font-serif text-lg font-bold text-slate-800">{template.name}</span>
            {isSelected ? <span className="text-xs text-indigo-600">Selected</span> : null}
          </button>
        );
      })}
    </div>
  );
}
