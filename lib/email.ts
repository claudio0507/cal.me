import { buildIcs } from "@/lib/ics";

interface BookingEmailInput {
  to: string;
  guestName: string;
  hostName: string;
  hostEmail: string;
  hostRole?: string | null;
  eventTitle: string;
  start: Date;
  end: Date;
  meetingLink: string;
  notes?: string | null;
  appointmentId: string;
  appUrl: string;
  icsToken: string;
  brandColor: string;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function renderHtml(input: BookingEmailInput, recipient: "guest" | "host"): string {
  const isGuest = recipient === "guest";
  const heading = isGuest
    ? `Sua reserva com ${input.hostName} está confirmada.`
    : `Nova reserva: ${input.guestName}`;
  const intro = isGuest
    ? `Olá ${input.guestName.split(" ")[0]},<br/>seu horário foi reservado.`
    : `${input.guestName} reservou um horário com você.`;

  return `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1917;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e0;border-radius:14px;overflow:hidden;">
        <tr><td style="background:${input.brandColor};height:6px;"></td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#76736d;font-weight:600;">Cal.me · Confirmação</p>
          <h1 style="margin:12px 0 16px;font-size:22px;line-height:1.25;letter-spacing:-0.01em;color:#1a1917;font-weight:600;">${heading}</h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4a4845;">${intro}</p>
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e0;border-radius:10px;">
            <tr><td style="padding:18px 20px;border-bottom:1px solid #f0eeea;">
              <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#76736d;font-weight:600;">Tipo</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1a1917;">${input.eventTitle}</p>
            </td></tr>
            <tr><td style="padding:18px 20px;border-bottom:1px solid #f0eeea;">
              <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#76736d;font-weight:600;">Data</p>
              <p style="margin:4px 0 0;font-size:15px;color:#1a1917;text-transform:capitalize;">${fmtDate(input.start)}</p>
            </td></tr>
            <tr><td style="padding:18px 20px;">
              <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#76736d;font-weight:600;">Horário</p>
              <p style="margin:4px 0 0;font-size:15px;color:#1a1917;font-family:'SF Mono',Menlo,Consolas,monospace;">${fmtTime(input.start)} – ${fmtTime(input.end)}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <a href="${input.meetingLink}" style="display:block;text-align:center;background:#1a1917;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 20px;border-radius:8px;">Entrar na reunião</a>
          <p style="margin:10px 0 0;font-size:12px;color:#76736d;text-align:center;font-family:'SF Mono',Menlo,Consolas,monospace;word-break:break-all;">${input.meetingLink}</p>
        </td></tr>
        <tr><td style="padding:0 32px 28px;">
          <a href="${input.appUrl}/api/appointments/${input.icsToken}/ics" style="display:inline-block;font-size:13px;color:#1a1917;text-decoration:underline;font-weight:500;">Adicionar ao calendário (.ics)</a>
        </td></tr>
        ${input.notes ? `<tr><td style="padding:0 32px 24px;"><div style="padding:14px 16px;background:#fafaf9;border-radius:8px;border:1px solid #f0eeea;"><p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#76736d;font-weight:600;">Observações</p><p style="margin:6px 0 0;font-size:13px;color:#4a4845;line-height:1.6;">${input.notes.replace(/\n/g, "<br/>")}</p></div></td></tr>` : ""}
        <tr><td style="padding:18px 32px;background:#fafaf9;border-top:1px solid #e7e5e0;">
          <p style="margin:0;font-size:11px;color:#9b9893;text-align:center;">Cal.me · página de reservas para profissionais</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendBookingEmails(input: BookingEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY ausente — emails não enviados.");
    return;
  }

  const from = process.env.RESEND_FROM ?? "Cal.me <onboarding@resend.dev>";

  const ics = buildIcs({
    uid: input.appointmentId,
    title: input.eventTitle,
    description: `${input.notes ?? ""}\n\nReunião: ${input.meetingLink}`.trim(),
    start: input.start,
    end: input.end,
    organizerEmail: input.hostEmail,
    organizerName: input.hostName,
    attendeeEmail: input.to,
    attendeeName: input.guestName,
    location: input.meetingLink,
  });
  const icsAttachment = {
    filename: "agendamento.ics",
    content: Buffer.from(ics).toString("base64"),
  };

  const send = async (to: string, subject: string, html: string) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        attachments: [icsAttachment],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] envio para ${to} falhou:`, res.status, body);
    }
  };

  const guestHtml = renderHtml(input, "guest");
  const hostHtml = renderHtml(input, "host");

  await Promise.allSettled([
    send(input.to, `Agendamento confirmado · ${input.eventTitle}`, guestHtml),
    send(input.hostEmail, `Nova reserva · ${input.guestName}`, hostHtml),
  ]);
}
