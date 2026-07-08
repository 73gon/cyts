import { useState } from 'react';
import { Button } from '../components/Button';
import { AnnotationEditor } from '../components/AnnotationEditor';
import { CorrectionPreview } from '../components/CorrectionPreview';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { useI18n } from '../i18n/i18n';
import { downloadCorrectionPdf } from '../utils/pdf';
import type {
  Annotation,
  ProfileId,
  RubricCriterion,
  SuggestionStatus,
  UploadedFile,
} from '../types';

interface ReviewScreenProps {
  file: UploadedFile | null;
  profileId: ProfileId | null;
  rubric: RubricCriterion[];
  annotations: Annotation[];
  feedback: string;
  summaryComment: string;
  suggestionStatus: SuggestionStatus;
  onRubricChange: (rubric: RubricCriterion[]) => void;
  onAnnotationsChange: (annotations: Annotation[]) => void;
  onFeedbackChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onStatusChange: (status: SuggestionStatus) => void;
  onBack: () => void;
  onRestart: () => void;
}

export function ReviewScreen({
  file,
  profileId,
  rubric,
  annotations,
  feedback,
  summaryComment,
  suggestionStatus,
  onRubricChange,
  onAnnotationsChange,
  onFeedbackChange,
  onSummaryChange,
  onStatusChange,
  onBack,
  onRestart,
}: ReviewScreenProps) {
  const { t } = useI18n();
  const [downloaded, setDownloaded] = useState(false);

  const profileName = profileId ? t.profiles[profileId].name : '—';
  const totalAwarded = rubric.reduce((sum, c) => sum + c.awardedPoints, 0);
  const totalMax = rubric.reduce((sum, c) => sum + c.maxPoints, 0);
  const pointsValid = rubric.every((c) => c.awardedPoints >= 0 && c.awardedPoints <= c.maxPoints);

  const statusActions: {
    status: Exclude<SuggestionStatus, 'pending'>;
    label: string;
    icon: 'check' | 'pencil' | 'x';
    active: string;
  }[] = [
    { status: 'accepted', label: t.review.accept, icon: 'check', active: 'bg-[var(--color-strength)] text-white' },
    { status: 'modified', label: t.review.modify, icon: 'pencil', active: 'bg-accent text-accent-fg' },
    { status: 'rejected', label: t.review.reject, icon: 'x', active: 'bg-[var(--color-error)] text-white' },
  ];

  function handleStatus(status: Exclude<SuggestionStatus, 'pending'>) {
    onStatusChange(status);
    if (status === 'accepted') onFeedbackChange(t.feedbackSuggested);
    if (status === 'rejected') onFeedbackChange('');
  }

  function updatePoints(id: string, value: number) {
    onRubricChange(rubric.map((c) => (c.id === id ? { ...c, awardedPoints: value } : c)));
  }

  function handleDownload() {
    downloadCorrectionPdf(t.exportFileName, {
      brand: 'Blackboard',
      docTitle: t.exportP.title,
      exam: {
        school: t.exam.school,
        subject: `${t.exam.subject} · ${t.exam.course}`,
        task: t.exam.taskPrompt,
        date: t.exam.date,
        anonLabel: t.dashboard.anonymized,
      },
      paragraphs: t.exam.paragraphs,
      annotations,
      markLabels: t.marks,
      profileLabel: `${t.exportP.profile}: ${profileName}`,
      rubric: rubric.map((c) => ({ name: c.name, awardedPoints: c.awardedPoints, maxPoints: c.maxPoints })),
      totalAwarded,
      totalMax,
      totalLabel: t.common.total,
      pointsLabel: t.common.points,
      answerLabel: t.review.marksTitle,
      marksLabel: t.draft.suggestedFeedback,
      summaryLabel: t.review.summaryTitle,
      summaryComment: summaryComment || feedback || '',
    });
    setDownloaded(true);
  }

  const feedbackEditable = suggestionStatus === 'modified' || suggestionStatus === 'rejected';

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {t.review.title}
        </h1>
        <p className="mt-1.5 text-inkmuted">{t.review.lead}</p>
      </header>

      <div className="mb-5">
        <Notice tone="success" icon="shield" title={t.review.controlTitle}>
          {t.review.controlBody}
        </Notice>
      </div>

      <div className="divide-y divide-line">
        {/* Suggestion handling */}
        <section className="pb-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-inksoft">
              {t.review.feedbackTitle}
            </h2>
            <div className="flex flex-wrap gap-2">
              {statusActions.map((action) => {
                const isActive = suggestionStatus === action.status;
                return (
                  <button
                    key={action.status}
                    type="button"
                    onClick={() => handleStatus(action.status)}
                    aria-pressed={isActive}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors',
                      isActive
                        ? `${action.active} ring-transparent`
                        : 'bg-panel text-inkmuted ring-line hover:bg-panel-2',
                    ].join(' ')}
                  >
                    <Icon name={action.icon} className="h-4 w-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
            readOnly={!feedbackEditable}
            rows={4}
            placeholder={
              suggestionStatus === 'rejected' ? t.review.feedbackRejectedPh : t.review.feedbackPh
            }
            className={[
              'mt-4 w-full resize-y rounded-lg border px-3 py-2.5 text-sm leading-relaxed text-ink focus:outline-none focus:ring-2',
              feedbackEditable
                ? 'border-line bg-panel focus:border-accent focus:ring-accent-soft'
                : 'border-line bg-panel-2 focus:ring-transparent',
            ].join(' ')}
          />
          <p className="mt-2 text-xs text-inksoft">
            {suggestionStatus === 'accepted'
              ? t.review.hintAccepted
              : suggestionStatus === 'modified'
                ? t.review.hintModified
                : suggestionStatus === 'rejected'
                  ? t.review.hintRejected
                  : t.review.hintPending}
          </p>
        </section>

        {/* Editable inline correction marks */}
        <section className="py-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-inksoft">
              {t.review.marksTitle}
            </h2>
            <span className="hidden items-center gap-1.5 text-xs font-medium text-inksoft sm:inline-flex">
              <Icon name="pencil" className="h-3.5 w-3.5" />
              {t.review.marksHint}
            </span>
          </div>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CorrectionPreview file={file} annotations={annotations} />
            </div>
            <AnnotationEditor annotations={annotations} onChange={onAnnotationsChange} />
          </div>
        </section>

        {/* Points editor */}
        <section className="py-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-inksoft">
            {t.review.pointsTitle}
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {rubric.map((c) => {
              const invalid = c.awardedPoints < 0 || c.awardedPoints > c.maxPoints;
              return (
                <li key={c.id} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-sm font-medium text-inkmuted">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={c.maxPoints}
                      value={c.awardedPoints}
                      aria-label={c.name}
                      onChange={(e) => updatePoints(c.id, Number(e.target.value))}
                      className={[
                        'w-20 rounded-lg border bg-panel px-3 py-1.5 text-right text-sm text-ink focus:outline-none focus:ring-2',
                        invalid
                          ? 'border-[var(--color-error)] focus:ring-[var(--color-error-soft)]'
                          : 'border-line focus:border-accent focus:ring-accent-soft',
                      ].join(' ')}
                    />
                    <span className="w-12 text-sm text-inksoft">/ {c.maxPoints}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm font-bold">
            <span className="text-ink">{t.common.total}</span>
            <span className="text-accent-text">
              {totalAwarded}/{totalMax}
            </span>
          </div>
          {!pointsValid && (
            <p className="mt-2 text-xs text-[var(--color-error)]">{t.review.pointsInvalid}</p>
          )}
        </section>

        {/* Final summary comment */}
        <section className="py-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-inksoft">
            {t.review.summaryTitle}
          </h2>
          <textarea
            value={summaryComment}
            onChange={(e) => onSummaryChange(e.target.value)}
            rows={4}
            placeholder={t.review.summaryPh}
            className="mt-4 w-full resize-y rounded-lg border border-line bg-panel px-3 py-2.5 text-sm leading-relaxed text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
        </section>

        {/* Inline export — the one place a framed panel is warranted */}
        <section className="pt-7">
          <div className="overflow-hidden rounded-2xl border border-accent/40 bg-panel-2/40">
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-fg">
                <Icon name="download" className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-ink">{t.exportP.title}</p>
                <p className="text-sm text-inkmuted">{t.exportP.lead}</p>
              </div>
            </div>
            <dl className="divide-y divide-line">
              <div className="flex items-center justify-between px-5 py-3">
                <dt className="text-sm text-inkmuted">{t.exportP.profile}</dt>
                <dd className="text-sm font-medium text-ink">{profileName}</dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <dt className="text-sm text-inkmuted">{t.exportP.finalPoints}</dt>
                <dd className="text-sm font-bold text-accent-text">
                  {totalAwarded} / {totalMax}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-3">
                <dt className="truncate text-sm text-inkmuted">{t.exportP.fileName}</dt>
                <dd className="shrink-0 text-xs text-inksoft">{t.exportP.ready}</dd>
              </div>
            </dl>
            <div className="flex flex-col items-start gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <Button size="lg" onClick={handleDownload} disabled={!pointsValid}>
                <Icon name="download" className="h-5 w-5" />
                {t.exportP.download}
              </Button>
              {downloaded && (
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-strength)]">
                  <Icon name="check" className="h-4 w-4" />
                  {t.exportP.downloaded(t.exportFileName)}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <Icon name="arrow-left" className="h-5 w-5" />
          {t.common.back}
        </Button>
        <Button variant="secondary" size="lg" onClick={onRestart}>
          <Icon name="refresh" className="h-5 w-5" />
          {t.exportP.restart}
        </Button>
      </div>
    </div>
  );
}
