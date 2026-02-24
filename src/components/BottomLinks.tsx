import Link from "next/link";
import { BookOpen, CalendarCheck, Medal } from "lucide-react";
import { SOCIAL_LINK_OPTIONS } from "@/lib/socialLinks";
import { getCachedSiteContent } from "@/lib/siteContent";

const BottomLinks = async () => {
  const content = await getCachedSiteContent();

  return (
    <section className="mt-12 lg:hidden">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 gap-6">
        <div className="public-card rounded-[1.6rem] p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b86d3a]">
            Quick Links
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[#1f2f36]">
            <Link
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#b86d3a]"
              href="/research-publications"
            >
              <BookOpen size={16} />
              Research & Publications
            </Link>
            <Link
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#b86d3a]"
              href="/achievements-awards"
            >
              <Medal size={16} />
              Achievements & Awards
            </Link>
            <Link
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#b86d3a]"
              href="/teaching-training"
            >
              <CalendarCheck size={16} />
              Teaching & Training
            </Link>
          </div>
        </div>

        <div className="public-card rounded-[1.6rem] p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b86d3a]">
            Social Links
          </h3>
          <div className="mt-4 space-y-2 text-sm text-[#1f2f36]">
            {SOCIAL_LINK_OPTIONS.map(({ id, label, Icon }) => {
              const url = content.socialLinks?.[id];
              if (!url) return null;
              return (
                <a
                  key={id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-[#b86d3a]"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d8e6ed] text-[#17323D]">
                    <Icon size={14} />
                  </span>
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomLinks;
