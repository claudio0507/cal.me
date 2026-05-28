/**
 * Cal.me — Sistema de Tema White-Label
 * 
 * Gera CSS Custom Properties a partir da cor de destaque do tenant.
 * Permite que cada empresa tenha sua identidade visual sem rebuild.
 */

/** Converte HEX para HSL */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Converte HSL de volta para HEX */
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

export interface TenantTheme {
  primaryColor: string;       // HEX da cor principal
  primaryContainer: string;   // HEX da versão clara
}

/**
 * Gera o CSS inline com as custom properties do tenant.
 * Usado no <style> do layout da booking page.
 */
export function generateThemeCSS(theme: TenantTheme): string {
  const primary = theme.primaryColor;
  const container = theme.primaryContainer;
  const hsl = hexToHSL(primary);

  // Gera variações automáticas
  const dimColor = hslToHex(hsl.h, Math.max(hsl.s - 10, 0), Math.min(hsl.l + 15, 85));
  const onContainerColor = hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 5, 15));

  return `
    :root {
      --color-brand: ${primary};
      --color-brand-light: ${container};
      --color-brand-dim: ${dimColor};
      --color-brand-on: #ffffff;
      --color-brand-on-container: ${onContainerColor};
    }
  `;
}

/**
 * Gera um objeto de estilo inline React com as CSS vars do tenant.
 * Alternativa ao <style> para Server Components.
 */
export function getThemeStyleVars(theme: TenantTheme): Record<string, string> {
  const hsl = hexToHSL(theme.primaryColor);
  const dimColor = hslToHex(hsl.h, Math.max(hsl.s - 10, 0), Math.min(hsl.l + 15, 85));
  const onContainerColor = hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 5, 15));

  return {
    "--color-brand": theme.primaryColor,
    "--color-brand-light": theme.primaryContainer,
    "--color-brand-dim": dimColor,
    "--color-brand-on": "#ffffff",
    "--color-brand-on-container": onContainerColor,
  };
}

/** Paletas pré-configuradas para demonstração */
export const PRESET_PALETTES = [
  { name: "Verde Limão",  primary: "#506600", container: "#ccff00" },
  { name: "Roxo",         primary: "#6B21A8", container: "#E9D5FF" },
  { name: "Azul Royal",   primary: "#1D4ED8", container: "#DBEAFE" },
  { name: "Coral",        primary: "#DC2626", container: "#FEE2E2" },
  { name: "Teal",         primary: "#0D9488", container: "#CCFBF1" },
  { name: "Laranja",      primary: "#EA580C", container: "#FFEDD5" },
  { name: "Rosa",         primary: "#DB2777", container: "#FCE7F3" },
  { name: "Cinza Premium",primary: "#374151", container: "#F3F4F6" },
] as const;
