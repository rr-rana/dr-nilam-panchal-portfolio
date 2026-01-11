"use client";

import dynamic from "next/dynamic";
import type { SiteContent } from "@/lib/siteContent";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
});

type HomeMainContentProps = {
  content: SiteContent;
};

const HomeMainContent = ({ content }: HomeMainContentProps) => {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
        <div className="aspect-video overflow-hidden rounded-2xl border border-white/80 bg-black/90">
          <ReactPlayer
            url={content.videoUrl}
            width="100%"
            height="100%"
            controls
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
        <div
          className="space-y-4 text-sm leading-relaxed text-[#4c5f66] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-[#17323D]"
          dangerouslySetInnerHTML={{ __html: content.mainHtml }}
        />
      </section>
    </main>
  );
};

export default HomeMainContent;
