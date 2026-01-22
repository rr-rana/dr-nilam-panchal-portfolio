import { NextResponse } from "next/server";
import { getCachedSiteContent } from "@/lib/siteContent";

export const GET = async () => {
  const content = await getCachedSiteContent();
  const publicPayload = {
    sidebarName: content.sidebarName,
    profileImageUrl: content.profileImageUrl,
  };
  const response = NextResponse.json(publicPayload);
  response.headers.set(
    "Cache-Control",
    "public, max-age=300, s-maxage=300, stale-while-revalidate=600"
  );
  return response;
};
