"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const WEEK_DAYS = [
  { full: "Domingo", short: "Dom" },
  { full: "Segunda-feira", short: "Seg" },
  { full: "Terça-feira", short: "Ter" },
  { full: "Quarta-feira", short: "Qua" },
  { full: "Quinta-feira", short: "Qui" },
  { full: "Sexta-feira", short: "Sex" },
  { full: "Sábado", short: "Sáb" },
];

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  const hh = h.toString().padStart(2, "0");
  TIME_OPTIONS.push(`${hh}:00`, `${hh}:30`);
}

interface Slot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function AvailabilityForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [slots, setSlots] = useState<Slot[]>(() =>
    WEEK_DAYS.map((_, i) => ({
      dayOfWeek: i,
      startTime: "09:00",
      endTime: "18:00",
      isActive: i !== 0 && i !== 6,
    }))
  );

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((u) => {
        if (!u?.availability) return;
        const byDay = new Map<number, Slot>();
        for (const a of u.availability) {
          byDay.set(a.dayOfWeek, {
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
            isActive: a.isActive,
          });
        }
        setSlots(
          WEEK_DAYS.map((_, i) =>
            byDay.get(i) ?? {
              dayOfWeek: i,
              startTime: "09:00",
              endTime: "18:00",
              isActive: false,
            }
          )
        );
      })
      .catch(() => setErrorMsg("Não foi possível carregar."))
      .finally(() => setLoading(false));
  }, []);

  function toggleDay(dayOfWeek: number) {
    setSlots((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, isActive: !s.isActive } : s))
    );
  }

  function updateTime(dayOfWeek: number, field: "startTime" | "endTime", value: string) {
    setSlots((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s))
    );
  }

  async function handleSave() {
    for (const s of slots) {
      if (s.isActive && s.startTime >= s.endTime) {
        setErrorMsg(
          `${WEEK_DAYS[s.dayOfWeek].full}: horário de início deve ser anterior ao fim.`
        );
        return;
      }
    }

    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: slots }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Erro ao salvar.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--ink-900)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
        <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-[15px] font-medium text-[var(--ink-900)]">
              Janela de atendimento semanal
            </h2>
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              Horários no fuso de São Paulo (UTC−3).
            </p>
          </div>
          <Icon name="clock" size={18} className="text-[var(--color-muted-2)]" />
        </header>

        <ul role="list" className="divide-y divide-[var(--color-border)]">
          {WEEK_DAYS.map((day, index) => {
            const cfg = slots.find((a) => a.dayOfWeek === index)!;
            return (
              <li
                key={day.full}
                className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-5 items-center px-5 py-4"
              >
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <ToggleSwitch
                    checked={cfg.isActive}
                    onChange={() => toggleDay(index)}
                    aria-label={`${cfg.isActive ? "Desativar" : "Ativar"} ${day.full}`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      cfg.isActive ? "text-[var(--ink-900)]" : "text-[var(--color-muted-2)]"
                    }`}
                  >
                    {day.full}
                  </span>
                </label>

                {cfg.isActive ? (
                  <div className="flex items-center gap-3">
                    <TimeSelect
                      value={cfg.startTime}
                      onChange={(v) => updateTime(index, "startTime", v)}
                      label={`Início ${day.full}`}
                    />
                    <span className="text-xs text-[var(--color-muted-2)] uppercase tracking-widest">
                      até
                    </span>
                    <TimeSelect
                      value={cfg.endTime}
                      onChange={(v) => updateTime(index, "endTime", v)}
                      label={`Fim ${day.full}`}
                    />
                  </div>
                ) : (
                  <span className="text-xs text-[var(--color-muted-2)] uppercase tracking-widest">
                    Fechado
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {errorMsg && (
        <p className="text-[13px] text-[var(--color-danger)] flex items-center gap-1.5">
          <Icon name="alert-circle" size={14} />
          {errorMsg}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-muted)]">
          As alterações afetam apenas novos agendamentos.
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Icon
            name={saving ? "sync" : saved ? "check" : "save"}
            size={15}
            strokeWidth={2}
            className={saving ? "animate-spin" : ""}
          />
          {saving ? "Salvando…" : saved ? "Salvo" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  ...rest
}: {
  checked: boolean;
  onChange: () => void;
} & React.AriaAttributes) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative w-9 h-5 rounded-full transition-colors duration-150
        ${checked ? "bg-[var(--ink-900)]" : "bg-[var(--color-surface-3)]"}
      `}
      {...rest}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm
          transition-transform duration-150
          ${checked ? "translate-x-4" : "translate-x-0"}
        `}
      />
    </button>
  );
}

function TimeSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="
          appearance-none font-mono text-sm tabular-nums
          h-9 pl-3 pr-8 bg-[var(--color-surface)]
          border border-[var(--color-border-strong)] rounded-[var(--radius-sm)]
          text-[var(--ink-900)]
          outline-none focus:border-[var(--ink-900)]
          transition-colors cursor-pointer
        "
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)] pointer-events-none"
      />
    </div>
  );
}
