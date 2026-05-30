import { prisma } from "@/lib/prisma";

export const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/calendar"];

const REFRESH_EARLY_MS = 60 * 1000;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env("GOOGLE_CLIENT_ID"),
    redirect_uri: env("GOOGLE_REDIRECT_URI"),
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export async function exchangeCode(code: string): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env("GOOGLE_CLIENT_ID"),
      client_secret: env("GOOGLE_CLIENT_SECRET"),
      redirect_uri: env("GOOGLE_REDIRECT_URI"),
      grant_type: "authorization_code",
    }).toString(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token exchange failed: ${res.status} ${body}`);
  }
  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: env("GOOGLE_CLIENT_ID"),
      client_secret: env("GOOGLE_CLIENT_SECRET"),
      grant_type: "refresh_token",
    }).toString(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token refresh failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function getValidAccessToken(userId: string): Promise<string | null> {
  const integration = await prisma.calendarIntegration.findUnique({
    where: { userId_provider: { userId, provider: "GOOGLE" } },
  });
  if (!integration || !integration.isActive) return null;

  const expiresAt = integration.expiresAt?.getTime() ?? 0;
  if (expiresAt > Date.now() + REFRESH_EARLY_MS) {
    return integration.accessToken;
  }

  if (!integration.refreshToken) return null;

  try {
    const refreshed = await refreshAccessToken(integration.refreshToken);
    const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000);
    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        accessToken: refreshed.access_token,
        expiresAt: newExpiresAt,
        ...(refreshed.refresh_token ? { refreshToken: refreshed.refresh_token } : {}),
      },
    });
    return refreshed.access_token;
  } catch (err) {
    console.error("[google] refresh failed", err);
    return null;
  }
}

export interface BusyRange {
  start: Date;
  end: Date;
}

export async function fetchBusyRanges(
  userId: string,
  timeMin: Date,
  timeMax: Date,
  calendarId: string = "primary"
): Promise<BusyRange[]> {
  const token = await getValidAccessToken(userId);
  if (!token) return [];

  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: calendarId }],
    }),
  });

  if (!res.ok) {
    console.error("[google] freeBusy failed", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  const busy = data?.calendars?.[calendarId]?.busy ?? [];
  return busy.map((b: { start: string; end: string }) => ({
    start: new Date(b.start),
    end: new Date(b.end),
  }));
}

interface CreateEventInput {
  userId: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  attendeeEmail: string;
  attendeeName: string;
  location?: string;
  calendarId?: string;
}

interface CreatedEvent {
  id: string;
  htmlLink: string;
  hangoutLink?: string;
  conferenceData?: unknown;
}

export async function createCalendarEvent(input: CreateEventInput): Promise<CreatedEvent | null> {
  const token = await getValidAccessToken(input.userId);
  if (!token) return null;

  const calendarId = input.calendarId ?? "primary";
  const params = new URLSearchParams({ conferenceDataVersion: "1", sendUpdates: "all" });

  const body = {
    summary: input.summary,
    description: input.description,
    location: input.location,
    start: { dateTime: input.start.toISOString() },
    end: { dateTime: input.end.toISOString() },
    attendees: [{ email: input.attendeeEmail, displayName: input.attendeeName }],
    conferenceData: {
      createRequest: {
        requestId: `calme-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: { useDefault: true },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    console.error("[google] createEvent failed", res.status, await res.text());
    return null;
  }
  return res.json();
}

export async function deleteCalendarEvent(
  userId: string,
  eventId: string,
  calendarId: string = "primary"
): Promise<boolean> {
  const token = await getValidAccessToken(userId);
  if (!token) return false;

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.ok || res.status === 410;
}

export async function revokeGoogleToken(token: string): Promise<void> {
  await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }).catch(() => {});
}
