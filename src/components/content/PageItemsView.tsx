import Link from "next/link";
import Image from "next/image";
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

type PageItemsViewProps = {
  slug: PageSlug;
  title: string;
  items: PageItem[];
};

const PageItemsView = async ({ slug, title, items }: PageItemsViewProps) => {
  const siteContent = await getCachedSiteContent();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-[#17323D]">
                    {title}
                  </h1>
                  <p className="mt-2 text-sm text-[#4c5f66]">
                    Explore the latest updates and detailed highlights.
                  </p>
                </div>
                <div className="rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-semibold text-[#17323D]">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              {items.length === 0 ? (
                <div className="rounded-3xl border border-white/70 bg-white/80 p-8 text-center text-sm text-[#4c5f66] shadow-xl backdrop-blur">
                  No content yet. Please check back soon.
                </div>
              ) : (
                items.map((item) => {
                  const preview = getPreview(item.descriptionHtml);
                  const thumbnail = item.photos[0];
                  return (
                    <article
                      key={item.id}
                      className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur sm:p-6"
                    >
                      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                        <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/80 bg-[#f3ede1] md:h-full">
                          {thumbnail ? (
                            <Image
                              src={thumbnail.url}
                              alt={thumbnail.alt || item.heading}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h2 className="text-xl font-semibold text-[#17323D]">
                              {item.heading}
                            </h2>
                            <p className="mt-2 text-sm text-[#4c5f66]">
                              {preview || "No description yet."}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/${slug}/${item.id}`}
                              className="rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white"
                            >
                              View Details
                            </Link>
                            {item.pdfUrl && (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-[#17323D]"
                              >
                                PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageItemsView;
