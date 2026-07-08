import { Button } from '../components/Button';
import { AnnotationNotes } from '../components/AnnotationNotes';
import { CorrectionPreview } from '../components/CorrectionPreview';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { PROFILE_META } from '../data';
import { useI18n } from '../i18n/i18n';
import type { Annotation, ProfileId, RubricCriterion, UploadedFile } from '../types';

interface DraftScreenProps {
  file: UploadedFile | null;
  profileId: ProfileId | null;
  rubric: RubricCriterion[];
  annotations: Annotation[];
  feedback: string;
  onBack: () => void;
  onContinue: () => void;
}

export function DraftScreen({
  file,
  profileId,
  rubric,
  annotations,
  feedback,
  onBack,
  onContinue,
}: DraftScreenProps) {
  const { t } = useI18n();
  const meta = PROFILE_META.find((p) => p.id === profileId);
  const profileName = profileId ? t.profiles[profileId].name : null;
  const totalAwarded = rubric.reduce((sum, c) => sum + c.awardedPoints, 0);
  const totalMax = rubric.reduce((sum, c) => sum + c.maxPoints, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {t.draft.title}
          </h1>
          <p className="mt-1.5 text-inkmuted">{t.draft.lead}</p>
        </div>
        {meta && profileName && (
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-accent-text">
            <Icon name={meta.icon as never} className="h-4 w-4" />
            {profileName}
          </span>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: exam preview */}
        <div>
          <CorrectionPreview file={file} annotations={annotations} />
        </div>

        {/* Right: AI output — flat sections separated by rules */}
        <div className="divide-y divide-line">
          <section className="pb-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-inksoft">
              <Icon name="document" className="h-4 w-4" /> {t.draft.ocr}
            </h2>
            <p className="mt-3 rounded-lg border border-line bg-panel-2/50 p-3 text-sm leading-relaxed text-inkmuted">
              {t.ocrText}
            </p>
          </section>

          <section className="py-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-inksoft">
              <Icon name="sparkles" className="h-4 w-4 text-accent-text" /> {t.draft.suggestedFeedback}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-inkmuted">
              {feedback || t.feedbackSuggested}
            </p>
            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-inksoft">
                <Icon name="arrow-left" className="h-3.5 w-3.5" />
                {t.draft.marksHint}
              </p>
              <AnnotationNotes annotations={annotations} />
            </div>
          </section>

          <section className="pt-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-inksoft">
              <Icon name="scale" className="h-4 w-4 text-accent-text" /> {t.draft.breakdown}
            </h2>
            <ul className="mt-3 space-y-2">
              {rubric.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-inkmuted">{c.name}</span>
                  <span className="font-semibold text-ink">
                    {c.awardedPoints}/{c.maxPoints}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm font-bold">
              <span className="text-ink">{t.common.total}</span>
              <span className="text-accent-text">
                {totalAwarded}/{totalMax}
              </span>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6">
        <Notice tone="warning" icon="info" title={t.draft.control}>
          {t.draft.controlBody}
        </Notice>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <Icon name="arrow-left" className="h-5 w-5" />
          {t.common.back}
        </Button>
        <Button size="lg" onClick={onContinue}>
          <Icon name="pencil" className="h-5 w-5" />
          {t.draft.edit}
          <Icon name="arrow-right" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
