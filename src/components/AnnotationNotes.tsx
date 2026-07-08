import { useI18n } from '../i18n/i18n';
import type { Annotation, AnnotationType } from '../types';
import { Icon } from './Icon';

interface AnnotationNotesProps {
  annotations: Annotation[];
}

const NOTE_STYLES: Record<AnnotationType, { badge: string; quote: string; arrow: string }> = {
  strength: {
    badge: 'bg-[var(--color-strength)]',
    quote: 'text-[var(--color-strength)] decoration-[color-mix(in_srgb,var(--color-strength)_55%,transparent)]',
    arrow: 'text-[var(--color-strength)]',
  },
  improvement: {
    badge: 'bg-[var(--color-improve)]',
    quote: 'text-[var(--color-improve)] decoration-[color-mix(in_srgb,var(--color-improve)_55%,transparent)]',
    arrow: 'text-[var(--color-improve)]',
  },
  error: {
    badge: 'bg-[var(--color-error)]',
    quote: 'text-[var(--color-error)] decoration-[color-mix(in_srgb,var(--color-error)_55%,transparent)]',
    arrow: 'text-[var(--color-error)]',
  },
};

/**
 * Renders precise, span-level feedback. Each note carries the number of the
 * matching mark in the exam preview and an arrow pointing back to that section
 * of the student's answer.
 */
export function AnnotationNotes({ annotations }: AnnotationNotesProps) {
  const { t } = useI18n();
  return (
    <ol className="space-y-3">
      {annotations.map((annotation, index) => {
        const style = NOTE_STYLES[annotation.type];
        return (
          <li key={annotation.id} className="flex gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${style.badge}`}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Icon name="arrow-left" className={`h-3.5 w-3.5 shrink-0 ${style.arrow}`} />
                <span
                  className={`truncate text-sm font-medium underline decoration-dotted underline-offset-2 ${style.quote}`}
                >
                  {annotation.quote}
                </span>
                <span className="ml-auto shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-inkmuted">
                  {t.marks[annotation.type]}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-inkmuted">{annotation.comment}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
