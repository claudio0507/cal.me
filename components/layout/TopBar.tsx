"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

interface TopBarProps {
  onMenuToggle: () => void;
}

interface MeUser {
  name: string;
  role: string | null;
  avatarUrl: string | null;
  username: string;
  isAdmin?: boolean;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const router = useRouter();
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => u && setUser(u))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-4 px-5 lg:px-8 bg-[var(--color-surface)]/85 backdrop-blur border-b border-[var(--color-border)]">
      <button
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 text-[var(--color-muted)] hover:text-[var(--ink-900)]"
        aria-label="Abrir menu"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium leading-tight text-[var(--ink-900)] truncate max-w-[200px]">
                {user.name}
              </p>
              {user.role && (
                <p className="text-[11px] leading-tight text-[var(--color-muted)] truncate max-w-[200px]">
                  {user.role}
                </p>
              )}
            </div>
            <div className="relative shrink-0">
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
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 h-9 px-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--ink-900)] rounded-[var(--radius)] transition-colors"
              aria-label="Sair"
            >
              <Icon name="logout" size={14} />
              <span className="hidden lg:inline">Sair</span>
            </button>
          </>
        ) : (
          <div className="w-9 h-9 rounded-full bg-[var(--color-surface-2)] animate-pulse" />
        )}
      </div>
    </header>
  );
}
