import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FileText, Eye } from "lucide-react";
import HomeSidebar from "@/components/HomeSidebar";
import type { PageItem } from "@/lib/pageItems";
import type { PageSlug } from "@/lib/pages";
import { getCachedSiteContent } from "@/lib/siteContent";

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

type PageItemsViewProps = {
  slug: PageSlug;
  title: string;
  items: PageItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

const PageItemsView = async ({
  slug,
  title,
  items,
  currentPage,
  totalPages,
  totalItems,
}: PageItemsViewProps) => {
  const siteContent = await getCachedSiteContent();
  const pagination = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-[#17323D]">
                    {title}
                  </h1>
                  <p className="mt-2 text-sm text-[#4c5f66]">
                    Explore the latest updates and detailed academic highlights.
                  </p>
                </div>
                <div className="rounded-full border border-white/80 bg-[#f7f4ee] px-4 py-2 text-xs font-semibold text-[#17323D] shadow-sm">
                  {totalItems} Items Found
                </div>
              </div>
            </section>

            <section className="space-y-4">
              {items.length === 0 ? (
                <div className="rounded-3xl border border-white/70 bg-white/95 p-8 text-center text-sm text-[#4c5f66] shadow-xl backdrop-blur">
                  No content yet. Please check back soon.
                </div>
              ) : (
                items.map((item) => {
                  const preview = getPreview(item.descriptionHtml);
                  const thumbnail = item.thumbnailUrl
                    ? { url: item.thumbnailUrl, alt: item.heading }
                    : item.photos[0];
                  return (
                    <article
                      key={item.id}
                      className="rounded-3xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5"
                    >
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/80 bg-[#f3ede1] sm:h-24 sm:w-24">
                          {thumbnail ? (
                            <Image
                              src={thumbnail.url}
                              alt={thumbnail.alt || item.heading}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-base font-semibold text-[#17323D]">
                            {item.heading}
                          </h2>
                          <p className="mt-2 text-sm text-[#4c5f66]">
                            {preview || "No description yet."}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <Link
                              href={`/${slug}/${item.id}`}
                              className="inline-flex items-center gap-2 rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white"
                            >
                              <Eye size={14} />
                              View Details
                            </Link>
                            {item.pdfUrl && (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-[#f7f4ee] px-4 py-2 text-xs font-semibold text-[#17323D]"
                              >
                                <FileText size={14} />
                                Download PDF
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="min-w-[160px] text-right text-xs text-[#4c5f66]">
                          <div className="font-semibold text-[#17323D]">
                            Author:
                          </div>
                          <div>{item.author || "---"}</div>
                          <div className="mt-2 font-semibold text-[#17323D]">
                            Published Date:
                          </div>
                          <div>{formatDate(item.publishedDate) || "---"}</div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            {totalPages > 1 && (
              <section className="flex items-center justify-center gap-2">
                <Link
                  href={`/${slug}?page=${Math.max(1, currentPage - 1)}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                    currentPage === 1
                      ? "pointer-events-none border-white/70 bg-white/70 text-[#9aa3a8]"
                      : "border-white/80 bg-white/95 text-[#17323D] hover:bg-white"
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </Link>
                {pagination.map((page) => (
                  <Link
                    key={page}
                    href={`/${slug}?page=${page}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                      page === currentPage
                        ? "border-[#17323D] bg-[#17323D] text-white"
                        : "border-white/80 bg-white/95 text-[#17323D] hover:bg-white"
                    }`}
                  >
                    {page}
                  </Link>
                ))}
                <Link
                  href={`/${slug}?page=${Math.min(totalPages, currentPage + 1)}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                    currentPage === totalPages
                      ? "pointer-events-none border-white/70 bg-white/70 text-[#9aa3a8]"
                      : "border-white/80 bg-white/95 text-[#17323D] hover:bg-white"
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

export default PageItemsView;
