"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";
import AdminToast from "@/components/admin/AdminToast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { SiteContent } from "@/lib/siteContentTypes";
import type { PageItem, PageItemPhoto } from "@/lib/pageItems";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getPreview = (html: string) => {
  const text = stripHtml(html);
  if (text.length <= 120) return text;
  return `${text.slice(0, 117)}...`;
};

type AdminItem = PageItem;
type AdminItemDraft = Omit<PageItem, "id" | "slug" | "createdAt" | "updatedAt">;

type AdminContentManagerProps = {
  slug: string;
  title: string;
};

const emptyDraft: AdminItemDraft = {
  heading: "",
  author: "",
  publishedDate: "",
  thumbnailUrl: "",
  descriptionHtml: "",
  photos: [],
  videoLinks: [],
  pdfUrl: "",
};

const AdminContentManager = ({ slug, title }: AdminContentManagerProps) => {
  const {
    isAuthenticated,
    isLoading,
    siteContent,
    itemsBySlug,
    itemsLoadingBySlug,
    refreshItems,
    setItemsForSlug,
  } = useAdminSession();
  const items = itemsBySlug[slug] ?? [];
  const isItemsLoading = itemsLoadingBySlug[slug] ?? false;
  const [draft, setDraft] = useState<AdminItemDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingPhotos, setPendingPhotos] = useState<File[]>([]);
  const [pendingPdf, setPendingPdf] = useState<File | null>(null);
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteTitle, setPendingDeleteTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const isEditing = useMemo(() => draft !== null, [draft]);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pagedItems = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, safePage]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!itemsBySlug[slug]) {
      refreshItems(slug, { showLoader: true }).catch(() => {
        setError("Failed to load content.");
      });
    }
  }, [slug, isAuthenticated, itemsBySlug, refreshItems]);


  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const resetDraft = () => {
    setDraft(null);
    setEditingId(null);
    setPendingPhotos([]);
    setPendingPdf(null);
    setPendingThumbnail(null);
  };

  const handleCreate = () => {
    setDraft({ ...emptyDraft });
    setEditingId(null);
    setPendingPhotos([]);
    setPendingPdf(null);
    setPendingThumbnail(null);
    setError("");
  };

  const handleEdit = (item: AdminItem) => {
    setDraft({
      heading: item.heading,
      author: item.author || "",
      publishedDate: item.publishedDate || "",
      thumbnailUrl: item.thumbnailUrl || "",
      descriptionHtml: item.descriptionHtml,
      photos: item.photos,
      videoLinks: item.videoLinks,
      pdfUrl: item.pdfUrl,
    });
    setEditingId(item.id);
    setPendingPhotos([]);
    setPendingPdf(null);
    setPendingThumbnail(null);
    setError("");
  };

  const uploadFile = async (file: File) => {
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

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      let nextThumbnailUrl = draft.thumbnailUrl;
      if (pendingThumbnail) {
        nextThumbnailUrl = await uploadFile(pendingThumbnail);
      }

      let nextPhotos = [...draft.photos];
      if (pendingPhotos.length) {
        const uploads = await Promise.all(
          pendingPhotos.map((file) => uploadFile(file))
        );
        const uploadedPhotos = uploads.map((url, index) => ({
          url,
          alt: pendingPhotos[index]?.name || draft.heading,
        }));
        nextPhotos = [...nextPhotos, ...uploadedPhotos];
      }

      let nextPdfUrl = draft.pdfUrl;
      if (pendingPdf) {
        nextPdfUrl = await uploadFile(pendingPdf);
      }

      const payload = {
        heading: draft.heading,
        author: draft.author?.trim() || undefined,
        publishedDate: draft.publishedDate?.trim() || undefined,
        thumbnailUrl: nextThumbnailUrl?.trim() || undefined,
        descriptionHtml: draft.descriptionHtml,
        photos: nextPhotos,
        videoLinks: draft.videoLinks.map((link) => link.trim()).filter(Boolean),
        pdfUrl: nextPdfUrl,
      };

      const response = await fetch(
        editingId
          ? `/api/admin/items/${slug}/${editingId}`
          : `/api/admin/items/${slug}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || "Failed to save content.");
      }
      const saved = (await response.json()) as AdminItem;
      if (editingId) {
        setItemsForSlug(
          slug,
          items.map((item) => (item.id === saved.id ? saved : item))
        );
      } else {
        setItemsForSlug(slug, [saved, ...items]);
      }
      resetDraft();
      setMessage("Changes saved.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save content.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (id: string, heading: string) => {
    setPendingDeleteId(id);
    setPendingDeleteTitle(heading);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    const response = await fetch(
      `/api/admin/items/${slug}/${pendingDeleteId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "Delete failed.");
      setIsDeleting(false);
      return;
    }
    setItemsForSlug(
      slug,
      items.filter((item) => item.id !== pendingDeleteId)
    );
    setPendingDeleteId(null);
    setPendingDeleteTitle("");
    setMessage("Item deleted.");
    setIsDeleting(false);
  };

  const handleRemovePhoto = (url: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      photos: draft.photos.filter((photo) => photo.url !== url),
    });
  };

  const handleVideoChange = (index: number, value: string) => {
    if (!draft) return;
    const next = [...draft.videoLinks];
    next[index] = value;
    setDraft({ ...draft, videoLinks: next });
  };

  const handleAddVideo = () => {
    if (!draft) return;
    setDraft({ ...draft, videoLinks: [...draft.videoLinks, ""] });
  };

  const handleRemoveVideo = (index: number) => {
    if (!draft) return;
    const next = draft.videoLinks.filter((_, idx) => idx !== index);
    setDraft({ ...draft, videoLinks: next });
  };

  const hasItemsLoaded = Object.prototype.hasOwnProperty.call(itemsBySlug, slug);
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

  if (!siteContent) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-[#4c5f66]">
        No content loaded.
      </div>
    );
  }

  const showList = !isEditing;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="sticky top-24 z-30 rounded-3xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-[#17323D]">{title}</h1>
              <p className="text-xs text-[#4c5f66]">
                Manage the content cards and detail pages.
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
              {isEditing && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="cursor-pointer rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <AdminSidebar content={siteContent} showEditButton variant="compact" />
          <main className="space-y-8">
            {showList && (
              <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Content List
                    </h2>
                    <p className="mt-1 text-xs text-[#4c5f66]">
                      {items.length} entries
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1f3b47]"
                  >
                    <Plus size={14} />
                    New Item
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {isItemsLoading && !hasItemsLoaded ? (
                    <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-6 text-center text-xs text-[#4c5f66] shadow-sm">
                      <LoadingSpinner />
                    </div>
                  ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d5c9b8] px-4 py-6 text-center text-xs text-[#4c5f66]">
                      No items created yet.
                    </div>
                  ) : (
                    pagedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group rounded-2xl border border-[#e6dccb] bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                      <div className="flex flex-nowrap items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-16 w-24 overflow-hidden rounded-2xl border border-white/80 bg-[#f3ede1]">
                          {item.thumbnailUrl || item.photos[0] ? (
                            <Image
                              src={item.thumbnailUrl || item.photos[0].url}
                              alt={item.heading}
                              fill
                              className="object-cover"
                            />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-[#7A4C2C]">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-[#17323D]">
                                {item.heading}
                              </div>
                              <div className="mt-1 line-clamp-2 text-xs text-[#4c5f66]">
                                {getPreview(item.descriptionHtml) ||
                                  "No description yet."}
                              </div>
                            </div>
                          </div>
                        <div className="ml-auto flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-amber-100 p-2 text-amber-700 transition-colors hover:bg-amber-200"
                              aria-label="Edit item"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(item.id, item.heading)}
                              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-rose-100 p-2 text-rose-700 transition-colors hover:bg-rose-200"
                              aria-label="Delete item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {items.length > pageSize && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#17323D] hover:bg-white"
                      aria-label="Previous page"
                      disabled={safePage === 1}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border text-xs font-semibold ${
                            page === safePage
                              ? "border-[#17323D] bg-[#17323D] text-white"
                              : "border-white/80 bg-white/90 text-[#17323D] hover:bg-white"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#17323D] hover:bg-white"
                      aria-label="Next page"
                      disabled={safePage === totalPages}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </section>
            )}

            {isEditing && draft && (
              <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                    {editingId ? "Edit Item" : "New Item"}
                  </h2>
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="cursor-pointer text-xs font-semibold text-[#7A4C2C] hover:text-[#5e351b]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={draft.heading}
                      onChange={(event) =>
                        setDraft({ ...draft, heading: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={draft.author || ""}
                      onChange={(event) =>
                        setDraft({ ...draft, author: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={draft.publishedDate || ""}
                      onChange={(event) =>
                        setDraft({ ...draft, publishedDate: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Description
                    </label>
                    <div className="mt-3">
                      <RichTextEditor
                        value={draft.descriptionHtml}
                        onChange={(value) =>
                          setDraft({ ...draft, descriptionHtml: value })
                        }
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Photos
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) =>
                        setPendingPhotos(Array.from(event.target.files || []))
                      }
                      className="mt-2 block w-full text-xs text-[#4c5f66] file:mr-3 file:rounded-full file:border-0 file:bg-[#17323D] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                    />
                    {draft.photos.length > 0 && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {draft.photos.map((photo) => (
                          <div
                            key={photo.url}
                            className="relative overflow-hidden rounded-2xl border border-white/80"
                          >
                            <div className="relative h-24 w-full">
                              <Image
                                src={photo.url}
                                alt={photo.alt || draft.heading}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.url)}
                              className="w-full border-t border-white/70 py-1 text-[10px] font-semibold uppercase text-[#7A4C2C]"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Thumbnail Image
                    </label>
                    <p className="mt-2 text-xs text-[#4c5f66]">
                      Recommended size: 600×600 px.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setPendingThumbnail(event.target.files?.[0] || null)
                      }
                      className="mt-3 block w-full text-xs text-[#4c5f66] file:mr-3 file:rounded-full file:border-0 file:bg-[#17323D] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                    />
                    {draft.thumbnailUrl && (
                      <div className="mt-3 overflow-hidden rounded-2xl border border-white/80 bg-[#f3ede1]">
                        <div className="relative h-32 w-32">
                          <Image
                            src={draft.thumbnailUrl}
                            alt={draft.heading || "Thumbnail"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      PDF
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(event) =>
                        setPendingPdf(event.target.files?.[0] || null)
                      }
                      className="mt-2 block w-full text-xs text-[#4c5f66] file:mr-3 file:rounded-full file:border-0 file:bg-[#17323D] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                    />
                    {draft.pdfUrl && (
                      <p className="mt-2 text-xs text-[#4c5f66]">
                        Current PDF attached.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Video Links
                    </label>
                    <div className="mt-2 space-y-2">
                      {draft.videoLinks.map((link, index) => (
                        <div
                          key={`${link}-${index}`}
                          className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/70 bg-white/80 p-2"
                        >
                          <input
                            type="text"
                            value={link}
                            onChange={(event) =>
                              handleVideoChange(index, event.target.value)
                            }
                            className="min-w-[220px] flex-1 rounded-2xl border border-[#e1d6c6] bg-white px-4 py-2 text-xs text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(index)}
                            className="cursor-pointer rounded-full bg-rose-100 px-3 py-2 text-[10px] font-semibold text-rose-700 transition-colors hover:bg-rose-200"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddVideo}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-200"
                      >
                        <Plus size={14} />
                        Add Video
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      {message && (
        <AdminToast message={message} />
      )}
      {error && <AdminToast message={error} variant="error" />}
      <ConfirmModal
        isOpen={Boolean(pendingDeleteId)}
        title="Delete item"
        message={
          pendingDeleteTitle
            ? `Are you sure you want to delete “${pendingDeleteTitle}”? This cannot be undone.`
            : "Are you sure you want to delete this item? This cannot be undone."
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onCancel={() => {
          setPendingDeleteId(null);
          setPendingDeleteTitle("");
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminContentManager;
