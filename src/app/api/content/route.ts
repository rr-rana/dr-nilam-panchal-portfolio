import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/siteContent";

export const GET = async () => {
  const content = await getSiteContent();
  const response = NextResponse.json(content);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
};
