import { notFound } from "next/navigation";
import SectionItemDetailView from "@/components/content/SectionItemDetailView";
import { getCachedSectionItem } from "@/lib/sectionItems";

const Page = async ({
  params,
}: {
  params: Promise<{ submenu: string; id: string }>;
}) => {
  const { submenu, id } = await params;
  const item = await getCachedSectionItem(
    "research-publications",
    submenu,
    id
  );
  if (!item) {
    notFound();
  }

  return (
    <SectionItemDetailView
      section="research-publications"
      title="Research & Publications"
      submenuSlug={submenu}
      item={item}
    />
  );
};

export default Page;
