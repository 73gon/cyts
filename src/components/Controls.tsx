import { useI18n, type Lang } from '../i18n/i18n';

const LANGS: Lang[] = ['en', 'de'];

/** Compact segmented control to switch UI language. */
export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className='inline-flex items-center rounded-lg border border-line bg-panel p-0.5' role='group' aria-label='Language'>
      {LANGS.map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            type='button'
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

export function HeaderControls() {
  return (
    <div className='flex items-center gap-2'>
      <LanguageToggle />
    </div>
  );
}
