import type { ResumeTemplate } from "./types";
import { ClassicDocument } from "./classic/ClassicTemplate";
import { ModernSidebarDocument } from "./modern-sidebar/ModernSidebarTemplate";
import { MinimalDocument } from "./minimal/MinimalTemplate";
import { ExecutiveDocument } from "./executive/ExecutiveTemplate";
import { CompactTechnicalDocument } from "./compact-technical/CompactTechnicalTemplate";
import { BoldHeaderDocument } from "./bold-header/BoldHeaderTemplate";
import { RightSidebarDocument } from "./right-sidebar/RightSidebarTemplate";
import { TimelineDocument } from "./timeline/TimelineTemplate";
import { TwoColumnBalancedDocument } from "./two-column-balanced/TwoColumnBalancedTemplate";
import { CreativePhotoDocument } from "./creative-photo/CreativePhotoTemplate";
import { BannerTwoColumnDocument } from "./banner-two-column/BannerTwoColumnTemplate";
import { SkillTagsDocument } from "./skill-tags/SkillTagsTemplate";
import { SoftCardDocument } from "./soft-card/SoftCardTemplate";
import { MonogramDocument } from "./monogram/MonogramTemplate";
import { UnderlineAccentDocument } from "./underline-accent/UnderlineAccentTemplate";
import { RibbonDocument } from "./ribbon/RibbonTemplate";
import { ColorBlockDocument } from "./color-block/ColorBlockTemplate";
import { SplitHeaderDocument } from "./split-header/SplitHeaderTemplate";
import { PastelPageDocument } from "./pastel-page/PastelPageTemplate";
import { BorderedFrameDocument } from "./bordered-frame/BorderedFrameTemplate";
import { ThreeColumnDocument } from "./three-column/ThreeColumnTemplate";
import { BoxedPhotoDocument } from "./boxed-photo/BoxedPhotoTemplate";
import { DashedDividerDocument } from "./dashed-divider/DashedDividerTemplate";
import { OverlapPhotoDocument } from "./overlap-photo/OverlapPhotoTemplate";
import { NameplateDocument } from "./nameplate/NameplateTemplate";
import { ContactStripDocument } from "./contact-strip/ContactStripTemplate";
import { SoftSidebarDocument } from "./soft-sidebar/SoftSidebarTemplate";
import { PhotoCardSidebarDocument } from "./photo-card-sidebar/PhotoCardSidebarTemplate";
import { PhotoMinimalDocument } from "./photo-minimal/PhotoMinimalTemplate";
import { FramedCardDocument } from "./framed-card/FramedCardTemplate";
import { BlushHeaderDocument } from "./blush-header/BlushHeaderTemplate";
import { CenteredSerifDocument } from "./centered-serif/CenteredSerifTemplate";
import { EmblemFrameDocument } from "./emblem-frame/EmblemFrameTemplate";
import { UnderlineSidebarDocument } from "./underline-sidebar/UnderlineSidebarTemplate";
import { ContactBarDocument } from "./contact-bar/ContactBarTemplate";
import { ContactBarPhotoDocument } from "./contact-bar-photo/ContactBarPhotoTemplate";
import { NavyBannerSidebarDocument } from "./navy-banner-sidebar/NavyBannerSidebarTemplate";
import { BlushSidebarDocument } from "./blush-sidebar/BlushSidebarTemplate";
import { SlateHeaderBandDocument } from "./slate-header-band/SlateHeaderBandTemplate";
import { TealSplitColumnDocument } from "./teal-split-column/TealSplitColumnTemplate";
import { ChipSidebarDocument } from "./chip-sidebar/ChipSidebarTemplate";

export const TEMPLATES: ResumeTemplate[] = [
  { id: "classic", name: "Classic", Document: ClassicDocument, supportsAccentColor: false },
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    Document: ModernSidebarDocument,
    supportsAccentColor: true,
    tags: ["photo", "sidebar"],
  },
  { id: "minimal", name: "Minimal", Document: MinimalDocument, supportsAccentColor: false },
  { id: "executive", name: "Executive", Document: ExecutiveDocument, supportsAccentColor: true },
  {
    id: "compact-technical",
    name: "Compact Technical",
    Document: CompactTechnicalDocument,
    supportsAccentColor: true,
  },
  {
    id: "bold-header",
    name: "Bold Header",
    Document: BoldHeaderDocument,
    supportsAccentColor: true,
    tags: ["photo"],
  },
  {
    id: "right-sidebar",
    name: "Right Sidebar",
    Document: RightSidebarDocument,
    supportsAccentColor: true,
    tags: ["photo", "sidebar"],
  },
  { id: "timeline", name: "Timeline", Document: TimelineDocument, supportsAccentColor: true },
  {
    id: "two-column-balanced",
    name: "Two-Column Balanced",
    Document: TwoColumnBalancedDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  {
    id: "creative-photo",
    name: "Creative Photo",
    Document: CreativePhotoDocument,
    supportsAccentColor: true,
    tags: ["photo", "sidebar"],
  },
  {
    id: "banner-two-column",
    name: "Banner Chip",
    Document: BannerTwoColumnDocument,
    supportsAccentColor: true,
  },
  { id: "skill-tags", name: "Skill Tags", Document: SkillTagsDocument, supportsAccentColor: true },
  { id: "soft-card", name: "Soft Card", Document: SoftCardDocument, supportsAccentColor: true },
  { id: "monogram", name: "Monogram", Document: MonogramDocument, supportsAccentColor: true },
  {
    id: "underline-accent",
    name: "Underline Accent",
    Document: UnderlineAccentDocument,
    supportsAccentColor: true,
  },
  { id: "ribbon", name: "Ribbon", Document: RibbonDocument, supportsAccentColor: true },
  { id: "color-block", name: "Color Block", Document: ColorBlockDocument, supportsAccentColor: true },
  { id: "split-header", name: "Split Header", Document: SplitHeaderDocument, supportsAccentColor: true },
  {
    id: "pastel-page",
    name: "Pastel Page",
    Document: PastelPageDocument,
    supportsAccentColor: true,
    tags: ["photo"],
  },
  { id: "bordered-frame", name: "Bordered Frame", Document: BorderedFrameDocument, supportsAccentColor: true },
  {
    id: "three-column",
    name: "Three Column",
    Document: ThreeColumnDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  {
    id: "boxed-photo",
    name: "Boxed Photo",
    Document: BoxedPhotoDocument,
    supportsAccentColor: true,
    tags: ["photo"],
  },
  { id: "dashed-divider", name: "Dashed Divider", Document: DashedDividerDocument, supportsAccentColor: true },
  {
    id: "overlap-photo",
    name: "Overlap Photo",
    Document: OverlapPhotoDocument,
    supportsAccentColor: true,
    tags: ["photo"],
  },
  {
    id: "nameplate",
    name: "Nameplate",
    Document: NameplateDocument,
    supportsAccentColor: true,
    tags: ["photo", "sidebar"],
  },
  { id: "contact-strip", name: "Contact Strip", Document: ContactStripDocument, supportsAccentColor: true },
  {
    id: "soft-sidebar",
    name: "Soft Sidebar",
    Document: SoftSidebarDocument,
    supportsAccentColor: true,
    tags: ["photo", "sidebar"],
  },
  {
    id: "photo-card-sidebar",
    name: "Photo Card Sidebar",
    Document: PhotoCardSidebarDocument,
    supportsAccentColor: true,
    tags: ["photo", "sidebar"],
  },
  {
    id: "photo-minimal",
    name: "Photo Minimal",
    Document: PhotoMinimalDocument,
    supportsAccentColor: true,
    tags: ["photo"],
  },
  {
    id: "framed-card",
    name: "Framed Card",
    Document: FramedCardDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  {
    id: "blush-header",
    name: "Blush Header",
    Document: BlushHeaderDocument,
    supportsAccentColor: true,
    tags: ["photo", "sidebar"],
  },
  { id: "centered-serif", name: "Centered Serif", Document: CenteredSerifDocument, supportsAccentColor: true },
  {
    id: "emblem-frame",
    name: "Emblem Frame",
    Document: EmblemFrameDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  {
    id: "underline-sidebar",
    name: "Underline Sidebar",
    Document: UnderlineSidebarDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  { id: "contact-bar", name: "Contact Bar", Document: ContactBarDocument, supportsAccentColor: true },
  {
    id: "contact-bar-photo",
    name: "Contact Bar Photo",
    Document: ContactBarPhotoDocument,
    supportsAccentColor: true,
    tags: ["photo"],
  },
  {
    id: "navy-banner-sidebar",
    name: "Navy Banner Sidebar",
    Document: NavyBannerSidebarDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  {
    id: "blush-sidebar",
    name: "Blush Sidebar",
    Document: BlushSidebarDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  {
    id: "slate-header-band",
    name: "Slate Header Band",
    Document: SlateHeaderBandDocument,
    supportsAccentColor: true,
    tags: ["photo"],
  },
  {
    id: "teal-split-column",
    name: "Teal Split Column",
    Document: TealSplitColumnDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
  {
    id: "chip-sidebar",
    name: "Chip Sidebar",
    Document: ChipSidebarDocument,
    supportsAccentColor: true,
    tags: ["sidebar"],
  },
];

export function getTemplate(id: string): ResumeTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
