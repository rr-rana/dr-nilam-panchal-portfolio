import { notFound } from "next/navigation";
import SectionItemDetailView from "@/components/content/SectionItemDetailView";
import { getCachedSectionItem } from "@/lib/sectionItems";
import { isSectionSlug, SECTION_DEFINITIONS } from "@/lib/sections";

const Page = async ({
  params,
}: {
  params: Promise<{ section: string; submenu: string; id: string }>;
}) => {
  const { section, submenu, id } = await params;
  if (!isSectionSlug(section)) {
    notFound();
  }

  const item = await getCachedSectionItem(section, submenu, id);
  if (!item) {
    notFound();
  }

  return (
    <SectionItemDetailView
      section={section}
      title={SECTION_DEFINITIONS[section].label}
      submenuSlug={submenu}
      item={item}
    />
  );
};

export default Page;
