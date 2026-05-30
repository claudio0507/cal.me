import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/session";
import { buildGoogleAuthUrl } from "@/lib/google";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login", "https://placeholder"));

  const state = crypto.randomBytes(16).toString("base64url");
  const stateToken = `${session.userId}.${state}`;

  const url = buildGoogleAuthUrl(stateToken);
  const res = NextResponse.redirect(url);
  res.cookies.set({
    name: "google_oauth_state",
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
