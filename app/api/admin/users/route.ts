import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Acesso restrito" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      username: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: {
          appointments: true,
          eventTypes: true,
        },
      },
    },
  });

  return NextResponse.json(users);
}
