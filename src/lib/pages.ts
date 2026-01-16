export type PageSlug =
  | "research-publications"
  | "projects"
  | "achievements"
  | "testimonials"
  | "publications"
  | "awards"
  | "grants"
  | "media"
  | "teaching"
  | "supervision"
  | "peer-reviews"
  | "editorial"
  | "conference"
  | "committee"
  | "news"
  | "cv"
  | "contact"
  | "privacy";

export type PageLink = {
  slug: PageSlug;
  label: string;
};

export const PRIMARY_PAGES: PageLink[] = [
  { slug: "research-publications", label: "Research & Publications" },
  { slug: "projects", label: "Projects" },
  { slug: "achievements", label: "Achievements" },
  { slug: "testimonials", label: "Testimonials" },
  { slug: "publications", label: "Publications" },
  { slug: "awards", label: "Awards" },
  { slug: "grants", label: "Grants" },
  { slug: "media", label: "Media" },
];

export const MORE_PAGES: PageLink[] = [
  { slug: "teaching", label: "Teaching" },
  { slug: "supervision", label: "Supervision" },
  { slug: "peer-reviews", label: "Peer-Reviews" },
  { slug: "editorial", label: "Editorial Roles" },
  { slug: "conference", label: "Conference Contributions" },
  { slug: "committee", label: "Committee and Board Duties" },
  { slug: "news", label: "News" },
  { slug: "cv", label: "CV" },
  { slug: "contact", label: "Contact" },
];

export const ALL_PAGES: PageLink[] = [...PRIMARY_PAGES, ...MORE_PAGES];
