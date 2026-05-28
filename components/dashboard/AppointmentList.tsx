"use client";

/**
 * Cal.me — Appointment List
 * Lista de próximos agendamentos com ações rápidas
 */

import { MOCK_APPOINTMENTS } from "@/lib/mock-data";
import type { Appointment, AppointmentStatus, Channel } from "@/lib/types";

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  PENDING:     { label: "Pendente",    color: "var(--color-warning)",    bg: "var(--color-warning-container)" },
  CONFIRMED:   { label: "Confirmado",  color: "var(--color-success)",    bg: "var(--color-success-container)" },
  CANCELLED:   { label: "Cancelado",   color: "var(--color-error)",      bg: "var(--color-error-container)" },
  RESCHEDULED: { label: "Reagendado",  color: "var(--color-brand)",      bg: "var(--color-brand-light)" },
  COMPLETED:   { label: "Concluído",   color: "var(--color-secondary)",  bg: "var(--color-surface-container-high)" },
};

const CHANNEL_CONFIG: Record<Channel, { icon: string; label: string }> = {
  VIDEO:      { icon: "videocam",      label: "Vídeo" },
  PHONE:      { icon: "phone",         label: "Telefone" },
  IN_PERSON:  { icon: "location_on",   label: "Presencial" },
  WHATSAPP:   { icon: "chat",          label: "WhatsApp" },
};

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const status = STATUS_CONFIG[appointment.status];
  const channel = CHANNEL_CONFIG[appointment.channel];

  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container-lowest)] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Time block */}
      <div className="shrink-0 text-center min-w-[70px]">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
          {formatDate(appointment.startTime)}
        </p>
        <p className="text-lg font-bold" style={{ color: "var(--color-brand)" }}>
          {formatTime(appointment.startTime)}
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-0.5 h-12 rounded-full shrink-0"
        style={{ background: "var(--color-brand-light)" }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-sm truncate">{appointment.guestName}</h3>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>
        </div>
        <p className="text-xs text-[var(--color-secondary)] truncate">{appointment.title}</p>
        <div className="flex items-center gap-1 mt-1 text-xs text-[var(--color-secondary)]">
          <span className="material-symbols-outlined text-xs">{channel.icon}</span>
          <span>{channel.label}</span>
          <span className="mx-1">·</span>
          <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && (
          <>
            <button
              className="p-2 rounded-lg hover:bg-[var(--color-surface-container-high)] transition-colors"
              title="Reagendar"
            >
              <span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">
                edit_calendar
              </span>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-[var(--color-error-container)] transition-colors"
              title="Cancelar"
            >
              <span className="material-symbols-outlined text-sm text-[var(--color-error)]">
                cancel
              </span>
            </button>
          </>
        )}
        <button
          className="p-2 rounded-lg hover:bg-[var(--color-surface-container-high)] transition-colors"
          title="Copiar link"
        >
          <span className="material-symbols-outlined text-sm text-[var(--color-secondary)]">
            content_copy
          </span>
        </button>
      </div>
    </div>
  );
}

export default function AppointmentList() {
  const sorted = [...MOCK_APPOINTMENTS]
    .filter((a) => a.status !== "COMPLETED" && a.status !== "CANCELLED")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div className="space-y-3 stagger">
      {sorted.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}

      {sorted.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-[var(--color-surface-container-highest)] mb-4 block">
            event_available
          </span>
          <p className="text-[var(--color-secondary)] font-medium">
            Nenhum agendamento próximo
          </p>
        </div>
      )}
    </div>
  );
}
