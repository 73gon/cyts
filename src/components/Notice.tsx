import type { ReactNode } from 'react';
import { Icon } from './Icon';

type Tone = 'info' | 'warning' | 'success';

interface NoticeProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  icon?: 'info' | 'lock' | 'shield' | 'check';
}

const TONE_CLASSES: Record<Tone, string> = {
  info: 'border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-accent-soft text-ink',
  warning:
    'border-[color-mix(in_srgb,var(--color-improve)_40%,transparent)] bg-[var(--color-improve-soft)] text-ink',
  success:
    'border-[color-mix(in_srgb,var(--color-strength)_40%,transparent)] bg-[var(--color-strength-soft)] text-ink',
};

const ICON_TONE: Record<Tone, string> = {
  info: 'text-accent-text',
  warning: 'text-[var(--color-improve)]',
  success: 'text-[var(--color-strength)]',
};

export function Notice({ tone = 'info', title, children, icon = 'info' }: NoticeProps) {
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${TONE_CLASSES[tone]}`}>
      <Icon name={icon} className={`mt-0.5 h-5 w-5 shrink-0 ${ICON_TONE[tone]}`} />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <p className={title ? 'mt-0.5 opacity-90' : 'opacity-90'}>{children}</p>
      </div>
    </div>
  );
}
