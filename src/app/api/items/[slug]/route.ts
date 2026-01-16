import { NextResponse } from "next/server";
import { getCachedPageItems } from "@/lib/pageItems";
import { ALL_PAGES, type PageSlug } from "@/lib/pages";

const allowedSlugs = new Set<PageSlug>(ALL_PAGES.map((page) => page.slug));

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;
  const resolvedSlug = slug as PageSlug;
  if (!allowedSlugs.has(resolvedSlug)) {
    return NextResponse.json({ items: [] }, { status: 404 });
  }

  const items = await getCachedPageItems(resolvedSlug);
  const response = NextResponse.json({ items });
  response.headers.set(
    "Cache-Control",
    "no-store, max-age=0"
  );
  return response;
};
