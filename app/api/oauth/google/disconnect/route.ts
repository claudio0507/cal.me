import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revokeGoogleToken } from "@/lib/google";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const integration = await prisma.calendarIntegration.findUnique({
    where: { userId_provider: { userId: session.userId, provider: "GOOGLE" } },
  });
  if (!integration) return NextResponse.json({ ok: true });

  if (integration.refreshToken) {
    await revokeGoogleToken(integration.refreshToken);
  } else if (integration.accessToken) {
    await revokeGoogleToken(integration.accessToken);
  }

  await prisma.calendarIntegration.delete({ where: { id: integration.id } });
  return NextResponse.json({ ok: true });
}
