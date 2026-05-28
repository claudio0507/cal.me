"use client";

/**
 * Cal.me — Sidebar Navigation
 * Navegação lateral inspirada no design de referência (Aetheric Precision)
 */

import { useState } from "react";

interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "calendar_today", label: "Agenda", href: "/dashboard" },
  { icon: "event_note", label: "Tipos de Evento", href: "/event-types" },
  { icon: "schedule", label: "Disponibilidade", href: "/availability" },
  { icon: "palette", label: "Personalização", href: "/settings" },
  { icon: "sync", label: "Integrações", href: "/integrations" },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/30 z-30 md:hidden hidden" />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 hidden md:flex flex-col
          ${collapsed ? "w-20" : "w-64"} 
          bg-[var(--color-surface-container-lowest)] border-r border-[var(--color-surface-container-highest)]
          transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className={`p-6 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: "var(--color-brand-light)" }}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: "var(--color-brand-on-container)" }}
            >
              event_available
            </span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1
                className="font-bold text-lg tracking-tight"
                style={{ color: "var(--color-brand)" }}
              >
                Cal.me
              </h1>
              <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-secondary)]">
                Enterprise Scheduling
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-4 mb-2 p-2 rounded-lg text-[var(--color-secondary)] hover:bg-[var(--color-surface-container-high)] transition-colors"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <span className="material-symbols-outlined text-sm">
            {collapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 stagger">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.href;
            return (
              <button
                key={item.href}
                onClick={() => onNavigate(item.href)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "shadow-sm font-bold"
                      : "text-[var(--color-secondary)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]"
                  }`}
                style={
                  isActive
                    ? {
                        background: "var(--color-brand-light)",
                        color: "var(--color-brand-on-container)",
                      }
                    : undefined
                }
                title={collapsed ? item.label : undefined}
              >
                <span
                  className="material-symbols-outlined"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Create Event CTA */}
        <div className="px-3 pb-4">
          <button
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm
              transition-all duration-200 hover:brightness-105 active:scale-[0.97] shadow-sm
              ${collapsed ? "px-3" : "px-4"}`}
            style={{
              background: "var(--color-brand-light)",
              color: "var(--color-brand-on-container)",
            }}
          >
            <span className="material-symbols-outlined">add</span>
            {!collapsed && <span>Criar Evento</span>}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-surface-container-highest)] px-3 py-4 space-y-1">
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm text-[var(--color-secondary)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors ${collapsed ? "justify-center" : ""}`}>
            <span className="material-symbols-outlined">help</span>
            {!collapsed && <span>Ajuda</span>}
          </button>
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm text-[var(--color-secondary)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors ${collapsed ? "justify-center" : ""}`}>
            <span className="material-symbols-outlined">logout</span>
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
