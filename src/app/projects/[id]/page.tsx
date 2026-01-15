import { notFound } from "next/navigation";
import PageItemDetailView from "@/components/content/PageItemDetailView";
import { getCachedPageItem } from "@/lib/pageItems";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const item = await getCachedPageItem("projects", id);
  if (!item) {
    notFound();
  }

  return (
    <PageItemDetailView slug="projects" title="Projects" item={item} />
  );
};

export default Page;
