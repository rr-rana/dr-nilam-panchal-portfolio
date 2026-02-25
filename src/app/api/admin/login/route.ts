import { NextResponse } from "next/server";
import {
  createSessionValue,
  getAdminCredentials,
  getSessionCookieName,
  getSessionMaxAge,
} from "@/lib/adminAuth";

export const POST = async (request: Request) => {
  let credentials: { username: string; password: string };
  try {
    credentials = getAdminCredentials();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Admin credentials are not configured.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.username !== credentials.username || body.password !== credentials.password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getSessionCookieName(), createSessionValue(body.username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: getSessionMaxAge(),
    path: "/",
  });

  return response;
};
