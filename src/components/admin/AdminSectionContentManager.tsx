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
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import type { SectionSlug } from "@/lib/sections";
import type { SectionSubmenu } from "@/lib/sectionSubmenus";
import type { SectionItem, SectionItemPhoto } from "@/lib/sectionItems";

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getPreview = (html: string) => {
  const text = stripHtml(html);
  if (text.length <= 120) return text;
  return `${text.slice(0, 117)}...`;
};

type AdminItem = SectionItem;
type AdminItemDraft = Omit<
  SectionItem,
  "id" | "section" | "createdAt" | "updatedAt"
>;

type AdminSectionContentManagerProps = {
  section: SectionSlug;
  title: string;
};

const emptyDraft: AdminItemDraft = {
  submenuSlug: "",
  heading: "",
  author: "",
  publishedDate: "",
  thumbnailUrl: "",
  descriptionHtml: "",
  photos: [],
  videoLinks: [],
  pdfUrl: "",
};

const ADMIN_CACHE_TTL_MS = 30_000;
const submenuCache = new Map<string, SectionSubmenu[]>();
const submenuCacheAt = new Map<string, number>();
const itemsCache = new Map<string, SectionItem[]>();
const itemsCacheAt = new Map<string, number>();

const AdminSectionContentManager = ({
  section,
  title,
}: AdminSectionContentManagerProps) => {
  const { isAuthenticated, isLoading, siteContent } = useAdminSession();
  const [submenus, setSubmenus] = useState<SectionSubmenu[]>([]);
  const [submenuLabel, setSubmenuLabel] = useState("");
  const [submenuEditingId, setSubmenuEditingId] = useState<string | null>(null);
  const [submenuEditingLabel, setSubmenuEditingLabel] = useState("");
  const [submenuPendingDelete, setSubmenuPendingDelete] = useState<{
    id: string;
    label: string;
    slug: string;
  } | null>(null);
  const [isSubmenuLoading, setIsSubmenuLoading] = useState(false);
  const [isSubmittingSubmenu, setIsSubmittingSubmenu] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const [items, setItems] = useState<AdminItem[]>([]);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
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

  const filteredItems = useMemo(() => {
    if (!activeSubmenu) return [];
    return items.filter((item) => item.submenuSlug === activeSubmenu);
  }, [items, activeSubmenu]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pagedItems = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, safePage]);

  const refreshSubmenus = async (
    showLoader = false,
    force = false
  ) => {
    const now = Date.now();
    const cached = submenuCache.get(section);
    const cachedAt = submenuCacheAt.get(section) ?? 0;
    const isFresh = cached && now - cachedAt < ADMIN_CACHE_TTL_MS && !force;
    if (showLoader) {
      setIsSubmenuLoading(true);
    }
    try {
      let list: SectionSubmenu[] = [];
      if (isFresh) {
        list = cached ?? [];
      } else {
        const response = await fetch(`/api/admin/sections/${section}/submenus`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { submenus?: SectionSubmenu[] };
        list = data.submenus ?? [];
        submenuCache.set(section, list);
        submenuCacheAt.set(section, now);
      }
      setSubmenus(list);
      if (!activeSubmenu && list.length) {
        setActiveSubmenu(list[0].slug);
      } else if (
        activeSubmenu &&
        !list.some((submenu) => submenu.slug === activeSubmenu)
      ) {
        setActiveSubmenu(list[0]?.slug ?? null);
      }
    } finally {
      setIsSubmenuLoading(false);
    }
  };

  const refreshItems = async (
    showLoader = false,
    force = false
  ) => {
    const now = Date.now();
    const cached = itemsCache.get(section);
    const cachedAt = itemsCacheAt.get(section) ?? 0;
    const isFresh = cached && now - cachedAt < ADMIN_CACHE_TTL_MS && !force;
    if (showLoader) {
      setIsItemsLoading(true);
    }
    try {
      let list: AdminItem[] = [];
      if (isFresh) {
        list = cached ?? [];
      } else {
        const response = await fetch(`/api/admin/sections/${section}/items`, {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = (await response.json()) as { items?: AdminItem[] };
        list = data.items ?? [];
        itemsCache.set(section, list);
        itemsCacheAt.set(section, now);
      }
      setItems(list);
    } finally {
      setIsItemsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshSubmenus(true).catch(() => {
      setError("Failed to load submenus.");
    });
    refreshItems(true).catch(() => {
      setError("Failed to load content.");
    });
  }, [section, isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubmenu]);

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
    if (!activeSubmenu) {
      setError("Create a submenu first.");
      return;
    }
    setDraft({ ...emptyDraft, submenuSlug: activeSubmenu });
    setEditingId(null);
    setPendingPhotos([]);
    setPendingPdf(null);
    setPendingThumbnail(null);
    setError("");
  };

  const handleEdit = (item: AdminItem) => {
    setDraft({
      submenuSlug: item.submenuSlug,
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
        const uploadedPhotos: SectionItemPhoto[] = uploads.map((url, index) => ({
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
        submenuSlug: draft.submenuSlug,
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
          ? `/api/admin/sections/${section}/items/${editingId}`
          : `/api/admin/sections/${section}/items`,
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
        setItems((prev) => {
          const next = prev.map((item) =>
            item.id === saved.id ? saved : item
          );
          itemsCache.set(section, next);
          itemsCacheAt.set(section, Date.now());
          return next;
        });
      } else {
        setItems((prev) => {
          const next = [saved, ...prev];
          itemsCache.set(section, next);
          itemsCacheAt.set(section, Date.now());
          return next;
        });
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
      `/api/admin/sections/${section}/items/${pendingDeleteId}`,
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
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== pendingDeleteId);
      itemsCache.set(section, next);
      itemsCacheAt.set(section, Date.now());
      return next;
    });
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

  const handleCreateSubmenu = async () => {
    if (!submenuLabel.trim()) return;
    setError("");
    setIsSubmittingSubmenu(true);
    try {
      const response = await fetch(`/api/admin/sections/${section}/submenus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: submenuLabel.trim() }),
      });
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || "Failed to create submenu.");
      }
      const created = (await response.json()) as SectionSubmenu;
      setSubmenus((prev) => {
        const next = [...prev, created];
        submenuCache.set(section, next);
        submenuCacheAt.set(section, Date.now());
        return next;
      });
      setSubmenuLabel("");
      setActiveSubmenu(created.slug);
      setMessage("Submenu created.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create submenu.";
      setError(message);
    } finally {
      setIsSubmittingSubmenu(false);
    }
  };

  const startEditSubmenu = (submenu: SectionSubmenu) => {
    setSubmenuEditingId(submenu.id);
    setSubmenuEditingLabel(submenu.label);
  };

  const cancelEditSubmenu = () => {
    setSubmenuEditingId(null);
    setSubmenuEditingLabel("");
  };

  const handleUpdateSubmenu = async () => {
    if (!submenuEditingId || !submenuEditingLabel.trim()) return;
    try {
      const response = await fetch(
        `/api/admin/sections/${section}/submenus/${submenuEditingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label: submenuEditingLabel.trim() }),
        }
      );
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || "Failed to update submenu.");
      }
      const updated = (await response.json()) as SectionSubmenu;
      setSubmenus((prev) => {
        const next = prev.map((submenu) =>
          submenu.id === updated.id ? updated : submenu
        );
        submenuCache.set(section, next);
        submenuCacheAt.set(section, Date.now());
        return next;
      });
      setActiveSubmenu(updated.slug);
      setSubmenuEditingId(null);
      setSubmenuEditingLabel("");
      await refreshItems(false, true);
      setMessage("Submenu updated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update submenu.";
      setError(message);
    }
  };

  const handleDeleteSubmenu = async () => {
    if (!submenuPendingDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/sections/${section}/submenus/${submenuPendingDelete.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || "Failed to delete submenu.");
      }
      setSubmenus((prev) => {
        const next = prev.filter(
          (submenu) => submenu.id !== submenuPendingDelete.id
        );
        if (activeSubmenu === submenuPendingDelete.slug) {
          setActiveSubmenu(next[0]?.slug ?? null);
        }
        submenuCache.set(section, next);
        submenuCacheAt.set(section, Date.now());
        return next;
      });
      await refreshItems(false, true);
      setMessage("Submenu deleted.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete submenu.";
      setError(message);
    } finally {
      setIsDeleting(false);
      setSubmenuPendingDelete(null);
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
                Manage submenus and the content inside each submenu.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-[#17323D] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                Back to Admin
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-[#17323D] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <AdminSidebar content={siteContent} showEditButton variant="compact" />
          <main className="space-y-8">
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                    Submenus
                  </h2>
                  <p className="mt-1 text-xs text-[#4c5f66]">
                    {submenus.length} submenus
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="New submenu label"
                    value={submenuLabel}
                    onChange={(event) => setSubmenuLabel(event.target.value)}
                    className="w-48 rounded-full border border-[#e1d6c6] bg-white px-4 py-2 text-xs text-[#2d3b41] outline-none transition-all duration-200 ease-out focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10 hover:border-[#17323D]/40"
                  />
                  <button
                    type="button"
                    onClick={handleCreateSubmenu}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#1f3b47] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmittingSubmenu}
                  >
                    <Plus size={14} />
                    {isSubmittingSubmenu ? "Adding..." : "Add Submenu"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {isSubmenuLoading ? (
                  <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-4 text-center text-xs text-[#4c5f66] shadow-sm">
                    <LoadingSpinner />
                  </div>
                ) : submenus.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#d5c9b8] px-4 py-6 text-center text-xs text-[#4c5f66]">
                    No submenus created yet.
                  </div>
                ) : (
                  submenus.map((submenu) => {
                    const isEditing = submenuEditingId === submenu.id;
                    const isActive = submenu.slug === activeSubmenu;

                    return (
                      <div
                        key={submenu.id}
                        role={isEditing ? undefined : "button"}
                        tabIndex={isEditing ? -1 : 0}
                        onClick={
                          isEditing ? undefined : () => setActiveSubmenu(submenu.slug)
                        }
                        onKeyDown={
                          isEditing
                            ? undefined
                            : (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  setActiveSubmenu(submenu.slug);
                                }
                              }
                        }
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-200 ease-out ${
                          isEditing ? "" : "cursor-pointer"
                        } ${
                          isActive
                            ? "border-[#17323D] bg-[#17323D] text-white shadow-sm"
                            : "border-white/70 bg-white/80 text-[#17323D] hover:-translate-y-0.5 hover:border-[#d6c6b3] hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        {isEditing ? (
                        <input
                          type="text"
                          value={submenuEditingLabel}
                          onChange={(event) =>
                            setSubmenuEditingLabel(event.target.value)
                          }
                          className="w-32 rounded-full border border-[#e1d6c6] bg-white px-3 py-1 text-xs text-[#2d3b41] outline-none transition-all duration-200 ease-out focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10 hover:border-[#17323D]/40"
                        />
                      ) : (
                        <span>{submenu.label}</span>
                      )}
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handleUpdateSubmenu}
                            className="cursor-pointer rounded-full bg-emerald-100 px-2 py-1 text-[10px] text-emerald-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditSubmenu}
                            className="cursor-pointer rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                startEditSubmenu(submenu);
                              }}
                              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-amber-100 p-1 text-amber-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-sm"
                              aria-label="Edit submenu"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSubmenuPendingDelete({
                                  id: submenu.id,
                                  label: submenu.label,
                                  slug: submenu.slug,
                                });
                              }}
                              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-rose-100 p-1 text-rose-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-rose-200 hover:shadow-sm"
                              aria-label="Delete submenu"
                            >
                              <Trash2 size={12} />
                            </button>
                        </div>
                      )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {showList && (
              <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Content List
                    </h2>
                    <p className="mt-1 text-xs text-[#4c5f66]">
                      {filteredItems.length} entries
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#1f3b47] hover:shadow-md"
                  >
                    <Plus size={14} />
                    New Item
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {isItemsLoading ? (
                    <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-6 text-center text-xs text-[#4c5f66] shadow-sm">
                      <LoadingSpinner />
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d5c9b8] px-4 py-6 text-center text-xs text-[#4c5f66]">
                      No items created yet.
                    </div>
                  ) : (
                    pagedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group overflow-hidden rounded-2xl border border-[#e6dccb] bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-4">
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
                              <div className="line-clamp-2 break-words text-sm font-semibold text-[#17323D]">
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
                              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-amber-100 p-2 text-amber-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-sm"
                              aria-label="Edit item"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(item.id, item.heading)}
                              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-rose-100 p-2 text-rose-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-rose-200 hover:shadow-sm"
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

                {filteredItems.length > pageSize && (
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
                    className="cursor-pointer text-xs font-semibold text-[#7A4C2C] transition-colors duration-200 ease-out hover:text-[#5e351b]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                      Submenu
                    </label>
                    <select
                      value={draft.submenuSlug}
                      onChange={(event) =>
                        setDraft({ ...draft, submenuSlug: event.target.value })
                      }
                      className="mt-2 w-full rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3 text-sm text-[#2d3b41] outline-none focus:border-[#17323D] focus:ring-2 focus:ring-[#17323D]/10"
                    >
                      {submenus.map((submenu) => (
                        <option key={submenu.id} value={submenu.slug}>
                          {submenu.label}
                        </option>
                      ))}
                    </select>
                  </div>

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
                            className="cursor-pointer rounded-full bg-rose-100 px-3 py-2 text-[10px] font-semibold text-rose-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-rose-200 hover:shadow-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddVideo}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-sm"
                      >
                        <Plus size={14} />
                        Add Video
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="cursor-pointer rounded-full bg-[#17323D] px-6 py-3 text-xs font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#1f3b47] hover:shadow-md disabled:opacity-60"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      {message && <AdminToast message={message} />}
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
      <ConfirmModal
        isOpen={Boolean(submenuPendingDelete)}
        title="Delete submenu"
        message={
          submenuPendingDelete
            ? `Delete “${submenuPendingDelete.label}” and all its items? This cannot be undone.`
            : "Delete this submenu? This cannot be undone."
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onCancel={() => setSubmenuPendingDelete(null)}
        onConfirm={handleDeleteSubmenu}
      />
    </div>
  );
};

export default AdminSectionContentManager;
