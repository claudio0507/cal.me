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
 * The mark — a 3×3 grid of cells. Filled cells suggest "agenda preenchida";
 * outlined cells are open slots. The asymmetric pattern reads as a real
 * calendar week with bookings, not a structured logo motif.
 *
 * Pattern (1=filled, 0=empty):
 *   1 1 0
 *   0 1 0
 *   1 0 1
 */
const MARK_PATTERN = [1, 1, 0, 0, 1, 0, 1, 0, 1];

export function LogoMark({
  size = 32,
  inverted = false,
}: {
  size?: number;
  inverted?: boolean;
}) {
  const color = inverted ? "white" : "var(--ink-900)";
  const cell = 8;
  const gap = 2;
  const offset = 2;

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
      {MARK_PATTERN.map((filled, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const x = offset + col * (cell + gap);
        const y = offset + row * (cell + gap);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={cell}
            height={cell}
            rx={1.6}
            fill={color}
            opacity={filled ? 1 : 0.18}
          />
        );
      })}
    </svg>
  );
}
