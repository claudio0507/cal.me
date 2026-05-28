import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* ─────── Top bar ─────── */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 grid place-items-center rounded-[var(--radius)] bg-[var(--ink-900)] text-white">
              <Icon name="logo" size={16} strokeWidth={1.8} />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[20px] leading-none tracking-tight text-[var(--ink-900)]">
                Cal<span className="text-[var(--ink-400)]">.</span>me
              </span>
              <span className="label hidden sm:inline">Enterprise scheduling</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/claudio"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-sm text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors"
            >
              Página de exemplo
              <Icon name="external-link" size={14} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
            >
              Acessar painel
              <Icon name="arrow-right" size={14} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ─────── Hero ─────── */}
      <main className="flex-1">
        <section className="max-w-[1180px] mx-auto px-6 lg:px-10 pt-20 pb-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
            <div className="animate-fade-in">
              <span className="label inline-flex items-center gap-2 mb-8">
                <span className="w-1 h-1 rounded-full bg-[var(--ink-900)]" />
                Plataforma white-label · Versão 0.1
              </span>

              <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[1.04] tracking-[-0.02em] text-[var(--ink-900)] mb-6">
                Agendamento corporativo,{" "}
                <span className="italic text-[var(--ink-700)]">com a marca</span>{" "}
                da sua empresa.
              </h1>

              <p className="max-w-[52ch] text-[17px] leading-[1.55] text-[var(--color-muted)] mb-10">
                Páginas de reserva personalizadas, sincronização bidirecional com
                Google e Outlook, e convites automáticos por e-mail.
                Operação simples, identidade visual sob controle.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
                >
                  Abrir painel
                  <Icon name="arrow-right" size={15} />
                </Link>
                <Link
                  href="/claudio"
                  className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-[var(--ink-900)] bg-[var(--color-surface)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] rounded-[var(--radius)] transition-colors"
                >
                  Ver página de reserva
                  <Icon name="external-link" size={15} />
                </Link>
              </div>

              {/* Quick facts */}
              <dl className="mt-16 grid grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
                {[
                  { k: "Tempo médio de setup", v: "8 min" },
                  { k: "Conflitos evitados", v: "100%" },
                  { k: "Cobertura de provedores", v: "Google · MS 365" },
                ].map((f) => (
                  <div key={f.k} className="bg-[var(--color-surface)] px-5 py-4">
                    <dd className="font-display text-[22px] leading-tight text-[var(--ink-900)]">{f.v}</dd>
                    <dt className="label mt-1">{f.k}</dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Visual — minimalist UI mock */}
            <div className="animate-scale-in lg:sticky lg:top-10">
              <div className="border border-[var(--color-border-strong)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 h-9 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-300)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-300)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-300)]" />
                  <span className="ml-auto font-mono text-[10px] text-[var(--color-muted)]">cal.me/sua-empresa</span>
                </div>
                <div className="p-6">
                  <span className="label">Consultoria</span>
                  <h3 className="font-display text-[26px] leading-tight tracking-tight text-[var(--ink-900)] mt-2 mb-1">
                    Aetheric Precision
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] mb-6">
                    Agende uma consultoria técnica com o nosso time.
                  </p>
                  <div className="space-y-2">
                    {[
                      { t: "Consulta de 30 min", d: "Conversa de alinhamento", m: "30" },
                      { t: "Demonstração de produto", d: "Walkthrough completo", m: "60" },
                      { t: "Kickoff de projeto", d: "Definição de escopo", m: "45" },
                    ].map((e) => (
                      <div key={e.t} className="flex items-center justify-between gap-3 px-4 py-3 border border-[var(--color-border)] rounded-[var(--radius)] hover:border-[var(--ink-900)] transition-colors group">
                        <div>
                          <p className="text-sm font-medium text-[var(--ink-900)]">{e.t}</p>
                          <p className="text-xs text-[var(--color-muted)]">{e.d}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[var(--color-muted)]">{e.m}min</span>
                          <Icon name="arrow-right" size={14} className="text-[var(--color-muted)] group-hover:text-[var(--ink-900)] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="label mt-4 text-center">
                Pré-visualização — o seu inquilino, a sua identidade
              </p>
            </div>
          </div>
        </section>

        {/* ─────── Pillars ─────── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-16">
            <span className="label">O essencial, bem feito</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-tight tracking-tight text-[var(--ink-900)] mt-3 mb-10 max-w-2xl">
              Três pilares para que o agendamento desapareça do seu caminho.
            </h2>

            <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
              {[
                {
                  i: "palette" as const,
                  t: "White-label completo",
                  d: "Logo, banner, cor de destaque e textos. Cada cliente recebe um link com a sua cara.",
                },
                {
                  i: "sync" as const,
                  t: "Sincronização real",
                  d: "Conexão bidirecional com Google Calendar e Microsoft 365. Conflitos bloqueados automaticamente.",
                },
                {
                  i: "calendar-check" as const,
                  t: "Convites sem fricção",
                  d: "Arquivo .ics anexado, lembretes por e-mail e atalhos para WhatsApp. Sem app, sem cadastro.",
                },
              ].map((p) => (
                <div key={p.t} className="bg-[var(--color-surface)] p-7">
                  <Icon name={p.i} size={22} className="text-[var(--ink-900)]" />
                  <h3 className="font-display text-[20px] leading-tight text-[var(--ink-900)] mt-5 mb-2">{p.t}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ─────── Footer ─────── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-muted)]">
            © 2026 Cal.me · Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className="text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors">Termos</a>
            <a href="#" className="text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors">Privacidade</a>
            <a href="#" className="text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
