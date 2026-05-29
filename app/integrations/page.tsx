"use client";

/**
 * Cal.me — Integrations
 * Connect Google / Microsoft calendars + webhook & .ics info.
 */

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Icon, type IconName } from "@/components/ui/Icon";

interface Integration {
  id: string;
  provider: "GOOGLE" | "MICROSOFT";
  name: string;
  description: string;
  icon: IconName;
  connected: boolean;
  lastSync?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "int_google",
      provider: "GOOGLE",
      name: "Google Calendar",
      description:
        "Sincronização bidirecional com Google Workspace ou Gmail. Conflitos bloqueados em tempo real.",
      icon: "calendar",
      connected: false,
    },
    {
      id: "int_ms",
      provider: "MICROSOFT",
      name: "Microsoft 365",
      description:
        "Outlook, Exchange ou Microsoft 365 corporativo. OAuth com permissões mínimas.",
      icon: "mail",
      connected: false,
    },
  ]);

  function toggleConnection(_id: string) {
    alert(
      "Integração com calendário externo está em desenvolvimento. Por enquanto, conflitos de horário são bloqueados automaticamente usando os agendamentos no próprio Cal.me."
    );
  }

  return (
    <AppShell
      title="Integrações"
      description="OAuth com Google Agenda e Microsoft 365 em desenvolvimento. Por enquanto, todos os agendamentos do Cal.me já bloqueiam conflitos automaticamente."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
        {integrations.map((i) => (
          <IntegrationCard
            key={i.id}
            integration={i}
            onToggle={() => toggleConnection(i.id)}
          />
        ))}
      </div>

      <section className="mt-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-6">
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 grid place-items-center rounded-[var(--radius)] bg-[var(--color-surface-2)] text-[var(--ink-900)] shrink-0">
            <Icon name="zap" size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-medium text-[var(--ink-900)] mb-1">
              Convites por e-mail & arquivos .ics
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
              Ao confirmar um agendamento, o Cal.me gera um token único e anexa
              um arquivo de convite{" "}
              <code className="font-mono text-[12px] bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded">
                .ics
              </code>{" "}
              padronizado. O cliente recebe a notificação no provedor padrão
              (Apple Mail, Gmail, Outlook), mesmo sem conexões OAuth.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <SecondaryLink icon="external-link">Documentação do webhook</SecondaryLink>
              <SecondaryLink icon="mail">Personalizar template de e-mail</SecondaryLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-6">
        <div className="flex items-start gap-4">
          <span className="w-10 h-10 grid place-items-center rounded-[var(--radius)] bg-[var(--color-surface-2)] text-[var(--ink-900)] shrink-0">
            <Icon name="shield" size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-medium text-[var(--ink-900)] mb-1">
              Privacidade & escopo de acesso
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">
              Solicitamos apenas leitura de eventos para bloquear conflitos e
              escrita em um calendário designado para criar agendamentos. Tokens
              ficam criptografados em repouso (AES-256) e nunca são expostos no
              cliente.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function IntegrationCard({
  integration,
  onToggle,
}: {
  integration: Integration;
  onToggle: () => void;
}) {
  const { connected, name, description, icon, lastSync } = integration;

  return (
    <article className="bg-[var(--color-surface)] p-6 flex flex-col gap-5">
      <header className="flex items-start gap-4">
        <span className="w-11 h-11 grid place-items-center rounded-[var(--radius)] bg-[var(--color-surface-2)] text-[var(--ink-900)] shrink-0">
          <Icon name={icon} size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[16px] font-medium text-[var(--ink-900)]">{name}</h3>
            <StatusPill connected={connected} />
          </div>
          <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">
            {description}
          </p>
        </div>
      </header>

      <footer className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? "bg-[var(--color-positive)]" : "bg-[var(--color-muted-2)]"
            }`}
          />
          <span className="text-[var(--color-muted)]">
            {connected
              ? `Sincronização ativa · ${lastSync ?? "agora"}`
              : "Nenhuma conta vinculada"}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium border border-dashed border-[var(--color-border-strong)] text-[var(--color-muted)] rounded-[var(--radius)] transition-colors hover:bg-[var(--color-surface-2)]"
        >
          Em breve
        </button>
      </footer>
    </article>
  );
}

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 text-[10px] font-medium uppercase
        tracking-wider px-1.5 py-0.5 rounded-sm border
        ${
          connected
            ? "text-[var(--color-positive)] bg-[var(--color-positive-soft)] border-[var(--color-positive)]/20"
            : "text-[var(--color-muted)] bg-[var(--color-surface-2)] border-[var(--color-border)]"
        }
      `}
    >
      <span className="w-1 h-1 rounded-full bg-current" />
      {connected ? "Conectado" : "Desconectado"}
    </span>
  );
}

function SecondaryLink({
  icon,
  children,
}: {
  icon: IconName;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-[var(--ink-900)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] rounded-[var(--radius-sm)] transition-colors"
    >
      <Icon name={icon} size={13} />
      {children}
    </button>
  );
}
