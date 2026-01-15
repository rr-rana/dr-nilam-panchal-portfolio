import Link from "next/link";
import Image from "next/image";
import HomeSidebar from "@/components/HomeSidebar";
import PageItemVideoSection from "@/components/content/PageItemVideoSection";
import type { PageItem } from "@/lib/pageItems";
import type { PageSlug } from "@/lib/pages";
import { getCachedSiteContent } from "@/lib/siteContent";

const PageItemDetailView = async ({
  slug,
  title,
  item,
}: {
  slug: PageSlug;
  title: string;
  item: PageItem;
}) => {
  const siteContent = await getCachedSiteContent();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="min-w-0">
                  <Link
                    href={`/${slug}`}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]"
                  >
                    Back to {title}
                  </Link>
                  <h1 className="mt-3 text-2xl font-semibold text-[#17323D]">
                    {item.heading}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-6 text-xs text-[#4c5f66]">
                    <div>
                      <span className="font-semibold text-[#17323D]">
                        Author:
                      </span>{" "}
                      {item.author || "---"}
                    </div>
                    <div>
                      <span className="font-semibold text-[#17323D]">
                        Published Date:
                      </span>{" "}
                      {item.publishedDate || "---"}
                    </div>
                  </div>
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex rounded-full bg-[#17323D] px-4 py-2 text-xs font-semibold text-white"
                    >
                      View PDF
                    </a>
                  )}
                </div>
                <div className="min-w-[180px] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-xs text-[#4c5f66] shadow-sm">
                  <div className="font-semibold text-[#17323D]">Author</div>
                  <div className="mt-1">{item.author || "---"}</div>
                  <div className="mt-3 font-semibold text-[#17323D]">
                    Published Date
                  </div>
                  <div className="mt-1">{item.publishedDate || "---"}</div>
                </div>
              </div>
            </section>

            {item.photos.length > 0 && (
              <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                  Gallery
                </h3>
                <div className="mt-4 space-y-4">
                  {item.photos.length === 1 && (
                    <div className="flex justify-center">
                      <div className="relative h-72 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/80">
                        <Image
                          src={item.photos[0].url}
                          alt={item.photos[0].alt || item.heading}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {item.photos.length === 2 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {item.photos.map((photo) => (
                        <div
                          key={photo.url}
                          className="relative h-64 overflow-hidden rounded-2xl border border-white/80"
                        >
                          <Image
                            src={photo.url}
                            alt={photo.alt || item.heading}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {item.photos.length >= 3 && (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {item.photos.slice(0, 2).map((photo) => (
                          <div
                            key={photo.url}
                            className="relative h-60 overflow-hidden rounded-2xl border border-white/80"
                          >
                            <Image
                              src={photo.url}
                              alt={photo.alt || item.heading}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <div className="relative h-64 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/80">
                          <Image
                            src={item.photos[2].url}
                            alt={item.photos[2].alt || item.heading}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      {item.photos.length > 3 && (
                        <div className="grid gap-4 md:grid-cols-3">
                          {item.photos.slice(3).map((photo) => (
                            <div
                              key={photo.url}
                              className="relative h-44 overflow-hidden rounded-2xl border border-white/80"
                            >
                              <Image
                                src={photo.url}
                                alt={photo.alt || item.heading}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
                Details
              </h3>
              <div
                className="content-body mt-4 space-y-4 text-sm leading-relaxed text-[#4c5f66] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold"
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

export default PageItemDetailView;
