import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { isSectionSlug } from "@/lib/sections";
import {
  createSectionSubmenu,
  listSectionSubmenus,
} from "@/lib/sectionSubmenus";
import { revalidateTag } from "next/cache";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ section: string }> }
) => {
  const { section } = await params;
  if (!isSectionSlug(section)) {
    return NextResponse.json({ submenus: [] }, { status: 404 });
  }

  const submenus = await listSectionSubmenus(section);
  return NextResponse.json({ submenus });
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
    label?: string;
  } | null;
  if (!body?.label) {
    return NextResponse.json({ error: "Label is required." }, { status: 400 });
  }

  try {
    const submenu = await createSectionSubmenu(section, body.label);
    revalidateTag("section-submenus", "default");
    revalidateTag(`section-submenus:${section}`, "default");
    return NextResponse.json(submenu);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create submenu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
