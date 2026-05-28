"use client";

/**
 * Cal.me — Public booking page
 * Tenant-themed: header pulls white-label settings, date/time picker is
 * neutral but accents (CTAs, selected state) inherit `--color-brand`.
 */

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { MOCK_USER, MOCK_EVENT_TYPES, generateTimeSlots } from "@/lib/mock-data";
import type { EventType } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

type Step = "event" | "datetime" | "details" | "confirmed";

export default function BookingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  use(params); // demo: resolves the async params
  const user = MOCK_USER;

  const [step, setStep] = useState<Step>("event");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1080px] mx-auto px-5 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors">
            <Icon name="chevron-left" size={14} />
            Voltar
          </Link>
          <span className="label">cal.me / {user.username}</span>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-[1080px] mx-auto px-5 lg:px-8 py-10 lg:py-14">
          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 mb-12 animate-fade-in">
            <div>
              <div
                className="h-16 -mx-1 rounded-[var(--radius)] mb-5"
                style={{
                  background: user.bannerUrl
                    ? `url(${user.bannerUrl}) center / cover`
                    : `var(--color-brand)`,
                }}
                aria-hidden="true"
              />
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[var(--radius)] overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-border)] shrink-0">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-[var(--color-muted)]">
                      <Icon name="user" size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="label">Anfitrião</span>
                  <p className="font-display text-[20px] leading-tight tracking-tight text-[var(--ink-900)] mt-0.5">
                    {user.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5 truncate font-mono">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="label">Página de reserva</span>
              <h1 className="font-display text-[clamp(32px,4.5vw,52px)] leading-[1.05] tracking-[-0.02em] text-[var(--ink-900)] mt-3 mb-4">
                Reserve um horário com {user.name.split(" ")[0]}.
              </h1>
              <p className="text-[16px] leading-relaxed text-[var(--color-muted)] max-w-prose">
                {user.welcomeMessage}
              </p>
            </div>
          </section>

          {/* Steps */}
          <Stepper step={step} />

          <div className="mt-8">
            {step === "event" && (
              <EventStep
                events={MOCK_EVENT_TYPES.filter((e) => e.isActive)}
                onSelect={(e) => {
                  setSelectedEvent(e);
                  setStep("datetime");
                }}
              />
            )}

            {step === "datetime" && selectedEvent && (
              <DateTimeStep
                event={selectedEvent}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onPickDate={setSelectedDate}
                onPickTime={(t) => {
                  setSelectedTime(t);
                  setStep("details");
                }}
                onBack={() => setStep("event")}
              />
            )}

            {step === "details" && selectedEvent && selectedDate && selectedTime && (
              <DetailsStep
                event={selectedEvent}
                date={selectedDate}
                time={selectedTime}
                guestName={guestName}
                guestEmail={guestEmail}
                notes={notes}
                onChangeName={setGuestName}
                onChangeEmail={setGuestEmail}
                onChangeNotes={setNotes}
                onBack={() => setStep("datetime")}
                onConfirm={() => setStep("confirmed")}
              />
            )}

            {step === "confirmed" && selectedEvent && selectedDate && selectedTime && (
              <ConfirmedStep
                event={selectedEvent}
                date={selectedDate}
                time={selectedTime}
                guestName={guestName}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1080px] mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
          <p>Página de reserva alimentada por Cal.me</p>
          <Link href="/" className="hover:text-[var(--ink-900)] transition-colors">
            Crie a sua →
          </Link>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────────── Stepper ───────────────────────── */
function Stepper({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "event", label: "Tipo de reunião" },
    { id: "datetime", label: "Data e horário" },
    { id: "details", label: "Seus dados" },
    { id: "confirmed", label: "Confirmação" },
  ];
  const currentIdx = steps.findIndex((s) => s.id === step);

  return (
    <ol
      className="grid grid-cols-4 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden"
      aria-label="Etapas do agendamento"
    >
      {steps.map((s, i) => {
        const status = i < currentIdx ? "done" : i === currentIdx ? "active" : "pending";
        return (
          <li
            key={s.id}
            className="bg-[var(--color-surface)] px-4 py-3 flex items-center gap-3"
            aria-current={status === "active" ? "step" : undefined}
          >
            <span
              className={`
                w-6 h-6 grid place-items-center rounded-full text-[11px] font-medium tabular-nums
                ${
                  status === "done"
                    ? "bg-[var(--color-brand)] text-[var(--color-brand-on)]"
                    : status === "active"
                    ? "bg-[var(--ink-900)] text-white"
                    : "bg-[var(--color-surface-2)] text-[var(--color-muted)]"
                }
              `}
            >
              {status === "done" ? <Icon name="check" size={12} strokeWidth={2.4} /> : i + 1}
            </span>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                status === "pending" ? "text-[var(--color-muted)]" : "text-[var(--ink-900)]"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ───────────────────────── Step 1 ───────────────────────── */
function EventStep({
  events,
  onSelect,
}: {
  events: EventType[];
  onSelect: (e: EventType) => void;
}) {
  return (
    <div className="grid gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden animate-fade-in">
      {events.map((e) => (
        <button
          key={e.id}
          type="button"
          onClick={() => onSelect(e)}
          className="text-left bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] transition-colors px-5 py-5 grid grid-cols-[auto_1fr_auto] gap-5 items-center"
        >
          <span className="w-11 h-11 grid place-items-center rounded-[var(--radius)] bg-[var(--color-surface-2)] text-[var(--ink-900)]">
            <Icon name="clock" size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-medium text-[var(--ink-900)]">{e.title}</p>
            <p className="text-sm text-[var(--color-muted)] mt-0.5 line-clamp-2">
              {e.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--color-muted-2)]">
              {e.duration} min
            </span>
            <Icon name="arrow-right" size={16} className="text-[var(--color-muted)]" />
          </div>
        </button>
      ))}
    </div>
  );
}

/* ───────────────────────── Step 2 ───────────────────────── */
function DateTimeStep({
  event,
  selectedDate,
  selectedTime,
  onPickDate,
  onPickTime,
  onBack,
}: {
  event: EventType;
  selectedDate: Date | null;
  selectedTime: string | null;
  onPickDate: (d: Date) => void;
  onPickTime: (t: string) => void;
  onBack: () => void;
}) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = useMemo(() => new Date(), []);
  const cursor = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return d;
  }, [today, monthOffset]);

  const days = useMemo(() => buildMonth(cursor), [cursor]);
  const slots = useMemo(
    () => (selectedDate ? generateTimeSlots(selectedDate, event.duration) : []),
    [selectedDate, event.duration]
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors"
        >
          <Icon name="chevron-left" size={14} /> Trocar tipo de reunião
        </button>
        <p className="text-xs text-[var(--color-muted)]">
          <span className="font-medium text-[var(--ink-900)]">{event.title}</span> ·{" "}
          {event.duration} min
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
        {/* Calendar */}
        <div className="bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-[18px] tracking-tight text-[var(--ink-900)] capitalize">
              {cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMonthOffset((m) => m - 1)}
                disabled={monthOffset === 0}
                className="w-8 h-8 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label="Mês anterior"
              >
                <Icon name="chevron-left" size={15} />
              </button>
              <button
                type="button"
                onClick={() => setMonthOffset((m) => m + 1)}
                className="w-8 h-8 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] transition-colors"
                aria-label="Próximo mês"
              >
                <Icon name="chevron-right" size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map((d) => (
              <div
                key={d}
                className="label text-[10px] py-2 text-[var(--color-muted-2)]"
              >
                {d}
              </div>
            ))}
            {days.map((d, i) => {
              if (!d) return <span key={`empty-${i}`} />;
              const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const disabled = isPast || isWeekend;
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              const isToday = d.toDateString() === today.toDateString();

              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPickDate(d)}
                  className={`
                    aspect-square text-sm font-medium tabular-nums rounded-[var(--radius-sm)]
                    transition-colors
                    ${
                      isSelected
                        ? "bg-[var(--ink-900)] text-white"
                        : disabled
                        ? "text-[var(--color-muted-2)]/40 cursor-not-allowed"
                        : isToday
                        ? "border border-[var(--ink-900)] text-[var(--ink-900)] hover:bg-[var(--color-surface-2)]"
                        : "text-[var(--ink-900)] hover:bg-[var(--color-surface-2)]"
                    }
                  `}
                  aria-label={d.toLocaleDateString("pt-BR")}
                  aria-pressed={isSelected}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="bg-[var(--color-surface)] p-5 flex flex-col">
          <span className="label mb-3">
            {selectedDate
              ? selectedDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : "Escolha uma data"}
          </span>

          {!selectedDate && (
            <p className="text-sm text-[var(--color-muted)] mt-4">
              Selecione um dia disponível no calendário ao lado.
            </p>
          )}

          {selectedDate && slots.length === 0 && (
            <p className="text-sm text-[var(--color-muted)] mt-4">
              Sem horários disponíveis neste dia.
            </p>
          )}

          {selectedDate && slots.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
              {slots.map((t) => {
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onPickTime(t)}
                    className={`
                      h-10 text-sm font-medium font-mono tabular-nums
                      rounded-[var(--radius-sm)] transition-colors
                      ${
                        isSelected
                          ? "bg-[var(--ink-900)] text-white"
                          : "border border-[var(--color-border)] text-[var(--ink-900)] hover:border-[var(--ink-900)] hover:bg-[var(--color-surface-2)]"
                      }
                    `}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildMonth(cursor: Date): (Date | null)[] {
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: firstDay }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  return cells;
}

/* ───────────────────────── Step 3 ───────────────────────── */
function DetailsStep({
  event,
  date,
  time,
  guestName,
  guestEmail,
  notes,
  onChangeName,
  onChangeEmail,
  onChangeNotes,
  onBack,
  onConfirm,
}: {
  event: EventType;
  date: Date;
  time: string;
  guestName: string;
  guestEmail: string;
  notes: string;
  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeNotes: (v: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const isValid = guestName.trim().length >= 2 && /\S+@\S+\.\S+/.test(guestEmail);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden animate-fade-in">
      <form
        className="bg-[var(--color-surface)] p-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) onConfirm();
        }}
      >
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors mb-4"
          >
            <Icon name="chevron-left" size={14} /> Trocar horário
          </button>
          <h3 className="font-display text-[20px] tracking-tight text-[var(--ink-900)]">
            Quase lá — confirme seus dados.
          </h3>
        </div>

        <BookField label="Nome completo" required>
          <input
            type="text"
            value={guestName}
            onChange={(e) => onChangeName(e.target.value)}
            required
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] outline-none focus:border-[var(--ink-900)] text-[var(--ink-900)]"
          />
        </BookField>

        <BookField label="E-mail" required>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => onChangeEmail(e.target.value)}
            required
            className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] outline-none focus:border-[var(--ink-900)] text-[var(--ink-900)]"
          />
        </BookField>

        <BookField label="Observações" hint="Opcional">
          <textarea
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            rows={4}
            placeholder="Algo que devemos saber antes da reunião?"
            className="w-full px-3 py-2.5 text-sm leading-relaxed bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] resize-none outline-none focus:border-[var(--ink-900)] text-[var(--ink-900)]"
          />
        </BookField>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full h-11 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-[var(--radius)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--color-brand)",
            color: "var(--color-brand-on)",
          }}
        >
          Confirmar agendamento
          <Icon name="arrow-right" size={15} />
        </button>
      </form>

      <aside className="bg-[var(--color-surface-2)] p-6">
        <span className="label mb-3 block">Resumo</span>
        <Summary event={event} date={date} time={time} />
      </aside>
    </div>
  );
}

function BookField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium text-[var(--ink-800)]">
          {label}
          {required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
        </span>
        {hint && <span className="text-[11px] text-[var(--color-muted-2)]">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Summary({ event, date, time }: { event: EventType; date: Date; time: string }) {
  return (
    <dl className="space-y-3 text-sm">
      <div>
        <dt className="label text-[10px]">Tipo</dt>
        <dd className="text-[var(--ink-900)] font-medium mt-0.5">{event.title}</dd>
      </div>
      <div>
        <dt className="label text-[10px]">Data</dt>
        <dd className="text-[var(--ink-900)] mt-0.5 capitalize">
          {date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </dd>
      </div>
      <div>
        <dt className="label text-[10px]">Horário</dt>
        <dd className="text-[var(--ink-900)] mt-0.5 font-mono">
          {time} · {event.duration} min
        </dd>
      </div>
    </dl>
  );
}

/* ───────────────────────── Step 4 ───────────────────────── */
function ConfirmedStep({
  event,
  date,
  time,
  guestName,
}: {
  event: EventType;
  date: Date;
  time: string;
  guestName: string;
}) {
  return (
    <div className="text-center max-w-md mx-auto py-10 animate-fade-in">
      <div
        className="w-14 h-14 grid place-items-center rounded-full mx-auto mb-6"
        style={{
          background: "var(--color-brand)",
          color: "var(--color-brand-on)",
        }}
      >
        <Icon name="check" size={22} strokeWidth={2.4} />
      </div>
      <h2 className="font-display text-[28px] tracking-tight text-[var(--ink-900)] mb-3">
        Agendamento confirmado.
      </h2>
      <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
        Obrigado, {guestName.split(" ")[0]}. Um convite com arquivo{" "}
        <span className="font-mono text-[12px] bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">
          .ics
        </span>{" "}
        foi enviado para o seu e-mail.
      </p>

      <div className="text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-5 mb-6">
        <Summary event={event} date={date} time={time} />
      </div>

      <div className="flex gap-2 justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] rounded-[var(--radius)] transition-colors"
        >
          <Icon name="calendar" size={14} />
          Adicionar ao calendário
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-[var(--ink-900)] text-white hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
        >
          <Icon name="message-circle" size={14} />
          Falar no WhatsApp
        </button>
      </div>
    </div>
  );
}
