"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Quote } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
});

const highlights = [
  {
    title: "Human-centered Health Tech",
    description:
      "Designing personalized exergame systems that blend clinical rigor with playful engagement.",
  },
  {
    title: "Cognitive-Motor Learning",
    description:
      "Exploring how movement and cognition co-adapt to support rehabilitation and aging.",
  },
  {
    title: "Implementation in the Wild",
    description:
      "Bringing lab insights into hospitals, communities, and home-based care settings.",
  },
];

const publications = [
  {
    title: "Co-designing adaptive exergames for neurorehabilitation",
    venue: "Journal of Neuroengineering, 2024",
  },
  {
    title: "A framework for motor-cognitive personalization",
    venue: "CHI Health, 2023",
  },
  {
    title: "Implementation toolkits for digital therapeutics",
    venue: "JMIR Rehabilitation, 2022",
  },
];

const HomeMainContent = () => {
  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
        <h2 className="text-2xl font-semibold text-[#17323D]">Welcome</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#4c5f66]">
          My work sits at the intersection of rehabilitation, health technology,
          and co-design. I collaborate with clinicians, patients, and
          technologists to build playful systems that make exercise feel
          purposeful, measurable, and human.
        </p>
        <div className="mt-5 aspect-video overflow-hidden rounded-2xl border border-white/80 bg-black/90">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            width="100%"
            height="100%"
            controls
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-lg backdrop-blur"
          >
            <h3 className="text-base font-semibold text-[#17323D]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-[#4c5f66]">{item.description}</p>
          </div>
        ))}
      </section>

      <section
        id="publications"
        className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur"
      >
        <h2 className="text-2xl font-semibold text-[#17323D]">
          Selected Publications
        </h2>
        <div className="mt-4 space-y-4">
          {publications.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/80 bg-[#f8f1e3] p-4 text-sm text-[#4c5f66]"
            >
              <p className="font-semibold text-[#17323D]">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7A4C2C]">
                {item.venue}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="awards"
        className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#17323D]">
            Awards & Grants
          </h2>
          <span className="rounded-full bg-[#F2D7A0] px-3 py-1 text-xs font-semibold text-[#17323D]">
            8+ honors
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
            <p className="text-sm font-semibold text-[#17323D]">
              European Digital Health Award
            </p>
            <p className="mt-2 text-sm text-[#4c5f66]">
              Recognized for human-centered rehabilitation prototypes that scale
              to clinical practice.
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
            <p className="text-sm font-semibold text-[#17323D]">
              Innovation in Rehabilitation Grant
            </p>
            <p className="mt-2 text-sm text-[#4c5f66]">
              Funding the next generation of adaptive exergame platforms.
            </p>
          </div>
        </div>
      </section>

      <section
        id="talks"
        className="rounded-3xl border border-white/70 bg-[#17323D] p-6 text-white shadow-xl"
      >
        <div className="flex items-start gap-3">
          <Quote size={24} className="text-[#F2D7A0]" />
          <div>
            <h2 className="text-2xl font-semibold">Talks & Teaching</h2>
            <p className="mt-2 text-sm text-white/80">
              Keynote at Digital Health Week · Course lead for Human-Centered
              Rehabilitation · Doctoral supervision.
            </p>
          </div>
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/90 hover:border-white/50">
          Invite to speak
          <ArrowUpRight size={14} />
        </button>
      </section>
    </main>
  );
};

export default HomeMainContent;
