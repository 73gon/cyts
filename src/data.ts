import type { ProfileId, UploadedFile } from './types';

/** Static profile identity + icon. Names/taglines/features come from i18n. */
export const PROFILE_META: { id: ProfileId; icon: string }[] = [
  { id: 'positive', icon: 'sparkles' },
  { id: 'grammar', icon: 'language' },
  { id: 'strict', icon: 'scale' },
  { id: 'oberstufe', icon: 'academic' },
];

export const MOCK_FILE: Omit<UploadedFile, 'name'> = {
  sizeLabel: '1.4 MB',
  pages: 2,
};
