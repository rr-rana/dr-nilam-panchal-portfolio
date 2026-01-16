import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { isSectionSlug } from "@/lib/sections";
import {
  deleteSectionSubmenu,
  updateSectionSubmenu,
} from "@/lib/sectionSubmenus";
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
    label?: string;
  } | null;
  if (!body?.label) {
    return NextResponse.json({ error: "Label is required." }, { status: 400 });
  }

  try {
    const updated = await updateSectionSubmenu(section, id, body.label);
    if (!updated) {
      return NextResponse.json({ error: "Submenu not found." }, { status: 404 });
    }
    revalidateTag("section-submenus", "default");
    revalidateTag(`section-submenus:${section}`, "default");
    revalidateTag("section-items", "default");
    revalidateTag(`section-items:${section}`, "default");
    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update submenu.";
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
    const ok = await deleteSectionSubmenu(section, id);
    if (!ok) {
      return NextResponse.json({ error: "Submenu not found." }, { status: 404 });
    }
    revalidateTag("section-submenus", "default");
    revalidateTag(`section-submenus:${section}`, "default");
    revalidateTag("section-items", "default");
    revalidateTag(`section-items:${section}`, "default");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete submenu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
