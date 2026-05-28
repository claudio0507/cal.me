"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import AppointmentList from "@/components/dashboard/AppointmentList";
import QuickStats from "@/components/dashboard/QuickStats";
import type { Appointment } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const BOOKING_URL = "https://calme-khaki.vercel.app/claudio";

export default function DashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return []; }
        return r.json();
      })
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <AppShell
      title={`${greet()}.`}
      description="Resumo da sua agenda e atalhos para compartilhar a sua página."
      actions={
        <div className="flex items-center gap-2">
          <CopyLinkButton url={BOOKING_URL} />
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 h-9 px-3 text-sm font-medium text-[var(--color-muted)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] rounded-[var(--radius)] transition-colors"
          >
            <Icon name="logout" size={14} />
            Sair
          </button>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--ink-900)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <QuickStats appointments={appointments} />

          <section className="mt-10">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="label">Próximos agendamentos</span>
                <h2 className="font-display text-[22px] leading-tight text-[var(--ink-900)] mt-1">
                  Agenda em andamento
                </h2>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors inline-flex items-center gap-1.5"
              >
                Ver todos
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
            <AppointmentList appointments={appointments} />
          </section>

          <section className="mt-10">
            <span className="label">Compartilhar</span>
            <h2 className="font-display text-[22px] leading-tight text-[var(--ink-900)] mt-1 mb-4">
              Distribuir o link da sua página
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
              <QuickAction
                icon="link"
                title="Copiar link"
                description={BOOKING_URL}
                onClick={() => navigator.clipboard.writeText(BOOKING_URL)}
              />
              <QuickAction
                icon="message-circle"
                title="Enviar via WhatsApp"
                description="Mensagem pronta para enviar"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`Agende uma reunião comigo: ${BOOKING_URL}`)}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              />
              <QuickAction
                icon="mail"
                title="Enviar por e-mail"
                description="Abre seu cliente de e-mail padrão"
                onClick={() =>
                  window.open(
                    `mailto:?subject=${encodeURIComponent("Agende um horário")}&body=${encodeURIComponent(`Olá! Escolha um horário: ${BOOKING_URL}`)}`,
                    "_blank"
                  )
                }
              />
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
    >
      <Icon name={copied ? "check" : "link"} size={14} strokeWidth={2} />
      {copied ? "Link copiado" : "Copiar link"}
    </button>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
}: {
  icon: IconName;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-[var(--color-surface)] px-5 py-5 group hover:bg-[var(--color-surface-2)] transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="w-9 h-9 grid place-items-center rounded-[var(--radius)] bg-[var(--color-surface-2)] text-[var(--ink-900)] group-hover:bg-[var(--ink-900)] group-hover:text-white transition-colors">
          <Icon name={icon} size={16} />
        </span>
        <Icon
          name="arrow-right"
          size={15}
          className="text-[var(--color-muted-2)] group-hover:text-[var(--ink-900)] group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <p className="text-[15px] font-medium text-[var(--ink-900)]">{title}</p>
      <p className="text-xs text-[var(--color-muted)] mt-0.5 truncate font-mono">{description}</p>
    </button>
  );
}
