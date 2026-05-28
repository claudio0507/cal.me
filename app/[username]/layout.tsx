import type { Metadata } from "next";
import { MOCK_USER } from "@/lib/mock-data";
import { generateThemeCSS } from "@/lib/theme";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const name = MOCK_USER.username === username ? MOCK_USER.name : username;
  return {
    title: `Agendar com ${name} · Cal.me`,
    description: `Reserve um horário com ${name}.`,
  };
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const themeCSS = generateThemeCSS({
    primaryColor: MOCK_USER.primaryColor,
    primaryContainer: MOCK_USER.primaryContainer,
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-on-bg)]">
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      {children}
    </div>
  );
}
