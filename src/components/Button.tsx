import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-fg shadow-[0_1px_2px_rgba(0,0,0,0.15),0_10px_22px_-10px_rgba(0,0,0,0.5)] hover:bg-accent-strong active:translate-y-px focus-visible:outline-accent disabled:opacity-50 disabled:shadow-none',
  secondary:
    'bg-panel text-ink ring-1 ring-inset ring-line hover:bg-panel-2 focus-visible:outline-accent',
  ghost:
    'bg-transparent text-inkmuted hover:bg-panel-2 hover:text-ink focus-visible:outline-line',
  danger:
    'bg-panel text-[var(--color-error)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-error)_35%,transparent)] hover:bg-[var(--color-error-soft)] focus-visible:outline-[var(--color-error)]',
};

const SIZE_CLASSES: Record<Size, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-[15px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
