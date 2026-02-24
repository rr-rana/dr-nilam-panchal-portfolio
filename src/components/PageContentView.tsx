import HomeSidebar from "@/components/HomeSidebar";
import { getCachedSiteContent } from "@/lib/siteContent";
import { getCachedPageContent } from "@/lib/pageContent";
import type { PageSlug } from "@/lib/pages";

type PageContentViewProps = {
  slug: string;
  title: string;
};

const PageContentView = async ({ slug, title }: PageContentViewProps) => {
  const [siteContent, pageContent] = await Promise.all([
    getCachedSiteContent(),
    getCachedPageContent(slug as PageSlug),
  ]);

  return (
    <div className="public-page">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="pt-2 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          <HomeSidebar content={siteContent} variant="compact" />
          <main className="space-y-6">
            <section className="public-card rounded-[1.8rem] p-6 sm:p-8">
              <h1 className="public-hero-title text-3xl font-bold text-[#153042]">
                {title}
              </h1>
              <div
                className="content-body public-prose mt-5 text-sm leading-relaxed sm:text-[15px]"
                dangerouslySetInnerHTML={{ __html: pageContent.html }}
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageContentView;
