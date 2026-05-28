"use client";

/**
 * Cal.me — AvailabilityForm
 * Grade semanal interativa para configuração de dias e horários ativos
 */

import { useState } from "react";
import { MOCK_AVAILABILITY } from "@/lib/mock-data";
import type { Availability } from "@/lib/types";

const WEEK_DAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// Gera opções de horário de 30 em 30 minutos
const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  const hh = h.toString().padStart(2, "0");
  TIME_OPTIONS.push(`${hh}:00`, `${hh}:30`);
}

export default function AvailabilityForm() {
  const [availabilities, setAvailabilities] = useState<Availability[]>(
    WEEK_DAYS.map((_, index) => {
      const match = MOCK_AVAILABILITY.find((a) => a.dayOfWeek === index);
      return {
        id: match?.id || `new_${index}`,
        userId: "usr_001",
        dayOfWeek: index,
        startTime: match?.startTime || "09:00",
        endTime: match?.endTime || "18:00",
        isActive: match ? match.isActive : index !== 0 && index !== 6, // desativa final de semana por padrão
      };
    })
  );

  const [saved, setSaved] = useState(false);

  function toggleDay(dayOfWeek: number) {
    setAvailabilities((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayOfWeek ? { ...item, isActive: !item.isActive } : item
      )
    );
  }

  function updateTime(dayOfWeek: number, field: "startTime" | "endTime", value: string) {
    setAvailabilities((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayOfWeek ? { ...item, [field]: value } : item
      )
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="p-6 rounded-2xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container-lowest)] shadow-sm">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ color: "var(--color-brand)" }}>
            calendar_clock
          </span>
          Janela de Atendimento Padrão
        </h2>

        <div className="space-y-4">
          {WEEK_DAYS.map((dayName, index) => {
            const dayConfig = availabilities.find((a) => a.dayOfWeek === index)!;

            return (
              <div
                key={dayName}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 gap-4
                  ${
                    dayConfig.isActive
                      ? "border-[var(--color-brand-light)] bg-[var(--color-surface-container-low)]"
                      : "border-[var(--color-surface-container-highest)] bg-transparent opacity-60"
                  }`}
              >
                {/* Day Switcher */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dayConfig.isActive}
                      onChange={() => toggleDay(index)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[var(--color-surface-container-highest)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-brand)]"></div>
                  </label>
                  <span className="font-bold text-sm">{dayName}</span>
                </div>

                {/* Time Range Selector */}
                {dayConfig.isActive ? (
                  <div className="flex items-center gap-3 animate-fade-in">
                    <div className="relative">
                      <select
                        value={dayConfig.startTime}
                        onChange={(e) => updateTime(index, "startTime", e.target.value)}
                        className="appearance-none bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-highest)] rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[var(--color-brand-light)] outline-none cursor-pointer"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-secondary)] pointer-events-none">
                        keyboard_arrow_down
                      </span>
                    </div>

                    <span className="text-[var(--color-secondary)] font-medium">às</span>

                    <div className="relative">
                      <select
                        value={dayConfig.endTime}
                        onChange={(e) => updateTime(index, "endTime", e.target.value)}
                        className="appearance-none bg-[var(--color-surface-container-lowest)] border border-[var(--color-surface-container-highest)] rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[var(--color-brand-light)] outline-none cursor-pointer"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-secondary)] pointer-events-none">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider italic sm:pr-8 py-2">
                    Indisponível / Fechado
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98] flex items-center gap-2"
          style={{
            background: "var(--color-brand-light)",
            color: "var(--color-brand-on-container)",
          }}
        >
          {saved ? (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              Salvo!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              Salvar Horários
            </>
          )}
        </button>
      </div>
    </div>
  );
}
