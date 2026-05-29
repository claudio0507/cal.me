import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const STEPS: { n: string; title: string; description: string }[] = [
  {
    n: "01",
    title: "Crie sua conta",
    description:
      "Em 30 segundos: escolha um username, defina senha. Sua página de reservas é gerada na hora.",
  },
  {
    n: "02",
    title: "Personalize sua marca",
    description:
      "Logo, banner, cor, mensagem, tipos de serviço e a janela semanal de atendimento. Tudo configurável.",
  },
  {
    n: "03",
    title: "Compartilhe seu link",
    description:
      "cal.me/seuusername é seu cartão digital. Clientes escolhem horário; você recebe e-mail e link da reunião.",
  },
];

const PILLARS = [
  {
    i: "palette" as const,
    t: "White-label completo",
    d: "Logo, banner, cor de destaque e textos. Cada anfitrião recebe um link com a sua identidade.",
  },
  {
    i: "calendar-check" as const,
    t: "Convites sem fricção",
    d: "Arquivo .ics anexado, e-mails transacionais para hóspede e anfitrião, link de reunião gerado.",
  },
  {
    i: "shield" as const,
    t: "Conflitos bloqueados",
    d: "Disponibilidade semanal + verificação de conflitos em tempo real. Nenhum agendamento duplo.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Top bar */}
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
              <span className="label hidden sm:inline">Agendamento corporativo</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center h-9 px-3 text-sm text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
            >
              Criar conta grátis
              <Icon name="arrow-right" size={14} />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-[1180px] mx-auto px-6 lg:px-10 pt-20 pb-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
            <div className="animate-fade-in">
              <span className="label inline-flex items-center gap-2 mb-8">
                <span className="w-1 h-1 rounded-full bg-[var(--ink-900)]" />
                Grátis para começar · Sem cartão de crédito
              </span>

              <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[1.04] tracking-[-0.02em] text-[var(--ink-900)] mb-6">
                Sua página de agendamento,{" "}
                <span className="italic text-[var(--ink-700)]">com a sua cara</span>.
              </h1>

              <p className="max-w-[52ch] text-[17px] leading-[1.55] text-[var(--color-muted)] mb-10">
                Crie em 30 segundos. Personalize a marca, defina sua agenda
                e compartilhe um link. Cal.me cuida de e-mail de confirmação,
                arquivo de convite e link de reunião.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
                >
                  Criar minha conta
                  <Icon name="arrow-right" size={15} />
                </Link>
                <Link
                  href="/claudio"
                  className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-[var(--ink-900)] bg-[var(--color-surface)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] rounded-[var(--radius)] transition-colors"
                >
                  Ver página de exemplo
                  <Icon name="external-link" size={15} />
                </Link>
              </div>

              <dl className="mt-16 grid grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
                {[
                  { k: "Setup", v: "30 seg" },
                  { k: "Conflitos", v: "0%" },
                  { k: "E-mails", v: ".ics anexo" },
                ].map((f) => (
                  <div key={f.k} className="bg-[var(--color-surface)] px-5 py-4">
                    <dd className="font-display text-[22px] leading-tight text-[var(--ink-900)]">{f.v}</dd>
                    <dt className="label mt-1">{f.k}</dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Mock visual */}
            <div className="animate-scale-in lg:sticky lg:top-10">
              <div className="border border-[var(--color-border-strong)] rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 h-9 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-300)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-300)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-300)]" />
                  <span className="ml-auto font-mono text-[10px] text-[var(--color-muted)]">cal.me/seunome</span>
                </div>
                <div className="p-6">
                  <span className="label">Consultoria</span>
                  <h3 className="font-display text-[26px] leading-tight tracking-tight text-[var(--ink-900)] mt-2 mb-1">
                    Você + Sua Empresa
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] mb-6">
                    Sua mensagem de boas-vindas aparece aqui.
                  </p>
                  <div className="space-y-2">
                    {[
                      { t: "Reunião 30 min", d: "Conversa rápida de alinhamento", m: "30" },
                      { t: "Demo de Produto", d: "Demonstração completa", m: "60" },
                      { t: "Kickoff de Projeto", d: "Definição de escopo", m: "45" },
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
                Pré-visualização — a sua marca, o seu link
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-16">
            <span className="label">Como funciona</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-tight tracking-tight text-[var(--ink-900)] mt-3 mb-3 max-w-2xl">
              Três passos. Nenhuma curva de aprendizado.
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] max-w-[60ch] mb-10">
              Cal.me foi desenhada para profissionais e empresas que precisam de
              uma página de reservas profissional sem ter que aprender outra ferramenta.
            </p>

            <ol className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
              {STEPS.map((s) => (
                <li key={s.n} className="bg-[var(--color-surface)] p-7">
                  <span className="font-mono text-[12px] text-[var(--color-muted-2)] tabular-nums">
                    {s.n}
                  </span>
                  <h3 className="font-display text-[20px] leading-tight text-[var(--ink-900)] mt-3 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {s.description}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
              >
                Começar agora
                <Icon name="arrow-right" size={15} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center h-11 px-3 text-sm text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors"
              >
                Já tem conta? Entrar
              </Link>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section>
          <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-16">
            <span className="label">O essencial, bem feito</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-tight tracking-tight text-[var(--ink-900)] mt-3 mb-10 max-w-2xl">
              Três pilares para que o agendamento desapareça do seu caminho.
            </h2>

            <div className="grid md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden">
              {PILLARS.map((p) => (
                <div key={p.t} className="bg-[var(--color-surface)] p-7">
                  <Icon name={p.i} size={22} className="text-[var(--ink-900)]" />
                  <h3 className="font-display text-[20px] leading-tight text-[var(--ink-900)] mt-5 mb-2">{p.t}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-16 text-center">
            <h2 className="font-display text-[clamp(28px,3.5vw,40px)] leading-tight tracking-tight text-[var(--ink-900)] max-w-2xl mx-auto">
              Sua página de reservas em 30 segundos.
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] mt-3 max-w-[52ch] mx-auto">
              Grátis para começar. Sem cartão. Sem instalação. Pronto para receber agendamentos.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
              >
                Criar minha conta
                <Icon name="arrow-right" size={15} />
              </Link>
              <Link
                href="/claudio"
                className="inline-flex items-center gap-2 h-11 px-5 text-sm font-medium text-[var(--ink-900)] bg-[var(--color-surface)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] rounded-[var(--radius)] transition-colors"
              >
                Ver uma página real
                <Icon name="external-link" size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-muted)]">
            © 2026 Cal.me · Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5 text-xs">
            <Link href="/login" className="text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors">Entrar</Link>
            <Link href="/signup" className="text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors">Criar conta</Link>
            <Link href="/claudio" className="text-[var(--color-muted)] hover:text-[var(--ink-900)] transition-colors">Exemplo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
