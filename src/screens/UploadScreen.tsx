import { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { ExamDocument } from '../components/ExamDocument';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { MOCK_FILE } from '../data';
import { useI18n } from '../i18n/i18n';
import type { UploadedFile } from '../types';

interface UploadScreenProps {
  file: UploadedFile | null;
  anonymized: boolean;
  onUpload: (file: UploadedFile) => void;
  onAnonymize: () => void;
  onClear: () => void;
  onContinue: () => void;
}

export function UploadScreen({
  file,
  anonymized,
  onUpload,
  onAnonymize,
  onClear,
  onContinue,
}: UploadScreenProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [anonymizing, setAnonymizing] = useState(false);

  function handleSelected() {
    // MVT: no real processing — always resolve to the mock exam.
    onUpload({ name: t.fileName, ...MOCK_FILE });
  }

  function handleAnonymize() {
    setAnonymizing(true);
    window.setTimeout(() => {
      onAnonymize();
      setAnonymizing(false);
    }, 1100);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {t.upload.title}
        </h1>
        <p className="mt-1.5 text-inkmuted">{t.upload.lead}</p>
      </header>

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleSelected();
          }}
          className={[
            'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            dragging
              ? 'border-accent bg-accent-soft'
              : 'border-line bg-panel hover:border-accent hover:bg-accent-soft/50',
          ].join(' ')}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-text">
            <Icon name="upload" className="h-7 w-7" />
          </span>
          <p className="mt-4 text-base font-semibold text-ink">{t.upload.drop}</p>
          <p className="mt-1 text-sm text-inksoft">{t.upload.browse}</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*"
            className="sr-only"
            onChange={handleSelected}
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Document preview */}
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm font-medium text-inkmuted">
                <Icon name="document" className="h-4 w-4 text-accent-text" />
                {file.name}
              </div>
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border',
                  anonymized
                    ? 'border-[color-mix(in_srgb,var(--color-strength)_40%,transparent)] bg-[var(--color-strength-soft)] text-[var(--color-strength)]'
                    : 'border-[color-mix(in_srgb,var(--color-improve)_40%,transparent)] bg-[var(--color-improve-soft)] text-[var(--color-improve)]',
                ].join(' ')}
              >
                <Icon name={anonymized ? 'shield-check' : 'eye-off'} className="h-3 w-3" />
                {anonymized ? t.upload.anonymized : t.upload.containsPii}
              </span>
            </div>
            <div className="bg-surface-2 bg-grid p-6">
              <div className="relative mx-auto w-full max-w-[300px]">
                <div className="animate-rise">
                  <ExamDocument redacted={anonymized} highlightPii={!anonymized} paginated />
                </div>
                {anonymizing && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[8px]">
                    <div className="scan-band scan-loop" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-line p-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                <Icon name="document" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
                <p className="text-xs text-inksoft">{t.upload.fileMeta(file.pages, file.sizeLabel)}</p>
              </div>
              <button
                type="button"
                onClick={onClear}
                aria-label="Remove file"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-inksoft transition-colors hover:bg-[var(--color-error-soft)] hover:text-[var(--color-error)]"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-line p-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon name="user" className="h-4 w-4 text-accent-text" />
                  {t.upload.detected}
                </h2>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                    anonymized
                      ? 'bg-[var(--color-strength-soft)] text-[var(--color-strength)]'
                      : 'bg-[var(--color-improve-soft)] text-[var(--color-improve)]',
                  ].join(' ')}
                >
                  {anonymized ? `0 ${t.upload.visible}` : `${t.pii.length} ${t.upload.found}`}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {t.pii.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between rounded-lg bg-panel-2 px-3 py-2 text-sm"
                  >
                    <span className="text-inkmuted">{item.label}</span>
                    {anonymized ? (
                      <span className="inline-flex items-center gap-1 font-medium text-[var(--color-strength)]">
                        <Icon name="check" className="h-3.5 w-3.5" /> {t.upload.redacted}
                      </span>
                    ) : (
                      <span className="rounded bg-[#161310] px-6 py-0.5 text-xs text-transparent">
                        {item.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {!anonymized ? (
                <Button className="mt-4 w-full" onClick={handleAnonymize} disabled={anonymizing}>
                  {anonymizing ? (
                    <>
                      <Icon name="spark" className="h-5 w-5 animate-spin" />
                      {t.upload.anonymizing}
                    </>
                  ) : (
                    <>
                      <Icon name="eye-off" className="h-5 w-5" />
                      {t.upload.anonymize}
                    </>
                  )}
                </Button>
              ) : (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--color-strength)_40%,transparent)] bg-[var(--color-strength-soft)] px-3 py-2.5 text-sm font-medium text-[var(--color-strength)]">
                  <Icon name="shield-check" className="h-5 w-5 shrink-0" />
                  {t.upload.allBlacked}
                </div>
              )}
            </div>

            <Notice tone={anonymized ? 'success' : 'warning'} icon="lock">
              {anonymized ? t.upload.safeNotice : t.upload.unsafeNotice}
            </Notice>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-end gap-3">
        {file && !anonymized && (
          <span className="text-sm text-inksoft">{t.upload.anonToContinue}</span>
        )}
        <Button size="lg" onClick={onContinue} disabled={!file || !anonymized}>
          {t.common.continue}
          <Icon name="arrow-right" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
