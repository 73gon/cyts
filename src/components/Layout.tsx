import type { ReactNode } from 'react';
import type { Step } from '../types';
import { useI18n } from '../i18n/i18n';
import { Logo } from './Logo';
import { StepIndicator } from './StepIndicator';
import { HeaderControls } from './Controls';

interface LayoutProps {
  children: ReactNode;
  step?: Step;
  onHome?: () => void;
}

export function Layout({ children, step, onHome }: LayoutProps) {
  const { t } = useI18n();
  return (
    <div className="app-bg flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onHome}
              className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Blackboard home"
            >
              <Logo />
            </button>
            <span className="hidden rounded-full border border-line bg-panel-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-inksoft sm:inline">
              {t.common.prototype}
            </span>
          </div>
          <HeaderControls />
        </div>
      </header>

      {step && (
        <div className="relative z-10 border-b border-line bg-surface-2">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
            <StepIndicator current={step} />
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-line bg-surface-2">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-inksoft sm:px-6">
          Blackboard — AI-assisted correction prototype. Demonstration with mocked data; no real AI,
          OCR, or student data is processed.
        </div>
      </footer>
    </div>
  );
}
