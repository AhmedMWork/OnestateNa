import { Question } from './types';
import { canonicalText } from './crypto';

export type AnswerEvaluation = {
  questionId: string;
  questionKey: string;
  answerText: string;
  score: number;
  maxScore: number;
  note: string;
};

function includesAny(answer: string, words: string[]) {
  const normalized = answer.toLowerCase();
  return words.some((word) => normalized.includes(word.toLowerCase()));
}

function scoreOpen(answer: string, keywords: string[] | undefined, maxScore: number) {
  if (!answer.trim()) return { score: 0, note: 'إجابة فارغة' };
  if (!keywords || keywords.length === 0) {
    const lenScore = Math.min(1, answer.trim().length / 260);
    return { score: Math.round(maxScore * Math.max(0.35, lenScore)), note: 'تقييم مبدئي بطول الإجابة ووضوحها' };
  }
  const hits = keywords.filter((k) => includesAny(answer, [k])).length;
  const ratio = hits / keywords.length;
  const qualityBonus = answer.length > 120 ? 0.12 : answer.length > 60 ? 0.06 : 0;
  const score = Math.round(maxScore * Math.min(1, ratio + qualityBonus));
  return { score, note: `مطابقة ${hits} من ${keywords.length} كلمات/معايير` };
}

function scoreChoice(answer: unknown, correct: unknown, maxScore: number) {
  if (correct === null || correct === undefined) return { score: maxScore, note: 'لا توجد إجابة نموذجية محددة' };
  if (Array.isArray(correct)) {
    const arr = Array.isArray(answer) ? answer.map(String) : [String(answer || '')];
    const correctArr = correct.map(String);
    const hits = arr.filter((v) => correctArr.includes(v)).length;
    return { score: Math.round(maxScore * (hits / Math.max(correctArr.length, 1))), note: `اختيارات صحيحة: ${hits}/${correctArr.length}` };
  }
  return String(answer).trim() === String(correct).trim()
    ? { score: maxScore, note: 'إجابة صحيحة' }
    : { score: 0, note: 'إجابة غير مطابقة للنموذج' };
}

export function evaluateAnswers(questions: Question[], answers: Record<string, unknown>) {
  const evaluations: AnswerEvaluation[] = [];
  const sectionMap: Record<string, { score: number; max: number }> = {};
  let totalScore = 0;
  let totalMax = 0;
  let hardReject = false;
  const warnings: string[] = [];

  for (const q of questions) {
    const raw = answers[q.id] ?? answers[q.question_key];
    const text = canonicalText(raw);
    const max = Number(q.weight || 0);
    let result = { score: 0, note: '' };

    if (q.required && !text) {
      result = { score: 0, note: 'سؤال مطلوب لم تتم الإجابة عليه' };
      warnings.push(`السؤال المطلوب غير مكتمل: ${q.title}`);
    } else if (q.input_type === 'CONSENT' || q.input_type === 'CHECKBOX') {
      const accepted = raw === true || raw === 'true' || raw === 'yes' || raw === 'نعم' || raw === 'أوافق' || raw === 'أوافق علي ذلك!';
      result = { score: accepted ? max : 0, note: accepted ? 'تمت الموافقة' : 'لم تتم الموافقة' };
      if (q.required && !accepted) hardReject = true;
    } else if (['SELECT', 'RADIO', 'MULTISELECT'].includes(q.input_type)) {
      result = scoreChoice(raw, q.correct_answer, max);
    } else if (['TEXT', 'TEXTAREA', 'NUMBER', 'SCALE'].includes(q.input_type)) {
      const correct = q.correct_answer;
      if (correct !== null && correct !== undefined) {
        const correctTexts = Array.isArray(correct) ? correct.map(String) : [String(correct)];
        const matches = correctTexts.some((c) => text.toLowerCase().includes(c.toLowerCase()));
        if (matches) result = { score: max, note: 'تحتوي على الإجابة النموذجية' };
        else result = scoreOpen(text, q.rubric_keywords, max);
      } else {
        result = scoreOpen(text, q.rubric_keywords, max);
      }
    }

    evaluations.push({ questionId: q.id, questionKey: q.question_key, answerText: text, score: result.score, maxScore: max, note: result.note });
    totalScore += result.score;
    totalMax += max;
    if (!sectionMap[q.section]) sectionMap[q.section] = { score: 0, max: 0 };
    sectionMap[q.section].score += result.score;
    sectionMap[q.section].max += max;
  }

  const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const level = hardReject ? 'رفض تلقائي' : percentage >= 85 ? 'مرشح قوي' : percentage >= 70 ? 'جيد' : percentage >= 55 ? 'يحتاج مراجعة' : 'ضعيف';
  const recommendation = hardReject
    ? 'رفض تلقائي بسبب عدم الموافقة على الإقرار المطلوب أو نقص حاسم.'
    : percentage >= 85
      ? 'مرشح قوي للمقابلة.'
      : percentage >= 70
        ? 'مناسب مبدئيًا مع مراجعة السيناريوهات.'
        : percentage >= 55
          ? 'يحتاج مراجعة يدوية دقيقة قبل القرار.'
          : 'الأفضل رفض الطلب أو طلب إعادة تقديم بعد دراسة القوانين.';

  const breakdown = Object.fromEntries(
    Object.entries(sectionMap).map(([section, v]) => [section, { score: v.score, max: v.max, percentage: v.max ? Math.round((v.score / v.max) * 100) : 0 }])
  );

  return { percentage, level, recommendation, hardReject, evaluations, breakdown, warnings };
}
