"use client";

import Image from "next/image";
import { BookOpen, CalendarCheck, Mail, MapPin, Medal } from "lucide-react";

type HomeSidebarProps = {
  profileImageUrl: string;
};

const HomeSidebar = ({ profileImageUrl }: HomeSidebarProps) => {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xl backdrop-blur">
        <div className="relative flex justify-center -mt-28">
          <Image
            src={profileImageUrl}
            alt="Profile portrait"
            className="h-44 w-44 rounded-2xl border-4 border-white object-cover shadow-lg"
            width={176}
            height={176}
            key={profileImageUrl}
          />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-[#17323D]">
          Patrick Manser
        </h2>
        <p className="mt-1 text-sm text-[#5a6b73]">
          Visionary researcher on serious exergames for health.
        </p>
        <div className="mt-4 space-y-2 text-sm text-[#2d3b41]">
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-[#7A4C2C]" />
            Zurich, Switzerland
          </p>
          <p className="flex items-center gap-2">
            <Mail size={16} className="text-[#7A4C2C]" />
            patrick.manser@ki.se
          </p>
        </div>
        <div className="mt-5 rounded-xl bg-[#f8f1e3] p-4 text-xs text-[#6b4a33]">
          Currently leading the Exergame Lab at ETH Zurich, focused on
          translational digital therapeutics.
        </div>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-lg backdrop-blur">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
          Quick Links
        </h3>
        <div className="mt-4 space-y-3 text-sm text-[#1f2f36]">
          <a className="flex items-center gap-2 hover:text-[#7A4C2C]" href="#publications">
            <BookOpen size={16} />
            Publications
          </a>
          <a className="flex items-center gap-2 hover:text-[#7A4C2C]" href="#awards">
            <Medal size={16} />
            Awards & Grants
          </a>
          <a className="flex items-center gap-2 hover:text-[#7A4C2C]" href="#talks">
            <CalendarCheck size={16} />
            Talks & Teaching
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-white/80 bg-[#17323D] p-5 text-white shadow-lg">
        <p className="text-sm leading-relaxed text-white/90">
          Science thrives on collaboration and critical discussion. If you&apos;re
          curious to learn more about my work, open to engaging with my mission,
          or interested in building a shared vision, I'd love to hear from you.
          Please get in touch via email (see above) or through one of the
          platforms below.
        </p>
      </div>

      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-lg backdrop-blur">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A4C2C]">
          Social Links
        </h3>
        <div className="mt-4 space-y-2 text-sm text-[#1f2f36]">
          <a className="flex items-center gap-3 hover:text-[#7A4C2C]" href="https://www.linkedin.com">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[10px] font-semibold uppercase text-[#17323D]">
              in
            </span>
            LinkedIn
          </a>
          <a className="flex items-center gap-3 hover:text-[#7A4C2C]" href="https://www.researchgate.net">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[10px] font-semibold uppercase text-[#17323D]">
              r
            </span>
            ResearchGate
          </a>
          <a className="flex items-center gap-3 hover:text-[#7A4C2C]" href="https://www.webofscience.com">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[10px] font-semibold uppercase text-[#17323D]">
              w
            </span>
            Web of Science
          </a>
          <a className="flex items-center gap-3 hover:text-[#7A4C2C]" href="https://orcid.org">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[10px] font-semibold uppercase text-[#17323D]">
              id
            </span>
            ORCID
          </a>
          <a className="flex items-center gap-3 hover:text-[#7A4C2C]" href="https://scholar.google.com">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[10px] font-semibold uppercase text-[#17323D]">
              g
            </span>
            Google Scholar
          </a>
          <a className="flex items-center gap-3 hover:text-[#7A4C2C]" href="#">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17323D]/10 text-[10px] font-semibold uppercase text-[#17323D]">
              i
            </span>
            Institutional Web Page
          </a>
        </div>
      </div>
    </aside>
  );
};

export default HomeSidebar;
