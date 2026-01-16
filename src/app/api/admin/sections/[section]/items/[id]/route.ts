import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { isSectionSlug } from "@/lib/sections";
import { deleteSectionItem, updateSectionItem } from "@/lib/sectionItems";
import { listSectionSubmenus } from "@/lib/sectionSubmenus";
import { revalidateTag } from "next/cache";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { section, id } = await params;
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
    const item = await updateSectionItem(section, id, {
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

    if (!item) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    revalidateTag("section-items", "default");
    revalidateTag(`section-items:${section}`, "default");
    revalidateTag(`section-items:${section}:${body.submenuSlug}`, "default");
    revalidateTag(`section-item:${section}:${body.submenuSlug}:${id}`, "default");
    return NextResponse.json(item);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { section, id } = await params;
  if (!isSectionSlug(section)) {
    return NextResponse.json({ error: "Invalid section." }, { status: 400 });
  }

  try {
    const ok = await deleteSectionItem(section, id);
    if (!ok) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }
    revalidateTag("section-items", "default");
    revalidateTag(`section-items:${section}`, "default");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
