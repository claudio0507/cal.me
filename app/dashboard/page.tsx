"use client";

/**
 * Cal.me — Dashboard
 * Visão geral de agendamentos + ações rápidas de compartilhamento.
 */

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import AppointmentList from "@/components/dashboard/AppointmentList";
import QuickStats from "@/components/dashboard/QuickStats";
import { MOCK_USER } from "@/lib/mock-data";
import { Icon, type IconName } from "@/components/ui/Icon";

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const firstName = MOCK_USER.name.split(" ")[0];
  const bookingUrl = `https://cal.me/${MOCK_USER.username}`;

  return (
    <AppShell
      title={`${greet()}, ${firstName}.`}
      description="Resumo da sua agenda e atalhos para compartilhar a sua página."
      actions={
        <CopyLinkButton url={bookingUrl} />
      }
    >
      <QuickStats />

      {/* Appointments */}
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
        <AppointmentList />
      </section>

      {/* Quick actions */}
      <section className="mt-10">
        <span className="label">Compartilhar</span>
        <h2 className="font-display text-[22px] leading-tight text-[var(--ink-900)] mt-1 mb-4">
          Distribuir o link da sua página
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
          <QuickAction
            icon="link"
            title="Copiar link"
            description={bookingUrl}
            onClick={() => navigator.clipboard.writeText(bookingUrl)}
          />
          <QuickAction
            icon="message-circle"
            title="Enviar via WhatsApp"
            description="Mensagem pronta para enviar"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(
                  `Agende uma reunião comigo: ${bookingUrl}`
                )}`,
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
                `mailto:?subject=${encodeURIComponent("Agende um horário")}&body=${encodeURIComponent(
                  `Olá! Escolha um horário que funcione para você: ${bookingUrl}`
                )}`,
                "_blank"
              )
            }
          />
        </div>
      </section>
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
