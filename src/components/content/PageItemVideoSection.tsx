"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const normalizeLink = (rawLink: string) => {
  const trimmed = rawLink.trim();
  if (!trimmed) return "";

  const withProtocol = /^[a-z]+:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^\/+/, "")}`;

  const shortsMatch = withProtocol.match(/youtube\.com\/shorts\/([^?&/]+)/i);
  if (shortsMatch) {
    return `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
  }

  return withProtocol;
};

const normalizeLinks = (videoLinks: string[]) =>
  videoLinks.map(normalizeLink).filter(Boolean);

type PageItemVideoSectionProps = {
  videoLinks: string[];
};

const PageItemVideoSection = ({
  videoLinks,
}: PageItemVideoSectionProps) => {
  const normalized = useMemo(
    () => normalizeLinks(videoLinks),
    [videoLinks]
  );
  if (!normalized.length) return null;

  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
        Videos
      </h3>
      <div className="mt-4 space-y-4">
        {normalized.length === 1 && (
          <div className="flex justify-center">
            <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-white/80 bg-black/90">
              <ReactPlayer
                url={normalized[0]}
                width="100%"
                height="100%"
                controls
              />
            </div>
          </div>
        )}
        {normalized.length === 2 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {normalized.map((link) => (
              <div
                key={link}
                className="aspect-video overflow-hidden rounded-2xl border border-white/80 bg-black/90"
              >
                <ReactPlayer url={link} width="100%" height="100%" controls />
              </div>
            ))}
          </div>
        )}
        {normalized.length >= 3 && (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {normalized.slice(0, 2).map((link) => (
                <div
                  key={link}
                  className="aspect-video overflow-hidden rounded-2xl border border-white/80 bg-black/90"
                >
                  <ReactPlayer
                    url={link}
                    width="100%"
                    height="100%"
                    controls
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-white/80 bg-black/90">
                <ReactPlayer
                  url={normalized[2]}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            </div>
            {normalized.length > 3 && (
              <div className="grid gap-4 lg:grid-cols-3">
                {normalized.slice(3).map((link) => (
                  <div
                    key={link}
                    className="aspect-video overflow-hidden rounded-2xl border border-white/80 bg-black/90"
                  >
                    <ReactPlayer
                      url={link}
                      width="100%"
                      height="100%"
                      controls
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageItemVideoSection;
