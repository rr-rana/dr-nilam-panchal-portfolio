import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import type { SocialLinkId } from "@/lib/siteContentTypes";

export type SocialLinkOption = {
  id: SocialLinkId;
  label: string;
  Icon: typeof Linkedin;
  placeholder: string;
};

export const SOCIAL_LINK_OPTIONS: SocialLinkOption[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: Linkedin,
    placeholder: "https://www.linkedin.com/in/username",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    Icon: Twitter,
    placeholder: "https://x.com/username",
  },
  {
    id: "github",
    label: "GitHub",
    Icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    id: "youtube",
    label: "YouTube",
    Icon: Youtube,
    placeholder: "https://www.youtube.com/@channel",
  },
  {
    id: "facebook",
    label: "Facebook",
    Icon: Facebook,
    placeholder: "https://www.facebook.com/username",
  },
  {
    id: "instagram",
    label: "Instagram",
    Icon: Instagram,
    placeholder: "https://www.instagram.com/username",
  },
  {
    id: "website",
    label: "Website",
    Icon: Globe,
    placeholder: "https://example.com",
  },
];
