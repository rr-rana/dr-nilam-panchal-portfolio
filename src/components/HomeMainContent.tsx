"use client";

import dynamic from "next/dynamic";
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
      <section className="site-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="site-kicker">Featured Lecture</h2>
        </div>
        <div className="aspect-video overflow-hidden rounded-2xl border border-[#c7d6df] bg-[#163645]">
          <ReactPlayer
            url={content.videoUrl}
            width="100%"
            height="100%"
            controls
          />
        </div>
      </section>

      <section className="site-panel p-6">
        <h2 className="site-kicker">Academic Profile</h2>
        <div
          className="mt-4 space-y-4 text-sm leading-relaxed text-[#415261] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-[#17324a]"
          dangerouslySetInnerHTML={{ __html: content.mainHtml }}
        />
      </section>
    </main>
  );
};

export default HomeMainContent;
