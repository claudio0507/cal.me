import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6faff] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#506600]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ccff00] rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[#506600] font-bold">event_available</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#506600]">Cal.me</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#5f5e5e] font-semibold">Enterprise Scheduling</p>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-bold text-[#5f5e5e] hover:text-[#506600] transition-colors">
            Acessar Conta
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-bold bg-[#ccff00] text-[#121212] px-4 py-2.5 rounded-xl hover:brightness-105 active:scale-95 shadow-sm transition-all"
          >
            Painel Geral
          </Link>
        </nav>
      </header>

      {/* Hero section */}
      <main className="max-w-4xl mx-auto text-center py-20 z-10 animate-fade-in">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00]/25 text-[#506600] text-[10px] font-bold uppercase tracking-wider mb-6">
          <span className="material-symbols-outlined text-xs">workspace_premium</span>
          White-Label SaaS Minimalista
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#141d23] mb-6 leading-tight">
          O agendamento corporativo <br className="hidden md:inline" />
          <span style={{ color: "var(--color-brand, #506600)" }}>descomplicado e customizável</span>
        </h2>
        <p className="text-[#5f5e5e] max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10">
          Entregue páginas de agendamentos com a identidade visual completa da sua empresa parceira. Integrações bidirecionais instantâneas, links curtos e convites automáticos formatados.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 stagger">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#506600] hover:bg-[#405200] text-white font-bold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            Acessar Painel / Dashboard
          </Link>
          <Link
            href="/claudio"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#dbe4ed] hover:border-[#506600] bg-white text-[#141d23] font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Ver Página de Reserva (White-Label)
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-[#dbe4ed] pt-8 z-10 text-[10px] text-[#5f5e5e] font-semibold uppercase tracking-widest gap-4">
        <span>© 2026 Cal.me. Todos os direitos reservados.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#506600]">Termos</a>
          <a href="#" className="hover:text-[#506600]">Privacidade</a>
        </div>
      </footer>
    </div>
  );
}
