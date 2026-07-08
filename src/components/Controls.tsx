import { useI18n, type Lang } from '../i18n/i18n';
import { useTheme } from '../theme/ThemeContext';
import { Icon } from './Icon';

const LANGS: Lang[] = ['en', 'de'];

/** Compact segmented control to switch UI language. */
export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div
      className="inline-flex items-center rounded-lg border border-line bg-panel p-0.5"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={[
              'rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors',
              active ? 'bg-accent text-accent-fg' : 'text-inkmuted hover:text-ink',
            ].join(' ')}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

/** Toggle between the two designs (/1 chalk · /2 editorial). */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel px-2.5 py-1.5 text-xs font-semibold text-inkmuted transition-colors hover:text-ink"
      aria-label="Switch design"
      title={theme === 'chalk' ? 'Design 1 · Chalkboard' : 'Design 2 · Editorial'}
    >
      <Icon name="swatch" className="h-4 w-4 text-accent-text" />
      <span className="tabular-nums">{theme === 'chalk' ? '01' : '02'}</span>
    </button>
  );
}

export function HeaderControls() {
  return (
    <div className="flex items-center gap-2">
      <LanguageToggle />
      <ThemeToggle />
    </div>
  );
}
