import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { exchangeCode } from "@/lib/google";
import { prisma } from "@/lib/prisma";

function failureRedirect(req: NextRequest, reason: string) {
  const url = new URL("/integrations", req.url);
  url.searchParams.set("google", "error");
  url.searchParams.set("reason", reason);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return failureRedirect(req, error);
  if (!code || !state) return failureRedirect(req, "missing_params");

  const cookieState = req.cookies.get("google_oauth_state")?.value;
  const [stateUserId, stateRand] = state.split(".");
  if (!cookieState || cookieState !== stateRand || stateUserId !== session.userId) {
    return failureRedirect(req, "state_mismatch");
  }

  try {
    const tokens = await exchangeCode(code);
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await prisma.calendarIntegration.upsert({
      where: { userId_provider: { userId: session.userId, provider: "GOOGLE" } },
      update: {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        expiresAt,
        isActive: true,
      },
      create: {
        userId: session.userId,
        provider: "GOOGLE",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        expiresAt,
        calendarId: "primary",
        isActive: true,
      },
    });

    const redirect = new URL("/integrations", req.url);
    redirect.searchParams.set("google", "connected");
    const res = NextResponse.redirect(redirect);
    res.cookies.delete("google_oauth_state");
    return res;
  } catch (err) {
    console.error("[oauth/google/callback]", err);
    return failureRedirect(req, "token_exchange_failed");
  }
}
