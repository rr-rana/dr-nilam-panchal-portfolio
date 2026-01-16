import SectionItemsClient from "@/components/content/SectionItemsClient";

const Page = async ({ params }: { params: Promise<{ submenu: string }> }) => {
  const { submenu } = await params;
  return (
    <SectionItemsClient
      section="research-publications"
      title="Research & Publications"
      initialSubmenu={submenu}
      showHeader={false}
      showSubmenuLinks={false}
      showBackButton
      backHref="/research-publications"
      backLabel="Back"
    />
  );
};

export default Page;
