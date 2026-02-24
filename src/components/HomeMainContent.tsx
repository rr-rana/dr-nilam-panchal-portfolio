"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Mail, MapPin, Sparkles, FileText } from "lucide-react";
import type { SiteContent } from "@/lib/siteContentTypes";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
});

type HomeMainContentProps = {
  content: SiteContent;
};

const HomeMainContent = ({ content }: HomeMainContentProps) => {
  return (
    <main className="space-y-8">
      <section className="border-b border-[#cfdbe3] pb-7">
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <div className="space-y-4 text-center">
              <Image
                src={content.profileImageUrl}
                alt="Profile portrait"
                className="mx-auto h-36 w-36 rounded-2xl object-cover shadow-lg shadow-[#183244]/20"
                width={144}
                height={144}
                key={content.profileImageUrl}
              />
              <h2 className="public-hero-title text-[1.7rem] leading-tight font-bold text-[#163042]">
                {content.sidebarName}
              </h2>
              {content.sidebarTitle && (
                <p className="text-[15px] leading-relaxed text-[#4a5d6b]">
                  {content.sidebarTitle}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-[#304352]">
              {content.sidebarLocation && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d4e1e9] bg-[#f7fbfd] px-3 py-1.5">
                  <MapPin size={14} className="text-[#b86d3a]" />
                  {content.sidebarLocation}
                </span>
              )}
              {content.sidebarEmail && (
                <a
                  href={`mailto:${content.sidebarEmail}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d4e1e9] bg-[#f7fbfd] px-3 py-1.5 transition-colors hover:bg-[#eef4f8]"
                >
                  <Mail size={14} className="text-[#b86d3a]" />
                  {content.sidebarEmail}
                </a>
              )}
            </div>
            {content.sidebarBlurb && (
              <div className="border-l-2 border-[#f0bf96] pl-3 text-sm leading-relaxed text-[#724124]">
                {content.sidebarBlurb}
              </div>
            )}
            {content.sidebarCvUrl && (
              <div>
                <a
                  href={content.sidebarCvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#163042] px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  <FileText size={14} />
                  Curriculum Vitae
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6e3eb] bg-[#eef5f8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#2f5269]">
              <Sparkles size={14} />
              Featured Introduction
            </div>
            <div className="aspect-video overflow-hidden rounded-[1.2rem] border border-[#cddae3] bg-[#0a141d] shadow-inner">
              <ReactPlayer
                url={content.videoUrl}
                width="100%"
                height="100%"
                controls
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-1">
        <div
          className="public-prose text-base"
          dangerouslySetInnerHTML={{ __html: content.mainHtml }}
        />
      </section>
    </main>
  );
};

export default HomeMainContent;
