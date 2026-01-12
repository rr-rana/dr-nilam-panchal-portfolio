"use client";

import Image from "next/image";
import { BookOpen, CalendarCheck, Mail, MapPin, Medal } from "lucide-react";
import type { SiteContent } from "@/lib/siteContentTypes";
import { SOCIAL_LINK_OPTIONS } from "@/lib/socialLinks";

type HomeSidebarProps = {
  content: SiteContent;
  variant?: "default" | "compact";
};

const HomeSidebar = ({ content, variant = "default" }: HomeSidebarProps) => {
  const isCompact = variant === "compact";
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xl backdrop-blur">
        <div
          className={`relative flex justify-center ${
            isCompact ? "mt-0" : "-mt-28"
          }`}
        >
          <Image
            src={content.profileImageUrl}
            alt="Profile portrait"
            className={`rounded-2xl border-4 border-white object-cover shadow-lg ${
              isCompact ? "h-36 w-36" : "h-44 w-44"
            }`}
            width={176}
            height={176}
            key={content.profileImageUrl}
          />
        </div>
        <h2 className={`${isCompact ? "mt-4" : "mt-4"} text-xl font-semibold text-[#17323D]`}>
          {content.sidebarName}
        </h2>
        {content.sidebarTitle && (
          <p className="mt-1 text-sm text-[#5a6b73]">{content.sidebarTitle}</p>
        )}
        {(content.sidebarLocation || content.sidebarEmail) && (
          <div className="mt-4 space-y-2 text-sm text-[#2d3b41]">
            {content.sidebarLocation && (
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-[#7A4C2C]" />
                {content.sidebarLocation}
              </p>
            )}
            {content.sidebarEmail && (
              <a
                className="flex items-center gap-2 hover:text-[#7A4C2C]"
                href={`mailto:${content.sidebarEmail}`}
              >
                <Mail size={16} className="text-[#7A4C2C]" />
                {content.sidebarEmail}
              </a>
            )}
          </div>
        )}
        {content.sidebarBlurb && (
          <div className="mt-5 rounded-xl bg-[#f8f1e3] p-4 text-xs text-[#6b4a33]">
            {content.sidebarBlurb}
          </div>
        )}
      </div>

      <div className="hidden lg:block rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg backdrop-blur">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
          Quick Links
        </h3>
        <div className="mt-4 space-y-3 text-sm text-[#1f2f36]">
          <a className="flex items-center gap-2 hover:text-[#7A4C2C]" href="/publications">
            <BookOpen size={16} />
            Publications
          </a>
          <a className="flex items-center gap-2 hover:text-[#7A4C2C]" href="/awards">
            <Medal size={16} />
            Awards & Grants
          </a>
          <a className="flex items-center gap-2 hover:text-[#7A4C2C]" href="/teaching">
            <CalendarCheck size={16} />
            Talks & Teaching
          </a>
        </div>
      </div>

      {content.sidebarFooter && (
        <div className="rounded-2xl border border-white/80 bg-[#17323D] p-5 text-white shadow-lg">
          <p className="text-sm leading-relaxed text-white/90">
            {content.sidebarFooter}
          </p>
        </div>
      )}

      <div className="hidden lg:block rounded-2xl border border-white/80 bg-white/80 p-5 shadow-lg backdrop-blur">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
          Social Links
        </h3>
        <div className="mt-4 space-y-2 text-sm text-[#1f2f36]">
          {SOCIAL_LINK_OPTIONS.map(({ id, label, Icon }) => {
            const url = content.socialLinks?.[id];
            if (!url) return null;
            return (
              <a
                key={id}
                className="flex items-center gap-3 hover:text-[#7A4C2C]"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[#17323D]">
                  <Icon size={14} />
                </span>
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default HomeSidebar;
