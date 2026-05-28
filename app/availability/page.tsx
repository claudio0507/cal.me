"use client";

import AppShell from "@/components/layout/AppShell";
import AvailabilityForm from "@/components/settings/AvailabilityForm";

export default function AvailabilityPage() {
  return (
    <AppShell
      title="Disponibilidade"
      description="Defina os dias e as janelas de horário em que você aceita agendamentos."
    >
      <AvailabilityForm />
    </AppShell>
  );
}
