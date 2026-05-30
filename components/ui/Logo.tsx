/**
 * Cal.me — Logo system
 * Mark + Wordmark + Tagline. Single source of truth for brand identity.
 */

import type { CSSProperties } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  tagline?: boolean;
  inverted?: boolean;
  className?: string;
}

const SIZES = {
  sm: { mark: 28, word: 17, tag: 9.5, gap: 8, dot: 0.3 },
  md: { mark: 34, word: 21, tag: 10.5, gap: 10, dot: 0.3 },
  lg: { mark: 56, word: 38, tag: 12, gap: 14, dot: 0.3 },
} as const;

export default function Logo({
  size = "md",
  tagline = false,
  inverted = false,
  className = "",
}: LogoProps) {
  const s = SIZES[size];

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: s.gap }}
      aria-label="Cal.me"
    >
      <LogoMark size={s.mark} inverted={inverted} />

      <div className="flex flex-col leading-none">
        <span
          className="font-display tracking-[-0.02em] leading-none whitespace-nowrap"
          style={{
            fontSize: s.word,
            color: inverted ? "white" : "var(--ink-900)",
            fontWeight: 500,
          }}
        >
          Cal
          <span
            className="inline-block align-middle rounded-full"
            style={
              {
                width: `${s.dot}em`,
                height: `${s.dot}em`,
                background: "var(--ink-900)",
                marginInline: "0.06em",
                position: "relative",
                top: "-0.02em",
              } as CSSProperties
            }
            aria-hidden="true"
          />
          me
        </span>

        {tagline && (
          <span
            className="font-mono uppercase tracking-[0.18em] mt-1 whitespace-nowrap"
            style={{
              fontSize: s.tag,
              color: inverted ? "rgba(255,255,255,0.6)" : "var(--color-muted)",
            }}
          >
            Agenda com a sua marca
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * The mark — a rounded square (the "page") with a single dot at center
 * (the "moment marked"). Mirrors the wordmark dot. Single shape, memorable.
 */
export function LogoMark({
  size = 32,
  inverted = false,
}: {
  size?: number;
  inverted?: boolean;
}) {
  const bg = inverted ? "white" : "var(--ink-900)";
  const fg = inverted ? "var(--ink-900)" : "white";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width="32" height="32" rx="8" fill={bg} />
      {/* Slot bar — top "page banner" */}
      <rect x="7" y="10" width="18" height="2.4" rx="1.2" fill={fg} opacity="0.45" />
      {/* The dot — your moment, mirrors wordmark · */}
      <circle cx="16" cy="20" r="3.4" fill={fg} />
    </svg>
  );
}
