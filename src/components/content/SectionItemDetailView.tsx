import Link from "next/link";
import { Calendar, User, FileText } from "lucide-react";
import HomeSidebar from "@/components/HomeSidebar";
import PageItemVideoSection from "@/components/content/PageItemVideoSection";
import PageItemGallery from "@/components/content/PageItemGallery";
import { getCachedSiteContent } from "@/lib/siteContent";
import type { SectionItem } from "@/lib/sectionItems";
import type { SectionSlug } from "@/lib/sections";

const SectionItemDetailView = async ({
  section,
  title,
  submenuSlug,
  item,
}: {
  section: SectionSlug;
  title: string;
  submenuSlug: string;
  item: SectionItem;
}) => {
  const siteContent = await getCachedSiteContent();

  return (
    <div className="public-page">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-4 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            <section className="public-card rounded-[1.8rem] p-6">
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${section}/${submenuSlug}`}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b86d3a]"
                  >
                    Back to {title}
                  </Link>
                  <h1 className="public-hero-title mt-3 text-3xl font-bold text-[#17323D]">
                    {item.heading}
                  </h1>
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#17323D] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-[#17323D]/30"
                    >
                      <FileText size={14} />
                      View PDF
                    </a>
                  )}
                </div>
                {(item.author?.trim() || item.publishedDate?.trim()) && (
                  <div className="w-full shrink-0 rounded-2xl border border-[#d2dfe6] bg-white px-4 py-4 text-xs text-[#4c5f66] shadow-sm sm:w-auto sm:min-w-[200px]">
                    {item.author?.trim() && (
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#b86d3a]">
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
                        <span className="mt-0.5 text-[#b86d3a]">
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

            <section className="public-card rounded-[1.8rem] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b86d3a]">
                Details
              </h3>
              <div
                className="content-body public-prose mt-4 text-sm leading-relaxed sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
              />
            </section>

            <PageItemVideoSection videoLinks={item.videoLinks ?? []} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SectionItemDetailView;
