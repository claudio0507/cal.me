import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Cal.me — Agendamento corporativo white-label",
  description:
    "Plataforma de agendamento white-label para empresas. Páginas de reserva com identidade visual própria, sincronização bidirecional de calendários e convites automáticos.",
  metadataBase: new URL("https://cal.me"),
  openGraph: {
    title: "Cal.me — Agendamento corporativo white-label",
    description:
      "Páginas de reserva com identidade visual da sua empresa. Sincronização bidirecional e convites automáticos.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${plexSans.variable} ${plexMono.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-on-bg)]">
        {children}
      </body>
    </html>
  );
}
