import type { FC } from "react";
import type { Resume } from "@/lib/schema/resume";

export type TemplateTag = "photo" | "sidebar";

export interface ResumeTemplate {
  id: string;
  name: string;
  /** react-pdf <Document> tree — the single source of truth for both live preview and PDF export. */
  Document: FC<{ resume: Resume; accentColor?: string }>;
  /** Whether this template's palette responds to the accent color picker. */
  supportsAccentColor: boolean;
  /** Layout traits used to filter the template gallery — see choose-template page. */
  tags?: TemplateTag[];
}
