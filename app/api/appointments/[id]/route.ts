import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { deleteCalendarEvent as deleteGoogleEvent } from "@/lib/google";
import { deleteMicrosoftEvent } from "@/lib/microsoft";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const action = String(body.action ?? "");

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment || appointment.userId !== session.userId) {
    return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
  }

  if (action === "cancel") {
    const reason = typeof body.reason === "string" ? body.reason.slice(0, 200) : null;

    if (appointment.externalEventId) {
      if (appointment.externalProvider === "GOOGLE") {
        await deleteGoogleEvent(session.userId, appointment.externalEventId).catch((err) =>
          console.error("[appointments] google delete failed", err)
        );
      } else if (appointment.externalProvider === "MICROSOFT") {
        await deleteMicrosoftEvent(session.userId, appointment.externalEventId).catch((err) =>
          console.error("[appointments] microsoft delete failed", err)
        );
      }
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED", cancelReason: reason },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "complete") {
    await prisma.appointment.update({ where: { id }, data: { status: "COMPLETED" } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
