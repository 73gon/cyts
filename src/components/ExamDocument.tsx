import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/i18n';
import type { Annotation, AnnotationType } from '../types';
import { Icon } from './Icon';

interface ExamDocumentProps {
  /** When true, personal data fields are covered by black redaction bars. */
  redacted?: boolean;
  /** Highlight the personal-data fields (e.g. before anonymizing). */
  highlightPii?: boolean;
  /** Correction marks drawn directly onto the student's answer. */
  annotations?: Annotation[];
  /** Show prev/next controls so the reader can flip through the A4 pages. */
  paginated?: boolean;
  /** Fit the whole (short) answer on a single A4 page — used by the hero. */
  fit?: boolean;
  /** Animate each mark in as it appears (used by the hero motion). */
  animateMarks?: boolean;
  className?: string;
}

const PARAS_PER_PAGE = 2;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

const MARK_STYLES: Record<AnnotationType, { underline: string; badge: string }> = {
  strength: {
    underline: 'bg-[var(--color-strength-soft)] decoration-[var(--color-strength)]',
    badge: 'bg-[var(--color-strength)]',
  },
  improvement: {
    underline: 'bg-[var(--color-improve-soft)] decoration-[var(--color-improve)]',
    badge: 'bg-[var(--color-improve)]',
  },
  error: {
    underline: 'bg-[var(--color-error-soft)] decoration-[var(--color-error)]',
    badge: 'bg-[var(--color-error)]',
  },
};

/** Splits one paragraph into plain and annotated segments, numbering globally. */
function renderAnnotatedParagraph(
  text: string,
  numbered: { annotation: Annotation; number: number }[],
  animate: boolean,
) {
  const matches = numbered
    .map((m) => ({ ...m, start: text.indexOf(m.annotation.quote) }))
    .filter((m) => m.start >= 0)
    .sort((a, b) => a.start - b.start);

  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start < cursor) continue;
    if (m.start > cursor) nodes.push(text.slice(cursor, m.start));
    const style = MARK_STYLES[m.annotation.type];
    nodes.push(
      <mark
        key={m.annotation.id}
        className={`relative rounded-[3px] px-0.5 text-[var(--color-paperink)] underline decoration-2 underline-offset-[3px] ${style.underline} ${animate ? 'mark-in' : ''}`}
      >
        {m.annotation.quote}
        <sup
          className={`ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full align-super font-sans text-[9px] font-bold leading-none text-white ${style.badge}`}
        >
          {m.number}
        </sup>
      </mark>,
    );
    cursor = m.start + m.annotation.quote.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function RedactableValue({
  value,
  redacted,
  highlight,
}: {
  value: string;
  redacted: boolean;
  highlight: boolean;
}) {
  return (
    <span className="relative inline-block align-baseline">
      <span
        className={[
          'rounded px-0.5 transition-colors',
          highlight && !redacted
            ? 'bg-[var(--color-improve-soft)] text-[var(--color-paperink)] ring-1 ring-[color-mix(in_srgb,var(--color-improve)_45%,transparent)]'
            : '',
          redacted ? 'text-transparent' : 'text-[var(--color-paperink)]',
        ].join(' ')}
      >
        {value}
      </span>
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute inset-y-0 -inset-x-0.5 origin-left rounded-[3px] bg-[#161310] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          redacted ? 'scale-x-100' : 'scale-x-0',
        ].join(' ')}
      />
    </span>
  );
}

/** A realistic scanned, handwritten exam page kept at a DIN A4 (1:√2) ratio. */
export function ExamDocument({
  redacted = false,
  highlightPii = false,
  annotations,
  paginated = false,
  fit = false,
  animateMarks = false,
  className = '',
}: ExamDocumentProps) {
  const { t } = useI18n();
  const exam = t.exam;
  const marks = annotations ?? [];
  const numbered = marks.map((annotation, index) => ({ annotation, number: index + 1 }));

  // In fit mode the whole (short) answer sits on one page; otherwise paginate.
  const pages = fit ? [exam.paragraphs.slice(0, 2)] : chunk(exam.paragraphs, PARAS_PER_PAGE);
  const [page, setPage] = useState(0);
  const total = pages.length;
  // Clamp if the language / data changes underneath us.
  useEffect(() => {
    if (page > total - 1) setPage(0);
  }, [page, total]);

  const isFirst = page === 0;
  const paragraphs = pages[Math.min(page, total - 1)] ?? [];
  const handSize = fit ? 'text-[13.5px] leading-[22px]' : 'text-[14px] leading-[23px]';
  const ruled =
    'repeating-linear-gradient(to bottom, transparent 0, transparent 22px, color-mix(in srgb, var(--color-paperink) 9%, transparent) 22px, color-mix(in srgb, var(--color-paperink) 9%, transparent) 23px)';

  return (
    <div
      className={`relative mx-auto flex aspect-[210/297] w-full max-w-[400px] flex-col overflow-hidden rounded-[8px] bg-[var(--color-paper)] text-[var(--color-paperink)] shadow-[0_2px_4px_rgba(0,0,0,0.14),0_28px_55px_-30px_rgba(0,0,0,0.6)] ring-1 ring-black/10 ${className}`}
    >
      {/* punched-hole margin for realism */}
      <div className="pointer-events-none absolute inset-y-0 left-7 z-10 w-px bg-[color-mix(in_srgb,var(--color-error)_45%,transparent)]" />

      <div className="flex flex-1 flex-col overflow-hidden px-6 pb-3 pl-10 pt-5">
        {isFirst ? (
          <>
            {/* School header */}
            <div className="flex items-start justify-between border-b-2 border-[var(--color-paperink)]/15 pb-2.5">
              <div className="min-w-0">
                <p className="font-display text-[13.5px] font-semibold leading-tight text-[var(--color-paperink)]">
                  {exam.school}
                </p>
                <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-papermuted)]">
                  {exam.subject} · {exam.course}
                </p>
              </div>
              <div className="shrink-0 rounded border border-[var(--color-paperink)]/25 px-1.5 py-0.5 text-right">
                <p className="text-[8.5px] uppercase tracking-wide text-[var(--color-papermuted)]">
                  {exam.maxNote}
                </p>
                <p className="text-[8.5px] text-[var(--color-papermuted)]">{exam.duration}</p>
              </div>
            </div>

            {/* Identity fields (the personal data) */}
            <dl className="mt-2.5 grid grid-cols-[auto_1fr_auto_auto] items-baseline gap-x-2 gap-y-0.5 text-[11.5px]">
              <dt className="text-[var(--color-papermuted)]">{exam.nameLabel}:</dt>
              <dd className="font-medium">
                <RedactableValue value={exam.studentName} redacted={redacted} highlight={highlightPii} />
              </dd>
              <dt className="text-[var(--color-papermuted)]">{exam.classLabel}:</dt>
              <dd className="font-medium">
                <RedactableValue value={exam.className} redacted={redacted} highlight={highlightPii} />
              </dd>
              <dt className="col-start-1 text-[var(--color-papermuted)]">{exam.dateLabel}:</dt>
              <dd className="font-medium">
                <RedactableValue value={exam.date} redacted={redacted} highlight={highlightPii} />
              </dd>
            </dl>

            {/* Task */}
            <p className="mt-3 border-l-2 border-[var(--color-paperink)]/30 pl-2 text-[11px] font-semibold leading-snug text-[var(--color-paperink)]">
              {exam.taskPrompt}
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between border-b border-[var(--color-paperink)]/15 pb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-papermuted)]">
            <span>{exam.school}</span>
            <span>{exam.task}</span>
          </div>
        )}

        {/* Handwritten answer on ruled lines */}
        <div className="relative mt-2.5 flex-1 overflow-hidden">
          <div
            key={page}
            className="fade-up space-y-2"
            style={{ backgroundImage: ruled, backgroundPosition: '0 3px' }}
          >
            {paragraphs.map((para, i) => (
              <p key={i} className={`font-hand ${handSize} text-[var(--color-paperink)]`}>
                {marks.length ? renderAnnotatedParagraph(para, numbered, animateMarks) : para}
              </p>
            ))}
          </div>
        </div>

        {/* Footer: pagination when enabled, otherwise the page label */}
        <div className="mt-1 flex items-center justify-between border-t border-dashed border-[var(--color-paperink)]/20 pt-2 text-[10px] text-[var(--color-papermuted)]">
          {paginated && total > 1 ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous page"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-paperink)]/20 text-[var(--color-paperink)] transition-colors hover:bg-[var(--color-paperink)]/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Icon name="arrow-left" className="h-3.5 w-3.5" />
              </button>
              <span className="tabular-nums">
                {page + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
                disabled={page >= total - 1}
                aria-label="Next page"
                className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-paperink)]/20 text-[var(--color-paperink)] transition-colors hover:bg-[var(--color-paperink)]/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span>{exam.pageLabel(page + 1, total)}</span>
          )}
          <span className="font-hand text-[14px]">{exam.initials}</span>
        </div>
      </div>
    </div>
  );
}
