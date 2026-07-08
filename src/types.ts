export type Step = 'upload' | 'profile' | 'rubric' | 'draft' | 'review';

export const STEP_ORDER: Step[] = ['upload', 'profile', 'rubric', 'draft', 'review'];

export type ProfileId = 'positive' | 'grammar' | 'strict' | 'oberstufe';

export interface CorrectionProfile {
  id: ProfileId;
  name: string;
  tagline: string;
  features: string[];
  icon: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  /** Points the teacher awarded (used from the draft screen onward). */
  awardedPoints: number;
}

export type SuggestionStatus = 'pending' | 'accepted' | 'modified' | 'rejected';

/** The kind of correction mark an annotation represents. */
export type AnnotationType = 'strength' | 'improvement' | 'error';

export interface Annotation {
  id: string;
  /** Exact substring of the exam answer this note points to. */
  quote: string;
  type: AnnotationType;
  /** Short margin note shown with an arrow pointing to the quote. */
  comment: string;
}

export type RubricSource = 'manual' | 'uploaded';

export interface UploadedFile {
  name: string;
  sizeLabel: string;
  pages: number;
}

export interface AppState {
  step: Step;
  file: UploadedFile | null;
  anonymized: boolean;
  profileId: ProfileId | null;
  rubric: RubricCriterion[];
  rubricSource: RubricSource;
  rubricFileName: string | null;
  annotations: Annotation[];
  feedback: string;
  summaryComment: string;
  suggestionStatus: SuggestionStatus;
}
