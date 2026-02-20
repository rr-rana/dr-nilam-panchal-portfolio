"use client";

import Image from "next/image";
import {
  BookOpen,
  CalendarCheck,
  FileText,
  Mail,
  MapPin,
  Medal,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/lib/siteContentTypes";
import { SOCIAL_LINK_OPTIONS } from "@/lib/socialLinks";
import Link from "next/link";

type HomeSidebarProps = {
  content: SiteContent;
  variant?: "default" | "compact";
};

const HomeSidebar = ({ content, variant = "default" }: HomeSidebarProps) => {
  const isCompact = variant === "compact";
  const pathname = usePathname();
  const effectivePathname = pathname || "";
  const isActive = (href: string) =>
    effectivePathname === href ||
    effectivePathname?.startsWith(`${href}/`);
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="site-panel p-5">
        <div
          className={`relative flex justify-center ${isCompact ? "mt-0" : "mt-4"}`}
        >
          <Image
            src={content.profileImageUrl}
            alt="Profile portrait"
            className={`rounded-full border-4 border-white object-cover shadow-lg ${isCompact ? "h-36 w-36" : "h-40 w-40"}`}
            width={176}
            height={176}
            key={content.profileImageUrl}
          />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#17324a]">
          {content.sidebarName}
        </h2>
        {content.sidebarTitle && (
          <p className="mt-1 text-sm text-[#516171]">{content.sidebarTitle}</p>
        )}
        {(content.sidebarLocation || content.sidebarEmail) && (
          <div className="mt-4 space-y-2 text-sm text-[#2d3b41]">
            {content.sidebarLocation && (
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-[#31567a]" />
                {content.sidebarLocation}
              </p>
            )}
            {content.sidebarEmail && (
              <a
                className="flex items-center gap-2 hover:text-[#1b3b5a]"
                href={`mailto:${content.sidebarEmail}`}
              >
                <Mail size={16} className="text-[#31567a]" />
                {content.sidebarEmail}
              </a>
            )}
          </div>
        )}
        {content.sidebarBlurb && (
          <div className="mt-5 rounded-xl border border-[#d4deea] bg-[#f4f8fd] p-4 text-xs text-[#4c5f73]">
            {content.sidebarBlurb}
          </div>
        )}
        {content.sidebarCvUrl && (
          <div className="mt-4 flex justify-center">
            <a
              href={content.sidebarCvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#c8d8ea] bg-[#dce8f8] px-4 py-2 text-xs font-semibold text-[#17324a]"
            >
              <FileText size={14} />
              Curriculum Vitae
            </a>
          </div>
        )}
      </div>

      <div className="hidden lg:block site-panel p-5">
        <h3 className="site-kicker">
          Quick Links
        </h3>
        <div className="mt-4 space-y-3 text-sm text-[#23384c]">
          <Link
            className={`flex items-center gap-2 transition-colors ${isActive("/research-publications")
                ? "font-semibold text-[#17324a]"
                : "hover:text-[#1b3b5a]"
              }`}
            href="/research-publications"
          >
            <BookOpen size={16} />
            Research & Publications
          </Link>
          <Link
            className={`flex items-center gap-2 transition-colors ${isActive("/achievements-awards")
                ? "font-semibold text-[#17324a]"
                : "hover:text-[#1b3b5a]"
              }`}
            href="/achievements-awards"
          >
            <Medal size={16} />
            Achievements & Awards
          </Link>
          <Link
            className={`flex items-center gap-2 transition-colors ${isActive("/teaching-training")
                ? "font-semibold text-[#17324a]"
                : "hover:text-[#1b3b5a]"
              }`}
            href="/teaching-training"
          >
            <CalendarCheck size={16} />
            Teaching & Training
          </Link>
        </div>
      </div>

      {content.sidebarFooter && (
        <div className="rounded-2xl border border-[#c8d8ea] bg-[#dce8f8] p-5 text-[#17324a] shadow-lg">
          <p className="text-sm leading-relaxed text-[#2f4d69]">
            {content.sidebarFooter}
          </p>
        </div>
      )}

      <div className="hidden lg:block site-panel p-5">
        <h3 className="site-kicker">
          Social Links
        </h3>
        <div className="mt-4 space-y-2 text-sm text-[#23384c]">
          {SOCIAL_LINK_OPTIONS.map(({ id, label, Icon }) => {
            const url = content.socialLinks?.[id];
            if (!url) return null;

            const finalUrl = url.startsWith("http") ? url : `https://${url}`;

            return (
              <Link
                key={id}
                className="flex items-center gap-3 hover:text-[#1b3b5a]"
                href={finalUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e7eff8] text-[#17324a]">
                  <Icon size={14} />
                </span>
                {label}
              </Link>
            );
          })}

        </div>
      </div>
    </aside>
  );
};

export default HomeSidebar;
