import type { Annotation, UploadedFile } from '../types';
import { useI18n } from '../i18n/i18n';
import { Icon } from './Icon';
import { ExamDocument } from './ExamDocument';

interface CorrectionPreviewProps {
  file: UploadedFile | null;
  /** Correction marks drawn onto the exam preview. */
  annotations?: Annotation[];
  /** Constrain the paper width so it doesn't tower in a narrow column. */
  maxWidthClass?: string;
}

/** Document preview shown next to the AI correction. */
export function CorrectionPreview({
  file,
  annotations,
  maxWidthClass = 'max-w-[300px]',
}: CorrectionPreviewProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-inkmuted">
          <Icon name="document" className="h-4 w-4 text-accent-text" />
          {file?.name ?? t.fileName}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--color-strength)_40%,transparent)] bg-[var(--color-strength-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-strength)]">
          <Icon name="shield-check" className="h-3 w-3" />
          {t.dashboard.anonymized}
        </span>
      </div>
      <div className="rounded-xl border border-line bg-surface-2 bg-grid p-4">
        <div className={`mx-auto ${maxWidthClass}`}>
          <ExamDocument redacted paginated annotations={annotations} />
        </div>
      </div>
    </div>
  );
}
