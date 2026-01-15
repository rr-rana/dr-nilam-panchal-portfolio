"use client";

import { useState } from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import type { PageItemPhoto } from "@/lib/pageItems";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

type PageItemGalleryProps = {
  photos: PageItemPhoto[];
  heading: string;
};

const PageItemGallery = ({ photos, heading }: PageItemGalleryProps) => {
  const [wideMap, setWideMap] = useState<Record<string, boolean>>({});

  if (!photos.length) return null;

  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
          Gallery
        </h3>
        <span className="rounded-full border border-white/80 bg-[#f7f4ee] px-3 py-1 text-[10px] font-semibold text-[#17323D]">
          {photos.length} Photos
        </span>
      </div>
      <LightGallery
        plugins={[lgThumbnail, lgZoom]}
        speed={300}
        download={false}
        selector="a[data-lg-item]"
      >
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo) => (
            <a
              key={photo.url}
              href={photo.url}
              data-lg-item
              className={`w-full ${
                wideMap[photo.url]
                  ? "sm:col-span-2 xl:col-span-2"
                  : "col-span-1"
              }`}
            >
              <div className="group w-full overflow-hidden rounded-2xl border border-[#e6dccb] bg-white shadow-sm">
                <img
                  src={photo.url}
                  alt={photo.alt || heading}
                  loading="lazy"
                  onLoad={(event) => {
                    const target = event.currentTarget;
                    const isWide =
                      target.naturalWidth / target.naturalHeight >= 1.35;
                    setWideMap((prev) =>
                      prev[photo.url] === isWide
                        ? prev
                        : { ...prev, [photo.url]: isWide }
                    );
                  }}
                  className="h-auto w-full rounded-2xl object-contain transition duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </a>
          ))}
        </div>
      </LightGallery>
    </section>
  );
};

export default PageItemGallery;
