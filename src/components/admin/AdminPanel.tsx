"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMainContent from "@/components/admin/AdminMainContent";
import AdminToast from "@/components/admin/AdminToast";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { SiteContent } from "@/lib/siteContentTypes";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

const AdminPanel = () => {
  const { isAuthenticated, isLoading, siteContent, setSiteContent } =
    useAdminSession();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (siteContent && !content) {
      setContent(siteContent);
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

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to save content.");
      }

      const saved = (await response.json()) as SiteContent;
      setContent(saved);
      setSiteContent(saved);
      setMessage("Changes saved.");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to save content.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
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

  const firstBanner = content.bannerSlides?.[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between pt-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#17323D]">Admin</h1>
            <p className="text-sm text-[#4c5f66]">
              Edit homepage content. Manage slider banners from a separate page.
            </p>
          </div>
          <div className="flex items-center gap-3">
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
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-xs text-[#17323D]">
            {error}
          </div>
        )}

        <section className="mt-6 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                Banner
              </h2>
              <p className="mt-1 text-sm text-[#4c5f66]">
                Primary banner preview shown on homepage.
              </p>
            </div>
            <Link
              href="/admin/banners"
              className="rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white"
            >
              Manage All Banners
            </Link>
          </div>
          {firstBanner?.imageUrl && (
            <div className="relative mt-4 h-56 overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-2xl md:h-72">
              <Image
                src={firstBanner.imageUrl}
                alt={firstBanner.title || "Banner"}
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent" />
              <div className="absolute top-4 right-4 rounded-xl bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {firstBanner.title || "Untitled banner"}
              </div>
            </div>
          )}
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <AdminSidebar content={content} showEditButton />
          <AdminMainContent content={content} onChange={setContent} />
        </div>
      </div>
      {message && <AdminToast message={message} />}
      {error && <AdminToast message={error} variant="error" />}
    </div>
  );
};

export default AdminPanel;
