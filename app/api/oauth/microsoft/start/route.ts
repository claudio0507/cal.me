import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/session";
import { buildMicrosoftAuthUrl } from "@/lib/microsoft";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  const state = crypto.randomBytes(16).toString("base64url");
  const stateToken = `${session.userId}.${state}`;

  const url = buildMicrosoftAuthUrl(stateToken);
  const res = NextResponse.redirect(url);
  res.cookies.set({
    name: "ms_oauth_state",
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
