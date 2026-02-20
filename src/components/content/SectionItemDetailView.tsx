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
    <div className="site-bg">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            <section className="site-panel p-6">
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${section}/${submenuSlug}`}
                    className="site-kicker"
                  >
                    Back to {title}
                  </Link>
                  <h1 className="mt-3 text-2xl font-semibold text-[#17324a]">
                    {item.heading}
                  </h1>
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#17324a] px-4 py-2 text-xs font-semibold text-white"
                    >
                      <FileText size={14} />
                      View PDF
                    </a>
                  )}
                </div>
                {(item.author?.trim() || item.publishedDate?.trim()) && (
                  <div className="w-full shrink-0 rounded-2xl border border-[#d4deea] bg-[#f4f8fd] px-4 py-4 text-xs text-[#4f6175] shadow-sm sm:w-auto sm:min-w-[200px]">
                    {item.author?.trim() && (
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#31567a]">
                          <User size={14} />
                        </span>
                        <div>
                          <div className="font-semibold text-[#17324a]">
                            Author
                          </div>
                          <div className="mt-1">{item.author}</div>
                        </div>
                      </div>
                    )}
                    {item.publishedDate?.trim() && (
                      <div className={`${item.author?.trim() ? "mt-4" : ""} flex items-start gap-2`}>
                        <span className="mt-0.5 text-[#31567a]">
                          <Calendar size={14} />
                        </span>
                        <div>
                          <div className="font-semibold text-[#17324a]">
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

            <section className="site-panel p-6">
              <h3 className="site-kicker">
                Details
              </h3>
              <div
                className="content-body mt-4 space-y-4 text-sm leading-relaxed text-[#415265] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-[#1f3248]"
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
