import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Notice } from '../components/Notice';
import { ProfileCard } from '../components/ProfileCard';
import { PROFILE_META } from '../data';
import { useI18n } from '../i18n/i18n';
import type { ProfileId } from '../types';

interface ProfileScreenProps {
  profileId: ProfileId | null;
  onSelect: (id: ProfileId) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ProfileScreen({ profileId, onSelect, onBack, onContinue }: ProfileScreenProps) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          {t.profile.title}
        </h1>
        <p className="mt-1.5 text-inkmuted">{t.profile.lead}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {PROFILE_META.map((meta) => {
          const copy = t.profiles[meta.id];
          return (
            <ProfileCard
              key={meta.id}
              icon={meta.icon}
              name={copy.name}
              tagline={copy.tagline}
              features={copy.features}
              selected={profileId === meta.id}
              onSelect={() => onSelect(meta.id)}
            />
          );
        })}
      </div>

      {!profileId && (
        <div className="mt-5">
          <Notice tone="info">{t.profile.select}</Notice>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <Icon name="arrow-left" className="h-5 w-5" />
          {t.common.back}
        </Button>
        <Button size="lg" onClick={onContinue} disabled={!profileId}>
          {t.common.continue}
          <Icon name="arrow-right" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
