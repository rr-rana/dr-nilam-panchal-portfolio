import HomeBanner from "@/components/HomeBanner";
import HomeSidebar from "@/components/HomeSidebar";
import HomeMainContent from "@/components/HomeMainContent";
import { getCachedSiteContent } from "@/lib/siteContent";

const Home = async () => {
  const content = await getCachedSiteContent();

  return (
    <div className="site-bg">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <HomeBanner
          bannerSlides={content.bannerSlides}
          fallbackImageUrl={content.bannerImageUrl}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <HomeSidebar content={content} />
          <HomeMainContent content={content} />
        </div>
      </div>
    </div>
  );
};

export default Home;
