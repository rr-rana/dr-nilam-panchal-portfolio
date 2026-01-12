"use client";

import Image from "next/image";

type AdminBannerProps = {
  bannerImageUrl: string;
  onSelect: (file: File) => void;
  isUploading: boolean;
};

const AdminBanner = ({
  bannerImageUrl,
  onSelect,
  isUploading,
}: AdminBannerProps) => {
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
        <label className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#17323D] shadow-md">
          {isUploading ? "Uploading banner..." : "Choose banner"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onSelect(file);
            }}
            disabled={isUploading}
          />
        </label>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
            Uploading banner...
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminBanner;
