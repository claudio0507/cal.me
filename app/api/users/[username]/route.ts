import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchBusyRanges as fetchGoogleBusy } from "@/lib/google";
import { fetchMicrosoftBusy } from "@/lib/microsoft";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      username: true,
      avatarUrl: true,
      bannerUrl: true,
      welcomeMessage: true,
      primaryColor: true,
      primaryContainer: true,
      eventTypes: {
        where: { isActive: true },
        select: { id: true, title: true, description: true, duration: true, slug: true, isActive: true },
      },
      availability: {
        where: { isActive: true },
        select: { dayOfWeek: true, startTime: true, endTime: true, isActive: true },
      },
      appointments: {
        where: {
          status: { in: ["CONFIRMED", "PENDING"] },
          startTime: { gte: new Date() },
        },
        select: { startTime: true, endTime: true, status: true },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const now = new Date();
  const windowEnd = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const [googleBusy, msBusy] = await Promise.all([
    fetchGoogleBusy(user.id, now, windowEnd).catch(() => []),
    fetchMicrosoftBusy(user.id, now, windowEnd).catch(() => []),
  ]);
  const merged = [
    ...user.appointments,
    ...[...googleBusy, ...msBusy].map((b) => ({
      startTime: b.start.toISOString(),
      endTime: b.end.toISOString(),
      status: "CONFIRMED" as const,
    })),
  ];

  return NextResponse.json({ ...user, appointments: merged });
}
