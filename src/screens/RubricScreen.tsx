import { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { RubricEditor } from '../components/RubricEditor';
import { useI18n } from '../i18n/i18n';
import type { RubricCriterion, RubricSource } from '../types';

interface RubricScreenProps {
  rubric: RubricCriterion[];
  rubricSource: RubricSource;
  rubricFileName: string | null;
  onChange: (rubric: RubricCriterion[]) => void;
  onSourceChange: (source: RubricSource) => void;
  onUploadRubric: () => void;
  onBack: () => void;
  onGenerate: () => void;
}

export function RubricScreen({
  rubric,
  rubricSource,
  rubricFileName,
  onChange,
  onSourceChange,
  onUploadRubric,
  onBack,
  onGenerate,
}: RubricScreenProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [extracting, setExtracting] = useState(false);

  const modes: { id: RubricSource; label: string; sub: string; icon: 'spark' | 'pencil' }[] = [
    { id: 'uploaded', label: t.rubric.modeUpload, sub: t.rubric.modeUploadSub, icon: 'spark' },
    { id: 'manual', label: t.rubric.modeManual, sub: t.rubric.modeManualSub, icon: 'pencil' },
  ];

  const hasCriteria = rubric.length >= 1;
  const allNamed = rubric.every((c) => c.name.trim().length > 0);
  const allPointsValid = rubric.every((c) => c.maxPoints > 0);
  const canGenerate = hasCriteria && allNamed && allPointsValid;

  const showEditor = rubricSource === 'manual' || rubricFileName !== null;

  function handleRubricFile() {
    setExtracting(true);
    window.setTimeout(() => {
      onUploadRubric();
      setExtracting(false);
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {t.rubric.title}
        </h1>
        <p className="mt-1.5 text-inkmuted">{t.rubric.lead}</p>
      </header>

      {/* Mode switch */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-panel-2 p-1">
        {modes.map((mode) => {
          const active = rubricSource === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSourceChange(mode.id)}
              aria-pressed={active}
              className={[
                'flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left transition-all',
                active ? 'bg-panel shadow-sm ring-1 ring-line' : 'text-inkmuted hover:text-ink',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  active ? 'bg-accent text-accent-fg' : 'bg-panel-2 text-inksoft',
                ].join(' ')}
              >
                <Icon name={mode.icon} className="h-4 w-4" />
              </span>
              <span>
                <span className={`block text-sm font-semibold ${active ? 'text-ink' : ''}`}>
                  {mode.label}
                </span>
                <span className="block text-xs text-inksoft">{mode.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Upload mode: dropzone until a rubric is parsed */}
      {rubricSource === 'uploaded' && !rubricFileName && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !extracting && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !extracting) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-panel px-6 py-14 text-center transition-colors hover:border-accent hover:bg-accent-soft/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-text">
            <Icon name={extracting ? 'spark' : 'upload'} className={`h-7 w-7 ${extracting ? 'animate-spin' : ''}`} />
          </span>
          <p className="mt-4 text-base font-semibold text-ink">
            {extracting ? t.rubric.reading : t.rubric.dropTitle}
          </p>
          <p className="mt-1 text-sm text-inksoft">
            {extracting ? t.rubric.readingSub : t.rubric.dropSub}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,image/*"
            className="sr-only"
            onChange={handleRubricFile}
          />
        </div>
      )}

      {/* Extracted-rubric banner */}
      {rubricSource === 'uploaded' && rubricFileName && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-accent-soft px-4 py-3">
            <div className="flex items-center gap-2.5 text-sm">
              <Icon name="spark" className="h-5 w-5 text-accent-text" />
              <span className="text-ink">{t.rubric.extracted(rubric.length, rubricFileName)}</span>
            </div>
          </div>
        </div>
      )}

      {showEditor && (
        <Card className="p-5 sm:p-6">
          <RubricEditor rubric={rubric} onChange={onChange} />
        </Card>
      )}

      {showEditor && !canGenerate && (
        <div className="mt-5">
          <Notice tone="info">
            {!hasCriteria
              ? t.rubric.needCriterion
              : !allNamed
                ? t.rubric.needName
                : t.rubric.needPoints}
          </Notice>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <Icon name="arrow-left" className="h-5 w-5" />
          {t.common.back}
        </Button>
        <Button size="lg" onClick={onGenerate} disabled={!showEditor || !canGenerate}>
          {t.rubric.generate}
          <Icon name="arrow-right" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
