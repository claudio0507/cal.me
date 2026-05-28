"use client";

/**
 * Cal.me — TopBar (Header)
 * Barra superior com busca, notificações e perfil do usuário
 */

import { MOCK_USER } from "@/lib/mock-data";

interface TopBarProps {
  sidebarCollapsed?: boolean;
  onMobileMenuToggle?: () => void;
}

export default function TopBar({ sidebarCollapsed, onMobileMenuToggle }: TopBarProps) {
  const user = MOCK_USER;

  return (
    <header
      className="sticky top-0 z-30 flex justify-between items-center px-6 lg:px-10 h-16 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-surface-container-highest)]"
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)] transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[var(--color-secondary)] text-lg">
            search
          </span>
          <input
            className="bg-[var(--color-surface-container)] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 w-64 outline-none transition-all duration-200 placeholder:text-[var(--color-secondary)]"
            style={{ "--tw-ring-color": "var(--color-brand-light)" } as React.CSSProperties}
            placeholder="Buscar agendamento..."
            type="text"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)] transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse-soft"
            style={{ background: "var(--color-brand)" }}
          />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-full text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)] transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[var(--color-surface-container-highest)] hidden lg:block" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="font-bold text-sm leading-tight">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-secondary)]">
              Administrador
            </p>
          </div>
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full border-2 object-cover"
              style={{ borderColor: "var(--color-brand-light)" }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-success)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
