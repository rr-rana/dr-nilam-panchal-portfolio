import "server-only";

import crypto from "crypto";
import { unstable_cache } from "next/cache";
import mongoClient, { getMongoDbName } from "@/lib/mongo";
import type { SectionSlug } from "@/lib/sections";

export type SectionItemPhoto = {
  url: string;
  alt?: string;
};

export type SectionItem = {
  id: string;
  section: SectionSlug;
  submenuSlug: string;
  heading: string;
  author?: string;
  publishedDate?: string;
  thumbnailUrl?: string;
  descriptionHtml: string;
  photos: SectionItemPhoto[];
  videoLinks: string[];
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SectionItemInput = {
  submenuSlug: string;
  heading: string;
  author?: string;
  publishedDate?: string;
  thumbnailUrl?: string;
  descriptionHtml: string;
  photos: SectionItemPhoto[];
  videoLinks: string[];
  pdfUrl?: string;
};

type SectionItemDocument = {
  _id: string;
  section: SectionSlug;
  submenuSlug: string;
  heading: string;
  author?: string;
  publishedDate?: string;
  thumbnailUrl?: string;
  descriptionHtml: string;
  photos: SectionItemPhoto[];
  videoLinks: string[];
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const getSectionItemsCollection = async () => {
  const client = await mongoClient;
  return client
    .db(getMongoDbName())
    .collection<SectionItemDocument>("section_items");
};

const mapDocument = (document: SectionItemDocument): SectionItem => ({
  id: document._id,
  section: document.section,
  submenuSlug: document.submenuSlug,
  heading: document.heading,
  author: document.author,
  publishedDate: document.publishedDate,
  thumbnailUrl: document.thumbnailUrl,
  descriptionHtml: document.descriptionHtml,
  photos: document.photos ?? [],
  videoLinks: document.videoLinks ?? [],
  pdfUrl: document.pdfUrl,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

export const listSectionItems = async (
  section: SectionSlug,
  submenuSlug?: string
): Promise<SectionItem[]> => {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const collection = await getSectionItemsCollection();
  const filter: Partial<Pick<SectionItemDocument, "section" | "submenuSlug">> = {
    section,
  };
  if (submenuSlug) {
    filter.submenuSlug = submenuSlug;
  }
  const documents = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
  return documents.map(mapDocument);
};

export const getSectionItem = async (
  section: SectionSlug,
  submenuSlug: string,
  id: string
): Promise<SectionItem | null> => {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const collection = await getSectionItemsCollection();
  const document = await collection.findOne({
    _id: id,
    section,
    submenuSlug,
  });
  return document ? mapDocument(document) : null;
};

export const createSectionItem = async (
  section: SectionSlug,
  input: SectionItemInput
): Promise<SectionItem> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getSectionItemsCollection();
  const now = new Date();
  const document: SectionItemDocument = {
    _id: crypto.randomUUID(),
    section,
    submenuSlug: input.submenuSlug,
    heading: input.heading,
    author: input.author,
    publishedDate: input.publishedDate,
    thumbnailUrl: input.thumbnailUrl,
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

export const updateSectionItem = async (
  section: SectionSlug,
  id: string,
  input: SectionItemInput
): Promise<SectionItem | null> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getSectionItemsCollection();
  const updatedAt = new Date();
  const result = await collection.findOneAndUpdate(
    { _id: id, section },
    {
      $set: {
        submenuSlug: input.submenuSlug,
        heading: input.heading,
        author: input.author,
        publishedDate: input.publishedDate,
        thumbnailUrl: input.thumbnailUrl,
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

export const deleteSectionItem = async (
  section: SectionSlug,
  id: string
): Promise<boolean> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getSectionItemsCollection();
  const result = await collection.deleteOne({ _id: id, section });
  return result.deletedCount > 0;
};

export const getCachedSectionItems = (
  section: SectionSlug,
  submenuSlug?: string
) =>
  unstable_cache(
    async () => listSectionItems(section, submenuSlug),
    ["section-items", section, submenuSlug ?? "all"],
    {
      revalidate: false,
      tags: [
        "section-items",
        `section-items:${section}`,
        `section-items:${section}:${submenuSlug ?? "all"}`,
      ],
    }
  )();

export const getCachedSectionItem = (
  section: SectionSlug,
  submenuSlug: string,
  id: string
) =>
  unstable_cache(
    async () => getSectionItem(section, submenuSlug, id),
    ["section-item", section, submenuSlug, id],
    {
      revalidate: false,
      tags: [
        "section-items",
        `section-items:${section}`,
        `section-items:${section}:${submenuSlug}`,
        `section-item:${section}:${submenuSlug}:${id}`,
      ],
    }
  )();
