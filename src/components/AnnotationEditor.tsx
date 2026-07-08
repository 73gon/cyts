import { useMemo } from 'react';
import { useI18n } from '../i18n/i18n';
import type { Annotation, AnnotationType } from '../types';
import { Icon } from './Icon';

interface AnnotationEditorProps {
  annotations: Annotation[];
  onChange: (annotations: Annotation[]) => void;
}

const TYPE_STYLE: Record<AnnotationType, { chip: string; dot: string }> = {
  strength: {
    chip: 'data-[on=true]:bg-[var(--color-strength)] data-[on=true]:text-white',
    dot: 'bg-[var(--color-strength)]',
  },
  improvement: {
    chip: 'data-[on=true]:bg-[var(--color-improve)] data-[on=true]:text-white',
    dot: 'bg-[var(--color-improve)]',
  },
  error: {
    chip: 'data-[on=true]:bg-[var(--color-error)] data-[on=true]:text-white',
    dot: 'bg-[var(--color-error)]',
  },
};

const TYPES: AnnotationType[] = ['strength', 'improvement', 'error'];

function makeId() {
  return `mark-${Math.random().toString(36).slice(2, 8)}`;
}

/** Split the exam into selectable sentence-level spans (exact substrings). */
function useSentences() {
  const { t } = useI18n();
  return useMemo(() => {
    const out: string[] = [];
    for (const para of t.exam.paragraphs) {
      const parts = para.match(/[^.!?]+[.!?]?/g) ?? [];
      for (const p of parts) {
        const s = p.trim();
        if (s.length > 6) out.push(s);
      }
    }
    return out;
  }, [t]);
}

export function AnnotationEditor({ annotations, onChange }: AnnotationEditorProps) {
  const { t } = useI18n();
  const sentences = useSentences();

  function update(id: string, patch: Partial<Annotation>) {
    onChange(annotations.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function remove(id: string) {
    onChange(annotations.filter((a) => a.id !== id));
  }

  function add() {
    const used = new Set(annotations.map((a) => a.quote));
    const nextQuote = sentences.find((s) => !used.has(s)) ?? sentences[0] ?? '';
    onChange([
      ...annotations,
      { id: makeId(), quote: nextQuote, type: 'improvement', comment: '' },
    ]);
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {annotations.map((annotation, index) => {
          const options = sentences.includes(annotation.quote)
            ? sentences
            : [annotation.quote, ...sentences];
          return (
            <li key={annotation.id} className="rounded-xl border border-line bg-panel-2/60 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-inkmuted">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${TYPE_STYLE[annotation.type].dot}`}
                  >
                    {index + 1}
                  </span>
                  {t.review.markType}
                </span>
                <div className="flex items-center gap-1">
                  {TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      data-on={annotation.type === type}
                      onClick={() => update(annotation.id, { type })}
                      className={`rounded-md border border-line px-2 py-1 text-[11px] font-semibold text-inkmuted transition-colors hover:text-ink ${TYPE_STYLE[type].chip}`}
                    >
                      {t.marks[type]}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => remove(annotation.id)}
                    aria-label={t.review.deleteMark}
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-inksoft transition-colors hover:bg-[var(--color-error-soft)] hover:text-[var(--color-error)]"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <label className="mt-3 block text-[11px] font-medium uppercase tracking-wide text-inksoft">
                {t.review.attachTo}
              </label>
              <select
                value={annotation.quote}
                onChange={(e) => update(annotation.id, { quote: e.target.value })}
                className="mt-1 w-full truncate rounded-lg border border-line bg-panel px-2.5 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
              >
                {options.map((s) => (
                  <option key={s} value={s}>
                    {s.length > 64 ? `${s.slice(0, 64)}…` : s}
                  </option>
                ))}
              </select>

              <label className="mt-3 block text-[11px] font-medium uppercase tracking-wide text-inksoft">
                {t.review.markComment}
              </label>
              <textarea
                value={annotation.comment}
                onChange={(e) => update(annotation.id, { comment: e.target.value })}
                rows={2}
                placeholder={t.review.markComment}
                className="mt-1 w-full resize-y rounded-lg border border-line bg-panel px-2.5 py-2 text-sm leading-relaxed text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line px-3 py-2 text-sm font-semibold text-inkmuted transition-colors hover:border-accent hover:text-accent-text"
      >
        <Icon name="plus" className="h-4 w-4" />
        {t.review.addMark}
      </button>
    </div>
  );
}
