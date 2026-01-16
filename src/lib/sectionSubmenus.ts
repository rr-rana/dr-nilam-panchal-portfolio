import "server-only";

import crypto from "crypto";
import mongoClient, { getMongoDbName } from "@/lib/mongo";
import { unstable_cache } from "next/cache";
import { SECTION_DEFINITIONS, type SectionSlug } from "@/lib/sections";
import { getSectionItemsCollection } from "@/lib/sectionItems";

export type SectionSubmenu = {
  id: string;
  section: SectionSlug;
  slug: string;
  label: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type SectionSubmenuDocument = {
  _id: string;
  section: SectionSlug;
  slug: string;
  label: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

const mapDocument = (document: SectionSubmenuDocument): SectionSubmenu => ({
  id: document._id,
  section: document.section,
  slug: document.slug,
  label: document.label,
  order: document.order,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

const getCollection = async () => {
  const client = await mongoClient;
  return client
    .db(getMongoDbName())
    .collection<SectionSubmenuDocument>("section_submenus");
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const listSectionSubmenus = async (
  section: SectionSlug
): Promise<SectionSubmenu[]> => {
  if (!process.env.MONGODB_URI) {
    const fallback = SECTION_DEFINITIONS[section]?.defaultSubmenus ?? [];
    return fallback.map((entry, index) => ({
      id: entry.slug,
      section,
      slug: entry.slug,
      label: entry.label,
      order: index,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    }));
  }

  const collection = await getCollection();
  const documents = await collection
    .find({ section })
    .sort({ order: 1 })
    .toArray();

  if (documents.length) {
    return documents.map(mapDocument);
  }

  const defaults = SECTION_DEFINITIONS[section]?.defaultSubmenus ?? [];
  if (!defaults.length) {
    return [];
  }

  const now = new Date();
  const seedDocs = defaults.map((entry, index) => ({
    _id: crypto.randomUUID(),
    section,
    slug: entry.slug,
    label: entry.label,
    order: index,
    createdAt: now,
    updatedAt: now,
  }));
  await collection.insertMany(seedDocs);
  return seedDocs.map(mapDocument);
};

export const createSectionSubmenu = async (
  section: SectionSlug,
  label: string
): Promise<SectionSubmenu> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getCollection();
  const slug = slugify(label);
  if (!slug) {
    throw new Error("Invalid label.");
  }

  const existing = await collection.findOne({ section, slug });
  if (existing) {
    throw new Error("A submenu with that label already exists.");
  }

  const last = await collection
    .find({ section })
    .sort({ order: -1 })
    .limit(1)
    .toArray();
  const nextOrder = (last[0]?.order ?? 0) + 1;
  const now = new Date();
  const document: SectionSubmenuDocument = {
    _id: crypto.randomUUID(),
    section,
    slug,
    label: label.trim(),
    order: nextOrder,
    createdAt: now,
    updatedAt: now,
  };
  await collection.insertOne(document);
  return mapDocument(document);
};

export const updateSectionSubmenu = async (
  section: SectionSlug,
  id: string,
  label: string
): Promise<SectionSubmenu | null> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getCollection();
  const current = await collection.findOne({ _id: id, section });
  if (!current) {
    return null;
  }

  const nextSlug = slugify(label);
  if (!nextSlug) {
    throw new Error("Invalid label.");
  }

  if (nextSlug !== current.slug) {
    const existing = await collection.findOne({ section, slug: nextSlug });
    if (existing) {
      throw new Error("A submenu with that label already exists.");
    }
  }

  const updatedAt = new Date();
  const result = await collection.findOneAndUpdate(
    { _id: id, section },
    { $set: { label: label.trim(), slug: nextSlug, updatedAt } },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  if (nextSlug !== current.slug) {
    const itemsCollection = await getSectionItemsCollection();
    await itemsCollection.updateMany(
      { section, submenuSlug: current.slug },
      { $set: { submenuSlug: nextSlug } }
    );
  }

  return mapDocument(result);
};

export const deleteSectionSubmenu = async (
  section: SectionSlug,
  id: string
): Promise<boolean> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const collection = await getCollection();
  const current = await collection.findOne({ _id: id, section });
  if (!current) {
    return false;
  }

  const itemsCollection = await getSectionItemsCollection();
  await itemsCollection.deleteMany({ section, submenuSlug: current.slug });

  const result = await collection.deleteOne({ _id: id, section });
  return result.deletedCount > 0;
};

export const getCachedSectionSubmenus = (section: SectionSlug) =>
  unstable_cache(
    async () => listSectionSubmenus(section),
    ["section-submenus", section],
    { revalidate: false, tags: ["section-submenus", `section-submenus:${section}`] }
  )();
