"use client";

import { useResumeStore } from "@/store/resumeStore";
import { getTemplate } from "@/templates/registry";
import { ACCENT_COLORS } from "@/templates/shared/colorPalette";

export function ColorPicker() {
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const selectedAccentColor = useResumeStore((s) => s.selectedAccentColor);
  const setSelectedAccentColor = useResumeStore((s) => s.setSelectedAccentColor);

  const template = getTemplate(selectedTemplateId);
  if (!template.supportsAccentColor) return null;

  return (
    <div className="border-b border-zinc-200 p-4">
      <span className="text-xs font-medium text-zinc-500">Accent color</span>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedAccentColor(null)}
          aria-label="Use default color"
          className={`h-6 w-6 rounded-full border-2 bg-white bg-[linear-gradient(135deg,transparent_47%,#d4d4d8_47%,#d4d4d8_53%,transparent_53%)] ${
            selectedAccentColor === null ? "border-zinc-900" : "border-zinc-300"
          }`}
        />
        {ACCENT_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => setSelectedAccentColor(color.value)}
            aria-label={color.name}
            title={color.name}
            style={{ backgroundColor: color.value }}
            className={`h-6 w-6 rounded-full border-2 ${
              selectedAccentColor === color.value ? "border-zinc-900" : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
