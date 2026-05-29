"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { Icon } from "@/components/ui/Icon";

interface AdminUser {
  id: string;
  name: string;
  role: string | null;
  email: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
  _count: {
    appointments: number;
    eventTypes: number;
  };
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    return fetch("/api/admin/users").then((r) => {
      if (r.status === 401) {
        router.push("/login");
        return null;
      }
      if (r.status === 403) {
        setForbidden(true);
        return null;
      }
      return r.json();
    });
  }, [router]);

  useEffect(() => {
    load()
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .finally(() => setLoading(false));
  }, [load]);

  async function removeUser(u: AdminUser) {
    if (!confirm(`Excluir ${u.name} (${u.email})? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Erro ao excluir.");
    }
  }

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    );
  });

  if (forbidden) {
    return (
      <AppShell title="Admin" description="Painel administrativo da plataforma.">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-10 text-center">
          <Icon name="shield" size={28} className="text-[var(--color-muted-2)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--ink-900)]">Acesso restrito</p>
          <p className="text-xs text-[var(--color-muted)] mt-1 max-w-md mx-auto">
            Esta área é destinada a administradores. Sua conta não está autorizada.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Usuários"
      description="Gerenciar contas cadastradas na plataforma."
      actions={
        <div className="relative">
          <Icon
            name="search"
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-2)]"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome, email, username"
            className="h-9 w-64 pl-9 pr-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius)] outline-none focus:border-[var(--ink-900)] text-[var(--ink-900)] placeholder:text-[var(--color-muted-2)]"
            aria-label="Buscar usuários"
          />
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[var(--ink-900)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden mb-8">
            <StatTile label="Total" value={users.length} icon="users" />
            <StatTile
              label="Com agendamentos"
              value={users.filter((u) => u._count.appointments > 0).length}
              icon="calendar"
            />
            <StatTile
              label="Total de eventos"
              value={users.reduce((sum, u) => sum + u._count.eventTypes, 0)}
              icon="clock"
            />
            <StatTile
              label="Total de reservas"
              value={users.reduce((sum, u) => sum + u._count.appointments, 0)}
              icon="calendar-check"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="border border-[var(--color-border)] rounded-[var(--radius)] p-12 text-center bg-[var(--color-surface)]">
              <p className="text-sm text-[var(--color-muted)]">
                {search ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado ainda."}
              </p>
            </div>
          ) : (
            <ul
              role="list"
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] overflow-hidden"
            >
              {filtered.map((u) => (
                <li
                  key={u.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-[var(--radius)] overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-border)] shrink-0">
                    {u.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[var(--color-muted)]">
                        <Icon name="user" size={16} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-medium text-[var(--ink-900)] truncate">
                        {u.name}
                      </p>
                      {u.role && (
                        <span className="text-[11px] text-[var(--color-muted)]">· {u.role}</span>
                      )}
                    </div>
                    <p className="text-[12px] text-[var(--color-muted)] font-mono truncate">
                      {u.email}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[var(--color-muted-2)] font-mono">
                      <span>cal.me/{u.username}</span>
                      <span aria-hidden="true">·</span>
                      <span>{u._count.appointments} reservas</span>
                      <span aria-hidden="true">·</span>
                      <span>{u._count.eventTypes} eventos</span>
                      <span aria-hidden="true">·</span>
                      <span>desde {fmtDate(u.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/${u.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--ink-900)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] transition-colors"
                      aria-label={`Abrir página de ${u.name}`}
                    >
                      <Icon name="external-link" size={12} />
                      Página
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeUser(u)}
                      className="w-8 h-8 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] transition-colors"
                      aria-label={`Excluir ${u.name}`}
                      title="Excluir"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </AppShell>
  );
}

function StatTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: "users" | "calendar" | "clock" | "calendar-check";
}) {
  return (
    <div className="bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="label">{label}</span>
        <Icon name={icon} size={15} className="text-[var(--color-muted-2)]" />
      </div>
      <p className="font-display text-[32px] leading-none tracking-tight text-[var(--ink-900)] tabular-nums">
        {value.toString().padStart(2, "0")}
      </p>
    </div>
  );
}
