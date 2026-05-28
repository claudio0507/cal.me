"use client";

/**
 * Cal.me — Appointment List
 * Editorial row layout. Status as compact label, channel as monospaced glyph row.
 */

import { MOCK_APPOINTMENTS } from "@/lib/mock-data";
import type { Appointment, AppointmentStatus, Channel } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; cls: string }
> = {
  PENDING: {
    label: "Pendente",
    cls: "text-[var(--color-warning)] bg-[var(--color-warning-soft)] border-[var(--color-warning)]/20",
  },
  CONFIRMED: {
    label: "Confirmado",
    cls: "text-[var(--color-positive)] bg-[var(--color-positive-soft)] border-[var(--color-positive)]/20",
  },
  CANCELLED: {
    label: "Cancelado",
    cls: "text-[var(--color-danger)] bg-[var(--color-danger-soft)] border-[var(--color-danger)]/20",
  },
  RESCHEDULED: {
    label: "Reagendado",
    cls: "text-[var(--color-info)] bg-[var(--color-info-soft)] border-[var(--color-info)]/20",
  },
  COMPLETED: {
    label: "Concluído",
    cls: "text-[var(--color-muted)] bg-[var(--color-surface-2)] border-[var(--color-border)]",
  },
};

const CHANNEL_CONFIG: Record<Channel, { icon: IconName; label: string }> = {
  VIDEO: { icon: "video", label: "Vídeo" },
  PHONE: { icon: "phone", label: "Telefone" },
  IN_PERSON: { icon: "map-pin", label: "Presencial" },
  WHATSAPP: { icon: "message-circle", label: "WhatsApp" },
};

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const status = STATUS_CONFIG[appointment.status];
  const channel = CHANNEL_CONFIG[appointment.channel];

  return (
    <li className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 px-5 py-4 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-2)] transition-colors">
      {/* Time block */}
      <div className="w-[72px] shrink-0">
        <p className="label text-[10px] leading-tight">
          {formatRelativeDate(appointment.startTime)}
        </p>
        <p className="font-mono text-[15px] leading-tight tabular-nums text-[var(--ink-900)] mt-1">
          {formatTime(appointment.startTime)}
        </p>
        <p className="font-mono text-[11px] text-[var(--color-muted-2)] tabular-nums mt-0.5">
          → {formatTime(appointment.endTime)}
        </p>
      </div>

      {/* Content */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-[15px] font-medium text-[var(--ink-900)] truncate">
            {appointment.guestName}
          </h3>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${status.cls}`}
          >
            <span className="w-1 h-1 rounded-full bg-current" />
            {status.label}
          </span>
        </div>
        <p className="text-[13px] text-[var(--color-muted)] truncate">
          {appointment.title}
        </p>
        <div className="flex items-center gap-3 mt-1.5 text-[12px] text-[var(--color-muted-2)]">
          <span className="inline-flex items-center gap-1.5">
            <Icon name={channel.icon} size={12} />
            {channel.label}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{appointment.guestEmail}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && (
          <>
            <button
              type="button"
              className="w-8 h-8 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-surface-3)] hover:text-[var(--ink-900)] transition-colors"
              aria-label="Reagendar"
            >
              <Icon name="edit" size={14} />
            </button>
            <button
              type="button"
              className="w-8 h-8 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] transition-colors"
              aria-label="Cancelar"
            >
              <Icon name="x" size={14} />
            </button>
          </>
        )}
        <button
          type="button"
          className="w-8 h-8 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-surface-3)] hover:text-[var(--ink-900)] transition-colors"
          aria-label="Copiar link"
        >
          <Icon name="copy" size={14} />
        </button>
      </div>
    </li>
  );
}

export default function AppointmentList() {
  const upcoming = [...MOCK_APPOINTMENTS]
    .filter((a) => a.status !== "COMPLETED" && a.status !== "CANCELLED")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  if (upcoming.length === 0) {
    return (
      <div className="border border-[var(--color-border)] rounded-[var(--radius)] p-12 text-center bg-[var(--color-surface)]">
        <Icon
          name="calendar"
          size={28}
          className="text-[var(--color-muted-2)] mx-auto mb-3"
        />
        <p className="text-sm font-medium text-[var(--ink-900)]">
          Nenhum agendamento próximo
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Compartilhe seu link de reserva para começar.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden"
      role="list"
    >
      {upcoming.map((appointment) => (
        <AppointmentRow key={appointment.id} appointment={appointment} />
      ))}
    </ul>
  );
}
