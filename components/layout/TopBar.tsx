"use client";

/**
 * Cal.me — TopBar (header)
 * Search, notifications, profile. Hamburger triggers Sidebar drawer on mobile.
 */

import { MOCK_USER } from "@/lib/mock-data";
import { Icon } from "@/components/ui/Icon";

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const user = MOCK_USER;

  return (
    <header
      className="sticky top-0 z-20 h-16 flex items-center gap-4 px-5 lg:px-8 bg-[var(--color-surface)]/85 backdrop-blur border-b border-[var(--color-border)]"
    >
      <button
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 text-[var(--color-muted)] hover:text-[var(--ink-900)]"
        aria-label="Abrir menu"
      >
        <Icon name="menu" size={20} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Icon
          name="search"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]"
        />
        <input
          type="search"
          placeholder="Buscar agendamento, cliente ou evento…"
          className="
            w-full h-9 pl-9 pr-3 text-sm
            bg-[var(--color-surface-2)] border border-transparent
            rounded-[var(--radius)]
            text-[var(--ink-900)] placeholder:text-[var(--color-muted-2)]
            outline-none
            focus:bg-[var(--color-surface)] focus:border-[var(--color-border-strong)]
            transition-colors
          "
          aria-label="Buscar"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline font-mono text-[10px] text-[var(--color-muted-2)] border border-[var(--color-border)] rounded px-1.5 py-0.5 bg-[var(--color-surface)]">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1 sm:hidden" />

      {/* Right cluster */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="relative w-9 h-9 grid place-items-center rounded-[var(--radius)] text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] transition-colors"
          aria-label="Notificações"
        >
          <Icon name="bell" size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--ink-900)]" />
        </button>

        <div className="hidden lg:block w-px h-6 bg-[var(--color-border)] mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium leading-tight text-[var(--ink-900)]">{user.name}</p>
            <p className="label text-[10px] leading-tight">Administradora</p>
          </div>
          <div className="relative">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-[var(--color-border)]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[var(--color-surface-2)] grid place-items-center text-[var(--color-muted)]">
                <Icon name="user" size={16} />
              </div>
            )}
            <span
              className="absolute -bottom-0 -right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-positive)]"
              aria-label="Online"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
