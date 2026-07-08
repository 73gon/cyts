import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-panel shadow-[var(--shadow-panel)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
