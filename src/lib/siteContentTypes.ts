export type SocialLinkId =
  | "linkedin"
  | "twitter"
  | "github"
  | "youtube"
  | "facebook"
  | "instagram"
  | "website";

export type SiteContent = {
  bannerImageUrl: string;
  profileImageUrl: string;
  videoUrl: string;
  mainHtml: string;
  sidebarName: string;
  sidebarTitle: string;
  sidebarLocation: string;
  sidebarEmail: string;
  sidebarBlurb: string;
  sidebarFooter: string;
  socialLinks: Partial<Record<SocialLinkId, string>>;
};
