export type SocialLinkId =
  | "linkedin"
  | "twitter"
  | "github"
  | "youtube"
  | "facebook"
  | "instagram"
  | "website"
  | "vidwan"
  | "googleScholar"
  | "orcid";

export type BannerSlide = {
  id: string;
  imageUrl: string;
  title: string;
};

export type SiteContent = {
  bannerImageUrl?: string;
  bannerSlides: BannerSlide[];
  profileImageUrl: string;
  videoUrl: string;
  mainHtml: string;
  sidebarName: string;
  sidebarTitle: string;
  sidebarLocation: string;
  sidebarEmail: string;
  sidebarBlurb: string;
  sidebarFooter: string;
  sidebarCvUrl?: string;
  socialLinks: Partial<Record<SocialLinkId, string>>;
};
