import Image from "next/image";
import type { SectionSlug } from "@/lib/sections";

import researchBanner from "@/assets/page-banners/research.png";
import moocsBanner from "@/assets/page-banners/MOOCs.png";
import eventsBanner from "@/assets/page-banners/events.png";
import teachingBanner from "@/assets/page-banners/teaching.png";
import seminarBanner from "@/assets/page-banners/seminar.png";
import achievementsBanner from "@/assets/page-banners/achievements.png";
import administrativeBanner from "@/assets/page-banners/administrative.png";
import othersBanner from "@/assets/page-banners/others.png";

type SectionHeaderLeftProps = {
  section: SectionSlug;
  title: string;
};

const SectionHeaderLeft = ({ section, title }: SectionHeaderLeftProps) => {
  const headerImage =
    {
      "research-publications": researchBanner,
      "moocs-e-content": moocsBanner,
      "events-engagements": eventsBanner,
      "teaching-training": teachingBanner,
      "seminar-conferences": seminarBanner,
      "achievements-awards": achievementsBanner,
      administrative: administrativeBanner,
      others: othersBanner,
    }[section] ?? null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#17323D]">{title}</h1>
      <p className="mt-2 text-sm text-[#4c5f66]">
        Explore the latest updates and detailed academic highlights.
      </p>
      {headerImage && (
        <div className="mt-5 overflow-hidden rounded-3xl border border-white/80 bg-white shadow-sm">
          <Image
            src={headerImage}
            alt={`${title} banner`}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
          />
        </div>
      )}
    </div>
  );
};

export default SectionHeaderLeft;
