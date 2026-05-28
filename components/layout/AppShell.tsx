"use client";

/**
 * Cal.me — AppShell
 * Layout wrapper for authenticated app pages (dashboard, settings, etc.).
 * Manages mobile drawer state, ensures consistent gutters.
 */

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ title, description, actions, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setDrawerOpen(true)} />

        <main className="flex-1 px-5 lg:px-8 py-8 lg:py-10">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 animate-fade-in">
            <div className="min-w-0">
              <h1 className="font-display text-[clamp(28px,3vw,38px)] leading-[1.1] tracking-[-0.01em] text-[var(--ink-900)]">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-[15px] text-[var(--color-muted)] max-w-2xl">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
