"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type { SiteContent } from "@/lib/siteContentTypes";
import type { PageContent } from "@/lib/pageContent";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import AdminToast from "@/components/admin/AdminToast";

type AdminPageEditorProps = {
  slug: string;
  title: string;
};

const AdminPageEditor = ({ slug, title }: AdminPageEditorProps) => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [sessionRes, siteRes, pageRes] = await Promise.all([
          fetch("/api/admin/session", { cache: "no-store" }),
          fetch("/api/admin/content", { cache: "no-store" }),
          fetch(`/api/admin/pages/${slug}`, { cache: "no-store" }),
        ]);
        const session = await sessionRes.json();
        if (!siteRes.ok || !pageRes.ok) {
          const payload = await (siteRes.ok ? pageRes : siteRes)
            .json()
            .catch(() => ({}));
          throw new Error(payload.error || "Failed to load content.");
        }
        const [siteData, pageData] = await Promise.all([
          siteRes.json(),
          pageRes.json(),
        ]);
        setIsAuthenticated(session.authenticated);
        setSiteContent(siteData);
        setPageContent(pageData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load content.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [slug]);

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

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "Login failed.");
      return;
    }

    setIsAuthenticated(true);
    setUsername("");
    setPassword("");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
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
      setMessage("Changes saved.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save content.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-[#4c5f66]">
        Loading editor...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
        <div className="mx-auto max-w-md px-6 py-16">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">
            <h1 className="text-2xl font-semibold text-[#17323D]">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-[#4c5f66]">
              Sign in to edit this page content.
            </p>
            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                className="w-full rounded-full border border-white/70 bg-white/90 px-4 py-2 text-sm text-[#2d3b41] outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-full border border-white/70 bg-white/90 px-4 py-2 text-sm text-[#2d3b41] outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-full bg-[#17323D] py-2 text-sm font-semibold text-white"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!siteContent || !pageContent) {
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
                <RichTextEditor
                  value={pageContent.html}
                  onChange={(value) =>
                    setPageContent({ ...pageContent, html: value })
                  }
                />
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
