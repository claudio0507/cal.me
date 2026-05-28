/**
 * Cal.me — Icon set
 * Inline SVG (no external font). Stroke-based, 1.6px, corporate restraint.
 * Sized via `size` prop or className; color inherits via `currentColor`.
 */

import type { SVGProps } from "react";

export type IconName =
  | "dashboard"
  | "calendar"
  | "clock"
  | "palette"
  | "sync"
  | "settings"
  | "help"
  | "logout"
  | "menu"
  | "search"
  | "bell"
  | "plus"
  | "check"
  | "x"
  | "chevron-left"
  | "chevron-right"
  | "chevron-down"
  | "arrow-right"
  | "link"
  | "copy"
  | "mail"
  | "message-circle"
  | "video"
  | "phone"
  | "map-pin"
  | "edit"
  | "save"
  | "upload"
  | "image"
  | "user"
  | "users"
  | "trash"
  | "external-link"
  | "shield"
  | "zap"
  | "globe"
  | "circle"
  | "circle-dot"
  | "calendar-check"
  | "calendar-x"
  | "alert-circle"
  | "info"
  | "logo";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

const PATHS: Record<IconName, React.ReactNode> = {
  "dashboard": (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.2" />
      <rect x="14" y="3" width="7" height="5" rx="1.2" />
      <rect x="14" y="12" width="7" height="9" rx="1.2" />
      <rect x="3" y="16" width="7" height="5" rx="1.2" />
    </>
  ),
  "calendar": (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M8 2.5v4M16 2.5v4" />
    </>
  ),
  "clock": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5l3.2 2" />
    </>
  ),
  "palette": (
    <>
      <path d="M12 3a9 9 0 0 0 0 18c1.4 0 2.5-1.1 2.5-2.5 0-.65-.25-1.25-.65-1.7-.4-.45-.65-1.05-.65-1.7 0-1.4 1.1-2.5 2.5-2.5H17a4 4 0 0 0 4-4c0-3-4-5.6-9-5.6Z" />
      <circle cx="7.5" cy="10.5" r="1.1" />
      <circle cx="12" cy="7.5" r="1.1" />
      <circle cx="16.5" cy="10.5" r="1.1" />
    </>
  ),
  "sync": (
    <>
      <path d="M21 12a9 9 0 0 1-15.5 6.3" />
      <path d="M3 12A9 9 0 0 1 18.5 5.7" />
      <path d="M21 4v4.5h-4.5" />
      <path d="M3 20v-4.5h4.5" />
    </>
  ),
  "settings": (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.5 14.6c.1-.2.1-.4.1-.6v-4c0-.2 0-.4-.1-.6l1.6-1.3a.5.5 0 0 0 .1-.6l-1.5-2.6a.5.5 0 0 0-.6-.2l-1.9.7c-.3-.2-.7-.5-1.1-.6l-.3-2a.5.5 0 0 0-.5-.4h-3a.5.5 0 0 0-.5.4l-.3 2c-.4.1-.8.4-1.1.6l-1.9-.7a.5.5 0 0 0-.6.2L6.4 7.5a.5.5 0 0 0 .1.6l1.6 1.3c-.1.2-.1.4-.1.6v4c0 .2 0 .4.1.6L6.5 16a.5.5 0 0 0-.1.6l1.5 2.6c.1.2.4.3.6.2l1.9-.7c.3.2.7.5 1.1.6l.3 2c0 .2.3.4.5.4h3a.5.5 0 0 0 .5-.4l.3-2c.4-.1.8-.4 1.1-.6l1.9.7c.2.1.5 0 .6-.2l1.5-2.6a.5.5 0 0 0-.1-.6l-1.6-1.4Z" />
    </>
  ),
  "help": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </>
  ),
  "logout": (
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l-5-5 5-5" />
      <path d="M5 12h11" />
    </>
  ),
  "menu": (<><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>),
  "search": (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  "bell": (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 6 3 7 3 9H3c0-2 3-3 3-9Z" />
      <path d="M10.5 21a1.5 1.5 0 0 0 3 0" />
    </>
  ),
  "plus": (<><path d="M12 5v14" /><path d="M5 12h14" /></>),
  "check": (<><path d="M4.5 12.5l5 5L20 7" /></>),
  "x": (<><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>),
  "chevron-left": (<><path d="M15 6l-6 6 6 6" /></>),
  "chevron-right": (<><path d="M9 6l6 6-6 6" /></>),
  "chevron-down": (<><path d="M6 9l6 6 6-6" /></>),
  "arrow-right": (<><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>),
  "link": (
    <>
      <path d="M9.5 14.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11 7.3" />
      <path d="M14.5 9.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7L13 16.7" />
    </>
  ),
  "copy": (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V5a1 1 0 0 1 1-1h10" />
    </>
  ),
  "mail": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 6.5L21 7" />
    </>
  ),
  "message-circle": (
    <>
      <path d="M21 12a8 8 0 0 1-12.5 6.6L3 20l1.5-5.4A8 8 0 1 1 21 12Z" />
    </>
  ),
  "video": (
    <>
      <rect x="3" y="6" width="13" height="12" rx="1.5" />
      <path d="M16 10l5-3v10l-5-3" />
    </>
  ),
  "phone": (
    <>
      <path d="M4 5c0 9 6 15 15 15l2-3.5-4.5-2-1.5 2c-3-1.5-5-3.5-6.5-6.5l2-1.5L8.5 3 5 5Z" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  "edit": (
    <>
      <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      <path d="M14 5l4 4" />
    </>
  ),
  "save": (
    <>
      <path d="M5 4h12l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M7 4v6h9V4" />
      <path d="M7 14h10v7H7z" />
    </>
  ),
  "upload": (<><path d="M12 3v13" /><path d="M6 9l6-6 6 6" /><path d="M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>),
  "image": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-9 9" />
    </>
  ),
  "user": (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  "users": (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 14c3 0 6 1.5 6 4" />
    </>
  ),
  "trash": (
    <>
      <path d="M4 6h16" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M6 6l1 14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-14" />
    </>
  ),
  "external-link": (
    <>
      <path d="M13 4h7v7" />
      <path d="M20 4L9 15" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </>
  ),
  "shield": (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    </>
  ),
  "zap": (<><path d="M13 3L5 14h6l-1 7 8-11h-6l1-7Z" /></>),
  "globe": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 3 4 6 4 9s-1.5 6-4 9c-2.5-3-4-6-4-9s1.5-6 4-9Z" />
    </>
  ),
  "circle": (<><circle cx="12" cy="12" r="4" /></>),
  "circle-dot": (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="currentColor" /></>),
  "calendar-check": (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M8 2.5v4M16 2.5v4" />
      <path d="M8.5 14.5l2.5 2.5 4.5-5" />
    </>
  ),
  "calendar-x": (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M8 2.5v4M16 2.5v4" />
      <path d="M9 13l6 6M15 13l-6 6" />
    </>
  ),
  "alert-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
    </>
  ),
  "info": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" />
    </>
  ),
  "logo": (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <path d="M3 9h18" />
      <path d="M8 2.5v4M16 2.5v4" />
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({ name, size = 18, strokeWidth = 1.6, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
