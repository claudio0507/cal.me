"use client";

/**
 * Cal.me — BrandingForm
 * Formulário de parametrização White-Label com preview ao vivo
 * - Upload de avatar e banner
 * - ColorPicker com paletas pré-definidas
 * - Texto de boas-vindas customizável
 */

import { useState, useRef } from "react";
import { MOCK_USER, MOCK_EVENT_TYPES } from "@/lib/mock-data";
import { PRESET_PALETTES } from "@/lib/theme";

export default function BrandingForm() {
  const [name, setName] = useState(MOCK_USER.name);
  const [welcomeMessage, setWelcomeMessage] = useState(MOCK_USER.welcomeMessage || "");
  const [primaryColor, setPrimaryColor] = useState(MOCK_USER.primaryColor);
  const [primaryContainer, setPrimaryContainer] = useState(MOCK_USER.primaryContainer);
  const [avatarPreview, setAvatarPreview] = useState(MOCK_USER.avatarUrl || "");
  const [bannerPreview, setBannerPreview] = useState(MOCK_USER.bannerUrl || "");
  const [saved, setSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
      {/* Form */}
      <div className="space-y-8 animate-fade-in">
        {/* Avatar & Banner */}
        <section className="p-6 rounded-2xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container-lowest)]">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ color: "var(--color-brand)" }}>image</span>
            Identidade Visual
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative group">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden border-2 bg-[var(--color-surface-container)]"
                style={{ borderColor: primaryContainer }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-[var(--color-secondary)]">person</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                style={{ background: primaryContainer, color: primaryColor }}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, setAvatarPreview)}
              />
            </div>
            <div>
              <p className="font-semibold text-sm">Foto de Perfil</p>
              <p className="text-xs text-[var(--color-secondary)]">JPG, PNG ou WebP. Máx 2MB.</p>
            </div>
          </div>

          {/* Banner */}
          <div>
            <p className="font-semibold text-sm mb-2">Banner / Cabeçalho</p>
            <div
              className="relative h-32 rounded-xl overflow-hidden border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container)] group cursor-pointer"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--color-secondary)]">
                  <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                  <p className="text-xs">Clique para enviar um banner</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                  upload
                </span>
              </div>
            </div>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, setBannerPreview)}
            />
          </div>
        </section>

        {/* Color Picker */}
        <section className="p-6 rounded-2xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container-lowest)]">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ color: "var(--color-brand)" }}>palette</span>
            Cor de Destaque
          </h2>

          {/* Preset palettes */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
            {PRESET_PALETTES.map((palette) => (
              <button
                key={palette.name}
                onClick={() => {
                  setPrimaryColor(palette.primary);
                  setPrimaryContainer(palette.container);
                }}
                className={`group relative w-full aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                  primaryColor === palette.primary
                    ? "border-[var(--color-on-bg)] shadow-lg scale-110"
                    : "border-transparent"
                }`}
                style={{ background: palette.container }}
                title={palette.name}
              >
                <div
                  className="absolute inset-2 rounded-lg"
                  style={{ background: palette.primary }}
                />
                {primaryColor === palette.primary && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm material-symbols-outlined drop-shadow">
                    check
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Custom color */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[var(--color-secondary)]">Principal:</label>
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                />
              </div>
              <code className="text-xs bg-[var(--color-surface-container)] px-2 py-1 rounded font-mono">
                {primaryColor}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[var(--color-secondary)]">Container:</label>
              <div className="relative">
                <input
                  type="color"
                  value={primaryContainer}
                  onChange={(e) => setPrimaryContainer(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                />
              </div>
              <code className="text-xs bg-[var(--color-surface-container)] px-2 py-1 rounded font-mono">
                {primaryContainer}
              </code>
            </div>
          </div>
        </section>

        {/* Welcome Text */}
        <section className="p-6 rounded-2xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container-lowest)]">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ color: "var(--color-brand)" }}>edit_note</span>
            Cultura Textual
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--color-secondary)] block mb-1.5">
                Nome exibido
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container)] focus:ring-2 outline-none text-sm transition-all"
                style={{ "--tw-ring-color": primaryContainer } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-secondary)] block mb-1.5">
                Mensagem de boas-vindas
              </label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-surface-container-highest)] bg-[var(--color-surface-container)] focus:ring-2 outline-none text-sm resize-none transition-all"
                style={{ "--tw-ring-color": primaryContainer } as React.CSSProperties}
                placeholder="Ex: Agende uma consultoria técnica com nosso time"
              />
              <p className="text-xs text-[var(--color-secondary)] mt-1">
                {welcomeMessage.length}/200 caracteres
              </p>
            </div>
          </div>
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
          style={{
            background: primaryContainer,
            color: primaryColor,
          }}
        >
          {saved ? (
            <>
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Salvo com sucesso!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">save</span>
              Salvar Configurações
            </>
          )}
        </button>
      </div>

      {/* Live Preview */}
      <div className="hidden xl:block sticky top-24 h-fit">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)] mb-3 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">visibility</span>
          Preview ao vivo
        </p>
        <div
          className="rounded-2xl border border-[var(--color-surface-container-highest)] overflow-hidden shadow-xl bg-[var(--color-surface-container-lowest)] animate-scale-in"
          style={{
            "--color-brand": primaryColor,
            "--color-brand-light": primaryContainer,
          } as React.CSSProperties}
        >
          {/* Banner preview */}
          <div
            className="h-24 relative"
            style={{
              background: bannerPreview
                ? `url(${bannerPreview}) center/cover`
                : `linear-gradient(135deg, ${primaryColor}, ${primaryContainer})`,
            }}
          >
            <div className="absolute -bottom-6 left-6">
              <div
                className="w-14 h-14 rounded-xl border-3 bg-[var(--color-surface-container)] overflow-hidden shadow-md"
                style={{ borderColor: primaryContainer }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl text-[var(--color-secondary)]">person</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-10 px-6 pb-6">
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-secondary)]">Consultor</p>
            <h3 className="font-bold text-base mb-2">{name || "Seu nome"}</h3>
            <p className="text-xs text-[var(--color-secondary)] mb-4 leading-relaxed">
              {welcomeMessage || "Sua mensagem de boas-vindas aparecerá aqui..."}
            </p>

            {/* Mini event types */}
            <div className="space-y-2">
              {MOCK_EVENT_TYPES.slice(0, 2).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ borderColor: primaryContainer }}
                >
                  <div>
                    <p className="text-xs font-bold">{evt.title}</p>
                    <p className="text-[10px] text-[var(--color-secondary)]">{evt.duration} min</p>
                  </div>
                  <button
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: primaryContainer, color: primaryColor }}
                  >
                    Agendar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
