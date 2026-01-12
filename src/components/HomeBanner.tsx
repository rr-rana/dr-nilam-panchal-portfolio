"use client";

import Image from "next/image";

type HomeBannerProps = {
  bannerImageUrl: string;
};

const HomeBanner = ({ bannerImageUrl }: HomeBannerProps) => {
  return (
    <section className="pt-6">
      <div className="relative h-56 overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-2xl md:h-72">
        <Image
          src={bannerImageUrl}
          alt="Research group"
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
          priority
          key={bannerImageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>
    </section>
  );
};

export default HomeBanner;
