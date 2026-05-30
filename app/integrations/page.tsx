"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { Icon, type IconName } from "@/components/ui/Icon";

interface IntegrationDTO {
  provider: "GOOGLE" | "MICROSOFT";
  isActive: boolean;
  expiresAt: string | null;
  calendarId: string | null;
}

interface IntegrationStatus {
  google: IntegrationDTO | null;
}

export default function IntegrationsPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="Integrações" description="">
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[var(--ink-900)] border-t-transparent rounded-full animate-spin" />
          </div>
        </AppShell>
      }
    >
      <IntegrationsView />
    </Suspense>
  );
}

function IntegrationsView() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<IntegrationStatus>({ google: null });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const load = useCallback(() => {
    return fetch("/api/integrations")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setStatus(d);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    const g = searchParams.get("google");
    if (g === "connected") {
      setBanner({ tone: "success", text: "Google Calendar conectado com sucesso." });
    } else if (g === "error") {
      const reason = searchParams.get("reason") ?? "";
      setBanner({
        tone: "error",
        text: `Falha ao conectar Google Calendar${reason ? ` (${reason})` : ""}. Tente novamente.`,
      });
    }
  }, [searchParams]);

  async function connectGoogle() {
    window.location.href = "/api/oauth/google/start";
  }

  async function disconnectGoogle() {
    if (!confirm("Desconectar o Google Calendar? Conflitos não serão mais bloqueados via Google.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/oauth/google/disconnect", { method: "POST" });
      if (res.ok) {
        setStatus({ google: null });
        setBanner({ tone: "success", text: "Google Calendar desconectado." });
      } else {
        setBanner({ tone: "error", text: "Erro ao desconectar." });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Integrações"
      description="Conecte calendários externos para sincronização bidirecional e bloqueio automático de conflitos."
    >
      {banner && (
        <div
          className={`mb-6 px-4 py-3 rounded-[var(--radius)] border text-sm flex items-center gap-2 ${
            banner.tone === "success"
              ? "bg-[var(--color-positive-soft)] border-[var(--color-positive)]/30 text-[var(--color-positive)]"
              : "bg-[var(--color-danger-soft)] border-[var(--color-danger)]/30 text-[var(--color-danger)]"
          }`}
        >
          <Icon name={banner.tone === "success" ? "check" : "alert-circle"} size={14} />
          {banner.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--ink-900)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
            <IntegrationCard
              name="Google Calendar"
              icon="calendar"
              description="Sincronização bidirecional: conflitos do seu Google Agenda bloqueiam slots no Cal.me, e cada reserva confirmada cria evento no seu calendário (com link do Google Meet)."
              connected={Boolean(status.google?.isActive)}
              expiresAt={status.google?.expiresAt ?? null}
              onConnect={connectGoogle}
              onDisconnect={disconnectGoogle}
              busy={busy}
              available={true}
            />
            <IntegrationCard
              name="Microsoft 365"
              icon="mail"
              description="Outlook / Microsoft 365. Em desenvolvimento."
              connected={false}
              expiresAt={null}
              onConnect={() => {}}
              onDisconnect={() => {}}
              busy={false}
              available={false}
            />
          </div>

          <section className="mt-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-6">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 grid place-items-center rounded-[var(--radius)] bg-[var(--color-surface-2)] text-[var(--ink-900)] shrink-0">
                <Icon name="zap" size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-medium text-[var(--ink-900)] mb-1">
                  Como funciona a sincronização Google
                </h2>
                <ul className="text-sm text-[var(--color-muted)] leading-relaxed space-y-1.5 list-disc pl-5">
                  <li>
                    <strong className="text-[var(--ink-800)]">Bloqueio de conflitos:</strong>{" "}
                    quando alguém acessa sua página de reservas, consultamos os próximos 60 dias do
                    seu Google Agenda (via API freeBusy) e ocultamos slots já ocupados.
                  </li>
                  <li>
                    <strong className="text-[var(--ink-800)]">Criação automática:</strong> ao confirmar
                    uma reserva, criamos o evento no seu calendário principal com link do Google Meet
                    e e-mail de convite para o hóspede.
                  </li>
                  <li>
                    <strong className="text-[var(--ink-800)]">Cancelamento sincronizado:</strong>{" "}
                    cancelar uma reunião no Cal.me também remove o evento do Google.
                  </li>
                </ul>
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
                  Solicitamos acesso ao calendário para leitura de disponibilidade (freeBusy) e
                  criação de eventos. Você pode desconectar a qualquer momento — fazemos a revogação
                  do token no Google automaticamente.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}

function IntegrationCard({
  name,
  icon,
  description,
  connected,
  expiresAt,
  onConnect,
  onDisconnect,
  busy,
  available,
}: {
  name: string;
  icon: IconName;
  description: string;
  connected: boolean;
  expiresAt: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  busy: boolean;
  available: boolean;
}) {
  return (
    <article className="bg-[var(--color-surface)] p-6 flex flex-col gap-5">
      <header className="flex items-start gap-4">
        <span className="w-11 h-11 grid place-items-center rounded-[var(--radius)] bg-[var(--color-surface-2)] text-[var(--ink-900)] shrink-0">
          <Icon name={icon} size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-[16px] font-medium text-[var(--ink-900)]">{name}</h3>
            <StatusPill connected={connected} available={available} />
          </div>
          <p className="text-[13px] text-[var(--color-muted)] leading-relaxed">{description}</p>
        </div>
      </header>

      <footer className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected
                ? "bg-[var(--color-positive)]"
                : "bg-[var(--color-muted-2)]"
            }`}
          />
          <span className="text-[var(--color-muted)]">
            {connected && expiresAt
              ? `Token expira em ${new Date(expiresAt).toLocaleString("pt-BR")}`
              : connected
              ? "Conectado"
              : available
              ? "Nenhuma conta vinculada"
              : "Em breve"}
          </span>
        </div>

        {available ? (
          connected ? (
            <button
              type="button"
              onClick={onDisconnect}
              disabled={busy}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium border border-[var(--color-border-strong)] text-[var(--ink-900)] hover:bg-[var(--color-surface-2)] rounded-[var(--radius)] transition-colors disabled:opacity-50"
            >
              Desconectar
            </button>
          ) : (
            <button
              type="button"
              onClick={onConnect}
              disabled={busy}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-[var(--ink-900)] text-white hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors disabled:opacity-50"
            >
              Conectar
              <Icon name="arrow-right" size={14} />
            </button>
          )
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium border border-dashed border-[var(--color-border-strong)] text-[var(--color-muted)] rounded-[var(--radius)] cursor-not-allowed"
          >
            Em breve
          </button>
        )}
      </footer>
    </article>
  );
}

function StatusPill({ connected, available }: { connected: boolean; available: boolean }) {
  if (!available) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-sm border text-[var(--color-muted)] bg-[var(--color-surface-2)] border-[var(--color-border)]">
        <span className="w-1 h-1 rounded-full bg-current" />
        Em breve
      </span>
    );
  }
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
