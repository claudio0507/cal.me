//**
 * Google Calendar integration status & disconnect
 */

import { NextRequest, NextResponse } from "next/server";
import { getIntegrationStatus, disconnectCalendar } from "@/lib/google-calendar";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = await getIntegrationStatus(session.userId);
  return NextResponse.json(status);
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await disconnectCalendar(session.userId);
  return NextResponse.json({ success: true });
}
