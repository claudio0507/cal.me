/**
 * Google Calendar Integration
 * OAuth flow + event creation
 */

import { google, calendar_v3 } from "googleapis";
import { prisma } from "./prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

export function getAuthUrl(userId: string) {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state: userId,
  });
}

export async function exchangeCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function saveIntegration(
  userId: string,
  tokens: {
    access_token?: string | null;
    refresh_token?: string | null;
    expiry_date?: number | null;
  }
) {
  await prisma.calendarIntegration.upsert({
    where: {
      userId_provider: {
        userId,
        provider: "GOOGLE",
      },
    },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      isActive: true,
    },
    create: {
      userId,
      provider: "GOOGLE",
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      calendarId: "primary",
      isActive: true,
    },
  });
}

export async function createCalendarEvent(
  userId: string,
  event: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
    attendeeEmail: string;
    attendeeName: string;
    location?: string;
  }
) {
  const integration = await prisma.calendarIntegration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: "GOOGLE",
      },
    },
  });

  if (!integration || !integration.isActive) {
    throw new Error("Google Calendar not connected");
  }

  oauth2Client.setCredentials({
    access_token: integration.accessToken,
    refresh_token: integration.refreshToken,
    expiry_date: integration.expiresAt?.getTime(),
  });

  // Refresh token if expired
  if (integration.expiresAt && integration.expiresAt < new Date()) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    await saveIntegration(userId, credentials);
    oauth2Client.setCredentials(credentials);
  }

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const eventBody: calendar_v3.Schema$Event = {
    summary: event.summary,
    description: event.description,
    start: {
      dateTime: event.start.toISOString(),
      timeZone: "America/Sao_Paulo",
    },
    end: {
      dateTime: event.end.toISOString(),
      timeZone: "America/Sao_Paulo",
    },
    attendees: [
      {
        email: event.attendeeEmail,
        displayName: event.attendeeName,
      },
    ],
    location: event.location,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: integration.calendarId || "primary",
    requestBody: eventBody,
    sendUpdates: "all",
  });

  return response.data;
}

export async function disconnectCalendar(userId: string) {
  await prisma.calendarIntegration.updateMany({
    where: {
      userId,
      provider: "GOOGLE",
    },
    data: {
      isActive: false,
    },
  });
}

export async function getIntegrationStatus(userId: string) {
  const integration = await prisma.calendarIntegration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: "GOOGLE",
      },
    },
  });

  return {
    connected: !!integration?.isActive,
    lastSync: integration?.updatedAt,
  };
}
