export type PageSlug =
  | "research-publications"
  | "moocs-e-content"
  | "events-engagements"
  | "teaching-training"
  | "seminar-conferences"
  | "invited-lectures"
  | "achievements-awards"
  | "administrative"
  | "others"
  | "cv"
  | "contact"
  | "privacy";

export type PageLink = {
  slug: PageSlug;
  label: string;
};

export const PRIMARY_PAGES: PageLink[] = [
  { slug: "research-publications", label: "Research & Publications" },
  { slug: "moocs-e-content", label: "MOOCs and E-Content" },
  { slug: "events-engagements", label: "Events & Engagements" },
  { slug: "teaching-training", label: "Teaching & Training" },
];

export const MORE_PAGES: PageLink[] = [
  { slug: "seminar-conferences", label: "Seminar & Conferences" },
  { slug: "invited-lectures", label: "Invited Lectures" },
  { slug: "achievements-awards", label: "Achievements & Awards" },
  { slug: "administrative", label: "Administrative" },
  { slug: "others", label: "Others" },
];

export const ALL_PAGES: PageLink[] = [...PRIMARY_PAGES, ...MORE_PAGES];
