import Link from "next/link";
import { BookOpen, CalendarCheck, Medal } from "lucide-react";
import { SOCIAL_LINK_OPTIONS } from "@/lib/socialLinks";
import { getCachedSiteContent } from "@/lib/siteContent";

const BottomLinks = async () => {
  const content = await getCachedSiteContent();

  return (
    <section className="mt-12 bg-[#f3ede1] lg:hidden">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
            Quick Links
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[#1f2f36]">
            <Link
              className="flex items-center gap-2 hover:text-[#7A4C2C]"
              href="/publications"
            >
              <BookOpen size={16} />
              Publications
            </Link>
            <Link
              className="flex items-center gap-2 hover:text-[#7A4C2C]"
              href="/awards"
            >
              <Medal size={16} />
              Awards & Grants
            </Link>
            <Link
              className="flex items-center gap-2 hover:text-[#7A4C2C]"
              href="/teaching"
            >
              <CalendarCheck size={16} />
              Talks & Teaching
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
            Social Links
          </h3>
          <div className="mt-4 space-y-2 text-sm text-[#1f2f36]">
            {SOCIAL_LINK_OPTIONS.map(({ id, label, Icon }) => {
              const url = content.socialLinks?.[id];
              if (!url) return null;
              return (
                <a
                  key={id}
                  className="flex items-center gap-3 hover:text-[#7A4C2C]"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[#17323D]">
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
