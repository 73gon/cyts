import { Icon } from './Icon';

interface ProfileCardProps {
  icon: string;
  name: string;
  tagline: string;
  features: string[];
  selected: boolean;
  onSelect: () => void;
}

export function ProfileCard({ icon, name, tagline, features, selected, onSelect }: ProfileCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        'group flex h-full flex-col rounded-2xl border bg-panel p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        selected
          ? 'border-accent ring-2 ring-accent shadow-[var(--shadow-panel)]'
          : 'border-line hover:border-accent/60 hover:-translate-y-0.5',
      ].join(' ')}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={[
            'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
            selected ? 'bg-accent text-accent-fg' : 'bg-accent-soft text-accent-text',
          ].join(' ')}
        >
          <Icon name={icon as never} className="h-6 w-6" />
        </span>
        <span
          className={[
            'flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
            selected ? 'border-accent bg-accent text-accent-fg' : 'border-line text-transparent',
          ].join(' ')}
        >
          <Icon name="check" className="h-3.5 w-3.5" />
        </span>
      </div>
      <h3 className="font-display text-base font-semibold text-ink">{name}</h3>
      <p className="mt-0.5 text-sm text-inkmuted">{tagline}</p>
      <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-inkmuted">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
