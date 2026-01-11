"use client";

import dynamic from "next/dynamic";
import type { SiteContent } from "@/lib/siteContent";
import RichTextEditor from "@/components/admin/RichTextEditor";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
});

type AdminMainContentProps = {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
};

const AdminMainContent = ({ content, onChange }: AdminMainContentProps) => {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
          Intro Video URL
        </label>
        <input
          type="text"
          value={content.videoUrl}
          onChange={(event) =>
            onChange({ ...content, videoUrl: event.target.value })
          }
          className="mt-2 w-full rounded-full border border-white/70 bg-white/90 px-4 py-2 text-sm text-[#2d3b41] outline-none"
        />
        <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-white/80 bg-black/90">
          <ReactPlayer
            url={content.videoUrl}
            width="100%"
            height="100%"
            controls
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
          Page Content
        </label>
        <div className="mt-3">
          <RichTextEditor
            value={content.mainHtml}
            onChange={(value) => onChange({ ...content, mainHtml: value })}
          />
        </div>
      </section>
    </main>
  );
};

export default AdminMainContent;
