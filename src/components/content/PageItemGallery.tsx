"use client";

import { useState } from "react";
import Image from "next/image";
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
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

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
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <a
              key={photo.url}
              href={photo.url}
              data-lg-item
              className="block w-full"
            >
              <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#e6dccb] bg-white shadow-sm">
                {!loadedMap[photo.url] && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#f1eee8] via-[#ece6db] to-[#f1eee8]"
                  />
                )}
                <Image
                  src={photo.url}
                  alt={photo.alt || heading}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  onLoad={() =>
                    setLoadedMap((prev) =>
                      prev[photo.url] ? prev : { ...prev, [photo.url]: true }
                    )
                  }
                  className="rounded-2xl object-cover transition duration-300 group-hover:scale-[1.01]"
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
