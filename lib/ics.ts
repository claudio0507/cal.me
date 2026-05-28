interface IcsInput {
  uid: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
  location?: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function fmtUtc(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let i = 0;
  while (i < line.length) {
    const chunk = line.slice(i, i + 73);
    parts.push(i === 0 ? chunk : " " + chunk);
    i += 73;
  }
  return parts.join("\r\n");
}

export function buildIcs(input: IcsInput): string {
  const now = fmtUtc(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cal.me//PT-BR//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${input.uid}@cal.me`,
    `DTSTAMP:${now}`,
    `DTSTART:${fmtUtc(input.start)}`,
    `DTEND:${fmtUtc(input.end)}`,
    `SUMMARY:${escapeText(input.title)}`,
    input.description ? `DESCRIPTION:${escapeText(input.description)}` : null,
    input.location ? `LOCATION:${escapeText(input.location)}` : null,
    `ORGANIZER;CN=${escapeText(input.organizerName)}:mailto:${input.organizerEmail}`,
    `ATTENDEE;CN=${escapeText(input.attendeeName)};RSVP=TRUE:mailto:${input.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((l): l is string => l !== null)
    .map(fold);

  return lines.join("\r\n");
}

export function googleCalendarUrl(input: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}): string {
  const dates = `${fmtUtc(input.start)}/${fmtUtc(input.end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates,
  });
  if (input.description) params.set("details", input.description);
  if (input.location) params.set("location", input.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(input: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}): string {
  const params = new URLSearchParams({
    rru: "addevent",
    path: "/calendar/action/compose",
    subject: input.title,
    startdt: input.start.toISOString(),
    enddt: input.end.toISOString(),
  });
  if (input.description) params.set("body", input.description);
  if (input.location) params.set("location", input.location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
