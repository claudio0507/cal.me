import { prisma } from "@/lib/prisma";

export const MS_SCOPES = ["Calendars.ReadWrite", "offline_access", "User.Read"];
const MS_TENANT = "common";
const MS_AUTH_URL = `https://login.microsoftonline.com/${MS_TENANT}/oauth2/v2.0/authorize`;
const MS_TOKEN_URL = `https://login.microsoftonline.com/${MS_TENANT}/oauth2/v2.0/token`;
const GRAPH_BASE = "https://graph.microsoft.com/v1.0";
const REFRESH_EARLY_MS = 60 * 1000;

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function buildMicrosoftAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env("MICROSOFT_CLIENT_ID"),
    redirect_uri: env("MICROSOFT_REDIRECT_URI"),
    response_type: "code",
    scope: MS_SCOPES.join(" "),
    response_mode: "query",
    prompt: "consent",
    state,
  });
  return `${MS_AUTH_URL}?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export async function exchangeMicrosoftCode(code: string): Promise<TokenResponse> {
  const res = await fetch(MS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("MICROSOFT_CLIENT_ID"),
      client_secret: env("MICROSOFT_CLIENT_SECRET"),
      code,
      redirect_uri: env("MICROSOFT_REDIRECT_URI"),
      grant_type: "authorization_code",
      scope: MS_SCOPES.join(" "),
    }).toString(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Microsoft token exchange failed: ${res.status} ${body}`);
  }
  return res.json();
}

async function refreshMicrosoftToken(refreshToken: string): Promise<TokenResponse> {
  const res = await fetch(MS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env("MICROSOFT_CLIENT_ID"),
      client_secret: env("MICROSOFT_CLIENT_SECRET"),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: MS_SCOPES.join(" "),
    }).toString(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Microsoft token refresh failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function getValidMicrosoftToken(userId: string): Promise<string | null> {
  const integration = await prisma.calendarIntegration.findUnique({
    where: { userId_provider: { userId, provider: "MICROSOFT" } },
  });
  if (!integration || !integration.isActive) return null;

  const expiresAt = integration.expiresAt?.getTime() ?? 0;
  if (expiresAt > Date.now() + REFRESH_EARLY_MS) {
    return integration.accessToken;
  }
  if (!integration.refreshToken) return null;

  try {
    const refreshed = await refreshMicrosoftToken(integration.refreshToken);
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
    console.error("[microsoft] refresh failed", err);
    return null;
  }
}

export interface BusyRange {
  start: Date;
  end: Date;
}

const BUSY_STATES = new Set(["busy", "tentative", "oof", "workingElsewhere"]);

export async function fetchMicrosoftBusy(
  userId: string,
  timeMin: Date,
  timeMax: Date
): Promise<BusyRange[]> {
  const token = await getValidMicrosoftToken(userId);
  if (!token) return [];

  const params = new URLSearchParams({
    startDateTime: timeMin.toISOString(),
    endDateTime: timeMax.toISOString(),
    $select: "start,end,showAs,isCancelled",
    $top: "200",
  });

  const res = await fetch(`${GRAPH_BASE}/me/calendarView?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Prefer: 'outlook.timezone="UTC"',
    },
  });

  if (!res.ok) {
    console.error("[microsoft] calendarView failed", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  const events = Array.isArray(data?.value) ? data.value : [];
  return events
    .filter(
      (e: { showAs?: string; isCancelled?: boolean }) =>
        !e.isCancelled && BUSY_STATES.has(e.showAs ?? "")
    )
    .map((e: { start: { dateTime: string }; end: { dateTime: string } }) => ({
      start: new Date(e.start.dateTime.endsWith("Z") ? e.start.dateTime : e.start.dateTime + "Z"),
      end: new Date(e.end.dateTime.endsWith("Z") ? e.end.dateTime : e.end.dateTime + "Z"),
    }));
}

interface CreateEventInput {
  userId: string;
  subject: string;
  bodyHtml?: string;
  start: Date;
  end: Date;
  attendeeEmail: string;
  attendeeName: string;
  location?: string;
}

interface CreatedEvent {
  id: string;
  webLink?: string;
  onlineMeeting?: { joinUrl?: string };
}

export async function createMicrosoftEvent(input: CreateEventInput): Promise<CreatedEvent | null> {
  const token = await getValidMicrosoftToken(input.userId);
  if (!token) return null;

  const body = {
    subject: input.subject,
    body: { contentType: "HTML", content: input.bodyHtml ?? "" },
    start: { dateTime: input.start.toISOString(), timeZone: "UTC" },
    end: { dateTime: input.end.toISOString(), timeZone: "UTC" },
    location: input.location ? { displayName: input.location } : undefined,
    attendees: [
      {
        emailAddress: { address: input.attendeeEmail, name: input.attendeeName },
        type: "required",
      },
    ],
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness",
  };

  const res = await fetch(`${GRAPH_BASE}/me/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("[microsoft] createEvent failed", res.status, await res.text());
    return null;
  }
  return res.json();
}

export async function deleteMicrosoftEvent(userId: string, eventId: string): Promise<boolean> {
  const token = await getValidMicrosoftToken(userId);
  if (!token) return false;

  const res = await fetch(`${GRAPH_BASE}/me/events/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok || res.status === 404;
}
