import Image from "next/image";
import { ArrowUpRight, BookOpen, CalendarCheck, Mail, MapPin, Medal } from "lucide-react";
import profileImage from "@/assets/profile.jpg";

const HomeSidebar = () => {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xl backdrop-blur">
        <div className="relative -mt-12 flex justify-center">
          <Image
            src={profileImage}
            alt="Profile portrait"
            className="h-32 w-32 rounded-2xl border-4 border-white object-cover shadow-lg"
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
        <p className="text-sm uppercase tracking-[0.2em] text-white/70">
          Office Hours
        </p>
        <p className="mt-2 text-sm text-white/90">
          Available for collaborations and supervision inquiries.
        </p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F2D7A0] px-4 py-2 text-xs font-semibold text-[#17323D]">
          Book a meeting
          <ArrowUpRight size={14} />
        </button>
      </div>
    </aside>
  );
};

export default HomeSidebar;
