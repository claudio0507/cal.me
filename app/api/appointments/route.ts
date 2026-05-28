import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      appointments: {
        orderBy: { startTime: "asc" },
        include: { eventType: { select: { title: true, duration: true } } },
      },
    },
  });

  return NextResponse.json(user?.appointments ?? []);
}
