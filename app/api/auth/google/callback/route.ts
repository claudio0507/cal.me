/**
 * Google OAuth - Callback handler
 */

import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, saveIntegration } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(
      new URL("/integrations?error=oauth_denied", request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/integrations?error=invalid_request", request.url)
    );
  }

  try {
    const tokens = await exchangeCode(code);
    await saveIntegration(state, tokens);

    return NextResponse.redirect(
      new URL("/integrations?success=connected", request.url)
    );
  } catch (err) {
    console.error("Failed to save Google integration:", err);
    return NextResponse.redirect(
      new URL("/integrations?error=save_failed", request.url)
    );
  }
}
