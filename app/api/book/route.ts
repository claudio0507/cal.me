import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateMeetingLink(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `https://meet.jit.si/calme-${rand(4)}-${rand(4)}-${rand(4)}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, eventTypeId, startTime, guestName, guestEmail, notes } = body;

  if (!username || !eventTypeId || !startTime || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  if (!/\S+@\S+\.\S+/.test(guestEmail)) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return NextResponse.json({ error: "Anfitrião não encontrado" }, { status: 404 });

  const eventType = await prisma.eventType.findFirst({
    where: { id: eventTypeId, userId: user.id, isActive: true },
  });
  if (!eventType) return NextResponse.json({ error: "Tipo de evento inválido" }, { status: 404 });

  const start = new Date(startTime);
  const end = new Date(start.getTime() + eventType.duration * 60 * 1000);

  if (start < new Date()) {
    return NextResponse.json({ error: "Não é possível agendar no passado" }, { status: 400 });
  }

  // Conflict check against confirmed/pending appointments
  const conflict = await prisma.appointment.findFirst({
    where: {
      userId: user.id,
      status: { in: ["CONFIRMED", "PENDING"] },
      AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: "Horário não está mais disponível. Escolha outro." },
      { status: 409 }
    );
  }

  const meetingLink = generateMeetingLink();

  const appointment = await prisma.appointment.create({
    data: {
      userId: user.id,
      eventTypeId,
      title: eventType.title,
      guestName,
      guestEmail,
      startTime: start,
      endTime: end,
      status: "CONFIRMED",
      channel: "VIDEO",
      notes: notes || null,
      meetingLink,
    },
  });

  return NextResponse.json({ appointment, meetingLink }, { status: 201 });
}
