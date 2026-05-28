import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("calme_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const session = await verifySession(token);
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/availability/:path*", "/integrations/:path*"],
};
