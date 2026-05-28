import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildIcs } from "@/lib/ics";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { icsToken: token },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  const description = [
    appointment.notes,
    appointment.meetingLink ? `Reunião: ${appointment.meetingLink}` : null,
    `Reservado via cal.me`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const ics = buildIcs({
    uid: appointment.id,
    title: appointment.title,
    description,
    start: appointment.startTime,
    end: appointment.endTime,
    organizerEmail: appointment.user.email,
    organizerName: appointment.user.name,
    attendeeEmail: appointment.guestEmail,
    attendeeName: appointment.guestName,
    location: appointment.meetingLink ?? undefined,
  });

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="agendamento-${appointment.id}.ics"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
