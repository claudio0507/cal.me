import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      role: true,
      welcomeMessage: true,
      eventTypes: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        select: { title: true, duration: true },
        take: 3,
      },
    },
  });

  if (!user) {
    return {
      title: "Página não encontrada · Cal.me",
      description: "A página de reserva solicitada não existe.",
    };
  }

  const hostLine = user.role ? `${user.name} · ${user.role}` : user.name;
  const title = `Reserve um horário com ${user.name}`;

  const eventLine =
    user.eventTypes.length > 0
      ? user.eventTypes.map((e) => `${e.title} (${e.duration}min)`).join(" · ")
      : "";

  const description = [
    user.welcomeMessage?.trim(),
    eventLine ? `Disponível: ${eventLine}` : null,
    hostLine,
  ]
    .filter(Boolean)
    .join(" — ")
    .slice(0, 200);

  return {
    title: `${title} · Cal.me`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Cal.me",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    other: {
      "theme-color": "#1a1917",
    },
  };
}

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-on-bg)]">
      {children}
    </div>
  );
}
