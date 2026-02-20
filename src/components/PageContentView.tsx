import HomeSidebar from "@/components/HomeSidebar";
import { getCachedSiteContent } from "@/lib/siteContent";
import { getCachedPageContent } from "@/lib/pageContent";
import type { PageSlug } from "@/lib/pages";

type PageContentViewProps = {
  slug: string;
  title: string;
};

const PageContentView = async ({ slug }: PageContentViewProps) => {
  const [siteContent, pageContent] = await Promise.all([
    getCachedSiteContent(),
    getCachedPageContent(slug as PageSlug),
  ]);

  return (
    <div className="site-bg">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <main className="space-y-8">
            <section className="site-panel p-6">
              <div
                className="content-body space-y-4 text-sm leading-relaxed text-[#415261] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-[#17324a]"
                dangerouslySetInnerHTML={{ __html: pageContent.html }}
              />
            </section>
          </main>
          <HomeSidebar content={siteContent} variant="compact" />
        </div>
      </div>
    </div>
  );
};

export default PageContentView;
