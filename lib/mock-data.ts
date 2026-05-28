/**
 * Cal.me — Dados mockados para desenvolvimento
 * Simula o que viria do banco de dados (Prisma/PostgreSQL)
 */

import { User, EventType, Availability, Appointment } from "./types";

export const MOCK_USER: User = {
  id: "usr_001",
  name: "Cláudio Fernandes",
  email: "claudio@aetheric.com",
  username: "claudio",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  bannerUrl: undefined,
  welcomeMessage: "Agende uma consultoria técnica com nosso time de especialistas",
  primaryColor: "#506600",
  primaryContainer: "#ccff00",
};

export const MOCK_EVENT_TYPES: EventType[] = [
  {
    id: "evt_001",
    userId: "usr_001",
    title: "Consulta de 30 min",
    description: "Uma conversa rápida para discutir seu projeto e alinhar expectativas iniciais sobre o escopo técnico.",
    duration: 30,
    slug: "consulta-30min",
    isActive: true,
  },
  {
    id: "evt_002",
    userId: "usr_001",
    title: "Demo de Produto",
    description: "Demonstração completa da solução com walkthrough das funcionalidades e resposta a dúvidas técnicas.",
    duration: 60,
    slug: "demo-produto",
    isActive: true,
  },
  {
    id: "evt_003",
    userId: "usr_001",
    title: "Kickoff de Projeto",
    description: "Reunião de alinhamento inicial para definir escopo, cronograma e responsáveis.",
    duration: 45,
    slug: "kickoff",
    isActive: true,
  },
];

export const MOCK_AVAILABILITY: Availability[] = [
  { id: "avl_01", userId: "usr_001", dayOfWeek: 1, startTime: "09:00", endTime: "12:00", isActive: true },
  { id: "avl_02", userId: "usr_001", dayOfWeek: 1, startTime: "14:00", endTime: "18:00", isActive: true },
  { id: "avl_03", userId: "usr_001", dayOfWeek: 2, startTime: "09:00", endTime: "12:00", isActive: true },
  { id: "avl_04", userId: "usr_001", dayOfWeek: 2, startTime: "14:00", endTime: "18:00", isActive: true },
  { id: "avl_05", userId: "usr_001", dayOfWeek: 3, startTime: "09:00", endTime: "12:00", isActive: true },
  { id: "avl_06", userId: "usr_001", dayOfWeek: 3, startTime: "14:00", endTime: "18:00", isActive: true },
  { id: "avl_07", userId: "usr_001", dayOfWeek: 4, startTime: "09:00", endTime: "12:00", isActive: true },
  { id: "avl_08", userId: "usr_001", dayOfWeek: 4, startTime: "14:00", endTime: "18:00", isActive: true },
  { id: "avl_09", userId: "usr_001", dayOfWeek: 5, startTime: "09:00", endTime: "12:00", isActive: true },
  { id: "avl_10", userId: "usr_001", dayOfWeek: 5, startTime: "14:00", endTime: "17:00", isActive: true },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "apt_001",
    userId: "usr_001",
    eventTypeId: "evt_001",
    title: "Consulta de 30 min",
    guestName: "Ana Silva",
    guestEmail: "ana@empresa.com",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    channel: "VIDEO",
    notes: "Discussão sobre integração de API REST",
  },
  {
    id: "apt_002",
    userId: "usr_001",
    eventTypeId: "evt_002",
    title: "Demo de Produto",
    guestName: "Roberto Mendes",
    guestEmail: "roberto@tech.io",
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    channel: "VIDEO",
  },
  {
    id: "apt_003",
    userId: "usr_001",
    eventTypeId: "evt_003",
    title: "Kickoff de Projeto",
    guestName: "Mariana Costa",
    guestEmail: "mariana@startup.dev",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 24.75 * 60 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    channel: "IN_PERSON",
    notes: "Trazer documento de escopo",
  },
  {
    id: "apt_004",
    userId: "usr_001",
    eventTypeId: "evt_001",
    title: "Consulta de 30 min",
    guestName: "Lucas Pereira",
    guestEmail: "lucas@corp.com.br",
    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 48.5 * 60 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    channel: "WHATSAPP",
  },
  {
    id: "apt_005",
    userId: "usr_001",
    eventTypeId: "evt_001",
    title: "Consulta de 30 min",
    guestName: "Fernanda Oliveira",
    guestEmail: "fer@design.co",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(),
    status: "COMPLETED",
    channel: "VIDEO",
  },
  {
    id: "apt_006",
    userId: "usr_001",
    eventTypeId: "evt_002",
    title: "Demo de Produto",
    guestName: "Pedro Santos",
    guestEmail: "pedro@agency.com",
    startTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 73 * 60 * 60 * 1000).toISOString(),
    status: "CANCELLED",
    channel: "VIDEO",
    cancelReason: "Conflito de agenda",
  },
];

/** Gera time slots disponíveis para uma data */
export function generateTimeSlots(date: Date, duration: number = 30): string[] {
  const dayOfWeek = date.getDay();
  const availabilities = MOCK_AVAILABILITY.filter(
    (a) => a.dayOfWeek === dayOfWeek && a.isActive
  );

  const slots: string[] = [];
  for (const avail of availabilities) {
    const [startH, startM] = avail.startTime.split(":").map(Number);
    const [endH, endM] = avail.endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      slots.push(`${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
    }
  }

  return slots;
}
