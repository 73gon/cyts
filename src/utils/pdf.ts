import type { Annotation, AnnotationType } from '../types';

const MARK_RGB: Record<AnnotationType, [number, number, number]> = {
  strength: [0.16, 0.55, 0.34],
  improvement: [0.78, 0.5, 0.08],
  error: [0.79, 0.22, 0.22],
};

export interface CorrectionPdfData {
  brand: string;
  docTitle: string;
  exam: { school: string; subject: string; task: string; date: string; anonLabel: string };
  paragraphs: string[];
  annotations: Annotation[];
  markLabels: Record<AnnotationType, string>;
  profileLabel: string;
  rubric: { name: string; awardedPoints: number; maxPoints: number }[];
  totalAwarded: number;
  totalMax: number;
  totalLabel: string;
  pointsLabel: string;
  answerLabel: string;
  marksLabel: string;
  summaryLabel: string;
  summaryComment: string;
}

const INK: [number, number, number] = [0.11, 0.12, 0.13];
const GRAY: [number, number, number] = [0.42, 0.44, 0.47];
const LINE: [number, number, number] = [0.82, 0.83, 0.85];
const ACCENT: [number, number, number] = [0.09, 0.1, 0.12];

const PAGE_W = 595;
const PAGE_H = 842;
const LEFT = 56;
const RIGHT = 539;
const TOP = 792;
const BOTTOM = 70;

const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
const rgb = ([r, g, b]: [number, number, number]) => `${r} ${g} ${b}`;

/** Tiny multi-page PDF builder with a text cursor and automatic page breaks. */
class Pdf {
  pages: string[][] = [[]];
  y = TOP;

  private cur() {
    return this.pages[this.pages.length - 1];
  }

  newPage() {
    this.pages.push([]);
    this.y = TOP;
  }

  ensure(space: number) {
    if (this.y - space < BOTTOM) this.newPage();
  }

  text(
    x: number,
    y: number,
    size: number,
    color: [number, number, number],
    str: string,
    font = 'F1',
  ) {
    this.cur().push(
      'BT',
      `/${font} ${size} Tf`,
      `${rgb(color)} rg`,
      `1 0 0 1 ${x} ${y} Tm`,
      `(${escape(str)}) Tj`,
      'ET',
    );
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: [number, number, number],
    width: number,
  ) {
    this.cur().push(`${rgb(color)} RG`, `${width} w`, `${x1} ${y1} m`, `${x2} ${y2} l`, 'S');
  }

  rect(x: number, y: number, w: number, h: number, color: [number, number, number], fill = true) {
    if (fill) this.cur().push(`${rgb(color)} rg`, `${x} ${y} ${w} ${h} re`, 'f');
    else this.cur().push(`${rgb(color)} RG`, '0.8 w', `${x} ${y} ${w} ${h} re`, 'S');
  }
}

function wrapText(input: string, maxChars: number): string[] {
  const out: string[] = [];
  let current = '';
  for (const word of input.split(' ')) {
    if (current && (current + ' ' + word).length > maxChars) {
      out.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) out.push(current);
  return out;
}

/** Render one paragraph in monospace with coloured underlines under marked spans. */
function renderMarkedParagraph(pdf: Pdf, para: string, numbered: (Annotation & { number: number })[]) {
  const MONO = 'F2';
  const size = 10.5;
  const charW = size * 0.6;
  const lineH = size + 6;
  const maxChars = Math.floor((RIGHT - LEFT) / charW);

  const words = para.split(' ');
  const wordStart: number[] = [];
  let pos = 0;
  for (const w of words) {
    wordStart.push(pos);
    pos += w.length + 1;
  }
  const lines: { start: number; end: number; str: string }[] = [];
  let lineStartWord = 0;
  for (let i = 0; i < words.length; i++) {
    const curLen = wordStart[i] + words[i].length - wordStart[lineStartWord];
    const last = i + 1 >= words.length;
    if (curLen > maxChars && i > lineStartWord) {
      const start = wordStart[lineStartWord];
      const end = wordStart[i - 1] + words[i - 1].length;
      lines.push({ start, end, str: para.slice(start, end) });
      lineStartWord = i;
    }
    if (last) {
      const start = wordStart[lineStartWord];
      const end = wordStart[i] + words[i].length;
      lines.push({ start, end, str: para.slice(start, end) });
    }
  }

  const marks = numbered
    .map((a) => ({ ...a, s: para.indexOf(a.quote) }))
    .filter((a) => a.s >= 0)
    .map((a) => ({ ...a, e: a.s + a.quote.length }));

  for (const ln of lines) {
    pdf.ensure(lineH);
    const y = pdf.y;
    pdf.text(LEFT, y, size, INK, ln.str, MONO);
    for (const m of marks) {
      const oStart = Math.max(ln.start, m.s);
      const oEnd = Math.min(ln.end, m.e);
      if (oEnd <= oStart) continue;
      const x1 = LEFT + (oStart - ln.start) * charW;
      const x2 = LEFT + (oEnd - ln.start) * charW;
      pdf.line(x1, y - 3, x2, y - 3, MARK_RGB[m.type], 1.5);
      if (m.s >= ln.start && m.s < ln.end) {
        pdf.rect(LEFT - 22, y - 2, 13, 13, MARK_RGB[m.type]);
        pdf.text(LEFT - 18.5, y + 1, 9, [1, 1, 1], String(m.number), 'F3');
      }
    }
    pdf.y -= lineH;
  }
  pdf.y -= 6;
}

function sectionHeader(pdf: Pdf, label: string) {
  pdf.ensure(30);
  pdf.text(LEFT, pdf.y, 9, GRAY, label.toUpperCase(), 'F3');
  pdf.y -= 6;
  pdf.line(LEFT, pdf.y, RIGHT, pdf.y, LINE, 0.6);
  pdf.y -= 16;
}

/** Renders a clean, professional corrected-exam PDF and triggers a download. */
export function downloadCorrectionPdf(fileName: string, data: CorrectionPdfData) {
  const pdf = new Pdf();
  const numbered = data.annotations.map((a, i) => ({ ...a, number: i + 1 }));

  // ---- Header band ----
  pdf.text(LEFT, TOP, 9, GRAY, data.brand.toUpperCase(), 'F3');
  pdf.y = TOP - 20;
  pdf.text(LEFT, pdf.y, 18, ACCENT, data.docTitle, 'F3');

  const boxW = 96;
  const boxX = RIGHT - boxW;
  const boxY = TOP - 34;
  pdf.rect(boxX, boxY, boxW, 40, INK);
  pdf.text(boxX + 12, boxY + 26, 17, [1, 1, 1], `${data.totalAwarded} / ${data.totalMax}`, 'F3');
  pdf.text(boxX + 12, boxY + 10, 7.5, [0.75, 0.77, 0.8], data.pointsLabel.toUpperCase(), 'F3');

  pdf.y = TOP - 44;
  pdf.text(LEFT, pdf.y, 10, GRAY, `${data.exam.school}  ·  ${data.exam.subject}`);
  pdf.y -= 13;
  pdf.text(LEFT, pdf.y, 10, GRAY, data.exam.task.length > 80 ? `${data.exam.task.slice(0, 80)}…` : data.exam.task);
  pdf.y -= 13;
  pdf.text(LEFT, pdf.y, 9.5, MARK_RGB.strength, `${data.exam.anonLabel}  ·  ${data.exam.date}`, 'F3');
  pdf.y -= 12;
  pdf.line(LEFT, pdf.y, RIGHT, pdf.y, INK, 1.2);
  pdf.y -= 22;

  // ---- Answer with correction marks ----
  sectionHeader(pdf, data.answerLabel);
  for (const para of data.paragraphs) {
    renderMarkedParagraph(pdf, para, numbered);
  }
  pdf.y -= 6;

  // ---- Feedback marks ----
  sectionHeader(pdf, data.marksLabel);
  for (const ann of numbered) {
    pdf.ensure(34);
    const yTop = pdf.y;
    pdf.rect(LEFT, yTop - 1, 13, 13, MARK_RGB[ann.type]);
    pdf.text(LEFT + 3.4, yTop + 2, 9, [1, 1, 1], String(ann.number), 'F3');
    pdf.text(LEFT + 22, yTop, 9.5, MARK_RGB[ann.type], data.markLabels[ann.type].toUpperCase(), 'F3');
    pdf.text(
      LEFT + 82,
      yTop,
      9.5,
      GRAY,
      `"${ann.quote.length > 58 ? `${ann.quote.slice(0, 58)}…` : ann.quote}"`,
    );
    pdf.y -= 15;
    for (const wrapped of wrapText(ann.comment, 92)) {
      pdf.ensure(14);
      pdf.text(LEFT + 22, pdf.y, 10, INK, wrapped);
      pdf.y -= 13;
    }
    pdf.y -= 8;
  }

  // ---- Point breakdown ----
  sectionHeader(pdf, `${data.pointsLabel} — ${data.profileLabel}`);
  for (const c of data.rubric) {
    pdf.ensure(16);
    pdf.text(LEFT, pdf.y, 11, INK, c.name);
    pdf.text(RIGHT - 54, pdf.y, 11, INK, `${c.awardedPoints} / ${c.maxPoints}`, 'F3');
    pdf.y -= 8;
    pdf.line(LEFT, pdf.y, RIGHT, pdf.y, LINE, 0.4);
    pdf.y -= 12;
  }
  pdf.ensure(20);
  pdf.text(LEFT, pdf.y, 12, INK, data.totalLabel, 'F3');
  pdf.text(RIGHT - 54, pdf.y, 12, ACCENT, `${data.totalAwarded} / ${data.totalMax}`, 'F3');
  pdf.y -= 26;

  // ---- Summary in a bordered box ----
  sectionHeader(pdf, data.summaryLabel);
  const summaryLines = wrapText(data.summaryComment || '—', 90);
  const boxH = 16 + summaryLines.length * 14;
  pdf.ensure(boxH + 4);
  const sTop = pdf.y + 4;
  pdf.rect(LEFT, sTop - boxH, RIGHT - LEFT, boxH, LINE, false);
  pdf.y -= 10;
  for (const wrapped of summaryLines) {
    pdf.text(LEFT + 12, pdf.y, 11, INK, wrapped);
    pdf.y -= 14;
  }

  // ===== Assemble the PDF file =====
  const objs: string[] = [];
  objs.push('<< /Type /Catalog /Pages 2 0 R >>');
  const numPages = pdf.pages.length;
  const kids = pdf.pages.map((_, i) => `${3 + i * 2} 0 R`).join(' ');
  objs.push(`<< /Type /Pages /Kids [${kids}] /Count ${numPages} >>`);

  const fontF1 = 3 + numPages * 2;
  const fontF2 = fontF1 + 1;
  const fontF3 = fontF1 + 2;

  pdf.pages.forEach((ops, i) => {
    const footer = [
      'BT',
      '/F1 8 Tf',
      `${rgb(GRAY)} rg`,
      `1 0 0 1 ${LEFT} 44 Tm`,
      `(${escape(`${data.brand} · reviewed and approved by the teacher`)}) Tj`,
      'ET',
      'BT',
      '/F1 8 Tf',
      `${rgb(GRAY)} rg`,
      `1 0 0 1 ${RIGHT - 60} 44 Tm`,
      `(${escape(`Page ${i + 1} / ${numPages}`)}) Tj`,
      'ET',
    ];
    const content = [...ops, ...footer].join('\n');
    objs.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${fontF1} 0 R /F2 ${fontF2} 0 R /F3 ${fontF3} 0 R >> >> /Contents ${4 + i * 2} 0 R >>`,
    );
    objs.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>');
  objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  let out = '%PDF-1.4\n';
  const offsets: number[] = [];
  objs.forEach((obj, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) out += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([out], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
