export type SectionSlug = "research-publications";

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
    defaultSubmenus: [
      { label: "Research", slug: "research" },
      { label: "Projects", slug: "projects" },
      { label: "Books Author", slug: "books-author" },
      { label: "Books Editor", slug: "books-editor" },
    ],
  },
};

export const SECTION_LINKS: SectionLink[] = Object.values(SECTION_DEFINITIONS);

export const isSectionSlug = (slug: string): slug is SectionSlug =>
  slug in SECTION_DEFINITIONS;
