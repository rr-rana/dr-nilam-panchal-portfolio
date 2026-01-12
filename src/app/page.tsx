"use client";

import { useEffect, useState } from "react";
import HomeBanner from "@/components/HomeBanner";
import HomeSidebar from "@/components/HomeSidebar";
import HomeMainContent from "@/components/HomeMainContent";
import type { SiteContent } from "@/lib/siteContentTypes";

const Home = () => {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const response = await fetch("/api/content", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as SiteContent;
      if (active) setContent(data);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (!content) {
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
        <HomeBanner bannerImageUrl={content.bannerImageUrl} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={content} />
          <HomeMainContent content={content} />
        </div>
      </div>
    </div>
  );
};

export default Home;
