import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { HeaderControls } from '../components/Controls';
import { ExamDocument } from '../components/ExamDocument';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { useI18n } from '../i18n/i18n';

interface DashboardProps {
  onStart: () => void;
}

type Phase = 'scan' | 'anon' | 'think' | 'result';

/** Ordered motion phases with their durations (ms). */
const SEQUENCE: { phase: Phase; ms: number }[] = [
  { phase: 'scan', ms: 3200 },
  { phase: 'anon', ms: 1700 },
  { phase: 'think', ms: 2000 },
  { phase: 'result', ms: 4200 },
];

/**
 * Animated hero telling the whole story on a loop:
 *  A4 exam → scanner sweeps twice → sensitive data is redacted →
 *  Blackboard "thinks" (clean loader) → correction marks appear one by one.
 * A step rail keeps the sequence structured and calm rather than busy.
 */
function HeroExam() {
  const { t } = useI18n();
  const heroAnnotations = t.annotations.slice(0, 3);
  const [step, setStep] = useState(0);
  const [reveal, setReveal] = useState(0);
  const phase = SEQUENCE[step].phase;

  useEffect(() => {
    const cur = SEQUENCE[step];
    const timers: number[] = [];
    if (cur.phase === 'result') {
      setReveal(0);
      for (let n = 1; n <= heroAnnotations.length; n++) {
        timers.push(window.setTimeout(() => setReveal(n), 620 * n));
      }
    }
    timers.push(window.setTimeout(() => setStep((v) => (v + 1) % SEQUENCE.length), cur.ms));
    return () => timers.forEach(clearTimeout);
  }, [step, heroAnnotations.length]);

  const awarded = t.rubricManual.reduce((s, c) => s + Math.max(1, Math.round(c.maxPoints * 0.78)), 0);
  const max = t.rubricManual.reduce((s, c) => s + c.maxPoints, 0);

  const captions: Record<Phase, string> = {
    scan: t.dashboard.stageScan,
    anon: t.dashboard.stageAnon,
    think: t.dashboard.stageThink,
    result: t.dashboard.stageResult,
  };

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      {/* Step rail — gives the sequence clear structure */}
      <div className="mb-5 flex items-center gap-1.5">
        {t.dashboard.motionSteps.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="flex flex-1 items-center gap-1.5">
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className={[
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-500',
                    done
                      ? 'bg-accent text-accent-fg'
                      : active
                        ? 'bg-accent/20 text-accent-text ring-1 ring-accent'
                        : 'bg-panel-2 text-inksoft',
                  ].join(' ')}
                >
                  {done ? <Icon name="check" className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={[
                    'hidden truncate text-[11px] font-medium transition-colors duration-500 sm:inline',
                    active ? 'text-ink' : 'text-inksoft',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {i < t.dashboard.motionSteps.length - 1 && (
                <span className="h-px flex-1 bg-line" aria-hidden />
              )}
            </div>
          );
        })}
      </div>

      {/* The A4 exam — floating, no card chrome */}
      <div className="relative">
        <ExamDocument
          fit
          redacted={phase !== 'scan'}
          highlightPii={phase === 'scan'}
          annotations={phase === 'result' ? heroAnnotations.slice(0, reveal) : undefined}
          animateMarks={phase === 'result'}
        />

        {/* Clean scanner: a soft band with a bright edge, two passes */}
        {phase === 'scan' && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[8px]">
            <div className="scan-band scan-once" />
          </div>
        )}

        {/* Analysing: a clean loader ring, no gimmicky iconography */}
        {phase === 'think' && (
          <div className="fade-up absolute inset-0 grid place-items-center rounded-[8px] bg-black/15 backdrop-blur-[1.5px]">
            <span className="flex h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-accent" />
          </div>
        )}
      </div>

      {/* Single descriptive caption, crossfading per phase */}
      <div
        key={phase}
        className="fade-up mt-4 flex items-center justify-center gap-2 text-center text-sm font-medium text-inkmuted"
      >
        {captions[phase]}
      </div>

      {/* Floating result callouts */}
      {phase === 'result' && reveal >= heroAnnotations.length && (
        <>
          <div className="fade-up absolute -bottom-8 -left-3 w-52 rounded-xl border border-line bg-panel p-3.5 shadow-[var(--shadow-panel)] sm:-left-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-inkmuted">
              <Icon name="sparkles" className="h-4 w-4 text-accent-text" />
              {t.draft.suggestedFeedback}
            </div>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-ink">
              {t.feedbackSuggested}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-sm">
              <span className="text-inkmuted">{t.common.total}</span>
              <span className="font-bold text-accent-text">
                {awarded} / {max}
              </span>
            </div>
          </div>

          <div className="fade-up absolute -right-3 top-16 hidden rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-fg shadow-lg sm:block">
            <span className="flex items-center gap-1.5">
              <Icon name="user" className="h-3.5 w-3.5" />
              {t.dashboard.teacherApproves}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export function Dashboard({ onStart }: DashboardProps) {
  const { t } = useI18n();

  return (
    <div className="app-bg flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <HeaderControls />
            <Button variant="secondary" size="md" onClick={onStart} className="hidden sm:inline-flex">
              {t.dashboard.cta}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 overflow-hidden border-b border-line board-texture">
        <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-accent-soft blur-3xl"
          aria-hidden
        />
        <main className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <section>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-[13px] font-medium text-accent-text shadow-sm">
              <Icon name="shield-check" className="h-4 w-4" />
              {t.dashboard.badge}
            </span>
            <h1 className="mt-5 text-balance font-display text-[2.6rem] font-semibold leading-[1.03] tracking-tight text-ink sm:text-6xl">
              {t.dashboard.headlinePre}
              <span className="text-accent-text">{t.dashboard.headlineAccent}</span>
              {t.dashboard.headlinePost}
            </h1>
            <p className="mt-5 text-lg font-semibold text-accent-text">{t.dashboard.subline}</p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-inkmuted">
              {t.dashboard.lead}
            </p>
            <div className="mt-8">
              <Button size="lg" onClick={onStart}>
                {t.dashboard.cta}
                <Icon name="arrow-right" className="h-5 w-5" />
              </Button>
            </div>
          </section>

          {/* Animated product preview */}
          <section className="relative">
            <HeroExam />
          </section>
        </main>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t.dashboard.valuesTitle}
          </h2>
          <p className="mt-3 text-inkmuted">{t.dashboard.valuesLead}</p>
        </div>
        <section className="mx-auto mt-12 grid max-w-5xl gap-x-10 gap-y-10 sm:grid-cols-3">
          {t.valueCards.map((card) => (
            <div key={card.title} className="border-t-2 border-accent/40 pt-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                <Icon name={card.icon as never} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-inkmuted">{card.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 border-t border-line pt-12 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-text">
            <Icon name="target" className="h-4 w-4" />
            {t.common.tagline}
          </span>
          <p className="mx-auto mt-4 max-w-3xl text-balance font-display text-2xl font-medium leading-relaxed text-ink sm:text-3xl">
            {t.dashboard.subline}
          </p>
          <div className="mt-7">
            <Button size="lg" onClick={onStart}>
              {t.dashboard.cta}
              <Icon name="arrow-right" className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-line bg-surface-2">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-inksoft sm:px-6">
          Blackboard — AI-assisted correction prototype. Mocked data only; no real AI, OCR, or
          student data is processed.
        </div>
      </footer>
    </div>
  );
}
