import "server-only";

import crypto from "crypto";
import { unstable_cache } from "next/cache";
import mongoClient, { getMongoDbName } from "@/lib/mongo";
import type { PageSlug } from "@/lib/pages";

export type PageItemPhoto = {
  url: string;
  alt?: string;
};

export type PageItem = {
  id: string;
  slug: PageSlug;
  heading: string;
  descriptionHtml: string;
  photos: PageItemPhoto[];
  videoLinks: string[];
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PageItemInput = {
  heading: string;
  descriptionHtml: string;
  photos: PageItemPhoto[];
  videoLinks: string[];
  pdfUrl?: string;
};

type PageItemDocument = {
  _id: string;
  slug: PageSlug;
  heading: string;
  descriptionHtml: string;
  photos: PageItemPhoto[];
  videoLinks: string[];
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

const getCollection = async () => {
  const client = await mongoClient;
  return client
    .db(getMongoDbName())
    .collection<PageItemDocument>("page_items");
};

const mapDocument = (document: PageItemDocument): PageItem => ({
  id: document._id,
  slug: document.slug,
  heading: document.heading,
  descriptionHtml: document.descriptionHtml,
  photos: document.photos,
  videoLinks: document.videoLinks,
  pdfUrl: document.pdfUrl,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

export const listPageItems = async (slug: PageSlug): Promise<PageItem[]> => {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const collection = await getCollection();
  const documents = await collection
    .find({ slug })
    .sort({ createdAt: -1 })
    .toArray();
  return documents.map(mapDocument);
};

export const getPageItem = async (
  slug: PageSlug,
  id: string
): Promise<PageItem | null> => {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const collection = await getCollection();
  const document = await collection.findOne({ _id: id, slug });
  return document ? mapDocument(document) : null;
};

export const createPageItem = async (
  slug: PageSlug,
  input: PageItemInput
): Promise<PageItem> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getCollection();
  const now = new Date();
  const document: PageItemDocument = {
    _id: crypto.randomUUID(),
    slug,
    heading: input.heading,
    descriptionHtml: input.descriptionHtml,
    photos: input.photos,
    videoLinks: input.videoLinks,
    pdfUrl: input.pdfUrl,
    createdAt: now,
    updatedAt: now,
  };
  await collection.insertOne(document);
  return mapDocument(document);
};

export const updatePageItem = async (
  slug: PageSlug,
  id: string,
  input: PageItemInput
): Promise<PageItem | null> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getCollection();
  const updatedAt = new Date();
  const result = await collection.findOneAndUpdate(
    { _id: id, slug },
    {
      $set: {
        heading: input.heading,
        descriptionHtml: input.descriptionHtml,
        photos: input.photos,
        videoLinks: input.videoLinks,
        pdfUrl: input.pdfUrl,
        updatedAt,
      },
    },
    { returnDocument: "after" }
  );

  return result ? mapDocument(result) : null;
};

export const deletePageItem = async (
  slug: PageSlug,
  id: string
): Promise<boolean> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: id, slug });
  return result.deletedCount > 0;
};

export const getCachedPageItems = (slug: PageSlug) =>
  unstable_cache(
    async () => listPageItems(slug),
    ["page-items", slug],
    { revalidate: 300, tags: ["page-items", `page-items:${slug}`] }
  )();

export const getCachedPageItem = (slug: PageSlug, id: string) =>
  unstable_cache(
    async () => getPageItem(slug, id),
    ["page-item", slug, id],
    { revalidate: 300, tags: ["page-items", `page-item:${slug}:${id}`] }
  )();
