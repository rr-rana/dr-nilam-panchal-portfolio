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
  const pathname = usePathname() || "";
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="site-panel p-5">
        <div className="flex justify-center">
          <Image
            src={content.profileImageUrl}
            alt="Profile portrait"
            className={`${isCompact ? "h-28 w-28" : "h-32 w-32"} rounded-full border-4 border-white object-cover shadow-lg`}
            width={176}
            height={176}
            key={content.profileImageUrl}
          />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#183247]">{content.sidebarName}</h2>
        {content.sidebarTitle && (
          <p className="mt-1 text-sm text-[#566574]">{content.sidebarTitle}</p>
        )}
        {(content.sidebarLocation || content.sidebarEmail) && (
          <div className="mt-4 space-y-2 text-sm text-[#2f4252]">
            {content.sidebarLocation && (
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-[#0f766e]" />
                {content.sidebarLocation}
              </p>
            )}
            {content.sidebarEmail && (
              <a className="flex items-center gap-2 hover:text-[#0f5c58]" href={`mailto:${content.sidebarEmail}`}>
                <Mail size={16} className="text-[#0f766e]" />
                {content.sidebarEmail}
              </a>
            )}
          </div>
        )}
        {content.sidebarBlurb && (
          <div className="mt-4 rounded-xl border border-[#cfdbe3] bg-[#f5f8fb] p-3 text-xs text-[#516273]">
            {content.sidebarBlurb}
          </div>
        )}
        {content.sidebarCvUrl && (
          <div className="mt-4">
            <a
              href={content.sidebarCvUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0f766e] px-4 py-2 text-xs font-semibold text-white"
            >
              <FileText size={14} />
              Curriculum Vitae
            </a>
          </div>
        )}
      </div>

      <div className="hidden lg:block site-panel p-5">
        <h3 className="site-kicker">Quick Links</h3>
        <div className="mt-4 space-y-3 text-sm text-[#22384c]">
          <Link className={`flex items-center gap-2 ${isActive("/research-publications") ? "font-semibold text-[#0f5c58]" : "hover:text-[#0f5c58]"}`} href="/research-publications">
            <BookOpen size={16} />
            Research & Publications
          </Link>
          <Link className={`flex items-center gap-2 ${isActive("/achievements-awards") ? "font-semibold text-[#0f5c58]" : "hover:text-[#0f5c58]"}`} href="/achievements-awards">
            <Medal size={16} />
            Achievements & Awards
          </Link>
          <Link className={`flex items-center gap-2 ${isActive("/teaching-training") ? "font-semibold text-[#0f5c58]" : "hover:text-[#0f5c58]"}`} href="/teaching-training">
            <CalendarCheck size={16} />
            Teaching & Training
          </Link>
        </div>
      </div>

      {content.sidebarFooter && (
        <div className="rounded-2xl border border-[#a8cbc8] bg-[#dcf0ee] p-5 shadow-lg">
          <p className="text-sm leading-relaxed text-[#204a56]">{content.sidebarFooter}</p>
        </div>
      )}

      <div className="hidden lg:block site-panel p-5">
        <h3 className="site-kicker">Social Links</h3>
        <div className="mt-4 space-y-2 text-sm text-[#23384c]">
          {SOCIAL_LINK_OPTIONS.map(({ id, label, Icon }) => {
            const url = content.socialLinks?.[id];
            if (!url) return null;
            const finalUrl = url.startsWith("http") ? url : `https://${url}`;
            return (
              <Link key={id} className="flex items-center gap-3 hover:text-[#0f5c58]" href={finalUrl} target="_blank" rel="noreferrer">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dcf0ee] text-[#0f5c58]">
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
