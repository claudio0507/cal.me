"use client";

import { useEffect, useRef, useState } from "react";
import { PRESET_PALETTES, readableOn } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

const MAX_WELCOME = 240;
const MAX_SERVICE_TYPES = 5;
const DURATION_OPTIONS = [15, 30, 45, 60, 90];

interface ServiceTypeEntry {
  id: string;
  title: string;
  duration: number;
  isPersisted: boolean;
}

interface UserMe {
  id: string;
  name: string;
  role: string | null;
  email: string;
  username: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  welcomeMessage: string | null;
  primaryColor: string;
  primaryContainer: string;
  eventTypes: { id: string; title: string; duration: number; slug: string; isActive: boolean }[];
}

export default function BrandingForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#506600");
  const [primaryContainer, setPrimaryContainer] = useState("#ccff00");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeEntry[]>([]);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((u: UserMe) => {
        if (!u || !u.id) return;
        setUsername(u.username);
        setName(u.name);
        setRole(u.role ?? "");
        setEmail(u.email);
        setWelcomeMessage(u.welcomeMessage ?? "");
        setPrimaryColor(u.primaryColor);
        setPrimaryContainer(u.primaryContainer);
        setAvatarPreview(u.avatarUrl ?? "");
        setBannerPreview(u.bannerUrl ?? "");
        setServiceTypes(
          (u.eventTypes ?? []).map((e) => ({
            id: e.id,
            title: e.title,
            duration: e.duration,
            isPersisted: true,
          }))
        );
      })
      .catch(() => setErrorMsg("Não foi possível carregar suas configurações."))
      .finally(() => setLoading(false));
  }, []);

  function addServiceType() {
    if (serviceTypes.length >= MAX_SERVICE_TYPES) return;
    setServiceTypes((prev) => [
      ...prev,
      { id: `new_${Date.now()}`, title: "", duration: 30, isPersisted: false },
    ]);
  }

  function removeServiceType(id: string) {
    setServiceTypes((prev) => prev.filter((s) => s.id !== id));
  }

  function updateServiceType(id: string, field: "title" | "duration", value: string | number) {
    setServiceTypes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
    maxEdge: number
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg("Imagem muito grande. Máximo 4 MB.");
      return;
    }
    try {
      const dataUrl = await downscaleImage(file, maxEdge);
      setPreview(dataUrl);
      setErrorMsg("");
    } catch {
      setErrorMsg("Não foi possível processar a imagem.");
    }
  }

  async function handleSave() {
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          email,
          welcomeMessage,
          primaryColor,
          primaryContainer,
          avatarUrl: avatarPreview,
          bannerUrl: bannerPreview,
          serviceTypes: serviceTypes.map((s) => ({
            id: s.isPersisted ? s.id : undefined,
            title: s.title,
            duration: s.duration,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Erro ao salvar.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
      const refreshed = await fetch("/api/users/me").then((r) => r.json());
      if (refreshed?.eventTypes) {
        setServiceTypes(
          refreshed.eventTypes.map((e: UserMe["eventTypes"][number]) => ({
            id: e.id,
            title: e.title,
            duration: e.duration,
            isPersisted: true,
          }))
        );
      }
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--ink-900)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
      <div className="space-y-6 animate-fade-in min-w-0">
        <FormSection title="Identidade visual" caption="Logotipo e banner exibidos na página de reserva.">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div>
              <span className="label block mb-2">Logo</span>
              <div className="relative">
                <div className="w-24 h-24 rounded-[var(--radius)] overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-surface-2)]">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-[var(--color-muted-2)]">
                      <Icon name="image" size={26} />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 grid place-items-center rounded-full bg-[var(--ink-900)] text-white border-2 border-[var(--color-surface)] hover:bg-[var(--ink-800)] transition-colors"
                  aria-label="Alterar logo"
                >
                  <Icon name="upload" size={13} strokeWidth={2} />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(e) => handleImageUpload(e, setAvatarPreview, 480)}
                />
              </div>
              <p className="mt-3 text-xs text-[var(--color-muted-2)]">
                PNG, JPG ou WebP · até 4 MB
              </p>
            </div>

            <div className="min-w-0">
              <span className="label block mb-2">Banner</span>
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="relative w-full h-32 rounded-[var(--radius)] overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] group"
                aria-label="Carregar banner"
              >
                {bannerPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="grid-bg w-full h-full grid place-items-center text-[var(--color-muted)]">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Icon name="upload" size={16} />
                      Carregar imagem
                    </span>
                  </div>
                )}
                <span className="absolute inset-0 bg-[var(--ink-900)]/0 group-hover:bg-[var(--ink-900)]/5 transition-colors" />
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => handleImageUpload(e, setBannerPreview, 1600)}
              />
              <p className="mt-3 text-xs text-[var(--color-muted-2)]">
                Proporção ideal 3:1 · 1600 × 540 px
              </p>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Cor de destaque"
          caption="Aplicada apenas à página pública. O painel administrativo permanece neutro."
        >
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-5">
            {PRESET_PALETTES.map((palette) => {
              const isActive = primaryColor.toLowerCase() === palette.primary.toLowerCase();
              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(palette.primary);
                    setPrimaryContainer(palette.container);
                  }}
                  title={palette.name}
                  aria-label={`Paleta ${palette.name}`}
                  aria-pressed={isActive}
                  className={`
                    relative aspect-square w-full rounded-[var(--radius)]
                    border transition-all
                    ${
                      isActive
                        ? "border-[var(--ink-900)] ring-2 ring-[var(--ink-900)] ring-offset-2 ring-offset-[var(--color-surface)]"
                        : "border-[var(--color-border-strong)] hover:border-[var(--ink-700)]"
                    }
                  `}
                  style={{ background: palette.primary }}
                >
                  {isActive && (
                    <Icon
                      name="check"
                      size={16}
                      strokeWidth={2.4}
                      className="absolute inset-0 m-auto"
                      style={{ color: readableOn(palette.primary) }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorField label="Principal" value={primaryColor} onChange={setPrimaryColor} />
            <ColorField label="Container claro" value={primaryContainer} onChange={setPrimaryContainer} />
          </div>
        </FormSection>

        <FormSection title="Perfil do Anfitrião" caption="Informações exibidas na página pública de reserva.">
          <div className="space-y-5">
            <Field label="Nome exibido" hint="Pode ser o nome da empresa ou do profissional.">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)]"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cargo">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  maxLength={80}
                  placeholder="Ex.: Arquiteto de Soluções"
                  className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)]"
                />
              </Field>

              <Field label="E-mail do Anfitrião">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={120}
                  placeholder="contato@empresa.com"
                  className="w-full h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)]"
                />
              </Field>
            </div>

            <Field
              label="Mensagem de boas-vindas"
              hint={`${welcomeMessage.length} / ${MAX_WELCOME} caracteres`}
            >
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value.slice(0, MAX_WELCOME))}
                rows={3}
                placeholder="Ex.: Agende uma reunião com a nossa equipe técnica."
                className="w-full px-3 py-2.5 text-sm leading-relaxed bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] resize-none outline-none focus:border-[var(--ink-900)]"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="Tipos de serviço"
          caption={`Defina até ${MAX_SERVICE_TYPES} tipos de reunião e o tempo estimado de cada um.`}
        >
          <div className="space-y-2">
            {serviceTypes.map((svc, idx) => (
              <div key={svc.id} className="flex items-center gap-2">
                <span className="label text-[10px] w-5 text-center shrink-0 tabular-nums">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={svc.title}
                  onChange={(e) => updateServiceType(svc.id, "title", e.target.value)}
                  placeholder="Nome do serviço"
                  maxLength={60}
                  className="flex-1 h-10 px-3 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)] min-w-0"
                />
                <select
                  value={svc.duration}
                  onChange={(e) => updateServiceType(svc.id, "duration", Number(e.target.value))}
                  className="w-28 h-10 px-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-[var(--ink-900)] outline-none focus:border-[var(--ink-900)] shrink-0"
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} min
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeServiceType(svc.id)}
                  disabled={serviceTypes.length === 1}
                  className="w-9 h-9 grid place-items-center rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:text-[var(--ink-900)] hover:bg-[var(--color-surface-2)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                  aria-label="Remover tipo de serviço"
                >
                  <Icon name="x" size={15} />
                </button>
              </div>
            ))}
          </div>

          {serviceTypes.length < MAX_SERVICE_TYPES && (
            <button
              type="button"
              onClick={addServiceType}
              className="mt-3 inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-[var(--color-muted)] border border-dashed border-[var(--color-border-strong)] hover:border-[var(--ink-900)] hover:text-[var(--ink-900)] rounded-[var(--radius-sm)] transition-colors"
            >
              <Icon name="plus" size={14} strokeWidth={2} />
              Adicionar tipo de serviço
            </button>
          )}
        </FormSection>

        {errorMsg && (
          <p className="text-[13px] text-[var(--color-danger)] flex items-center gap-1.5">
            <Icon name="alert-circle" size={14} />
            {errorMsg}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[var(--color-muted)]">
            As alterações entram em vigor imediatamente após salvar.
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Icon
              name={saving ? "sync" : saved ? "check" : "save"}
              size={15}
              strokeWidth={2}
              className={saving ? "animate-spin" : ""}
            />
            {saving ? "Salvando…" : saved ? "Configurações salvas" : "Salvar configurações"}
          </button>
        </div>
      </div>

      <aside className="hidden xl:block sticky top-24 self-start">
        <div className="flex items-center justify-between mb-3">
          <span className="label">Preview em tempo real</span>
          <span className="font-mono text-[11px] text-[var(--color-muted-2)]">
            cal.me/{username}
          </span>
        </div>
        <div
          className="rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] overflow-hidden bg-[var(--color-surface)] animate-scale-in"
          style={
            {
              "--preview-brand": primaryColor,
              "--preview-brand-soft": primaryContainer,
              "--preview-brand-on": readableOn(primaryColor),
            } as React.CSSProperties
          }
        >
          <div
            className="h-24 relative"
            style={{
              background: bannerPreview
                ? `url(${bannerPreview}) center / cover no-repeat`
                : `var(--preview-brand)`,
            }}
          >
            <div className="absolute -bottom-7 left-5">
              <div className="w-14 h-14 rounded-[var(--radius)] overflow-hidden border-2 border-[var(--color-surface)] bg-[var(--color-surface-2)]">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-[var(--color-muted-2)]">
                    <Icon name="user" size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-10 px-5 pb-5">
            <span className="label text-[9px]">Reserve um horário com</span>
            <h3 className="font-display text-[18px] leading-tight tracking-tight text-[var(--ink-900)] mt-1">
              {name || "Sua empresa"}
            </h3>
            {role && (
              <p className="text-[11px] font-medium text-[var(--color-muted)] mt-0.5">
                {role}
              </p>
            )}
            <p className="text-[12px] text-[var(--color-muted)] mt-1 leading-relaxed">
              {welcomeMessage || "A mensagem aparece aqui."}
            </p>

            <div className="mt-4 space-y-1.5">
              {serviceTypes.filter((s) => s.title).slice(0, 2).map((svc) => (
                <div
                  key={svc.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[var(--ink-900)] truncate">
                      {svc.title}
                    </p>
                    <p className="text-[10px] text-[var(--color-muted)] font-mono">
                      {svc.duration} min
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-sm shrink-0"
                    style={{
                      background: "var(--preview-brand)",
                      color: "var(--preview-brand-on)",
                    }}
                  >
                    Reservar
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function FormSection({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)]">
      <header className="px-5 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-[15px] font-medium text-[var(--ink-900)]">{title}</h2>
        {caption && <p className="text-xs text-[var(--color-muted)] mt-0.5">{caption}</p>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium text-[var(--ink-800)]">{label}</span>
        {hint && <span className="text-[11px] text-[var(--color-muted-2)] font-mono">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="text-[12px] font-medium text-[var(--ink-800)] block mb-1.5">
        {label}
      </span>
      <div className="flex items-center gap-2 h-10 px-2 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-sm)]">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-7 h-7 rounded-[var(--radius-sm)] cursor-pointer border-0 p-0 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          className="flex-1 bg-transparent text-sm font-mono outline-none text-[var(--ink-900)]"
        />
      </div>
    </div>
  );
}

async function downscaleImage(file: File, maxEdge: number): Promise<string> {
  const originalUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("image load failed"));
    el.src = originalUrl;
  });

  const longestEdge = Math.max(img.width, img.height);
  if (longestEdge <= maxEdge && file.size <= 600 * 1024) {
    return originalUrl;
  }

  const scale = Math.min(1, maxEdge / longestEdge);
  const targetW = Math.round(img.width * scale);
  const targetH = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return originalUrl;

  const keepAlpha = file.type === "image/png" || file.type === "image/webp";
  if (!keepAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const outputType = keepAlpha ? "image/png" : "image/jpeg";
  const quality = keepAlpha ? undefined : 0.88;
  return canvas.toDataURL(outputType, quality);
}
