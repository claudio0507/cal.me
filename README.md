# Cal.me

Plataforma de agendamento corporativo **white-label**. Cada empresa parceira
recebe uma página pública (`cal.me/<empresa>`) com a sua identidade visual:
logo, banner, cor de destaque, mensagem de boas-vindas e tipos de evento.

## Pilares

1. **White-label completo** — identidade visual injetada via CSS custom
   properties, sem rebuild por tenant.
2. **Sincronização real** — Google Calendar e Microsoft 365 com bloqueio
   bidirecional de conflitos.
3. **Convites sem fricção** — anexo `.ics`, lembretes por e-mail e atalhos
   para WhatsApp.

## Stack

- **Framework** — Next.js 16 (App Router, React 19)
- **Estilo** — Tailwind CSS 4 + design tokens semânticos
- **Tipografia** — IBM Plex Sans / Fraunces / IBM Plex Mono
- **Ícones** — SVG inline (sem dependência de fontes externas)
- **Persistência** — Prisma + PostgreSQL (schema em `prisma/schema.prisma`)

## Estrutura

```
app/
  (auth)            — painel administrativo (dashboard, settings, ...)
  [username]/       — página pública de reserva do tenant
components/
  ui/Icon.tsx       — set de ícones inline
  layout/           — AppShell, Sidebar, TopBar
  dashboard/        — QuickStats, AppointmentList
  settings/         — BrandingForm, AvailabilityForm
lib/
  theme.ts          — geração do CSS white-label
  mock-data.ts      — dados de demonstração
  types.ts          — tipos do domínio
```

## Desenvolvimento

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:3000`. O painel está em `/dashboard`;
a página pública de exemplo em `/claudio`.

## Deploy

Configurado para deploy contínuo na Vercel (`.vercel/` no `.gitignore`).
