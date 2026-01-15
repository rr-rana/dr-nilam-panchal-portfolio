import PageItemsView from "@/components/content/PageItemsView";
import { getCachedPageItems } from "@/lib/pageItems";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const items = await getCachedPageItems("projects");
  const resolvedSearchParams = await searchParams;
  const pageSize = 5;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const requestedPage = Number(resolvedSearchParams.page) || 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pagedItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <PageItemsView
      slug="projects"
      title="Projects"
      items={pagedItems}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
    />
  );
};

export default Page;
