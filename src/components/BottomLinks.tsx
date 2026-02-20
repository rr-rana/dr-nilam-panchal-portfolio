import Link from "next/link";
import { BookOpen, CalendarCheck, Medal } from "lucide-react";
import { SOCIAL_LINK_OPTIONS } from "@/lib/socialLinks";
import { getCachedSiteContent } from "@/lib/siteContent";

const BottomLinks = async () => {
  const content = await getCachedSiteContent();

  return (
    <section className="mt-12 border-t border-[#d4deea] bg-[#eef3f9] lg:hidden">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 gap-6">
        <div className="site-panel p-6">
          <h3 className="site-kicker">
            Quick Links
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[#21374c]">
            <Link
              className="flex items-center gap-2 hover:text-[#1b3b5a]"
              href="/research-publications"
            >
              <BookOpen size={16} />
              Research & Publications
            </Link>
            <Link
              className="flex items-center gap-2 hover:text-[#1b3b5a]"
              href="/achievements-awards"
            >
              <Medal size={16} />
              Achievements & Awards
            </Link>
            <Link
              className="flex items-center gap-2 hover:text-[#1b3b5a]"
              href="/teaching-training"
            >
              <CalendarCheck size={16} />
              Teaching & Training
            </Link>
          </div>
        </div>

        <div className="site-panel p-6">
          <h3 className="site-kicker">
            Social Links
          </h3>
          <div className="mt-4 space-y-2 text-sm text-[#21374c]">
            {SOCIAL_LINK_OPTIONS.map(({ id, label, Icon }) => {
              const url = content.socialLinks?.[id];
              if (!url) return null;
              return (
                <a
                  key={id}
                  className="flex items-center gap-3 hover:text-[#1b3b5a]"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e7eff8] text-[#17324a]">
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
