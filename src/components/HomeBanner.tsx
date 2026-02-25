"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
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
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (!isFullscreenOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreenOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreenOpen]);

  if (!slides.length) return null;

  const safeActiveIndex = activeIndex % slides.length;
  const activeSlide = slides[safeActiveIndex];
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

  return (
    <section className="pt-6">
      <div className="relative h-56 overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-2xl md:h-72">
        <Image
          src={activeSlide.imageUrl}
          alt={activeSlide.title || "Banner"}
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
          priority
          key={activeSlide.id}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent" />
        <button
          type="button"
          onClick={() => setIsFullscreenOpen(true)}
          className="absolute left-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label="Open fullscreen banner"
        >
          <Expand size={18} />
        </button>
        <div className="absolute top-4 right-4 rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
          {activeSlide.title}
        </div>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/35 p-2 text-white backdrop-blur-sm"
              aria-label="Previous banner"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/35 p-2 text-white backdrop-blur-sm"
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
                  className={`h-2.5 w-2.5 cursor-pointer rounded-full border border-white/70 ${
                    index === safeActiveIndex ? "bg-white" : "bg-white/30"
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {isFullscreenOpen && (
        <div className="fixed inset-0 z-[120] bg-black/95">
          <Image
            src={activeSlide.imageUrl}
            alt={activeSlide.title || "Banner"}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/40" />

          <button
            type="button"
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute right-5 top-5 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
            aria-label="Close fullscreen banner"
          >
            <X size={20} />
          </button>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-5 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition hover:bg-black/70"
                aria-label="Previous banner"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-5 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition hover:bg-black/70"
                aria-label="Next banner"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
                {slides.map((slide, index) => (
                  <button
                    key={`fullscreen-${slide.id}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-3 w-3 cursor-pointer rounded-full border border-white/80 ${
                      index === safeActiveIndex ? "bg-white" : "bg-white/35"
                    }`}
                    aria-label={`Go to banner ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-xl bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            {activeSlide.title}
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeBanner;
