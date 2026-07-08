import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnnotationType } from '../types';

export type Lang = 'en' | 'de';

export interface RubricSeed {
  id: string;
  name: string;
  maxPoints: number;
  awardedPoints: number;
}

export interface AnnotationSeed {
  id: string;
  quote: string;
  type: AnnotationType;
  comment: string;
}

export interface ProfileCopy {
  name: string;
  tagline: string;
  features: string[];
}

export interface ValueCardCopy {
  title: string;
  description: string;
  icon: string;
}

/** Full copy + content for one language. */
export interface Dict {
  langLabel: string;
  common: {
    back: string;
    continue: string;
    prototype: string;
    tagline: string;
    total: string;
    points: string;
  };
  steps: Record<'upload' | 'profile' | 'rubric' | 'draft' | 'review', string>;
  dashboard: {
    badge: string;
    headlinePre: string;
    headlineAccent: string;
    headlinePost: string;
    subline: string;
    lead: string;
    cta: string;
    workflow: string[];
    valuesTitle: string;
    valuesLead: string;
    previewFile: string;
    anonymized: string;
    teacherApproves: string;
    stageScan: string;
    stageAnon: string;
    stageThink: string;
    stageResult: string;
    motionSteps: string[];
  };
  upload: {
    title: string;
    lead: string;
    drop: string;
    browse: string;
    containsPii: string;
    anonymized: string;
    detected: string;
    found: string;
    visible: string;
    redacted: string;
    anonymize: string;
    anonymizing: string;
    allBlacked: string;
    scanning: string;
    safeNotice: string;
    unsafeNotice: string;
    anonToContinue: string;
    fileMeta: (pages: number, size: string) => string;
  };
  profile: {
    title: string;
    lead: string;
    select: string;
  };
  rubric: {
    title: string;
    lead: string;
    modeUpload: string;
    modeUploadSub: string;
    modeManual: string;
    modeManualSub: string;
    dropTitle: string;
    dropSub: string;
    reading: string;
    readingSub: string;
    extracted: (n: number, file: string) => string;
    reviewBelow: string;
    criterion: string;
    maxPoints: string;
    addCriterion: string;
    totalPoints: string;
    mustBePositive: string;
    needName: string;
    needCriterion: string;
    needPoints: string;
    generate: string;
  };
  loading: {
    title: string;
    sub: string;
    steps: string[];
    reassure: string;
  };
  draft: {
    title: string;
    lead: string;
    ocr: string;
    suggestedFeedback: string;
    marksHint: string;
    breakdown: string;
    control: string;
    controlBody: string;
    edit: string;
    approve: string;
  };
  review: {
    title: string;
    lead: string;
    controlTitle: string;
    controlBody: string;
    feedbackTitle: string;
    accept: string;
    modify: string;
    reject: string;
    feedbackRejectedPh: string;
    feedbackPh: string;
    hintAccepted: string;
    hintModified: string;
    hintRejected: string;
    hintPending: string;
    marksTitle: string;
    marksHint: string;
    addMark: string;
    attachTo: string;
    markType: string;
    markComment: string;
    deleteMark: string;
    pointsTitle: string;
    pointsInvalid: string;
    summaryTitle: string;
    summaryPh: string;
  };
  exportP: {
    title: string;
    lead: string;
    profile: string;
    finalPoints: string;
    finalSummary: string;
    download: string;
    downloaded: (file: string) => string;
    restart: string;
    fileName: string;
    ready: string;
  };
  marks: Record<AnnotationType, string>;
  exam: {
    school: string;
    subject: string;
    course: string;
    task: string;
    taskPrompt: string;
    nameLabel: string;
    classLabel: string;
    dateLabel: string;
    studentName: string;
    className: string;
    date: string;
    paragraphs: string[];
    pageLabel: (n: number, total: number) => string;
    handwritten: string;
    initials: string;
    duration: string;
    maxNote: string;
  };
  pii: { label: string; value: string }[];
  profiles: Record<string, ProfileCopy>;
  valueCards: ValueCardCopy[];
  rubricManual: RubricSeed[];
  rubricExtracted: RubricSeed[];
  rubricFileName: string;
  annotations: AnnotationSeed[];
  feedbackSuggested: string;
  summaryComment: string;
  ocrText: string;
  fileName: string;
  exportFileName: string;
}

/* ------------------------------------------------------------------ */
/* English                                                            */
/* ------------------------------------------------------------------ */

const EN_PARAGRAPHS = [
  'The Weimar Republic was founded in 1919 after the end of the First World War. From the very beginning it was under pressure, because many Germans rejected the new democracy and associated it with the military defeat. The stab-in-the-back myth claimed that the army had remained undefeated in the field and was only betrayed at home.',
  'The Treaty of Versailles greatly increased this dissatisfaction. Germany lost territory, had to pay high reparations and accept sole responsibility for the war. Large parts of the population saw the treaty as a dictate and a humiliation, which above all benefited the radical parties on the left and the right.',
  'On top of this came severe economic hardship. In 1923 hyperinflation reached its peak and money lost its value almost daily. In the end a loaf of bread cost several billion marks. Many families lost their savings, wile a few speculators grew rich almost overnight.',
  'Politically, too, the republic remained unstable. There were numerous coup attempts, such as the Kapp Putsch in 1920 and the Hitler Putsch in 1923. Governments changed frequently, and Article 48 of the constitution allowed the president to rule by emergency decree, which weakened parliament further.',
];

const EN: Dict = {
  langLabel: 'EN',
  common: {
    back: 'Back',
    continue: 'Continue',
    prototype: 'Prototype',
    tagline: 'Teacher-controlled · Privacy-first · Customizable',
    total: 'Total',
    points: 'points',
  },
  steps: {
    upload: 'Upload',
    profile: 'Profile',
    rubric: 'Rubric',
    draft: 'Draft',
    review: 'Review',
  },
  dashboard: {
    badge: 'Built for German schools · DSGVO-first',
    headlinePre: 'AI-assisted correction for ',
    headlineAccent: 'handwritten exams',
    headlinePost: ' in German schools.',
    subline: 'Teacher-controlled. Privacy-first. Customizable.',
    lead: 'Blackboard scans a handwritten exam, anonymizes it for you, and turns it into a structured correction draft — then hands full control back to you to review, edit and approve every point.',
    cta: 'Start correction',
    workflow: ['Upload', 'Anonymize', 'Profile', 'Rubric', 'Draft', 'Review'],
    valuesTitle: 'Faster correction, without giving up control',
    valuesLead: 'Three reasons teachers trust Blackboard with their exam stack.',
    previewFile: 'history_exam.pdf',
    anonymized: 'Anonymized',
    teacherApproves: 'Teacher approves',
    stageScan: 'Scanning the page',
    stageAnon: 'Anonymizing personal data',
    stageThink: 'Blackboard is analysing the answer',
    stageResult: 'Placing the correction marks',
    motionSteps: ['Scan', 'Anonymize', 'Analyse', 'Mark up'],
  },
  upload: {
    title: 'Upload exam',
    lead: 'Upload a handwritten exam. Blackboard anonymizes it for you before any AI processing.',
    drop: 'Drag & drop your exam here',
    browse: 'or click to browse · PDF, JPG, PNG',
    containsPii: 'Contains personal data',
    anonymized: 'Anonymized',
    detected: 'Detected personal data',
    found: 'found',
    visible: 'visible',
    redacted: 'Redacted',
    anonymize: 'Anonymize document',
    anonymizing: 'Anonymizing…',
    allBlacked: 'All personal data blacked out.',
    scanning: 'Scanning',
    safeNotice: 'This exam is anonymized and safe to process. No student data leaves your control.',
    unsafeNotice:
      'For this prototype, only anonymized exams may be processed. Blackboard removes student names and personal data first.',
    anonToContinue: 'Anonymize the exam to continue',
    fileMeta: (pages, size) => `${pages} pages · ${size}`,
  },
  profile: {
    title: 'Choose a correction profile',
    lead: 'The profile shapes how Blackboard phrases feedback and applies marks. Pick the style that matches this exam.',
    select: 'Select a correction profile to continue.',
  },
  rubric: {
    title: 'Set up your rubric',
    lead: 'Upload an existing rubric and let Blackboard extract the criteria, or build one by hand. You always decide the final scores.',
    modeUpload: 'Upload rubric',
    modeUploadSub: 'AI extracts the criteria',
    modeManual: 'Build manually',
    modeManualSub: 'Define criteria yourself',
    dropTitle: 'Upload your grading rubric',
    dropSub: 'PDF, DOCX or image · AI will detect criteria and points',
    reading: 'Reading your rubric…',
    readingSub: 'Extracting criteria and point values',
    extracted: (n, file) => `Extracted ${n} criteria from ${file}. Review and adjust below.`,
    reviewBelow: 'Review and adjust below.',
    criterion: 'Criterion',
    maxPoints: 'Max points',
    addCriterion: 'Add criterion',
    totalPoints: 'Total points',
    mustBePositive: 'Must be positive',
    needName: 'Every criterion needs a name.',
    needCriterion: 'Add at least one criterion to continue.',
    needPoints: 'Maximum points must be positive numbers.',
    generate: 'Generate correction draft',
  },
  loading: {
    title: 'Correcting the exam',
    sub: 'Blackboard is reading the handwriting and drafting a correction from your rubric.',
    steps: [
      'Reading the handwriting',
      'Aligning answers with your rubric',
      'Drafting feedback in your chosen profile',
      'Placing correction marks',
    ],
    reassure: 'Nothing is graded automatically — you review and approve every point next.',
  },
  draft: {
    title: 'AI correction draft',
    lead: 'A simulated correction based on your rubric and profile. Nothing here is final.',
    ocr: 'OCR text',
    suggestedFeedback: 'Suggested feedback',
    marksHint: 'Each mark points to the numbered section in the exam.',
    breakdown: 'Point breakdown',
    control: 'Teacher control',
    controlBody:
      'This is only an AI suggestion. You review and approve all feedback and points in the next step.',
    edit: 'Review & edit',
    approve: 'Review & edit',
  },
  review: {
    title: 'Review, edit & export',
    lead: 'You have the final say. Edit the feedback, the marks on the paper and every point, then export the corrected PDF.',
    controlTitle: 'You are in control',
    controlBody:
      "Every value below is yours to change. Blackboard's suggestion is only a starting point.",
    feedbackTitle: 'AI feedback suggestion',
    accept: 'Accept',
    modify: 'Modify',
    reject: 'Reject',
    feedbackRejectedPh: 'Suggestion rejected — write your own feedback here.',
    feedbackPh: 'Feedback text',
    hintAccepted: 'Suggestion accepted. Choose “Modify” to edit the wording.',
    hintModified: 'Editing enabled — your changes are kept.',
    hintRejected: 'Suggestion rejected — feedback is now fully your own.',
    hintPending: 'Choose how to handle the AI suggestion above.',
    marksTitle: 'Correction marks on the paper',
    marksHint: 'Edit, retype or remove marks. Changes appear on the exam instantly.',
    addMark: 'Add mark',
    attachTo: 'Attached to',
    markType: 'Type',
    markComment: 'Margin note',
    deleteMark: 'Remove mark',
    pointsTitle: 'Points per criterion',
    pointsInvalid: "Points must be between 0 and each criterion's maximum.",
    summaryTitle: 'Final summary comment',
    summaryPh: 'Write the summary comment the student will read.',
  },
  exportP: {
    title: 'Export the corrected exam',
    lead: 'Your annotated exam is ready. Download a clean, professional PDF for your records.',
    profile: 'Correction profile',
    finalPoints: 'Final points',
    finalSummary: 'Final feedback summary',
    download: 'Download corrected PDF',
    downloaded: (file) => `${file} downloaded.`,
    restart: 'Start a new correction',
    fileName: 'corrected_history_exam.pdf',
    ready: 'Ready to download',
  },
  marks: {
    strength: 'Strength',
    improvement: 'Improve',
    error: 'Correct',
  },
  exam: {
    school: 'Gymnasium am Stadtpark',
    subject: 'History',
    course: 'Advanced course · Grade 12',
    task: 'Exam No. 2 — The Weimar Republic',
    taskPrompt:
      'Task 1: Explain the main reasons for the instability of the Weimar Republic between 1919 and 1923. (28 points)',
    nameLabel: 'Name',
    classLabel: 'Class',
    dateLabel: 'Date',
    studentName: 'Anna Schmidt',
    className: '12b',
    date: '14 March 2026',
    paragraphs: EN_PARAGRAPHS,
    pageLabel: (n, total) => `Page ${n} / ${total} · handwritten`,
    handwritten: 'handwritten',
    initials: '— A. S.',
    duration: 'Duration: 90 min',
    maxNote: 'Max. 28 points',
  },
  pii: [
    { label: 'Student name', value: 'Anna Schmidt' },
    { label: 'Class', value: '12b' },
    { label: 'Date', value: '14 March 2026' },
  ],
  profiles: {
    positive: {
      name: 'Positive Mode',
      tagline: 'Encouraging, strengths-first feedback',
      features: ['Highlights strengths first', 'Minimal red marks', 'Encouraging tone'],
    },
    grammar: {
      name: 'Grammar Coach',
      tagline: 'Language-focused inline corrections',
      features: ['Inline language feedback', 'German/English focus', 'Suggests corrections'],
    },
    strict: {
      name: 'Strict Rubric',
      tagline: 'Consistent, point-based grading',
      features: ['Point-based grading', 'Criteria-based deductions', 'Consistent scoring'],
    },
    oberstufe: {
      name: 'Oberstufe',
      tagline: 'Structured feedback for Abitur subjects',
      features: ['Structured feedback', 'Content & argumentation', 'For Gymnasium / Abitur'],
    },
  },
  valueCards: [
    {
      title: 'Save correction time',
      description:
        'Get a structured draft in seconds, so you spend your time reviewing instead of writing from scratch.',
      icon: 'clock',
    },
    {
      title: 'Keep teacher control',
      description:
        'Every suggestion and every point is editable. Nothing is final until you approve it.',
      icon: 'shield',
    },
    {
      title: 'DSGVO-ready workflow',
      description:
        'Blackboard anonymizes the exam first. Student names and personal data stay out of the AI process.',
      icon: 'lock',
    },
  ],
  rubricManual: [
    { id: 'content', name: 'Content accuracy', maxPoints: 10, awardedPoints: 0 },
    { id: 'argumentation', name: 'Argumentation', maxPoints: 8, awardedPoints: 0 },
    { id: 'structure', name: 'Structure', maxPoints: 5, awardedPoints: 0 },
    { id: 'language', name: 'Language', maxPoints: 5, awardedPoints: 0 },
  ],
  rubricExtracted: [
    { id: 'sachkompetenz', name: 'Content competence', maxPoints: 12, awardedPoints: 0 },
    { id: 'analyse', name: 'Analysis & argumentation', maxPoints: 9, awardedPoints: 0 },
    { id: 'urteil', name: 'Judgement', maxPoints: 6, awardedPoints: 0 },
    { id: 'darstellung', name: 'Language & presentation', maxPoints: 7, awardedPoints: 0 },
  ],
  rubricFileName: 'grading_rubric_history.pdf',
  annotations: [
    {
      id: 'a1',
      quote: 'The stab-in-the-back myth claimed',
      type: 'strength',
      comment: 'Strong point — the stab-in-the-back myth is central to the rejection of the republic.',
    },
    {
      id: 'a2',
      quote: 'The Treaty of Versailles greatly increased this dissatisfaction',
      type: 'strength',
      comment: 'Correctly identified: Versailles as a burden on the young democracy.',
    },
    {
      id: 'a3',
      quote: 'pay high reparations',
      type: 'improvement',
      comment: 'Add concrete figures or the London Ultimatum to reach the top band.',
    },
    {
      id: 'a4',
      quote: 'wile',
      type: 'error',
      comment: 'Spelling: this should be “while”.',
    },
    {
      id: 'a5',
      quote: 'Governments changed frequently',
      type: 'improvement',
      comment: 'Too general — refer to the short lifespan of the cabinets and their lack of a majority.',
    },
  ],
  feedbackSuggested:
    'A well-structured answer that correctly identifies the political and economic causes of instability. To reach the top band, add concrete figures on reparations and be more precise about the frequent changes of government.',
  summaryComment:
    'A solid answer with a clear understanding of the political situation. To reach the top band, connect the economic crisis more explicitly to the loss of trust in democracy and cite concrete details on Versailles and the government changes.',
  ocrText: EN_PARAGRAPHS.join(' '),
  fileName: 'history_exam.pdf',
  exportFileName: 'corrected_history_exam.pdf',
};

/* ------------------------------------------------------------------ */
/* German                                                             */
/* ------------------------------------------------------------------ */

const DE_PARAGRAPHS = [
  'Die Weimarer Republik entstand 1919 nach dem Ende des Ersten Weltkriegs. Von Beginn an stand sie unter großem Druck, weil viele Deutsche die neue Demokratie ablehnten und sie mit der militärischen Niederlage verbanden. Die Dolchstoßlegende behauptete, das Heer sei im Feld unbesiegt geblieben und erst in der Heimat verraten worden.',
  'Der Vertrag von Versailles verstärkte die Unzufriedenheit erheblich. Deutschland verlor Gebiete, musste hohe Reparationen zahlen und die alleinige Kriegsschuld anerkennen. Große Teile der Bevölkerung empfanden den Vertrag als Diktat und als Demütigung, wovon vor allem die radikalen Parteien von links und rechts profitierten.',
  'Hinzu kam die schwere wirtschaftliche Not. Im Jahr 1923 erreichte die Hyperinflation ihren Höhepunkt, das Geld verlor fast täglich an Wert. Am Ende kostete ein Laib Brot mehrere Milliarden Mark. Viele Familien verloren ihre Ersparnisse, wärend einige Spekulanten fast über Nacht reich wurden.',
  'Auch politisch blieb die Republik instabil. Es gab zahlreiche Putschversuche, etwa den Kapp-Putsch 1920 und den Hitler-Putsch 1923. Die Regierungen wechselten häufig, und Artikel 48 der Verfassung erlaubte dem Präsidenten das Regieren per Notverordnung, was das Parlament weiter schwächte.',
];

const DE: Dict = {
  langLabel: 'DE',
  common: {
    back: 'Zurück',
    continue: 'Weiter',
    prototype: 'Prototyp',
    tagline: 'Lehrkraft behält die Kontrolle · Datenschutz zuerst · Anpassbar',
    total: 'Gesamt',
    points: 'Punkte',
  },
  steps: {
    upload: 'Upload',
    profile: 'Profil',
    rubric: 'Raster',
    draft: 'Entwurf',
    review: 'Prüfen',
  },
  dashboard: {
    badge: 'Für deutsche Schulen · DSGVO-konform',
    headlinePre: 'KI-gestützte Korrektur für ',
    headlineAccent: 'handschriftliche Klausuren',
    headlinePost: ' an deutschen Schulen.',
    subline: 'Lehrkraft behält die Kontrolle. Datenschutz zuerst. Anpassbar.',
    lead: 'Blackboard scannt eine handschriftliche Klausur, anonymisiert sie für Sie und erstellt einen strukturierten Korrekturentwurf — die volle Kontrolle über jeden Punkt bleibt bei Ihnen.',
    cta: 'Korrektur starten',
    workflow: ['Upload', 'Anonymisieren', 'Profil', 'Raster', 'Entwurf', 'Prüfen'],
    valuesTitle: 'Schneller korrigieren, ohne die Kontrolle abzugeben',
    valuesLead: 'Drei Gründe, warum Lehrkräfte Blackboard vertrauen.',
    previewFile: 'klausur_geschichte.pdf',
    anonymized: 'Anonymisiert',
    teacherApproves: 'Lehrkraft bestätigt',
    stageScan: 'Seite wird gescannt',
    stageAnon: 'Personendaten werden anonymisiert',
    stageThink: 'Blackboard analysiert die Antwort',
    stageResult: 'Korrekturmarkierungen werden gesetzt',
    motionSteps: ['Scannen', 'Anonymisieren', 'Analysieren', 'Markieren'],
  },
  upload: {
    title: 'Klausur hochladen',
    lead: 'Laden Sie eine handschriftliche Klausur hoch. Blackboard anonymisiert sie vor jeder KI-Verarbeitung für Sie.',
    drop: 'Klausur hierher ziehen',
    browse: 'oder klicken zum Auswählen · PDF, JPG, PNG',
    containsPii: 'Enthält Personendaten',
    anonymized: 'Anonymisiert',
    detected: 'Erkannte Personendaten',
    found: 'gefunden',
    visible: 'sichtbar',
    redacted: 'Geschwärzt',
    anonymize: 'Dokument anonymisieren',
    anonymizing: 'Wird anonymisiert…',
    allBlacked: 'Alle Personendaten geschwärzt.',
    scanning: 'Scan läuft',
    safeNotice:
      'Diese Klausur ist anonymisiert und kann verarbeitet werden. Keine Schülerdaten verlassen Ihre Kontrolle.',
    unsafeNotice:
      'In diesem Prototyp werden nur anonymisierte Klausuren verarbeitet. Blackboard entfernt zuerst Namen und Personendaten.',
    anonToContinue: 'Zum Fortfahren die Klausur anonymisieren',
    fileMeta: (pages, size) => `${pages} Seiten · ${size}`,
  },
  profile: {
    title: 'Korrekturprofil wählen',
    lead: 'Das Profil bestimmt, wie Blackboard Feedback formuliert und Markierungen setzt. Wählen Sie den Stil, der zu dieser Klausur passt.',
    select: 'Wählen Sie ein Korrekturprofil, um fortzufahren.',
  },
  rubric: {
    title: 'Bewertungsraster einrichten',
    lead: 'Laden Sie ein vorhandenes Raster hoch und lassen Sie Blackboard die Kriterien extrahieren — oder erstellen Sie es selbst. Die endgültige Bewertung treffen immer Sie.',
    modeUpload: 'Raster hochladen',
    modeUploadSub: 'KI extrahiert die Kriterien',
    modeManual: 'Selbst erstellen',
    modeManualSub: 'Kriterien selbst festlegen',
    dropTitle: 'Bewertungsraster hochladen',
    dropSub: 'PDF, DOCX oder Bild · KI erkennt Kriterien und Punkte',
    reading: 'Raster wird gelesen…',
    readingSub: 'Kriterien und Punktwerte werden extrahiert',
    extracted: (n, file) => `${n} Kriterien aus ${file} extrahiert. Bitte unten prüfen und anpassen.`,
    reviewBelow: 'Bitte unten prüfen und anpassen.',
    criterion: 'Kriterium',
    maxPoints: 'Max. Punkte',
    addCriterion: 'Kriterium hinzufügen',
    totalPoints: 'Gesamtpunkte',
    mustBePositive: 'Muss positiv sein',
    needName: 'Jedes Kriterium braucht einen Namen.',
    needCriterion: 'Fügen Sie mindestens ein Kriterium hinzu.',
    needPoints: 'Maximale Punkte müssen positive Zahlen sein.',
    generate: 'Korrekturentwurf erstellen',
  },
  loading: {
    title: 'Klausur wird korrigiert',
    sub: 'Blackboard liest die Handschrift und erstellt anhand Ihres Rasters einen Korrekturentwurf.',
    steps: [
      'Handschrift wird gelesen',
      'Antworten werden mit dem Raster abgeglichen',
      'Feedback im gewählten Profil wird verfasst',
      'Korrekturmarkierungen werden gesetzt',
    ],
    reassure: 'Nichts wird automatisch benotet — Sie prüfen und bestätigen jeden Punkt selbst.',
  },
  draft: {
    title: 'KI-Korrekturentwurf',
    lead: 'Eine simulierte Korrektur auf Basis Ihres Rasters und Profils. Nichts davon ist endgültig.',
    ocr: 'OCR-Text',
    suggestedFeedback: 'Feedback-Vorschlag',
    marksHint: 'Jede Markierung verweist auf den nummerierten Abschnitt in der Klausur.',
    breakdown: 'Punkteübersicht',
    control: 'Kontrolle bei der Lehrkraft',
    controlBody:
      'Dies ist nur ein KI-Vorschlag. Im nächsten Schritt prüfen und bestätigen Sie Feedback und Punkte.',
    edit: 'Prüfen & bearbeiten',
    approve: 'Prüfen & bearbeiten',
  },
  review: {
    title: 'Prüfen, bearbeiten & exportieren',
    lead: 'Sie entscheiden. Bearbeiten Sie das Feedback, die Markierungen auf dem Blatt und jeden Punkt — und exportieren Sie dann die korrigierte PDF.',
    controlTitle: 'Sie behalten die Kontrolle',
    controlBody:
      'Jeder Wert unten ist von Ihnen änderbar. Der Vorschlag von Blackboard ist nur ein Ausgangspunkt.',
    feedbackTitle: 'KI-Feedback-Vorschlag',
    accept: 'Übernehmen',
    modify: 'Ändern',
    reject: 'Verwerfen',
    feedbackRejectedPh: 'Vorschlag verworfen — schreiben Sie hier Ihr eigenes Feedback.',
    feedbackPh: 'Feedback-Text',
    hintAccepted: 'Vorschlag übernommen. Wählen Sie „Ändern“, um den Text zu bearbeiten.',
    hintModified: 'Bearbeitung aktiv — Ihre Änderungen werden gespeichert.',
    hintRejected: 'Vorschlag verworfen — das Feedback ist nun vollständig Ihres.',
    hintPending: 'Wählen Sie oben, wie Sie mit dem KI-Vorschlag umgehen.',
    marksTitle: 'Korrekturmarkierungen auf dem Blatt',
    marksHint: 'Markierungen bearbeiten, umschreiben oder entfernen. Änderungen erscheinen sofort auf der Klausur.',
    addMark: 'Markierung hinzufügen',
    attachTo: 'Bezieht sich auf',
    markType: 'Typ',
    markComment: 'Randnotiz',
    deleteMark: 'Markierung entfernen',
    pointsTitle: 'Punkte pro Kriterium',
    pointsInvalid: 'Punkte müssen zwischen 0 und dem Maximum des Kriteriums liegen.',
    summaryTitle: 'Abschließender Kommentar',
    summaryPh: 'Schreiben Sie den Kommentar, den die Schülerin oder der Schüler liest.',
  },
  exportP: {
    title: 'Korrigierte Klausur exportieren',
    lead: 'Ihre annotierte Klausur ist fertig. Laden Sie eine saubere, professionelle PDF für Ihre Unterlagen herunter.',
    profile: 'Korrekturprofil',
    finalPoints: 'Endpunktzahl',
    finalSummary: 'Abschließendes Feedback',
    download: 'Korrigierte PDF herunterladen',
    downloaded: (file) => `${file} heruntergeladen.`,
    restart: 'Neue Korrektur starten',
    fileName: 'korrigierte_klausur_geschichte.pdf',
    ready: 'Bereit zum Download',
  },
  marks: {
    strength: 'Stärke',
    improvement: 'Ausbauen',
    error: 'Korrektur',
  },
  exam: {
    school: 'Gymnasium am Stadtpark',
    subject: 'Geschichte',
    course: 'Leistungskurs · Jahrgang 12',
    task: 'Klausur Nr. 2 — Die Weimarer Republik',
    taskPrompt:
      'Aufgabe 1: Erläutern Sie die wesentlichen Ursachen für die Instabilität der Weimarer Republik in den Jahren 1919 bis 1923. (28 Punkte)',
    nameLabel: 'Name',
    classLabel: 'Klasse',
    dateLabel: 'Datum',
    studentName: 'Anna Schmidt',
    className: '12b',
    date: '14.03.2026',
    paragraphs: DE_PARAGRAPHS,
    pageLabel: (n, total) => `Seite ${n} / ${total} · handschriftlich`,
    handwritten: 'handschriftlich',
    initials: '— A. S.',
    duration: 'Dauer: 90 Min.',
    maxNote: 'Max. 28 Punkte',
  },
  pii: [
    { label: 'Name', value: 'Anna Schmidt' },
    { label: 'Klasse', value: '12b' },
    { label: 'Datum', value: '14.03.2026' },
  ],
  profiles: {
    positive: {
      name: 'Positiv-Modus',
      tagline: 'Ermutigendes Feedback, Stärken zuerst',
      features: ['Stärken zuerst hervorheben', 'Wenige rote Markierungen', 'Ermutigender Ton'],
    },
    grammar: {
      name: 'Sprach-Coach',
      tagline: 'Sprachfokussierte Korrekturen im Text',
      features: ['Sprachliches Feedback im Text', 'Deutsch/Englisch-Fokus', 'Schlägt Korrekturen vor'],
    },
    strict: {
      name: 'Striktes Raster',
      tagline: 'Konsistente, punktbasierte Bewertung',
      features: ['Punktbasierte Bewertung', 'Kriteriengestützte Abzüge', 'Konsistente Punktvergabe'],
    },
    oberstufe: {
      name: 'Oberstufe',
      tagline: 'Strukturiertes Feedback für Abiturfächer',
      features: ['Strukturiertes Feedback', 'Inhalt & Argumentation', 'Für Gymnasium / Abitur'],
    },
  },
  valueCards: [
    {
      title: 'Korrekturzeit sparen',
      description:
        'In Sekunden einen strukturierten Entwurf erhalten — Sie prüfen, statt alles von Grund auf zu schreiben.',
      icon: 'clock',
    },
    {
      title: 'Kontrolle bei der Lehrkraft',
      description:
        'Jeder Vorschlag und jeder Punkt ist bearbeitbar. Nichts ist endgültig, bis Sie es bestätigen.',
      icon: 'shield',
    },
    {
      title: 'DSGVO-konformer Ablauf',
      description:
        'Blackboard anonymisiert die Klausur zuerst. Namen und Personendaten bleiben aus dem KI-Prozess heraus.',
      icon: 'lock',
    },
  ],
  rubricManual: [
    { id: 'content', name: 'Inhaltliche Richtigkeit', maxPoints: 10, awardedPoints: 0 },
    { id: 'argumentation', name: 'Argumentation', maxPoints: 8, awardedPoints: 0 },
    { id: 'structure', name: 'Struktur', maxPoints: 5, awardedPoints: 0 },
    { id: 'language', name: 'Sprache', maxPoints: 5, awardedPoints: 0 },
  ],
  rubricExtracted: [
    { id: 'sachkompetenz', name: 'Sachkompetenz', maxPoints: 12, awardedPoints: 0 },
    { id: 'analyse', name: 'Analyse & Argumentation', maxPoints: 9, awardedPoints: 0 },
    { id: 'urteil', name: 'Urteilskompetenz', maxPoints: 6, awardedPoints: 0 },
    { id: 'darstellung', name: 'Darstellungsleistung', maxPoints: 7, awardedPoints: 0 },
  ],
  rubricFileName: 'bewertungsraster_geschichte.pdf',
  annotations: [
    {
      id: 'a1',
      quote: 'Die Dolchstoßlegende behauptete',
      type: 'strength',
      comment: 'Sehr gut — die Dolchstoßlegende ist ein zentraler Grund für die Ablehnung der Republik.',
    },
    {
      id: 'a2',
      quote: 'Der Vertrag von Versailles verstärkte die Unzufriedenheit',
      type: 'strength',
      comment: 'Richtig erkannt: Versailles als Belastung der jungen Demokratie.',
    },
    {
      id: 'a3',
      quote: 'hohe Reparationen zahlen',
      type: 'improvement',
      comment: 'Nenne konkrete Zahlen oder das Londoner Ultimatum, um die volle Punktzahl zu erreichen.',
    },
    {
      id: 'a4',
      quote: 'wärend',
      type: 'error',
      comment: 'Rechtschreibung: richtig ist „während“.',
    },
    {
      id: 'a5',
      quote: 'Die Regierungen wechselten häufig',
      type: 'improvement',
      comment: 'Zu allgemein — verweise auf die kurze Lebensdauer der Kabinette und ihre fehlende Mehrheit.',
    },
  ],
  feedbackSuggested:
    'Eine gut strukturierte Antwort, die die politischen und wirtschaftlichen Ursachen der Instabilität richtig benennt. Für die Spitzengruppe: konkrete Zahlen zu den Reparationen ergänzen und die häufigen Regierungswechsel präziser fassen.',
  summaryComment:
    'Eine solide Antwort mit klarem Verständnis der politischen Lage. Für die Spitzengruppe: verbinde die Wirtschaftskrise deutlicher mit dem Vertrauensverlust in die Demokratie und belege Versailles sowie die Regierungswechsel konkret.',
  ocrText: DE_PARAGRAPHS.join(' '),
  fileName: 'klausur_geschichte.pdf',
  exportFileName: 'korrigierte_klausur_geschichte.pdf',
};

export const DICTS: Record<Lang, Dict> = { en: EN, de: DE };

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  onLangChange,
}: {
  children: ReactNode;
  onLangChange?: (lang: Lang) => void;
}) {
  const [lang, setLangState] = useState<Lang>('en');

  function setLang(next: Lang) {
    setLangState(next);
    onLangChange?.(next);
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
