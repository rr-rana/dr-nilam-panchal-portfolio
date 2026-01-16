import { notFound } from "next/navigation";
import SectionItemsClient from "@/components/content/SectionItemsClient";
import { isSectionSlug, SECTION_DEFINITIONS } from "@/lib/sections";

const Page = async ({ params }: { params: Promise<{ section: string }> }) => {
  const { section } = await params;
  if (!isSectionSlug(section)) {
    notFound();
  }

  const title = SECTION_DEFINITIONS[section].label;
  return <SectionItemsClient section={section} title={title} />;
};

export default Page;
