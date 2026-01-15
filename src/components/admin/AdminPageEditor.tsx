"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SiteContent } from "@/lib/siteContentTypes";
import type { PageContent } from "@/lib/pageContent";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import AdminToast from "@/components/admin/AdminToast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

type AdminPageEditorProps = {
  slug: string;
  title: string;
};

const AdminPageEditor = ({ slug, title }: AdminPageEditorProps) => {
  const {
    isAuthenticated,
    isLoading,
    siteContent,
    pageContentBySlug,
    pageContentLoadingBySlug,
    refreshPageContent,
    setPageContentForSlug,
  } = useAdminSession();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const cachedPageContent = pageContentBySlug[slug];
  const isPageLoading = pageContentLoadingBySlug[slug] ?? false;

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!cachedPageContent) {
      refreshPageContent(slug, { showLoader: true }).catch(() => {
        setError("Failed to load content.");
      });
    }
  }, [slug, isAuthenticated, cachedPageContent, refreshPageContent]);

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
    if (cachedPageContent) {
      setPageContent(cachedPageContent);
      return;
    }
    setPageContent(null);
  }, [slug, cachedPageContent]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const handleSave = async () => {
    if (!pageContent) return;
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: pageContent.html }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to save content.");
      }

      const saved = (await response.json()) as PageContent;
      setPageContent(saved);
      setPageContentForSlug(slug, saved);
      setMessage("Changes saved.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save content.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const showLoader = isLoading;

  if (showLoader) {
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
  const effectivePageContent = pageContent ?? cachedPageContent;

  if (!siteContent) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-[#4c5f66]">
        No content loaded.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="sticky top-24 z-30 rounded-3xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-[#17323D]">{title}</h1>
              <p className="text-xs text-[#4c5f66]">
                Edit the page content below.
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
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-xs text-[#17323D]">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <AdminSidebar content={siteContent} showEditButton variant="compact" />
          <main className="space-y-8">
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                Page Content
              </label>
              <div className="mt-3">
                  {effectivePageContent ? (
                    <RichTextEditor
                      value={effectivePageContent.html}
                      onChange={(value) =>
                        setPageContent({
                          ...effectivePageContent,
                          html: value,
                        })
                      }
                    />
                  ) : (
                    <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-6 text-center text-xs text-[#4c5f66] shadow-sm">
                      <LoadingSpinner />
                    </div>
                  )}
              </div>
            </section>
          </main>
        </div>
      </div>
      {message && <AdminToast message={message} />}
      {error && <AdminToast message={error} variant="error" />}
    </div>
  );
};

export default AdminPageEditor;
