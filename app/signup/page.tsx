"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

function suggestUsername(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 30);
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNameChange(v: string) {
    setName(v);
    if (!usernameTouched) setUsername(suggestUsername(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar conta.");
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 grid place-items-center rounded-[var(--radius)] bg-[var(--ink-900)] text-white">
              <Icon name="logo" size={17} strokeWidth={1.8} />
            </span>
            <span className="font-display text-[20px] leading-none tracking-tight text-[var(--ink-900)]">
              Cal<span className="text-[var(--ink-400)]">.</span>me
            </span>
          </Link>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-7">
          <h1 className="font-display text-[22px] tracking-tight text-[var(--ink-900)] mb-1">
            Criar conta
          </h1>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            Sua página de reservas pronta em segundos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-[12px] font-medium text-[var(--ink-800)] block mb-1.5">
                Nome
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                maxLength={80}
                placeholder="Seu nome ou empresa"
                className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)] placeholder:text-[var(--color-muted-2)]"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-medium text-[var(--ink-800)]">
                  Seu link
                </span>
                <span className="text-[11px] text-[var(--color-muted-2)] font-mono">
                  cal.me/{username || "username"}
                </span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsernameTouched(true);
                  setUsername(suggestUsername(e.target.value));
                }}
                required
                maxLength={30}
                pattern="[a-z0-9]{3,}"
                placeholder="seunome"
                className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)] placeholder:text-[var(--color-muted-2)] font-mono"
              />
            </label>

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
                autoComplete="new-password"
                minLength={8}
                placeholder="Ao menos 8 caracteres"
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
                  Criando conta…
                </>
              ) : (
                <>
                  Criar conta
                  <Icon name="arrow-right" size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-[var(--color-muted)] mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-[var(--ink-900)] font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>

        <div className="mt-6 px-5 py-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] text-center">
          <p className="text-[12px] text-[var(--color-muted)] leading-relaxed">
            Problemas, melhorias ou parcerias? Fale com nosso suporte.
          </p>
          <a
            href="https://wa.me/5518991254923?text=Ol%C3%A1%2C%20preciso%20de%20suporte%20com%20o%20Cal.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-[13px] font-medium text-[var(--ink-900)] hover:underline"
          >
            <Icon name="message-circle" size={13} />
            +55 18 99125-4923
          </a>
        </div>
      </div>
    </div>
  );
}
