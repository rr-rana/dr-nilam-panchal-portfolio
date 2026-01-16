import "server-only";

import mongoClient, { getMongoDbName } from "@/lib/mongo";
import type { PageSlug } from "@/lib/pages";
import { unstable_cache } from "next/cache";

export type PageContent = {
  slug: PageSlug;
  html: string;
};

type PageContentDocument = {
  _id: PageSlug;
  content: PageContent;
  updatedAt?: Date;
};

const DEFAULT_HTML = "<p></p>";

export const getPageContent = async (slug: PageSlug): Promise<PageContent> => {
  if (!process.env.MONGODB_URI) {
    return { slug, html: DEFAULT_HTML };
  }

  const client = await mongoClient;
  const collection = client
    .db(getMongoDbName())
    .collection<PageContentDocument>("page_content");
  const document = await collection.findOne({ _id: slug });
  if (!document?.content) {
    return { slug, html: DEFAULT_HTML };
  }
  return document.content;
};

export const savePageContent = async (
  slug: PageSlug,
  html: string
): Promise<PageContent> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = await mongoClient;
  const content = { slug, html };
  const collection = client
    .db(getMongoDbName())
    .collection<PageContentDocument>("page_content");
  await collection.updateOne(
    { _id: slug },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true }
  );
  return content;
};

export const getCachedPageContent = (slug: PageSlug) =>
  unstable_cache(
    async () => getPageContent(slug),
    ["page-content", slug],
    { revalidate: false, tags: ["page-content", `page-content:${slug}`] }
  )();
