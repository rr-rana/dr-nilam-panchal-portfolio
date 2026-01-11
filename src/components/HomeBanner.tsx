import Image from "next/image";
import bannerImage from "@/assets/banner.png";

const HomeBanner = () => {
  return (
    <section className="pt-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/50 shadow-2xl">
        <Image
          src={bannerImage}
          alt="Research group"
          className="h-56 w-full object-cover md:h-72"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>
    </section>
  );
};

export default HomeBanner;
