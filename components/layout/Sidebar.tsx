"use client";

/**
 * Cal.me — Sidebar
 * Real client-side nav via Next Link + usePathname. Mobile drawer included.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

interface NavItem {
  icon: IconName;
  label: string;
  href: string;
}

const PRIMARY_NAV: NavItem[] = [
  { icon: "dashboard", label: "Painel", href: "/dashboard" },
  { icon: "clock", label: "Disponibilidade", href: "/availability" },
  { icon: "palette", label: "Personalização", href: "/settings" },
  { icon: "sync", label: "Integrações", href: "/integrations" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-[var(--ink-900)]/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40
          w-64 flex flex-col
          bg-[var(--color-surface)] border-r border-[var(--color-border)]
          transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          h-screen
        `}
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 grid place-items-center rounded-[var(--radius)] bg-[var(--ink-900)] text-white">
              <Icon name="logo" size={16} strokeWidth={1.8} />
            </span>
            <span className="font-display text-[18px] leading-none tracking-tight text-[var(--ink-900)]">
              Cal<span className="text-[var(--ink-400)]">.</span>me
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 -mr-1.5 text-[var(--color-muted)] hover:text-[var(--ink-900)]"
            aria-label="Fechar menu"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Section: workspace */}
        <div className="px-5 pt-5 pb-2">
          <span className="label">Espaço de trabalho</span>
        </div>

        <nav className="flex-1 px-3 stagger" aria-label="Seções principais">
          {PRIMARY_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 h-10 px-3 rounded-[var(--radius)]
                  text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-[var(--ink-900)] text-white"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)]"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} size={17} strokeWidth={isActive ? 1.8 : 1.6} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1 h-1 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="px-3 pb-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 h-10 rounded-[var(--radius)] bg-[var(--ink-900)] hover:bg-[var(--ink-800)] text-white text-sm font-medium transition-colors"
          >
            <Icon name="plus" size={15} strokeWidth={2} />
            Novo evento
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-border)] px-3 py-3 space-y-0.5">
          <button
            type="button"
            className="flex items-center gap-3 w-full h-9 px-3 rounded-[var(--radius)] text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] transition-colors"
          >
            <Icon name="help" size={16} />
            <span>Ajuda</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 w-full h-9 px-3 rounded-[var(--radius)] text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] transition-colors"
          >
            <Icon name="logout" size={16} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
