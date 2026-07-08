import type { ReactElement, SVGProps } from 'react';

type IconName =
  | 'clock'
  | 'shield'
  | 'lock'
  | 'sparkles'
  | 'language'
  | 'scale'
  | 'academic'
  | 'upload'
  | 'document'
  | 'check'
  | 'pencil'
  | 'x'
  | 'plus'
  | 'trash'
  | 'arrow-right'
  | 'arrow-left'
  | 'download'
  | 'info'
  | 'user'
  | 'eye-off'
  | 'shield-check'
  | 'spark'
  | 'star'
  | 'globe'
  | 'swatch'
  | 'scan'
  | 'cpu'
  | 'refresh'
  | 'quote'
  | 'target';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const PATHS: Record<IconName, ReactElement> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </>
  ),
  sparkles: (
    <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14z" />
  ),
  language: (
    <>
      <path d="M4 5h9" />
      <path d="M8 3v2c0 4-2 7-5 9" />
      <path d="M6 9c0 2.5 2.5 4.5 6 5.5" />
      <path d="M13 20l4-9 4 9M14.5 17h5" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 8h10" />
      <path d="M7 8l-3 6h6l-3-6zM17 8l-3 6h6l-3-6z" />
      <path d="M6 20h12" />
    </>
  ),
  academic: (
    <>
      <path d="M3 9l9-4 9 4-9 4-9-4z" />
      <path d="M7 11v4c0 1 2.2 2.5 5 2.5s5-1.5 5-2.5v-4" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V5M8 9l4-4 4 4" />
      <path d="M5 19h14" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a0 0 0 0 1 0 0z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  check: <path d="M5 12l5 5 9-11" />,
  pencil: <path d="M4 20h4l10-10-4-4L4 16v4zM13 6l4 4" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </>
  ),
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6" />,
  download: (
    <>
      <path d="M12 4v11M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.4 5.2A9.3 9.3 0 0 1 12 5c5 0 9 4.5 9 7a12 12 0 0 1-2.2 3M6.3 6.3C3.9 7.7 3 10.2 3 12c.8 1.5 2 2.9 3.6 3.9A8.8 8.8 0 0 0 12 19c1 0 2-.2 2.9-.5" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  spark: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
  ),
  star: (
    <path d="M12 4l2.3 5 5.2.5-4 3.5 1.2 5.2L12 16l-4.7 2.7L8.5 13.5 4.5 10l5.2-.5L12 4z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </>
  ),
  swatch: (
    <>
      <path d="M6 3h5v12a2.5 2.5 0 1 1-5 0V3z" />
      <path d="M11 8l3-3 6 6-8.5 8.5" />
      <path d="M8.5 15.5h.01" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 12h16" />
    </>
  ),
  cpu: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2" />
    </>
  ),
  refresh: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4" />
    </>
  ),
  quote: <path d="M8 7C5.8 8 4.5 10 4.5 12.5V17H9v-4.5H6.8C6.8 10.5 7.5 9 9 8.3L8 7zm8 0c-2.2 1-3.5 3-3.5 5.5V17H17v-4.5h-2.2c0-2 .7-3.5 2.2-4.2L16 7z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
