"use client";

import { useState } from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import type { SectionItemPhoto } from "@/lib/sectionItems";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

type PageItemGalleryProps = {
  photos: SectionItemPhoto[];
  heading: string;
};

const PageItemGallery = ({ photos, heading }: PageItemGalleryProps) => {
  const [wideMap, setWideMap] = useState<Record<string, boolean>>({});

  if (!photos.length) return null;

  return (
    <section className="site-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="site-kicker">
          Gallery
        </h3>
        <span className="rounded-full border border-[#cdd8df] bg-[#eaf2f8] px-3 py-1 text-[10px] font-semibold text-[#17324a]">
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
              <div className="group w-full overflow-hidden rounded-2xl border border-[#cfdbe3] bg-white shadow-sm">
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
