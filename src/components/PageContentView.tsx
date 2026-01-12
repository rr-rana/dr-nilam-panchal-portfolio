"use client";

import { useEffect, useState } from "react";
import HomeSidebar from "@/components/HomeSidebar";
import type { SiteContent } from "@/lib/siteContentTypes";
import type { PageContent } from "@/lib/pageContent";

type PageContentViewProps = {
  slug: string;
  title: string;
};

const PageContentView = ({ slug, title }: PageContentViewProps) => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [siteRes, pageRes] = await Promise.all([
        fetch("/api/content", { cache: "no-store" }),
        fetch(`/api/pages/${slug}`, { cache: "no-store" }),
      ]);
      if (!siteRes.ok || !pageRes.ok) return;
      const [siteData, pageData] = await Promise.all([
        siteRes.json(),
        pageRes.json(),
      ]);
      if (active) {
        setSiteContent(siteData);
        setPageContent(pageData);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (!siteContent || !pageContent) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="pt-10 text-sm text-[#4c5f66]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1e7_0%,#f3ede1_35%,#ebe4d6_65%,#e2d9c7_100%)]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-8">
            <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div
                className="space-y-4 text-sm leading-relaxed text-[#4c5f66] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: pageContent.html }}
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageContentView;
