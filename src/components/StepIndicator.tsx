import { Fragment } from 'react';
import { STEP_ORDER, type Step } from '../types';
import { useI18n } from '../i18n/i18n';
import { Icon } from './Icon';

interface StepIndicatorProps {
  current: Step;
}

export function StepIndicator({ current }: StepIndicatorProps) {
  const { t } = useI18n();
  const currentIndex = STEP_ORDER.indexOf(current);

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {STEP_ORDER.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <Fragment key={step}>
              <li className="flex flex-col items-center gap-1.5">
                <span
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-accent text-accent-fg ring-4 ring-accent-soft'
                      : isDone
                        ? 'bg-accent text-accent-fg'
                        : 'bg-panel-2 text-inksoft ring-1 ring-line',
                  ].join(' ')}
                >
                  {isDone ? <Icon name="check" className="h-4 w-4" /> : index + 1}
                </span>
                <span
                  className={[
                    'text-[11px] font-medium sm:text-xs',
                    isActive ? 'text-accent-text' : isDone ? 'text-inkmuted' : 'text-inksoft',
                  ].join(' ')}
                >
                  {t.steps[step]}
                </span>
              </li>
              {index < STEP_ORDER.length - 1 && (
                <li aria-hidden className="-mt-5 h-0.5 flex-1 rounded-full bg-line">
                  <div
                    className="h-0.5 rounded-full bg-accent transition-all"
                    style={{ width: index < currentIndex ? '100%' : '0%' }}
                  />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
