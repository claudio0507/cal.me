"use client";

import AppShell from "@/components/layout/AppShell";
import BrandingForm from "@/components/settings/BrandingForm";

export default function SettingsPage() {
  return (
    <AppShell
      title="Personalização"
      description="Defina a identidade visual da página de reserva pública da sua empresa. As alterações são refletidas em tempo real."
    >
      <BrandingForm />
    </AppShell>
  );
}
