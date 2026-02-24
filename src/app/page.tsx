import HomeBanner from "@/components/HomeBanner";
import HomeSidebar from "@/components/HomeSidebar";
import HomeMainContent from "@/components/HomeMainContent";
import { getCachedSiteContent } from "@/lib/siteContent";

const Home = async () => {
  const content = await getCachedSiteContent();

  return (
    <div className="public-page">
      <div className="px-0 pb-18">
        <HomeBanner
          bannerSlides={content.bannerSlides}
          fallbackImageUrl={content.bannerImageUrl}
        />

        <div className="max-w-7xl mx-auto px-5">
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <HomeMainContent content={content} />
            <HomeSidebar content={content} variant="linksOnly" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
