import { useEffect, useRef, useState } from 'react';
import { ExamDocument } from '../components/ExamDocument';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { useI18n } from '../i18n/i18n';

interface LoadingScreenProps {
  onDone: () => void;
}

const STEP_MS = 780;

/**
 * An immersive but professional "the AI is working" interstitial: a scan sweep
 * runs across the exam while the correction stages tick off one by one.
 */
export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const { t } = useI18n();
  const steps = t.loading.steps;
  const [active, setActive] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timers = steps.map((_, i) =>
      window.setTimeout(() => setActive(i + 1), STEP_MS * (i + 1)),
    );
    const finish = window.setTimeout(() => doneRef.current(), STEP_MS * (steps.length + 1));
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [steps]);

  const pct = Math.min(100, Math.round((active / steps.length) * 100));

  return (
    <div className="app-bg relative flex min-h-full flex-col">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <Logo className="mb-8" />

        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Scanning document */}
          <div className="relative mx-auto w-full max-w-[320px]">
            <div className="relative">
              <ExamDocument redacted />
              {/* clean scanner sweep, contained to the page */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[8px]">
                <div className="scan-band scan-loop" />
              </div>
            </div>
            <span className="absolute -right-3 -top-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1.5 text-xs font-semibold text-accent-text shadow-[var(--shadow-panel)]">
              <Icon name="scan" className="h-4 w-4 animate-pulse-soft" />
              {t.upload.scanning}
            </span>
          </div>

          {/* Progress */}
          <div>
            <div className="mb-1 inline-flex items-center gap-2 text-accent-text">
              <span className="flex h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
              <span className="think-dots" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
              {t.loading.title}
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-inkmuted">
              {t.loading.sub}
            </p>

            {/* Progress bar */}
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-panel-2">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>

            <ul className="mt-6 space-y-3">
              {steps.map((label, i) => {
                const isDone = i < active;
                const isCurrent = i === active;
                return (
                  <li key={label} className="flex items-center gap-3">
                    <span
                      className={[
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                        isDone
                          ? 'border-transparent bg-accent text-accent-fg'
                          : isCurrent
                            ? 'border-accent text-accent-text'
                            : 'border-line text-inksoft',
                      ].join(' ')}
                    >
                      {isDone ? (
                        <Icon name="check" className="h-4 w-4" />
                      ) : isCurrent ? (
                        <Icon name="spark" className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={[
                        'text-sm font-medium transition-colors',
                        isDone ? 'text-ink' : isCurrent ? 'text-ink' : 'text-inksoft',
                      ].join(' ')}
                    >
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-7 flex items-start gap-2 rounded-xl border border-line bg-panel px-3.5 py-2.5 text-xs leading-relaxed text-inkmuted">
              <Icon name="shield-check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />
              {t.loading.reassure}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
