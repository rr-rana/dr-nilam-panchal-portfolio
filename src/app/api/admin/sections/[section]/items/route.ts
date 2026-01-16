import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { isSectionSlug } from "@/lib/sections";
import {
  createSectionItem,
  listSectionItems,
} from "@/lib/sectionItems";
import { listSectionSubmenus } from "@/lib/sectionSubmenus";
import { revalidateTag } from "next/cache";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ section: string }> }
) => {
  const { section } = await params;
  if (!isSectionSlug(section)) {
    return NextResponse.json({ items: [] }, { status: 404 });
  }

  const items = await listSectionItems(section);
  return NextResponse.json({ items });
};

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { section } = await params;
  if (!isSectionSlug(section)) {
    return NextResponse.json({ error: "Invalid section." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as {
    submenuSlug?: string;
    heading?: string;
    author?: string;
    publishedDate?: string;
    thumbnailUrl?: string;
    descriptionHtml?: string;
    photos?: { url: string; alt?: string }[];
    videoLinks?: string[];
    pdfUrl?: string;
  } | null;

  if (!body?.submenuSlug || !body.heading) {
    return NextResponse.json(
      { error: "Submenu and heading are required." },
      { status: 400 }
    );
  }

  const submenus = await listSectionSubmenus(section);
  const isValidSubmenu = submenus.some(
    (submenu) => submenu.slug === body.submenuSlug
  );
  if (!isValidSubmenu) {
    return NextResponse.json({ error: "Invalid submenu." }, { status: 400 });
  }

  try {
    const item = await createSectionItem(section, {
      submenuSlug: body.submenuSlug,
      heading: body.heading,
      author: body.author,
      publishedDate: body.publishedDate,
      thumbnailUrl: body.thumbnailUrl,
      descriptionHtml: body.descriptionHtml ?? "",
      photos: body.photos ?? [],
      videoLinks: body.videoLinks ?? [],
      pdfUrl: body.pdfUrl,
    });

    revalidateTag("section-items", "default");
    revalidateTag(`section-items:${section}`, "default");
    revalidateTag(`section-items:${section}:${body.submenuSlug}`, "default");
    return NextResponse.json(item);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
