import "server-only";

import bannerImage from "@/assets/banner.png";
import profileImage from "@/assets/profile.jpg";
import type { SiteContent } from "@/lib/siteContentTypes";
import mongoClient, { getMongoDbName } from "@/lib/mongo";
import { unstable_cache } from "next/cache";

let lastKnownContent: SiteContent | null = null;
const CONTENT_ID = "site-content";

type SiteContentDocument = {
  _id: string;
  content: SiteContent;
  updatedAt?: Date;
};

export const defaultSiteContent: SiteContent = {
  bannerImageUrl: bannerImage.src,
  profileImageUrl: profileImage.src,
  videoUrl: "https://www.youtube.com/watch?v=Fi-HdiBbIWc",
  sidebarName: "Prof. (Dr.) Nilam Panchal",
  sidebarTitle: "Professor of Management, Gujarat University",
  sidebarLocation: "Ahmedabad, India",
  sidebarEmail: "",
  sidebarBlurb:
    "Professor and Head, Department of Public Policy and Governance, B.K. School of Business Management.",
  sidebarFooter:
    "Science thrives on collaboration and critical discussion. If you're curious to learn more about my work, open to engaging with my mission, or interested in building a shared vision, I'd love to hear from you. Please get in touch via email (see above) or through one of the platforms below.",
  sidebarCvUrl: "",
  socialLinks: {},
  mainHtml: `
    <p><strong>Prof. (Dr.) NILAM PANCHAL</strong></p>
    <p>Ph.D. (Finance), Ph.D. (HR), M. Phil, MBA, PGDIRPM, MBA, FDPM &amp; SFDP (IIMA)</p>
    <p><strong>Specialization:</strong> Finance &amp; Human Resource</p>
    <p><strong>Title:</strong></p>
    <ul>
      <li>Professor (Management)</li>
      <li>B.K School of Business management, Gujarat university.</li>
      <li>Head, Dept. of Public Policy &amp; Governance Gujarat university.</li>
    </ul>
    <p><strong>Bio</strong></p>
    <p>Prof. (Dr.) Nilam Panchal serves as Professor and Head of the Department of Public Policy and Governance (DPPG), B.K. School, Gujarat University. She oversees academic programmes at DPPG including PhD, MBA, IMBA, PG Diploma, and Certificate courses. She also holds the position of Academic Coordinator for the School of International Studies and Diaspora, SAP, and DFL at Gujarat University.</p>
    <p>A distinguished academician, she has authored 150+ research papers and 45 books. She has coordinated 452 workshops/seminars and delivered 371+ expert lectures across diverse areas of Management. Prof. Panchal has developed five MOOCs on UGC SWAYAM and created 300+ e content modules for SWAYAM PRABHA (DTH Channels) in Economics, Commerce, and Management. She serves as Chief Editor of the IJMPR Journal and is on the editorial boards of Vidya and Vidyavrutt publications (GU).</p>
    <p>She has contributed to course development for PG programmes of BAOU, IGNOU, MGNCRE, and other Government of India academic initiatives. She has been awarded six research and seminar grants by ICSSR and NHRC (GOI). To date, 24 PhD scholars have completed their doctoral research under her supervision. Prof. Panchal is a Life Member of AIMA, AIMS, ISTD, NEMA, and NHRD. She has trained more than 20,000 professionals through FDPs, EDPs, MDPs, and SDPs for corporates and academic institutions. She was also invited as a Member and Presenter to the 16th Finance Commission, Government of India.</p>
  `.trim(),
};

type SiteContentOptions = {
  allowFallback?: boolean;
};

export const getSiteContent = async (
  options: SiteContentOptions = {}
): Promise<SiteContent> => {
  const { allowFallback = true } = options;
  if (!process.env.MONGODB_URI) {
    console.warn("[siteContent] Missing MONGODB_URI; using fallback content.");
    if (!allowFallback) {
      throw new Error("MONGODB_URI is not configured.");
    }
    return lastKnownContent || defaultSiteContent;
  }

  try {
    const client = await mongoClient;
    const collection = client
      .db(getMongoDbName())
      .collection<SiteContentDocument>("site_content");
    const document = await collection.findOne({ _id: CONTENT_ID });
    const data = (document?.content || document || {}) as Partial<SiteContent> & {
      name?: string;
      degrees?: string;
      specialization?: string;
      titleLines?: string[];
      bioHtml?: string;
    };

    if (!data.mainHtml && data.bioHtml) {
      const name = data.name || "Prof. (Dr.) NILAM PANCHAL";
      const degrees =
        data.degrees ||
        "Ph.D. (Finance), Ph.D. (HR), M. Phil, MBA, PGDIRPM, MBA, FDPM & SFDP (IIMA)";
      const specialization =
        data.specialization || "Specialization: Finance & Human Resource";

      data.mainHtml = `
        <p><strong>${name}</strong></p>
        <p>${degrees}</p>
        <p><strong>Specialization:</strong> ${specialization.replace(
          /^Specialization:\s*/i,
          ""
        )}</p>
        <p><strong>Title:</strong></p>
        <ul>
          ${
            Array.isArray(data.titleLines)
              ? data.titleLines.map((line) => `<li>${line}</li>`).join("")
              : ""
          }
        </ul>
        ${data.bioHtml}
      `.trim();
    }

    const resolved: SiteContent = {
      ...defaultSiteContent,
      ...data,
      socialLinks: {
        ...defaultSiteContent.socialLinks,
        ...(data.socialLinks || {}),
      },
    };
    lastKnownContent = resolved;
    return resolved;
  } catch (error) {
    console.error("[siteContent] Error loading content.", error);
    if (!allowFallback) {
      throw new Error("Failed to load site content.");
    }
    return lastKnownContent || defaultSiteContent;
  }
};

export const saveSiteContent = async (
  content: SiteContent
): Promise<SiteContent> => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = await mongoClient;
  const collection = client
    .db(getMongoDbName())
    .collection<SiteContentDocument>("site_content");
  await collection.updateOne(
    { _id: CONTENT_ID },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true }
  );

  lastKnownContent = content;
  return content;
};

export const getCachedSiteContent = unstable_cache(
  async () => getSiteContent({ allowFallback: true }),
  ["site-content"],
  { revalidate: 300, tags: ["site-content"] }
);
