import PageItemsView from "@/components/content/PageItemsView";
import { getCachedPageItems } from "@/lib/pageItems";

const Page = async () => {
  const items = await getCachedPageItems("projects");
  return <PageItemsView slug="projects" title="Projects" items={items} />;
};

export default Page;
