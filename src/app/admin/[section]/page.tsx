import { notFound } from "next/navigation";
import AdminSectionContentManager from "@/components/admin/AdminSectionContentManager";
import { isSectionSlug, SECTION_DEFINITIONS } from "@/lib/sections";

const Page = async ({ params }: { params: Promise<{ section: string }> }) => {
  const { section } = await params;
  if (!isSectionSlug(section)) {
    notFound();
  }

  return (
    <AdminSectionContentManager
      section={section}
      title={SECTION_DEFINITIONS[section].label}
    />
  );
};

export default Page;
