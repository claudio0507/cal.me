import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json(user);
}
