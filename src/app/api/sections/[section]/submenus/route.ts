import { NextResponse } from "next/server";
import { isSectionSlug } from "@/lib/sections";
import { getCachedSectionSubmenus } from "@/lib/sectionSubmenus";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ section: string }> }
) => {
  const { section } = await params;
  if (!isSectionSlug(section)) {
    return NextResponse.json({ submenus: [] }, { status: 404 });
  }

  const submenus = await getCachedSectionSubmenus(section);
  const response = NextResponse.json({ submenus });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
};
