/**
 * Cal.me — Tipos globais
 */

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "RESCHEDULED" | "COMPLETED";
export type Channel = "VIDEO" | "PHONE" | "IN_PERSON" | "WHATSAPP";
export type Provider = "GOOGLE" | "MICROSOFT";

export interface User {
  id: string;
  name: string;
  role?: string;
  email: string;
  username: string;
  avatarUrl?: string;
  bannerUrl?: string;
  welcomeMessage?: string;
  primaryColor: string;
  primaryContainer: string;
}

export interface EventType {
  id: string;
  userId: string;
  title: string;
  description?: string;
  duration: number;
  slug: string;
  isActive: boolean;
}

export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  eventTypeId: string;
  title: string;
  guestName: string;
  guestEmail: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  channel: Channel;
  notes?: string;
  cancelReason?: string;
  icsToken?: string;
  eventType?: EventType;
}

export interface CalendarIntegration {
  id: string;
  userId: string;
  provider: Provider;
  isActive: boolean;
  calendarId?: string;
}
