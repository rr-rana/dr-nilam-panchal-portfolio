import Link from "next/link";
import { Calendar, User, FileText, ChevronLeft } from "lucide-react";
import HomeSidebar from "@/components/HomeSidebar";
import PageItemVideoSection from "@/components/content/PageItemVideoSection";
import PageItemGallery from "@/components/content/PageItemGallery";
import { getCachedSiteContent } from "@/lib/siteContent";
import type { SectionItem } from "@/lib/sectionItems";
import type { SectionSlug } from "@/lib/sections";

const hasDetailContent = (html?: string) =>
  Boolean(html?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim());

const SectionItemDetailView = async ({
  section,
  submenuSlug,
  item,
}: {
  section: SectionSlug;
  submenuSlug: string;
  item: SectionItem;
}) => {
  const siteContent = await getCachedSiteContent();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${section}/${submenuSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-semibold text-[#17323D] shadow-sm hover:bg-white"
                  >
                    <ChevronLeft size={14} />
                    Back
                  </Link>
                  <h1 className="mt-3 text-2xl font-semibold text-[#17323D]">
                    {item.heading}
                  </h1>
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white"
                    >
                      <FileText size={14} />
                      View PDF
                    </a>
                  )}
                </div>
                {(item.author?.trim() || item.publishedDate?.trim()) && (
                  <div className="w-full shrink-0 rounded-2xl border border-white/70 bg-white/90 px-4 py-4 text-xs text-[#4c5f66] shadow-sm sm:w-auto sm:min-w-[200px]">
                    {item.author?.trim() && (
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#7A4C2C]">
                          <User size={14} />
                        </span>
                        <div>
                          <div className="font-semibold text-[#17323D]">
                            Author
                          </div>
                          <div className="mt-1">{item.author}</div>
                        </div>
                      </div>
                    )}
                    {item.publishedDate?.trim() && (
                      <div className={`${item.author?.trim() ? "mt-4" : ""} flex items-start gap-2`}>
                        <span className="mt-0.5 text-[#7A4C2C]">
                          <Calendar size={14} />
                        </span>
                        <div>
                          <div className="font-semibold text-[#17323D]">
                            Published Date
                          </div>
                          <div className="mt-1">{item.publishedDate}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <PageItemGallery photos={item.photos} heading={item.heading} />

            {hasDetailContent(item.descriptionHtml) && (
              <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Details
                </h3>
                <div
                  className="content-body mt-4 space-y-4 text-sm leading-relaxed text-[#4c5f66] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                />
              </section>
            )}

            <PageItemVideoSection videoLinks={item.videoLinks ?? []} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SectionItemDetailView;
