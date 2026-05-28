"use client";

/**
 * Cal.me — Quick Stats
 * Editorial-style metric strip. Tabular numerals, restrained type hierarchy.
 */

import { MOCK_APPOINTMENTS } from "@/lib/mock-data";
import { Icon, type IconName } from "@/components/ui/Icon";

interface Stat {
  icon: IconName;
  label: string;
  value: number;
  hint?: string;
}

export default function QuickStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  const todayCount = MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.startTime);
    return d >= todayStart && d < tomorrowStart && a.status !== "CANCELLED";
  }).length;

  const weekCount = MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.startTime);
    return d >= todayStart && d < weekEnd && a.status !== "CANCELLED";
  }).length;

  const pendingCount = MOCK_APPOINTMENTS.filter((a) => a.status === "PENDING").length;
  const completedCount = MOCK_APPOINTMENTS.filter((a) => a.status === "COMPLETED").length;

  const stats: Stat[] = [
    { icon: "calendar", label: "Hoje", value: todayCount, hint: "Confirmados + pendentes" },
    { icon: "calendar-check", label: "Próximos 7 dias", value: weekCount, hint: "Janela móvel" },
    { icon: "alert-circle", label: "Pendentes", value: pendingCount, hint: "Aguardando confirmação" },
    { icon: "check", label: "Concluídos", value: completedCount, hint: "Histórico" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden stagger">
      {stats.map((s) => (
        <div key={s.label} className="bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="label">{s.label}</span>
            <Icon name={s.icon} size={15} className="text-[var(--color-muted-2)]" />
          </div>
          <p className="font-display text-[34px] leading-none tracking-tight text-[var(--ink-900)] tabular-nums">
            {s.value.toString().padStart(2, "0")}
          </p>
          {s.hint && <p className="mt-2 text-xs text-[var(--color-muted)]">{s.hint}</p>}
        </div>
      ))}
    </div>
  );
}
