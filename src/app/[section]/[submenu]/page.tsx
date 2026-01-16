import { notFound } from "next/navigation";
import SectionItemsClient from "@/components/content/SectionItemsClient";
import { isSectionSlug, SECTION_DEFINITIONS } from "@/lib/sections";

const Page = async ({
  params,
}: {
  params: Promise<{ section: string; submenu: string }>;
}) => {
  const { section, submenu } = await params;
  if (!isSectionSlug(section)) {
    notFound();
  }

  const title = SECTION_DEFINITIONS[section].label;
  return (
    <SectionItemsClient
      section={section}
      title={title}
      initialSubmenu={submenu}
      showHeader={false}
      showSubmenuLinks={false}
      showBackButton
      backHref={`/${section}`}
      backLabel="Back"
    />
  );
};

export default Page;
