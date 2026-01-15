import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdminRequest } from "@/lib/adminAuth";
import { ALL_PAGES, type PageSlug } from "@/lib/pages";
import { createPageItem, listPageItems } from "@/lib/pageItems";

const getSlug = (request: NextRequest) => {
  const { pathname } = new URL(request.url);
  const parts = pathname.split("/").filter(Boolean);
  return parts.at(-1);
};

const isValidSlug = (slug: string): slug is PageSlug =>
  ALL_PAGES.some((page) => page.slug === slug);

export const GET = async (request: NextRequest) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const slug = getSlug(request);
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid page." }, { status: 400 });
  }

  const items = await listPageItems(slug);
  return NextResponse.json({ items });
};

export const POST = async (request: NextRequest) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const slug = getSlug(request);
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid page." }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        heading?: string;
        author?: string;
        publishedDate?: string;
        thumbnailUrl?: string;
        descriptionHtml?: string;
        photos?: { url: string; alt?: string }[];
        videoLinks?: string[];
        pdfUrl?: string;
      }
    | null;

  if (!body?.heading || !body.descriptionHtml) {
    return NextResponse.json(
      { error: "Heading and description are required." },
      { status: 400 }
    );
  }

  try {
    const item = await createPageItem(slug, {
      heading: body.heading,
      author: body.author?.trim() || undefined,
      publishedDate: body.publishedDate?.trim() || undefined,
      thumbnailUrl: body.thumbnailUrl?.trim() || undefined,
      descriptionHtml: body.descriptionHtml,
      photos: body.photos ?? [],
      videoLinks: body.videoLinks ?? [],
      pdfUrl: body.pdfUrl,
    });

    revalidateTag("page-items", "max");
    revalidateTag(`page-items:${slug}`, "max");

    return NextResponse.json(item);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
