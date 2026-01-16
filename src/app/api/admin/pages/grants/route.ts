import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getPageContent, savePageContent } from "@/lib/pageContent";
import { revalidateTag } from "next/cache";

export const GET = async () => {
  const content = await getPageContent("grants");
  const response = NextResponse.json(content);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
};

export const PUT = async (request: NextRequest) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { html?: string }
    | null;
  if (!body || typeof body.html !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const saved = await savePageContent("grants", body.html);
    revalidateTag("page-content");
    revalidateTag("page-content:grants");
    return NextResponse.json(saved);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
