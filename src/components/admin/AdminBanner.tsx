"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { BannerSlide } from "@/lib/siteContentTypes";

type AdminBannerProps = {
  banners: BannerSlide[];
  onSelect: (id: string, file: File) => void;
  onTitleChange: (id: string, title: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  isUploading: boolean;
  uploadingId: string | null;
};

const AdminBanner = ({
  banners,
  onSelect,
  onTitleChange,
  onAdd,
  onRemove,
  onMove,
  isUploading,
  uploadingId,
}: AdminBannerProps) => {
  return (
    <section className="pt-6 space-y-5">
      <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-lg backdrop-blur sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7A4C2C]">
              Banner Slider
            </h2>
            <p className="mt-1 text-xs text-[#5f6c72]">
              Manage homepage slides, titles, and image order.
            </p>
          </div>
          <div className="inline-flex items-center gap-3">
            <span className="rounded-full border border-[#17323D]/20 bg-[#17323D]/5 px-3 py-1 text-xs font-semibold text-[#17323D]">
              {banners.length} slide{banners.length > 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#0f2630]"
            >
              <Plus size={14} />
              Add Banner
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="overflow-hidden rounded-3xl border border-white/70 bg-white/92 shadow-xl backdrop-blur"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#e8dfd1] bg-[#f8f3ea] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#17323D] px-2 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                    Slide {index + 1}
                  </p>
                  <p className="text-xs text-[#5f6c72]">
                    {banner.title?.trim() || "Untitled slide"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onMove(banner.id, "up")}
                  disabled={index === 0}
                  className="cursor-pointer rounded-full border border-[#d5c9b8] bg-white p-2 text-[#17323D] shadow-sm transition-colors hover:bg-[#f7efe2] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Move banner up"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(banner.id, "down")}
                  disabled={index === banners.length - 1}
                  className="cursor-pointer rounded-full border border-[#d5c9b8] bg-white p-2 text-[#17323D] shadow-sm transition-colors hover:bg-[#f7efe2] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Move banner down"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(banner.id)}
                  disabled={banners.length === 1}
                  className="cursor-pointer rounded-full border border-[#e4c2bf] bg-white p-2 text-[#8d2f25] shadow-sm transition-colors hover:bg-[#fff2f0] disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Remove banner"
                  title="Delete slide"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <div className="relative h-56 overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-2xl md:h-72">
                {banner.imageUrl ? (
                  <>
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title || `Banner ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 960px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                      {banner.title || "Untitled banner"}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f3ebdd]">
                    <span className="rounded-full border border-[#d8ccb9] bg-white px-3 py-1 text-xs font-semibold text-[#7A4C2C]">
                      No image selected
                    </span>
                  </div>
                )}
                {(isUploading && uploadingId === banner.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white">
                    Uploading image...
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#e8dfd1] bg-[#fcfaf6] p-3">
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A4C2C]">
                    Slide Title
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(event) =>
                        onTitleChange(banner.id, event.target.value)
                      }
                      placeholder="Banner title"
                      className="mt-1.5 w-full rounded-xl border border-[#d8ccb9] bg-white px-3.5 py-2 text-sm font-medium normal-case tracking-normal text-[#2d3b41] outline-none transition-colors focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                    />
                  </label>

                  <label className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-[#d5c9b8] bg-white px-4 text-xs font-semibold text-[#17323D] shadow-sm transition-colors hover:bg-[#f8f1e3] md:w-[160px]">
                    {(isUploading && uploadingId === banner.id)
                      ? "Uploading..."
                      : banner.imageUrl
                        ? "Replace Image"
                        : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) onSelect(banner.id, file);
                      }}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-[#5f6c72]">
                  Recommended: landscape image, 1600x600 or larger.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminBanner;
