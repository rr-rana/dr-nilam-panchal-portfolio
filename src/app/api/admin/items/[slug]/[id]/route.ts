import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdminRequest } from "@/lib/adminAuth";
import { ALL_PAGES, type PageSlug } from "@/lib/pages";
import {
  deletePageItem,
  getPageItem,
  updatePageItem,
} from "@/lib/pageItems";

const getParams = (request: NextRequest) => {
  const { pathname } = new URL(request.url);
  const parts = pathname.split("/").filter(Boolean);
  const id = parts.at(-1);
  const slug = parts.at(-2);
  return { slug, id };
};

const isValidSlug = (slug: string): slug is PageSlug =>
  ALL_PAGES.some((page) => page.slug === slug);

export const GET = async (request: NextRequest) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug, id } = getParams(request);
  if (!slug || !id || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid page." }, { status: 400 });
  }

  const item = await getPageItem(slug, id);
  if (!item) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(item);
};

export const PUT = async (request: NextRequest) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug, id } = getParams(request);
  if (!slug || !id || !isValidSlug(slug)) {
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
    const item = await updatePageItem(slug, id, {
      heading: body.heading,
      author: body.author?.trim() || undefined,
      publishedDate: body.publishedDate?.trim() || undefined,
      thumbnailUrl: body.thumbnailUrl?.trim() || undefined,
      descriptionHtml: body.descriptionHtml,
      photos: body.photos ?? [],
      videoLinks: body.videoLinks ?? [],
      pdfUrl: body.pdfUrl,
    });

    if (!item) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    revalidateTag("page-items", "max");
    revalidateTag(`page-items:${slug}`, "max");
    revalidateTag(`page-item:${slug}:${id}`, "max");

    return NextResponse.json(item);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug, id } = getParams(request);
  if (!slug || !id || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid page." }, { status: 400 });
  }

  try {
    const deleted = await deletePageItem(slug, id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    revalidateTag("page-items", "max");
    revalidateTag(`page-items:${slug}`, "max");
    revalidateTag(`page-item:${slug}:${id}`, "max");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
