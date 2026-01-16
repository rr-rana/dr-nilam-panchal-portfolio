import { NextResponse } from "next/server";
import { getCachedPageContent } from "@/lib/pageContent";

export const GET = async () => {
  const content = await getCachedPageContent("editorial");
  const response = NextResponse.json(content);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
};
