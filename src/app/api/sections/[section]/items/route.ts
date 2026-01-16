import { NextResponse } from "next/server";
import { isSectionSlug } from "@/lib/sections";
import { getCachedSectionItems } from "@/lib/sectionItems";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) => {
  const { section } = await params;
  if (!isSectionSlug(section)) {
    return NextResponse.json({ items: [] }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const submenu = searchParams.get("submenu") || undefined;
  const items = await getCachedSectionItems(section, submenu);
  const response = NextResponse.json({ items });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
};
