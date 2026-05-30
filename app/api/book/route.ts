import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendBookingEmails } from "@/lib/email";
import { fetchBusyRanges as fetchGoogleBusy, createCalendarEvent as createGoogleEvent } from "@/lib/google";
import { fetchMicrosoftBusy, createMicrosoftEvent } from "@/lib/microsoft";

function generateJitsiLink(): string {
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

  const [googleBusy, msBusy] = await Promise.all([
    fetchGoogleBusy(user.id, start, end).catch(() => []),
    fetchMicrosoftBusy(user.id, start, end).catch(() => []),
  ]);
  const externalBusy = [...googleBusy, ...msBusy];
  const externalConflict = externalBusy.some((b) => start < b.end && end > b.start);
  if (externalConflict) {
    return NextResponse.json(
      { error: "Horário ocupado no calendário do anfitrião. Escolha outro." },
      { status: 409 }
    );
  }

  let meetingLink = generateJitsiLink();
  let externalEventId: string | null = null;
  let externalProvider: "GOOGLE" | "MICROSOFT" | null = null;

  const gEvent = await createGoogleEvent({
    userId: user.id,
    summary: `${eventType.title} · ${guestName}`,
    description: [
      `Reunião agendada via Cal.me com ${guestName} (${guestEmail}).`,
      notes ? `Observações: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n\n"),
    start,
    end,
    attendeeEmail: guestEmail,
    attendeeName: guestName,
  }).catch((err) => {
    console.error("[book] google createEvent failed", err);
    return null;
  });

  if (gEvent) {
    externalEventId = gEvent.id;
    externalProvider = "GOOGLE";
    if (gEvent.hangoutLink) meetingLink = gEvent.hangoutLink;
  } else {
    const msEvent = await createMicrosoftEvent({
      userId: user.id,
      subject: `${eventType.title} · ${guestName}`,
      bodyHtml: `<p>Reunião agendada via Cal.me com ${guestName} (${guestEmail}).</p>${
        notes ? `<p><strong>Observações:</strong> ${notes}</p>` : ""
      }`,
      start,
      end,
      attendeeEmail: guestEmail,
      attendeeName: guestName,
    }).catch((err) => {
      console.error("[book] microsoft createEvent failed", err);
      return null;
    });

    if (msEvent) {
      externalEventId = msEvent.id;
      externalProvider = "MICROSOFT";
      if (msEvent.onlineMeeting?.joinUrl) meetingLink = msEvent.onlineMeeting.joinUrl;
    }
  }

  const icsToken = crypto.randomBytes(24).toString("base64url");

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
      icsToken,
      externalEventId,
      externalProvider,
    },
  });

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("host") ?? "calme-khaki.vercel.app";
  const appUrl = `${proto}://${host}`;

  sendBookingEmails({
    to: guestEmail,
    guestName,
    hostName: user.name,
    hostEmail: user.email,
    hostRole: user.role,
    eventTitle: eventType.title,
    start,
    end,
    meetingLink,
    notes: notes || null,
    appointmentId: appointment.id,
    appUrl,
    icsToken,
    brandColor: user.primaryColor,
  }).catch((err) => console.error("[book] email error", err));

  return NextResponse.json({ appointment, meetingLink, icsToken }, { status: 201 });
}
