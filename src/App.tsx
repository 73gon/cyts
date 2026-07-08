import { useEffect, useRef, useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { UploadScreen } from './screens/UploadScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RubricScreen } from './screens/RubricScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { DraftScreen } from './screens/DraftScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { useI18n, type Dict } from './i18n/i18n';
import type {
  Annotation,
  AppState,
  ProfileId,
  RubricCriterion,
  RubricSource,
  Step,
  SuggestionStatus,
  UploadedFile,
} from './types';

type View = 'dashboard' | Step | 'loading';

function makeInitialState(t: Dict): AppState {
  return {
    step: 'upload',
    file: null,
    anonymized: false,
    profileId: null,
    rubric: t.rubricManual.map((c) => ({ ...c })),
    rubricSource: 'uploaded',
    rubricFileName: null,
    annotations: t.annotations.map((a) => ({ ...a })),
    feedback: t.feedbackSuggested,
    summaryComment: t.summaryComment,
    suggestionStatus: 'pending',
  };
}

/** Fill in believable suggested points for any criterion that has none yet. */
function withSuggestedPoints(rubric: RubricCriterion[]): RubricCriterion[] {
  return rubric.map((c) => {
    const valid = c.awardedPoints > 0 && c.awardedPoints <= c.maxPoints;
    return valid ? c : { ...c, awardedPoints: Math.max(1, Math.round(c.maxPoints * 0.78)) };
  });
}

export default function App() {
  const { t } = useI18n();
  const [view, setView] = useState<View>('dashboard');
  const [state, setState] = useState<AppState>(() => makeInitialState(t));

  // Re-seed language-derived content when the UI language changes.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setState((prev) => {
      const seed =
        prev.rubricSource === 'uploaded' && prev.rubricFileName
          ? t.rubricExtracted
          : t.rubricManual;
      const rubric = prev.rubric.map((c) => {
        const match = seed.find((s) => s.id === c.id);
        return match ? { ...c, name: match.name } : c;
      });
      return {
        ...prev,
        file: prev.file ? { ...prev.file, name: t.fileName } : prev.file,
        rubricFileName: prev.rubricFileName ? t.rubricFileName : null,
        rubric,
        annotations: t.annotations.map((a) => ({ ...a })),
        feedback: t.feedbackSuggested,
        summaryComment: t.summaryComment,
        suggestionStatus: 'pending',
      };
    });
  }, [t]);

  function patch(changes: Partial<AppState>) {
    setState((prev) => ({ ...prev, ...changes }));
  }

  function goHome() {
    setView('dashboard');
  }

  function restart() {
    setState(makeInitialState(t));
    setView('dashboard');
  }

  function setUpload(file: UploadedFile) {
    patch({ file, anonymized: false });
  }

  function selectProfile(profileId: ProfileId) {
    patch({ profileId });
  }

  function setRubric(rubric: RubricCriterion[]) {
    patch({ rubric });
  }

  function setRubricSource(rubricSource: RubricSource) {
    patch({ rubricSource });
  }

  function uploadRubric() {
    patch({
      rubric: t.rubricExtracted.map((c) => ({ ...c })),
      rubricFileName: t.rubricFileName,
    });
  }

  function generateDraft() {
    patch({ rubric: withSuggestedPoints(state.rubric) });
    setView('loading');
  }

  function setStatus(suggestionStatus: SuggestionStatus) {
    patch({ suggestionStatus });
  }

  function setAnnotations(annotations: Annotation[]) {
    patch({ annotations });
  }

  if (view === 'dashboard') {
    return <Dashboard onStart={() => setView('upload')} />;
  }

  if (view === 'loading') {
    return <LoadingScreen onDone={() => setView('draft')} />;
  }

  return (
    <Layout step={view} onHome={goHome}>
      {view === 'upload' && (
        <UploadScreen
          file={state.file}
          anonymized={state.anonymized}
          onUpload={setUpload}
          onAnonymize={() => patch({ anonymized: true })}
          onClear={() => patch({ file: null, anonymized: false })}
          onContinue={() => setView('profile')}
        />
      )}

      {view === 'profile' && (
        <ProfileScreen
          profileId={state.profileId}
          onSelect={selectProfile}
          onBack={() => setView('upload')}
          onContinue={() => setView('rubric')}
        />
      )}

      {view === 'rubric' && (
        <RubricScreen
          rubric={state.rubric}
          rubricSource={state.rubricSource}
          rubricFileName={state.rubricFileName}
          onChange={setRubric}
          onSourceChange={setRubricSource}
          onUploadRubric={uploadRubric}
          onBack={() => setView('profile')}
          onGenerate={generateDraft}
        />
      )}

      {view === 'draft' && (
        <DraftScreen
          file={state.file}
          profileId={state.profileId}
          rubric={state.rubric}
          annotations={state.annotations}
          feedback={state.feedback}
          onBack={() => setView('rubric')}
          onContinue={() => setView('review')}
        />
      )}

      {view === 'review' && (
        <ReviewScreen
          file={state.file}
          profileId={state.profileId}
          rubric={state.rubric}
          annotations={state.annotations}
          feedback={state.feedback}
          summaryComment={state.summaryComment}
          suggestionStatus={state.suggestionStatus}
          onRubricChange={setRubric}
          onAnnotationsChange={setAnnotations}
          onFeedbackChange={(feedback) => patch({ feedback })}
          onSummaryChange={(summaryComment) => patch({ summaryComment })}
          onStatusChange={setStatus}
          onBack={() => setView('draft')}
          onRestart={restart}
        />
      )}
    </Layout>
  );
}
