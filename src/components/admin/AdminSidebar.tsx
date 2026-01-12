"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CalendarCheck,
  Mail,
  MapPin,
  Medal,
  PencilLine,
} from "lucide-react";
import type { SiteContent } from "@/lib/siteContentTypes";
import { SOCIAL_LINK_OPTIONS } from "@/lib/socialLinks";

type AdminSidebarProps = {
  content: SiteContent;
  showEditButton?: boolean;
  variant?: "default" | "compact";
};

const AdminSidebar = ({
  content,
  showEditButton,
  variant = "default",
}: AdminSidebarProps) => {
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
        {showEditButton && (
          <div className="mt-4 flex justify-center">
            <Link
              href="/admin/sidebar"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-gradient-to-r from-[#17323D] via-[#1f3b46] to-[#17323D] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F6F1E7] shadow-md shadow-[#17323D]/20 transition-transform duration-150 hover:-translate-y-0.5"
            >
              <PencilLine size={12} />
              Edit Sidebar
            </Link>
          </div>
        )}
        <h2 className="mt-3 text-xl font-semibold text-[#17323D]">
          {content.sidebarName}
        </h2>
        {content.sidebarTitle && (
          <p className="mt-1 text-sm text-[#5a6b73]">
            {content.sidebarTitle}
          </p>
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
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-[#7A4C2C]" />
                {content.sidebarEmail}
              </p>
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
          <span className="flex items-center gap-2">
            <BookOpen size={16} />
            Publications
          </span>
          <span className="flex items-center gap-2">
            <Medal size={16} />
            Awards & Grants
          </span>
          <span className="flex items-center gap-2">
            <CalendarCheck size={16} />
            Talks & Teaching
          </span>
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
              <span key={id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[#17323D]">
                  <Icon size={14} />
                </span>
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
