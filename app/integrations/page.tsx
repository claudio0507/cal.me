"use client";

/**
 * Cal.me — Integrations
 * Connect Google / Microsoft calendars
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "int_google",
      provider: "GOOGLE",
      name: "Google Calendar",
      description:
        "Sincronização bidirecional com Google Workspace ou Gmail. Cria eventos automaticamente quando alguém agenda.",
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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle OAuth callback messages
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "connected") {
      setMessage({ type: "success", text: "Google Calendar conectado com sucesso!" });
    } else if (error === "oauth_denied") {
      setMessage({ type: "error", text: "Permissão negada. Tente novamente." });
    } else if (error) {
      setMessage({ type: "error", text: "Erro ao conectar. Tente novamente." });
    }

    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Fetch integration status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/integrations/google");
        if (res.ok) {
          const data = await res.json();
          setIntegrations((prev) =>
            prev.map((i) =>
              i.provider === "GOOGLE"
                ? {
                    ...i,
                    connected: data.connected,
                    lastSync: data.lastSync
                      ? new Date(data.lastSync).toLocaleDateString("pt-BR")
                      : undefined,
                  }
                : i
            )
          );
        }
      } catch (err) {
        console.error("Failed to fetch integration status:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  async function toggleConnection(id: string) {
    const integration = integrations.find((i) => i.id === id);
    if (!integration) return;

    if (integration.provider === "GOOGLE") {
      if (integration.connected) {
        // Disconnect
        try {
          const res = await fetch("/api/integrations/google", { method: "DELETE" });
          if (res.ok) {
            setIntegrations((prev) =>
              prev.map((i) =>
                i.id === id
                  ? { ...i, connected: false, lastSync: undefined }
                  : i
              )
            );
            setMessage({ type: "success", text: "Google Calendar desconectado." });
          }
        } catch (err) {
          setMessage({ type: "error", text: "Erro ao desconectar." });
        }
      } else {
        // Connect - redirect to OAuth
        window.location.href = "/api/auth/google";
      }
    } else {
      alert("Integração Microsoft 365 em desenvolvimento.");
    }
  }

  return (
    <AppShell
      title="Integrações"
      description="Conecte Google Agenda e Microsoft 365 para sincronização automática de eventos."
    >
      {message && (
        <div
          className={`mb-6 p-4 rounded-[var(--radius)] border ${
            message.type === "success"
              ? "bg-[var(--color-positive-soft)] border-[var(--color-positive)]/20 text-[var(--color-positive)]"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
        {integrations.map((i) => (
          <IntegrationCard
            key={i.id}
            integration={i}
            onToggle={() => toggleConnection(i.id)}
            loading={loading}
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
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function IntegrationCard({
  integration,
  onToggle,
  loading,
}: {
  integration: Integration;
  onToggle: () => void;
  loading: boolean;
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
          disabled={loading}
          className={`
            inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-[var(--radius)] transition-colors
            ${
              connected
                ? "border border-[var(--color-border-strong)] text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"
                : "bg-[var(--ink-900)] text-white hover:bg-[var(--ink-700)]"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {loading ? "Carregando..." : connected ? "Desconectar" : "Conectar"}
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
