"use client";

/**
 * Cal.me — BrandingForm
 * White-label customization: avatar, banner, brand color, welcome copy.
 * Live preview reflects all changes against tenant theme.
 */

import { useRef, useState } from "react";
import { MOCK_USER, MOCK_EVENT_TYPES } from "@/lib/mock-data";
import { PRESET_PALETTES, readableOn } from "@/lib/theme";
import { Icon } from "@/components/ui/Icon";

const MAX_WELCOME = 240;

export default function BrandingForm() {
  const [name, setName] = useState(MOCK_USER.name);
  const [welcomeMessage, setWelcomeMessage] = useState(MOCK_USER.welcomeMessage ?? "");
  const [primaryColor, setPrimaryColor] = useState(MOCK_USER.primaryColor);
  const [primaryContainer, setPrimaryContainer] = useState(MOCK_USER.primaryContainer);
  const [avatarPreview, setAvatarPreview] = useState(MOCK_USER.avatarUrl ?? "");
  const [bannerPreview, setBannerPreview] = useState(MOCK_USER.bannerUrl ?? "");
  const [saved, setSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
      {/* Form */}
      <div className="space-y-6 animate-fade-in min-w-0">
        {/* ─── Identity ─── */}
        <FormSection title="Identidade visual" caption="Logotipo e banner exibidos na página de reserva.">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div>
              <span className="label block mb-2">Logo</span>
              <div className="relative">
                <div className="w-24 h-24 rounded-[var(--radius)] overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-surface-2)]">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
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
                  onChange={(e) => handleImageUpload(e, setAvatarPreview)}
                />
              </div>
              <p className="mt-3 text-xs text-[var(--color-muted-2)]">
                PNG, JPG ou WebP · até 2 MB
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
                  <img
                    src={bannerPreview}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
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
                onChange={(e) => handleImageUpload(e, setBannerPreview)}
              />
              <p className="mt-3 text-xs text-[var(--color-muted-2)]">
                Proporção ideal 3:1 · 1600 × 540 px
              </p>
            </div>
          </div>
        </FormSection>

        {/* ─── Brand color ─── */}
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
            <ColorField
              label="Principal"
              value={primaryColor}
              onChange={setPrimaryColor}
            />
            <ColorField
              label="Container claro"
              value={primaryContainer}
              onChange={setPrimaryContainer}
            />
          </div>
        </FormSection>

        {/* ─── Copy ─── */}
        <FormSection title="Textos" caption="Aparecem no cabeçalho da página pública.">
          <div className="space-y-5">
            <Field label="Nome exibido" hint="Pode ser o nome da empresa ou do profissional.">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                className="
                  w-full h-10 px-3 text-sm
                  bg-[var(--color-surface)] border border-[var(--color-border-strong)]
                  rounded-[var(--radius-sm)] text-[var(--ink-900)]
                  outline-none focus:border-[var(--ink-900)]
                "
              />
            </Field>

            <Field
              label="Mensagem de boas-vindas"
              hint={`${welcomeMessage.length} / ${MAX_WELCOME} caracteres`}
            >
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value.slice(0, MAX_WELCOME))}
                rows={3}
                placeholder="Ex.: Agende uma reunião com a nossa equipe técnica."
                className="
                  w-full px-3 py-2.5 text-sm leading-relaxed
                  bg-[var(--color-surface)] border border-[var(--color-border-strong)]
                  rounded-[var(--radius-sm)] text-[var(--ink-900)] resize-none
                  outline-none focus:border-[var(--ink-900)]
                "
              />
            </Field>
          </div>
        </FormSection>

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-[var(--color-muted)]">
            As alterações entram em vigor imediatamente após salvar.
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-800)] rounded-[var(--radius)] transition-colors"
          >
            <Icon name={saved ? "check" : "save"} size={15} strokeWidth={2} />
            {saved ? "Configurações salvas" : "Salvar configurações"}
          </button>
        </div>
      </div>

      {/* ─── Live preview ─── */}
      <aside className="hidden xl:block sticky top-24 self-start">
        <div className="flex items-center justify-between mb-3">
          <span className="label">Preview em tempo real</span>
          <span className="font-mono text-[11px] text-[var(--color-muted-2)]">
            cal.me/{MOCK_USER.username}
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
            <p className="text-[12px] text-[var(--color-muted)] mt-1 leading-relaxed">
              {welcomeMessage || "A mensagem aparece aqui."}
            </p>

            <div className="mt-4 space-y-1.5">
              {MOCK_EVENT_TYPES.slice(0, 2).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[var(--ink-900)] truncate">
                      {evt.title}
                    </p>
                    <p className="text-[10px] text-[var(--color-muted)] font-mono">
                      {evt.duration} min
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-sm"
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
