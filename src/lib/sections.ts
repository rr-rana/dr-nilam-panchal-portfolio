export type SectionSlug =
  | "research-publications"
  | "moocs-e-content"
  | "events-engagements"
  | "teaching-training"
  | "seminar-conferences"
  | "invited-lectures"
  | "achievements-awards"
  | "administrative"
  | "others";

export type SectionLink = {
  slug: SectionSlug;
  label: string;
};

export type SectionDefinition = SectionLink & {
  defaultSubmenus: { label: string; slug: string }[];
};

export const SECTION_DEFINITIONS: Record<SectionSlug, SectionDefinition> = {
  "research-publications": {
    slug: "research-publications",
    label: "Research & Publications",
    defaultSubmenus: [],
  },
  "moocs-e-content": {
    slug: "moocs-e-content",
    label: "MOOCs and E-Content",
    defaultSubmenus: [],
  },
  "events-engagements": {
    slug: "events-engagements",
    label: "Events & Engagements",
    defaultSubmenus: [],
  },
  "teaching-training": {
    slug: "teaching-training",
    label: "Teaching & Training",
    defaultSubmenus: [],
  },
  "seminar-conferences": {
    slug: "seminar-conferences",
    label: "Seminar & Conferences",
    defaultSubmenus: [],
  },
  "invited-lectures": {
    slug: "invited-lectures",
    label: "Invited Lectures",
    defaultSubmenus: [],
  },
  "achievements-awards": {
    slug: "achievements-awards",
    label: "Achievements & Awards",
    defaultSubmenus: [],
  },
  administrative: {
    slug: "administrative",
    label: "Administrative",
    defaultSubmenus: [],
  },
  others: {
    slug: "others",
    label: "Others",
    defaultSubmenus: [],
  },
};

export const SECTION_LINKS: SectionLink[] = Object.values(SECTION_DEFINITIONS);

export const isSectionSlug = (slug: string): slug is SectionSlug =>
  slug in SECTION_DEFINITIONS;
