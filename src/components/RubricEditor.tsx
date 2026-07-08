import type { RubricCriterion } from '../types';
import { useI18n } from '../i18n/i18n';
import { Button } from './Button';
import { Icon } from './Icon';

interface RubricEditorProps {
  rubric: RubricCriterion[];
  onChange: (rubric: RubricCriterion[]) => void;
}

function makeId() {
  return `criterion-${Math.random().toString(36).slice(2, 9)}`;
}

export function RubricEditor({ rubric, onChange }: RubricEditorProps) {
  const { t } = useI18n();
  const totalPoints = rubric.reduce((sum, c) => sum + (c.maxPoints || 0), 0);

  function updateCriterion(id: string, patch: Partial<RubricCriterion>) {
    onChange(rubric.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addCriterion() {
    onChange([...rubric, { id: makeId(), name: '', maxPoints: 5, awardedPoints: 0 }]);
  }

  function removeCriterion(id: string) {
    onChange(rubric.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="hidden grid-cols-[1fr_120px_44px] gap-3 bg-panel-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-inksoft sm:grid">
          <span>{t.rubric.criterion}</span>
          <span>{t.rubric.maxPoints}</span>
          <span className="sr-only">Actions</span>
        </div>
        <ul className="divide-y divide-line">
          {rubric.map((criterion) => {
            const invalidPoints = criterion.maxPoints <= 0;
            return (
              <li
                key={criterion.id}
                className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-[1fr_120px_44px] sm:items-center"
              >
                <input
                  type="text"
                  value={criterion.name}
                  placeholder={t.rubric.criterion}
                  aria-label={t.rubric.criterion}
                  onChange={(e) => updateCriterion(criterion.id, { name: e.target.value })}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink placeholder:text-inksoft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
                <div>
                  <input
                    type="number"
                    min={1}
                    value={criterion.maxPoints}
                    aria-label={t.rubric.maxPoints}
                    onChange={(e) => updateCriterion(criterion.id, { maxPoints: Number(e.target.value) })}
                    className={[
                      'w-full rounded-lg border bg-panel px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2',
                      invalidPoints
                        ? 'border-[var(--color-error)] focus:ring-[var(--color-error-soft)]'
                        : 'border-line focus:border-accent focus:ring-accent-soft',
                    ].join(' ')}
                  />
                  {invalidPoints && (
                    <p className="mt-1 text-xs text-[var(--color-error)]">{t.rubric.mustBePositive}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeCriterion(criterion.id)}
                  disabled={rubric.length <= 1}
                  aria-label={t.review.deleteMark}
                  className="flex h-9 w-9 items-center justify-center justify-self-end rounded-lg text-inksoft transition-colors hover:bg-[var(--color-error-soft)] hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inksoft"
                >
                  <Icon name="trash" className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Button variant="secondary" size="md" onClick={addCriterion}>
          <Icon name="plus" className="h-4 w-4" />
          {t.rubric.addCriterion}
        </Button>
        <div className="flex items-center gap-2 rounded-lg bg-accent-soft px-4 py-2 text-sm font-semibold text-accent-text">
          {t.rubric.totalPoints}
          <span className="rounded-md bg-accent px-2.5 py-0.5 text-accent-fg">{totalPoints}</span>
        </div>
      </div>
    </div>
  );
}
