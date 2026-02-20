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
    <section className="pt-6">
      <div className="relative h-56 overflow-hidden rounded-[1.4rem] border border-[#d4deea] bg-white shadow-xl md:h-80">
        <Image
          src={activeSlide.imageUrl}
          alt={activeSlide.title || "Banner"}
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
          priority
          key={activeSlide.id}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10273c]/65 via-[#10273c]/30 to-transparent" />
        <div className="absolute bottom-5 left-5 rounded-xl bg-white/85 px-4 py-2 text-sm font-semibold text-[#17324a] backdrop-blur-sm">
          {activeSlide.title}
        </div>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/80 p-2 text-[#17324a] backdrop-blur-sm"
              aria-label="Previous banner"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/80 p-2 text-[#17324a] backdrop-blur-sm"
              aria-label="Next banner"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full border border-white/80 ${
                    index === safeActiveIndex ? "bg-[#17324a]" : "bg-white/40"
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
