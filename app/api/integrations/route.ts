import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const integrations = await prisma.calendarIntegration.findMany({
    where: { userId: session.userId },
    select: { provider: true, isActive: true, expiresAt: true, calendarId: true },
  });

  const google = integrations.find((i) => i.provider === "GOOGLE") ?? null;

  return NextResponse.json({ google });
}
