import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const integration = await prisma.calendarIntegration.findUnique({
    where: { userId_provider: { userId: session.userId, provider: "MICROSOFT" } },
  });
  if (!integration) return NextResponse.json({ ok: true });

  await prisma.calendarIntegration.delete({ where: { id: integration.id } });
  return NextResponse.json({ ok: true });
}
