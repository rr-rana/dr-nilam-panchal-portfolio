"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminBanner from "@/components/admin/AdminBanner";
import AdminToast from "@/components/admin/AdminToast";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { BannerSlide, SiteContent } from "@/lib/siteContentTypes";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

const createBannerId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `banner-${Date.now()}`;

const normalizeSlides = (content: SiteContent): BannerSlide[] => {
  if (Array.isArray(content.bannerSlides) && content.bannerSlides.length) {
    return content.bannerSlides;
  }
  return [
    {
      id: createBannerId(),
      imageUrl: content.bannerImageUrl || "",
      title: "Academic Highlights",
    },
  ];
};

const AdminBannerManager = () => {
  const { isAuthenticated, isLoading, siteContent, setSiteContent } =
    useAdminSession();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [bannerPreviews, setBannerPreviews] = useState<Record<string, string>>(
    {}
  );
  const [pendingBannerFiles, setPendingBannerFiles] = useState<
    Record<string, File>
  >({});
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadingBannerId, setUploadingBannerId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (siteContent && !content) {
      setContent({ ...siteContent, bannerSlides: normalizeSlides(siteContent) });
    }
  }, [content, siteContent]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => {
      setError("");
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    return () => {
      Object.values(bannerPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [bannerPreviews]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "Upload failed.");
    }
    const payload = await response.json();
    return payload.url as string;
  };

  const withCacheBust = (url: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${Date.now()}`;
  };

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      let nextContent = content;
      const pendingEntries = Object.entries(pendingBannerFiles);
      if (pendingEntries.length) {
        setIsUploadingBanner(true);
        const uploadedById: Record<string, string> = {};
        for (const [id, file] of pendingEntries) {
          setUploadingBannerId(id);
          uploadedById[id] = withCacheBust(await uploadImage(file));
        }
        nextContent = {
          ...nextContent,
          bannerSlides: nextContent.bannerSlides.map((slide) => ({
            ...slide,
            imageUrl: uploadedById[slide.id] || slide.imageUrl,
          })),
        };
      }
      nextContent = {
        ...nextContent,
        bannerImageUrl: nextContent.bannerSlides[0]?.imageUrl || "",
      };

      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to save banners.");
      }

      const saved = (await response.json()) as SiteContent;
      setContent(saved);
      setSiteContent(saved);
      setPendingBannerFiles({});
      Object.values(bannerPreviews).forEach((url) => URL.revokeObjectURL(url));
      setBannerPreviews({});
      setMessage("Banners saved.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to save banners.";
      setError(msg);
    } finally {
      setUploadingBannerId(null);
      setIsUploadingBanner(false);
      setIsSaving(false);
    }
  };

  const handleSelectBanner = (id: string, file: File) => {
    if (!content) return;
    setError("");
    setMessage("Banner updated locally. Click save to upload.");
    const oldPreview = bannerPreviews[id];
    if (oldPreview) {
      URL.revokeObjectURL(oldPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setPendingBannerFiles((prev) => ({ ...prev, [id]: file }));
    setBannerPreviews((prev) => ({ ...prev, [id]: previewUrl }));
    setContent({
      ...content,
      bannerSlides: content.bannerSlides.map((slide) =>
        slide.id === id ? { ...slide, imageUrl: previewUrl } : slide
      ),
    });
  };

  const handleAddBanner = () => {
    if (!content) return;
    const newBanner: BannerSlide = {
      id: createBannerId(),
      imageUrl: "",
      title: "",
    };
    setContent({ ...content, bannerSlides: [...content.bannerSlides, newBanner] });
  };

  const handleRemoveBanner = (id: string) => {
    if (!content || content.bannerSlides.length <= 1) return;
    const previewUrl = bannerPreviews[id];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setBannerPreviews((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setPendingBannerFiles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setContent({
      ...content,
      bannerSlides: content.bannerSlides.filter((slide) => slide.id !== id),
    });
  };

  const handleMoveBanner = (id: string, direction: "up" | "down") => {
    if (!content) return;
    const currentIndex = content.bannerSlides.findIndex(
      (slide) => slide.id === id
    );
    if (currentIndex < 0) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= content.bannerSlides.length) return;
    const nextSlides = [...content.bannerSlides];
    const [moved] = nextSlides.splice(currentIndex, 1);
    nextSlides.splice(targetIndex, 0, moved);
    setContent({ ...content, bannerSlides: nextSlides });
  };

  const handleTitleChange = (id: string, title: string) => {
    if (!content) return;
    setContent({
      ...content,
      bannerSlides: content.bannerSlides.map((slide) =>
        slide.id === id ? { ...slide, title } : slide
      ),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="rounded-3xl border border-white/70 bg-white/90 px-6 py-4 shadow-xl backdrop-blur">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="rounded-3xl border border-white/70 bg-white/90 px-6 py-4 shadow-xl backdrop-blur">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-[#4c5f66]">
        No content loaded.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#17323D]">
              Banner Management
            </h1>
            <p className="text-sm text-[#4c5f66]">
              Manage all homepage slider banners from here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-[#17323D]"
            >
              Back to Admin
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-[#17323D]"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Banners"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-xs text-[#17323D]">
            {error}
          </div>
        )}

        <AdminBanner
          banners={content.bannerSlides}
          onSelect={handleSelectBanner}
          onTitleChange={handleTitleChange}
          onAdd={handleAddBanner}
          onRemove={handleRemoveBanner}
          onMove={handleMoveBanner}
          isUploading={isUploadingBanner}
          uploadingId={uploadingBannerId}
        />
      </div>
      {message && <AdminToast message={message} />}
      {error && <AdminToast message={error} variant="error" />}
    </div>
  );
};

export default AdminBannerManager;
