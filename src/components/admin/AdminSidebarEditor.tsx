"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { SiteContent } from "@/lib/siteContentTypes";
import { SOCIAL_LINK_OPTIONS } from "@/lib/socialLinks";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import { uploadFileFromBrowser } from "@/lib/clientUpload";

const AdminSidebarEditor = () => {
  const { isAuthenticated, isLoading, siteContent, setSiteContent } =
    useAdminSession();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [pendingProfileFile, setPendingProfileFile] = useState<File | null>(
    null
  );
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
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
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
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
      if (pendingProfileFile) {
        setIsUploadingProfile(true);
        const profileUrl = withCacheBust(
          await uploadFileFromBrowser(pendingProfileFile)
        );
        nextContent = { ...nextContent, profileImageUrl: profileUrl };
      }
      if (pendingCvFile) {
        setIsUploadingCv(true);
        const cvUrl = withCacheBust(await uploadFileFromBrowser(pendingCvFile));
        nextContent = { ...nextContent, sidebarCvUrl: cvUrl };
      }

      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to save content.");
      }

      const saved = (await response.json()) as SiteContent;
      setContent(saved);
      setSiteContent(saved);
      setPendingProfileFile(null);
      setPendingCvFile(null);
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
        setProfilePreview(null);
      }
      setMessage("Sidebar updated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save content.";
      setError(message);
    } finally {
      setIsUploadingProfile(false);
      setIsUploadingCv(false);
      setIsSaving(false);
    }
  };

  const handleSelectProfile = (file: File) => {
    setError("");
    setMessage("Profile photo updated locally. Click save to upload.");
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }
    setPendingProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const [pendingCvFile, setPendingCvFile] = useState<File | null>(null);

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
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#17323D]">
              Sidebar Settings
            </h1>
            <p className="text-sm text-[#4c5f66]">
              Update the profile card and social links shown on the homepage.
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
          <div className="mt-4 rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-xs text-[#17323D]">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xl backdrop-blur">
              <div className="relative flex justify-center">
                <Image
                  src={profilePreview || content.profileImageUrl}
                  alt="Profile portrait"
                  className="h-44 w-44 rounded-2xl border-4 border-white object-cover shadow-lg"
                  width={176}
                  height={176}
                />
                <label className="absolute -bottom-3 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#17323D] shadow-md">
                  {isUploadingProfile ? "Uploading..." : "Choose photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) handleSelectProfile(file);
                    }}
                    disabled={isUploadingProfile}
                  />
                </label>
                {isUploadingProfile && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-xs font-semibold text-white">
                    Uploading photo...
                  </div>
                )}
              </div>
              <p className="mt-6 text-xs text-[#5a6b73]">
                Upload a square image for the sidebar profile card.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                Profile Details
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  <span className="flex items-center justify-between gap-3">
                    Name
                    <span className="group relative inline-flex">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#7A4C2C]/30 bg-white text-[#7A4C2C] shadow-sm">
                        <Info size={14} />
                      </span>
                      <span className="pointer-events-none absolute right-0 top-full z-10 mt-2 w-52 rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#17323D] shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        Updates header name too
                      </span>
                    </span>
                  </span>
                  <input
                    type="text"
                    value={content.sidebarName}
                    onChange={(event) =>
                      setContent({ ...content, sidebarName: event.target.value })
                    }
                    placeholder="Name"
                    className="w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                  />
                </label>
                <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Title / Role
                  <input
                    type="text"
                    value={content.sidebarTitle}
                    onChange={(event) =>
                      setContent({ ...content, sidebarTitle: event.target.value })
                    }
                    placeholder="Title / Role"
                    className="w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                  />
                </label>
                <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Location
                  <input
                    type="text"
                    value={content.sidebarLocation}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        sidebarLocation: event.target.value,
                      })
                    }
                    placeholder="Location"
                    className="w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                  />
                </label>
                <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Email
                  <input
                    type="email"
                    value={content.sidebarEmail}
                    onChange={(event) =>
                      setContent({ ...content, sidebarEmail: event.target.value })
                    }
                    placeholder="Email"
                    className="w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                  />
                </label>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                    Curriculum Vitae (PDF)
                  </label>
                  <p className="mt-2 text-xs text-[#4c5f66]">
                    PDF only. Upload to show the CV button in the sidebar.
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) =>
                      setPendingCvFile(event.target.files?.[0] || null)
                    }
                    className="mt-3 block w-full text-xs text-[#4c5f66] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#17323D] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                  />
                  {content.sidebarCvUrl && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <a
                        href={content.sidebarCvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-semibold text-[#17323D]"
                      >
                        View current CV
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setContent({ ...content, sidebarCvUrl: "" })
                        }
                        className="inline-flex cursor-pointer rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-semibold text-rose-700"
                      >
                        Remove CV
                      </button>
                    </div>
                  )}
                </div>
                <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Short Bio
                  <textarea
                    value={content.sidebarBlurb}
                    onChange={(event) =>
                      setContent({ ...content, sidebarBlurb: event.target.value })
                    }
                    placeholder="Short bio blurb"
                    className="min-h-30 w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                  />
                </label>
                <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Contact Message
                  <textarea
                    value={content.sidebarFooter}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        sidebarFooter: event.target.value,
                      })
                    }
                    placeholder="Footer call-to-action text"
                    className="min-h-30 w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Social Links
                </h2>
                <span className="text-xs text-[#4c5f66]">
                  Only filled links will appear.
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {SOCIAL_LINK_OPTIONS.map(({ id, label, Icon, placeholder }) => (
                  <label
                    key={id}
                    className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]"
                  >
                    {label}
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f8f1e3] text-[#7A4C2C]">
                        <Icon size={18} />
                      </span>
                      <input
                        type="url"
                        value={content.socialLinks?.[id] || ""}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            socialLinks: {
                              ...(content.socialLinks || {}),
                              [id]: event.target.value,
                            },
                          })
                        }
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                        aria-label={`${label} URL`}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      {message && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminSidebarEditor;
