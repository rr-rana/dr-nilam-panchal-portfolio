"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, FileText, Eye, FolderOpen } from "lucide-react";
import HomeSidebar from "@/components/HomeSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { SectionSlug } from "@/lib/sections";
import type { SectionSubmenu } from "@/lib/sectionSubmenus";
import type { SectionItem } from "@/lib/sectionItems";
import type { SiteContent } from "@/lib/siteContentTypes";

const itemsCache = new Map<string, SectionItem[]>();
const submenusCache = new Map<string, SectionSubmenu[]>();
const submenusLoaded = new Set<string>();
let siteContentCache: SiteContent | null = null;

type SectionItemsClientProps = {
  section: SectionSlug;
  title: string;
  initialSubmenu?: string | null;
  showHeader?: boolean;
  showSubmenuLinks?: boolean;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  headerLeft?: React.ReactNode;
};

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getPreview = (html: string) => {
  const text = stripHtml(html);
  if (text.length <= 160) return text;
  return `${text.slice(0, 157)}...`;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SectionItemsClient = ({
  section,
  title,
  initialSubmenu = null,
  showHeader = true,
  showSubmenuLinks = true,
  showBackButton = false,
  backHref,
  backLabel = "Back",
  headerLeft,
}: SectionItemsClientProps) => {
  const searchParams = useSearchParams();
  const [submenus, setSubmenus] = useState<SectionSubmenu[]>(
    () => submenusCache.get(section) ?? []
  );
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [items, setItems] = useState<SectionItem[] | null>(null);
  const [loadedSubmenu, setLoadedSubmenu] = useState<string | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(
    () => siteContentCache
  );
  const [isLoadingSubmenus, setIsLoadingSubmenus] = useState(
    !submenusLoaded.has(section)
  );
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(!siteContent);

  useEffect(() => {
    if (siteContentCache) {
      setSiteContent(siteContentCache);
      setIsLoadingContent(false);
      return;
    }

    let isActive = true;
    const load = async () => {
      try {
        const response = await fetch("/api/content");
        if (!response.ok) return;
        const data = (await response.json()) as SiteContent;
        if (!isActive) return;
        siteContentCache = data;
        setSiteContent(data);
      } finally {
        if (isActive) {
          setIsLoadingContent(false);
        }
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (submenusLoaded.has(section)) {
      setSubmenus(submenusCache.get(section) ?? []);
      setIsLoadingSubmenus(false);
      return;
    }

    let isActive = true;
    const load = async () => {
      try {
        const response = await fetch(`/api/sections/${section}/submenus`);
        if (!response.ok) return;
        const data = (await response.json()) as { submenus?: SectionSubmenu[] };
        if (!isActive) return;
        const resolved = data.submenus ?? [];
        submenusCache.set(section, resolved);
        setSubmenus(resolved);
        submenusLoaded.add(section);
      } finally {
        if (isActive) {
          setIsLoadingSubmenus(false);
        }
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [section]);

  useEffect(() => {
    if (!submenus.length) {
      setActiveSubmenu(null);
      return;
    }
    if (initialSubmenu) {
      const match = submenus.find(
        (submenu) => submenu.slug === initialSubmenu
      );
      if (match) {
        setActiveSubmenu(match.slug);
        return;
      }
    }
    setActiveSubmenu(null);
  }, [submenus, initialSubmenu]);

  useEffect(() => {
    if (!activeSubmenu) {
      setItems([]);
      setLoadedSubmenu(null);
      return;
    }

    const cacheKey = `${section}:${activeSubmenu}`;
    const cached = itemsCache.get(cacheKey);
    if (cached) {
      setItems(cached);
      setLoadedSubmenu(activeSubmenu);
      setIsLoadingItems(false);
      return;
    }

    let isActive = true;
    setIsLoadingItems(true);
    const load = async () => {
      try {
        const response = await fetch(
          `/api/sections/${section}/items?submenu=${encodeURIComponent(
            activeSubmenu
          )}`
        );
        if (!response.ok) return;
        const data = (await response.json()) as { items?: SectionItem[] };
        if (!isActive) return;
        const resolved = data.items ?? [];
        itemsCache.set(cacheKey, resolved);
        setItems(resolved);
        setLoadedSubmenu(activeSubmenu);
      } finally {
        if (isActive) {
          setIsLoadingItems(false);
        }
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, [section, activeSubmenu]);

  const basePath = `/${section}`;
  const fallbackHeaderLeft = (
    <div>
      <h1 className="text-2xl font-semibold text-[#17324a]">{title}</h1>
      <p className="mt-2 text-sm text-[#566779]">
        Explore the latest updates and detailed academic highlights.
      </p>
    </div>
  );

  const showItems = Boolean(initialSubmenu && activeSubmenu);
  const pageSize = 5;
  const paginationState = useMemo(() => {
    const allItems = showItems ? items ?? [] : [];
    const totalItems = allItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const requestedPage = Number(searchParams.get("page")) || 1;
    const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const pagedItems = allItems.slice(startIndex, startIndex + pageSize);
    return { pagedItems, totalItems, totalPages, currentPage };
  }, [items, searchParams, showItems]);

  if (!siteContent) {
    return (
      <div className="site-bg">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="site-panel px-6 py-4">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="site-bg">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            {showHeader && (
              <section className="site-panel p-6">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>{headerLeft ?? fallbackHeaderLeft}</div>
                  {showSubmenuLinks && (
                    <div className="site-panel-soft p-4">
                      <h2 className="site-kicker">
                        Submenus
                      </h2>
                      <div className="mt-3 space-y-2">
                        {isLoadingSubmenus ? (
                          <>
                            {Array.from({ length: 4 }).map((_, index) => (
                              <div
                                key={index}
                                className="skeleton-shimmer h-10 rounded-2xl border border-white/70"
                              />
                            ))}
                          </>
                        ) : submenus.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-[#c7d4e4] bg-white/70 px-4 py-6 text-center text-xs text-[#566779]">
                            No submenus yet. Please check back soon.
                          </div>
                        ) : (
                          submenus.map((submenu) => (
                            <Link
                              key={submenu.id}
                              href={`${basePath}/${submenu.slug}`}
                              className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                                submenu.slug === activeSubmenu
                                  ? "border-[#17324a] bg-[#17324a] text-white shadow-md"
                                  : "border-[#d4deea] bg-white text-[#17324a] hover:-translate-y-0.5 hover:border-[#89a2be] hover:shadow-md"
                              }`}
                            >
                              <span>{submenu.label}</span>
                              <span
                                className={`text-xs transition-opacity ${
                                  submenu.slug === activeSubmenu
                                    ? "opacity-90"
                                    : "opacity-40 group-hover:opacity-70"
                                }`}
                              >
                                →
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {showBackButton && (
              <section>
                <Link
                  href={backHref || basePath}
                  className="inline-flex items-center rounded-full border border-[#d4deea] bg-white px-4 py-2 text-xs font-semibold text-[#17324a] shadow-sm hover:bg-[#f3f8ff]"
                >
                  {backLabel}
                </Link>
              </section>
            )}

            <section className="space-y-4">
              {!activeSubmenu || !showItems ? null : isLoadingItems || isLoadingContent ? (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="site-panel p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="skeleton-shimmer h-20 w-20 rounded-2xl sm:h-24 sm:w-24" />
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="skeleton-shimmer h-5 w-3/4 rounded-full" />
                          <div className="skeleton-shimmer h-4 w-full rounded-full" />
                          <div className="skeleton-shimmer h-4 w-5/6 rounded-full" />
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="skeleton-shimmer h-8 w-28 rounded-full" />
                            <div className="skeleton-shimmer h-8 w-32 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-2 sm:min-w-[160px]">
                          <div className="skeleton-shimmer h-4 w-20 rounded-full sm:ml-auto" />
                          <div className="skeleton-shimmer h-4 w-24 rounded-full sm:ml-auto" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : items &&
                loadedSubmenu === activeSubmenu &&
                paginationState.pagedItems.length === 0 ? (
                <div className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-xl backdrop-blur">
                  <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4deea] bg-[#e9f0f9] text-[#31567a] shadow-inner">
                      <FolderOpen size={24} />
                    </div>
                    <h3 className="text-base font-semibold text-[#17324a]">
                      No items yet
                    </h3>
                    <div className="w-full max-w-sm space-y-2">
                      <div className="h-3 w-3/4 rounded-full bg-[#dbe6f4] mx-auto" />
                      <div className="h-3 w-full rounded-full bg-[#e7eef8] mx-auto" />
                      <div className="h-3 w-2/3 rounded-full bg-[#dbe6f4] mx-auto" />
                    </div>
                  </div>
                </div>
              ) : (
                paginationState.pagedItems.map((item) => {
                  const preview = getPreview(item.descriptionHtml);
                  const thumbnail = item.thumbnailUrl
                    ? { url: item.thumbnailUrl, alt: item.heading }
                    : item.photos[0];
                  const author = item.author?.trim();
                  const publishedDateRaw = item.publishedDate?.trim();
                  const publishedDate = publishedDateRaw
                    ? formatDate(publishedDateRaw)
                    : "";
                  const showMeta = Boolean(author || publishedDate);
                  return (
                    <article
                      key={item.id}
                      className="site-panel p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#d4deea] bg-[#e8eff8] sm:h-24 sm:w-24">
                          {thumbnail ? (
                            <Image
                              src={thumbnail.url}
                              alt={thumbnail.alt || item.heading}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#31567a]">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="line-clamp-2 text-base font-semibold text-[#17324a]">
                            {item.heading}
                          </h2>
                          <p className="mt-2 line-clamp-3 text-sm text-[#536476]">
                            {preview || "No description yet."}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <Link
                              href={`${basePath}/${activeSubmenu}/${item.id}`}
                              className="inline-flex items-center gap-2 rounded-full bg-[#17324a] px-4 py-2 text-xs font-semibold text-white"
                            >
                              <Eye size={14} />
                              View Details
                            </Link>
                            {item.pdfUrl && (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-[#d4deea] bg-[#eef4fb] px-4 py-2 text-xs font-semibold text-[#17324a]"
                              >
                                <FileText size={14} />
                                Download PDF
                              </a>
                            )}
                          </div>
                        </div>
                        {showMeta && (
                          <div className="text-xs text-[#55677a] sm:min-w-[160px] sm:text-right">
                            {author && (
                              <>
                                <div className="font-semibold text-[#17324a]">
                                  Author:
                                </div>
                                <div>{author}</div>
                              </>
                            )}
                            {publishedDate && (
                              <>
                                <div className={`font-semibold text-[#17324a]${author ? " mt-2" : ""}`}>
                                  Published Date:
                                </div>
                                <div>{publishedDate}</div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            {paginationState.totalPages > 1 && activeSubmenu && showItems && (
              <section className="flex items-center justify-center gap-2">
                <Link
                  href={`${basePath}/${activeSubmenu}?page=${Math.max(
                    1,
                    paginationState.currentPage - 1
                  )}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                    paginationState.currentPage === 1
                      ? "pointer-events-none border-[#d4deea] bg-[#edf2f8] text-[#9aa3a8]"
                      : "border-[#d4deea] bg-white text-[#17324a] hover:bg-[#f3f8ff]"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </Link>
                {Array.from(
                  { length: paginationState.totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <Link
                    key={page}
                    href={`${basePath}/${activeSubmenu}?page=${page}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                      page === paginationState.currentPage
                        ? "border-[#17324a] bg-[#17324a] text-white"
                        : "border-[#d4deea] bg-white text-[#17324a] hover:bg-[#f3f8ff]"
                    }`}
                  >
                    {page}
                  </Link>
                ))}
                <Link
                  href={`${basePath}/${activeSubmenu}?page=${Math.min(
                    paginationState.totalPages,
                    paginationState.currentPage + 1
                  )}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                    paginationState.currentPage === paginationState.totalPages
                      ? "pointer-events-none border-[#d4deea] bg-[#edf2f8] text-[#9aa3a8]"
                      : "border-[#d4deea] bg-white text-[#17324a] hover:bg-[#f3f8ff]"
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </Link>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SectionItemsClient;
