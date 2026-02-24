"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BannerSlide } from "@/lib/siteContentTypes";

type HomeBannerProps = {
  bannerSlides?: BannerSlide[];
  fallbackImageUrl?: string;
  fallbackTitle?: string;
};

const AUTO_SLIDE_MS = 5000;

const HomeBanner = ({
  bannerSlides,
  fallbackImageUrl,
  fallbackTitle = "Academic Highlights",
}: HomeBannerProps) => {
  const slides =
    Array.isArray(bannerSlides) && bannerSlides.length
      ? bannerSlides
      : fallbackImageUrl
        ? [{ id: "legacy-banner-fallback", imageUrl: fallbackImageUrl, title: fallbackTitle }]
        : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const safeActiveIndex = activeIndex % slides.length;
  const activeSlide = slides[safeActiveIndex];
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

  return (
    <section className="pt-0 lg:pt-0">
      <div className="relative h-[46vh] min-h-[290px] overflow-hidden border-y border-[#d1dde6] bg-black lg:h-[calc(100vh-78px)] lg:min-h-[560px] lg:border-y-0">
        <Image
          src={activeSlide.imageUrl}
          alt={activeSlide.title || "Banner"}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          key={activeSlide.id}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111ccc] via-[#08152266] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#081624b3] via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-6 md:inset-x-8 md:bottom-8 lg:inset-x-12 lg:bottom-12">
          <div className="inline-block max-w-[calc(100vw-3rem)] rounded-2xl border border-white/20 bg-white/12 p-3 backdrop-blur-md md:max-w-[calc(100vw-5rem)] md:p-4 lg:max-w-[70vw]">
            <p className="public-hero-title text-base leading-tight font-bold text-white md:text-xl lg:text-2xl">
              {activeSlide.title}
            </p>
          </div>
        </div>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white/35 bg-black/25 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/40 lg:left-7"
              aria-label="Previous banner"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white/35 bg-black/25 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/40 lg:right-7"
              aria-label="Next banner"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-6 right-5 flex items-center gap-2 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 cursor-pointer rounded-full border border-white/70 transition-all ${
                    index === safeActiveIndex ? "w-9 bg-white" : "w-2.5 bg-white/25"
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HomeBanner;
