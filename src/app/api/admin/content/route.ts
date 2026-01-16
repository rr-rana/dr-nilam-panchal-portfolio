import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getSiteContent, saveSiteContent } from "@/lib/siteContent";
import { revalidateTag } from "next/cache";
import type { SiteContent } from "@/lib/siteContentTypes";

export const GET = async () => {
  try {
    const content = await getSiteContent({ allowFallback: false });
    const response = NextResponse.json(content);
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SiteContent | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const current = await getSiteContent();
    const nextContent: SiteContent = {
      ...current,
      ...body,
      socialLinks: {
        ...(current.socialLinks || {}),
        ...(body.socialLinks || {}),
      },
    };
    const saved = await saveSiteContent(nextContent);
    revalidateTag("site-content", "default");
    return NextResponse.json(saved);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
