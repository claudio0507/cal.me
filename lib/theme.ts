/**
 * Cal.me — Sistema de tema white-label
 *
 * Gera CSS custom properties a partir da cor de destaque do tenant.
 * O painel administrativo permanece em paleta neutra; apenas a página
 * pública do tenant (`/[username]`) recebe a cor da empresa.
 */

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Returns black or white based on contrast against background */
export function readableOn(hex: string): "#ffffff" | "#0a0a09" {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0a0a09" : "#ffffff";
}

export interface TenantTheme {
  primaryColor: string;
  primaryContainer: string;
}

/**
 * Gera o CSS inline com as custom properties do tenant.
 * Usado no `<style>` do layout público (/[username]).
 */
export function generateThemeCSS(theme: TenantTheme): string {
  const primary = theme.primaryColor;
  const container = theme.primaryContainer;
  const hsl = hexToHSL(primary);

  const dimColor = hslToHex(hsl.h, Math.max(hsl.s - 10, 0), Math.min(hsl.l + 15, 85));
  const onContainer = hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 5, 15));
  const brandOn = readableOn(primary);

  return `
    :root {
      --color-brand: ${primary};
      --color-brand-soft: ${container};
      --color-brand-dim: ${dimColor};
      --color-brand-on: ${brandOn};
      --color-brand-on-soft: ${onContainer};
    }
  `;
}

export function getThemeStyleVars(theme: TenantTheme): Record<string, string> {
  const hsl = hexToHSL(theme.primaryColor);
  const dimColor = hslToHex(hsl.h, Math.max(hsl.s - 10, 0), Math.min(hsl.l + 15, 85));
  const onContainer = hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 5, 15));

  return {
    "--color-brand": theme.primaryColor,
    "--color-brand-soft": theme.primaryContainer,
    "--color-brand-dim": dimColor,
    "--color-brand-on": readableOn(theme.primaryColor),
    "--color-brand-on-soft": onContainer,
  };
}

/**
 * Paletas pré-configuradas — corporativas, sóbrias.
 * Cor principal sólida + container claro derivado.
 */
export const PRESET_PALETTES = [
  { name: "Graphite",   primary: "#0a0a09", container: "#f4f4f3" },
  { name: "Ink",        primary: "#1f2937", container: "#f1f5f9" },
  { name: "Forest",     primary: "#14532d", container: "#ecfdf5" },
  { name: "Burgundy",   primary: "#7f1d1d", container: "#fef2f2" },
  { name: "Navy",       primary: "#1e3a8a", container: "#eff6ff" },
  { name: "Bronze",     primary: "#78350f", container: "#fffbeb" },
  { name: "Slate",      primary: "#334155", container: "#f8fafc" },
  { name: "Plum",       primary: "#581c87", container: "#faf5ff" },
] as const;
