"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { generateTimeSlots } from "@/lib/mock-data";
import type { EventType } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { getThemeStyleVars } from "@/lib/theme";
import { googleCalendarUrl } from "@/lib/ics";

type Step = "event" | "datetime" | "details" | "confirmed";

interface PublicUser {
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
  eventTypes: EventType[];
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }>;
  appointments: Array<{ startTime: string; endTime: string; status: string }>;
}

export default function BookingPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setUser)
      .catch(() => setLoadError(true));
  }, [username]);

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-muted)]">
        <p>Página não encontrada.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--ink-900)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <BookingFlow user={user} />;
}

function BookingFlow({ user }: { user: PublicUser }) {
  const [step, setStep] = useState<Step>("event");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [icsToken, setIcsToken] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const themeVars = useMemo(
    () => getThemeStyleVars({ primaryColor: user.primaryColor, primaryContainer: user.primaryContainer }),
    [user.primaryColor, user.primaryContainer]
  );

  async function handleConfirm() {
    if (!selectedEvent || !selectedDate || !selectedTime) return;
    setConfirming(true);
    setBookingError(null);

    const [h, m] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(h, m, 0, 0);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          eventTypeId: selectedEvent.id,
          startTime: startTime.toISOString(),
          guestName,
          guestEmail,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao confirmar");

      setMeetingLink(data.meetingLink);
      setIcsToken(data.icsToken ?? null);
      setStep("confirmed");
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Erro ao agendar");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={themeVars as React.CSSProperties}>
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1080px] mx-auto px-5 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors"
          >
            <Icon name="chevron-left" size={14} />
            Voltar
          </Link>
          <span className="label">cal.me / {user.username}</span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero — editorial layout: banner full-width, overlapping avatar */}
        <section className="animate-fade-in">
          <div
            className="h-[120px] sm:h-[140px] lg:h-[160px] w-full relative"
            style={{
              background: user.bannerUrl
                ? `url(${user.bannerUrl}) center / cover no-repeat`
                : `linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-soft) 100%)`,
            }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/40 to-transparent pointer-events-none" />
          </div>

          <div className="max-w-[1080px] mx-auto px-5 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-10 gap-y-6 -mt-14 lg:-mt-16 mb-10 lg:mb-14">
              {/* Avatar — overlaps banner */}
              <div className="relative shrink-0">
                <div className="w-[112px] h-[112px] lg:w-[128px] lg:h-[128px] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface)] border-4 border-[var(--color-surface)] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full grid place-items-center"
                      style={{ background: "var(--color-brand-soft)", color: "var(--color-brand-on-soft)" }}
                    >
                      <Icon name="user" size={44} strokeWidth={1.4} />
                    </div>
                  )}
                </div>
              </div>

              {/* Host identity + title */}
              <div className="min-w-0 lg:pt-16">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="label">Anfitrião</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-muted-2)]" aria-hidden="true" />
                  <span className="text-[11px] font-mono text-[var(--color-muted-2)]">
                    cal.me/{user.username}
                  </span>
                </div>

                <h1 className="font-display text-[clamp(28px,4vw,44px)] leading-[1.05] tracking-[-0.02em] text-[var(--ink-900)]">
                  {user.name}
                </h1>

                {user.role && (
                  <p className="text-[15px] font-medium text-[var(--ink-700)] mt-1">
                    {user.role}
                  </p>
                )}

                <p className="text-[13px] text-[var(--color-muted)] mt-1 font-mono">
                  {user.email}
                </p>

                {user.welcomeMessage && (
                  <p
                    className="text-[15px] lg:text-[16px] leading-relaxed text-[var(--ink-800)] mt-5 max-w-[640px] pl-4 border-l-2"
                    style={{ borderColor: "var(--color-brand)" }}
                  >
                    {user.welcomeMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1080px] mx-auto px-5 lg:px-8 pb-10 lg:pb-14">
          <span className="label block mb-3">Reservar um horário</span>
          {/* Steps */}
          <Stepper step={step} />

          <div className="mt-8">
            {step === "event" && (
              <EventStep
                events={user.eventTypes.filter((e) => e.isActive)}
                onSelect={(e) => {
                  setSelectedEvent(e);
                  setStep("datetime");
                }}
              />
            )}

            {step === "datetime" && selectedEvent && (
              <DateTimeStep
                event={selectedEvent}
                appointments={user.appointments}
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
                onConfirm={handleConfirm}
                confirming={confirming}
                error={bookingError}
              />
            )}

            {step === "confirmed" && selectedEvent && selectedDate && selectedTime && (
              <ConfirmedStep
                event={selectedEvent}
                date={selectedDate}
                time={selectedTime}
                guestName={guestName}
                hostName={user.name}
                meetingLink={meetingLink}
                icsToken={icsToken}
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
            <p className="text-sm text-[var(--color-muted)] mt-0.5 line-clamp-2">{e.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--color-muted-2)]">{e.duration} min</span>
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
  appointments,
  selectedDate,
  selectedTime,
  onPickDate,
  onPickTime,
  onBack,
}: {
  event: EventType;
  appointments: Array<{ startTime: string | Date; endTime: string | Date; status: string }>;
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
    () =>
      selectedDate
        ? generateTimeSlots(selectedDate, event.duration, appointments)
        : [],
    [selectedDate, event.duration, appointments]
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
          <span className="font-medium text-[var(--ink-900)]">{event.title}</span> · {event.duration} min
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
                className="w-8 h-8 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] disabled:opacity-30 transition-colors"
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
              <div key={d} className="label text-[10px] py-2 text-[var(--color-muted-2)]">
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
              {slots.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onPickTime(t)}
                  className={`
                    h-10 text-sm font-medium font-mono tabular-nums
                    rounded-[var(--radius-sm)] transition-colors
                    ${
                      selectedTime === t
                        ? "bg-[var(--ink-900)] text-white"
                        : "border border-[var(--color-border)] text-[var(--ink-900)] hover:border-[var(--ink-900)] hover:bg-[var(--color-surface-2)]"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
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
  confirming,
  error,
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
  confirming: boolean;
  error: string | null;
}) {
  const isValid = guestName.trim().length >= 2 && /\S+@\S+\.\S+/.test(guestEmail);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden animate-fade-in">
      <form
        className="bg-[var(--color-surface)] p-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid && !confirming) onConfirm();
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

        {error && (
          <p className="text-[13px] text-[var(--color-danger)] flex items-center gap-1.5">
            <Icon name="alert-circle" size={14} />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || confirming}
          className="w-full h-11 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-[var(--radius)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--color-brand)", color: "var(--color-brand-on)" }}
        >
          {confirming ? (
            <>
              <Icon name="sync" size={15} className="animate-spin" />
              Confirmando…
            </>
          ) : (
            <>
              Confirmar agendamento
              <Icon name="arrow-right" size={15} />
            </>
          )}
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
  hostName,
  meetingLink,
  icsToken,
}: {
  event: EventType;
  date: Date;
  time: string;
  guestName: string;
  hostName: string;
  meetingLink: string | null;
  icsToken: string | null;
}) {
  const start = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
  }, [date, time]);
  const end = useMemo(() => new Date(start.getTime() + event.duration * 60 * 1000), [start, event.duration]);

  const description = meetingLink
    ? `Reunião com ${hostName}.\n${meetingLink}`
    : `Reunião com ${hostName}.`;

  const gcalUrl = googleCalendarUrl({
    title: event.title,
    start,
    end,
    description,
    location: meetingLink ?? undefined,
  });
  const icsHref = icsToken ? `/api/appointments/${icsToken}/ics` : null;

  const waMessage = `Olá! Confirmei nossa reunião:\n\n${event.title}\n${date.toLocaleDateString(
    "pt-BR",
    { weekday: "long", day: "numeric", month: "long" }
  )} às ${time}${meetingLink ? `\n\n${meetingLink}` : ""}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="max-w-[640px] mx-auto py-10 animate-fade-in">
      <div className="text-center mb-10">
        <div
          className="w-14 h-14 grid place-items-center rounded-full mx-auto mb-6"
          style={{ background: "var(--color-brand)", color: "var(--color-brand-on)" }}
        >
          <Icon name="check" size={22} strokeWidth={2.4} />
        </div>
        <h2 className="font-display text-[28px] tracking-tight text-[var(--ink-900)] mb-3">
          Agendamento confirmado.
        </h2>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          Obrigado, {guestName.split(" ")[0]}. Enviamos o convite para o seu e-mail.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-5 mb-4">
        <Summary event={event} date={date} time={time} />
      </div>

      {meetingLink && (
        <a
          href={meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 px-4 py-3 mb-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] hover:bg-[var(--color-surface-2)] transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-9 h-9 grid place-items-center rounded-[var(--radius-sm)] shrink-0"
              style={{ background: "var(--color-brand)", color: "var(--color-brand-on)" }}
            >
              <Icon name="video" size={16} />
            </span>
            <div className="min-w-0 text-left">
              <p className="text-[12px] font-medium text-[var(--ink-900)]">Entrar na reunião</p>
              <p className="text-[11px] text-[var(--color-muted)] font-mono truncate">
                {meetingLink}
              </p>
            </div>
          </div>
          <Icon
            name="external-link"
            size={14}
            className="text-[var(--color-muted)] shrink-0 group-hover:text-[var(--ink-900)] transition-colors"
          />
        </a>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <AddToCalendarMenu gcalUrl={gcalUrl} icsHref={icsHref} />
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium bg-[var(--ink-900)] text-white hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
        >
          <Icon name="message-circle" size={14} />
          Compartilhar no WhatsApp
        </a>
      </div>
    </div>
  );
}

function AddToCalendarMenu({
  gcalUrl,
  icsHref,
}: {
  gcalUrl: string;
  icsHref: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] rounded-[var(--radius)] transition-colors"
      >
        <Icon name="calendar" size={14} />
        Adicionar ao calendário
        <Icon name={open ? "chevron-up" : "chevron-down"} size={13} className="text-[var(--color-muted)]" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-10 bottom-full sm:top-full sm:bottom-auto mb-2 sm:mb-0 sm:mt-2 left-0 right-0 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius)] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] overflow-hidden animate-fade-in"
        >
          <CalendarOption
            href={gcalUrl}
            label="Google Agenda"
            external
            onClick={() => setOpen(false)}
          />
          {icsHref && (
            <CalendarOption
              href={icsHref}
              label="Apple / Outros (.ics)"
              download
              onClick={() => setOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function CalendarOption({
  href,
  label,
  external,
  download,
  onClick,
}: {
  href: string;
  label: string;
  external?: boolean;
  download?: boolean;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download ? "" : undefined}
      role="menuitem"
      className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-[var(--ink-900)] hover:bg-[var(--color-surface-2)] transition-colors border-b border-[var(--color-border)] last:border-b-0"
    >
      <span className="font-medium">{label}</span>
      <Icon
        name={download ? "download" : "external-link"}
        size={13}
        className="text-[var(--color-muted)]"
      />
    </a>
  );
}
