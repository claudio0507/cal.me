"use client";

/**
 * Cal.me — Quick Stats
 * Métricas resumidas do dia/semana na Dashboard
 */

import { MOCK_APPOINTMENTS } from "@/lib/mock-data";

export default function QuickStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  const todayCount = MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.startTime);
    return d >= todayStart && d < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000) && a.status !== "CANCELLED";
  }).length;

  const weekCount = MOCK_APPOINTMENTS.filter((a) => {
    const d = new Date(a.startTime);
    return d >= todayStart && d < weekEnd && a.status !== "CANCELLED";
  }).length;

  const pendingCount = MOCK_APPOINTMENTS.filter((a) => a.status === "PENDING").length;
  const completedCount = MOCK_APPOINTMENTS.filter((a) => a.status === "COMPLETED").length;

  const stats = [
    { icon: "today", label: "Hoje", value: todayCount, color: "var(--color-brand)" },
    { icon: "date_range", label: "Esta Semana", value: weekCount, color: "var(--color-brand-dim)" },
    { icon: "pending_actions", label: "Pendentes", value: pendingCount, color: "var(--color-warning)" },
    { icon: "task_alt", label: "Concluídos", value: completedCount, color: "var(--color-success)" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden p-5 rounded-2xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container-lowest)] hover:shadow-md transition-shadow duration-300"
        >
          {/* Glow accent */}
          <div
            className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-10 blur-2xl"
            style={{ background: stat.color }}
          />

          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${stat.color}18` }}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ color: stat.color }}
              >
                {stat.icon}
              </span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
              {stat.label}
            </span>
          </div>

          <p className="text-3xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
