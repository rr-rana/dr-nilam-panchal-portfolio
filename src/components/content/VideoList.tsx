"use client";

import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

type VideoListProps = {
  videoLinks: string[];
};

const VideoList = ({ videoLinks }: VideoListProps) => {
  if (!videoLinks.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
        Videos
      </h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {videoLinks.map((link) => (
          <div
            key={link}
            className="aspect-video overflow-hidden rounded-2xl border border-white/80 bg-black/90"
          >
            <ReactPlayer url={link} width="100%" height="100%" controls />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
