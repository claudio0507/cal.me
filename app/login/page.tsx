"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao fazer login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="Cal.me">
            <Logo size="md" tagline />
          </Link>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-7">
          <h1 className="font-display text-[22px] tracking-tight text-[var(--ink-900)] mb-1">
            Acesso ao painel
          </h1>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            Entre com suas credenciais para gerenciar sua agenda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-[12px] font-medium text-[var(--ink-800)] block mb-1.5">
                E-mail
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)] placeholder:text-[var(--color-muted-2)]"
              />
            </label>

            <label className="block">
              <span className="text-[12px] font-medium text-[var(--ink-800)] block mb-1.5">
                Senha
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)] placeholder:text-[var(--color-muted-2)]"
              />
            </label>

            {error && (
              <p className="text-[13px] text-[var(--color-danger)] flex items-center gap-1.5">
                <Icon name="alert-circle" size={14} />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Icon name="sync" size={15} className="animate-spin" />
                  Entrando…
                </>
              ) : (
                <>
                  Entrar no painel
                  <Icon name="arrow-right" size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-[var(--color-muted)] mt-6">
            Ainda não tem conta?{" "}
            <Link href="/signup" className="text-[var(--ink-900)] font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
