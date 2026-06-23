import { ApplicationStatus, ApplicationType, Priority, ReviewLabel } from './types';

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  ADMIN: 'التقديم على الإدارة',
  FACTION_LEADER: 'التقديم على قائد فصيل'
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  NEW: 'جديد',
  UNDER_REVIEW: 'قيد المراجعة',
  INTERVIEW_REQUIRED: 'محتاج مقابلة',
  PRE_ACCEPTED: 'مقبول مبدئيًا',
  ACCEPTED: 'مقبول نهائيًا',
  REJECTED: 'مرفوض',
  DEFERRED: 'مؤجل',
  DUPLICATE: 'مكرر',
  BLOCKED: 'محظور'
};

export const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  NEW: 'border-sky-400/30 bg-sky-500/10 text-sky-200',
  UNDER_REVIEW: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  INTERVIEW_REQUIRED: 'border-violet-400/30 bg-violet-500/10 text-violet-200',
  PRE_ACCEPTED: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  ACCEPTED: 'border-green-400/30 bg-green-500/10 text-green-200',
  REJECTED: 'border-red-400/30 bg-red-500/10 text-red-200',
  DEFERRED: 'border-zinc-400/30 bg-zinc-500/10 text-zinc-200',
  DUPLICATE: 'border-orange-400/30 bg-orange-500/10 text-orange-200',
  BLOCKED: 'border-red-500/50 bg-red-700/20 text-red-100'
};

export const REVIEW_LABELS: Record<ReviewLabel, string> = {
  VERY_STRONG: 'مرشح قوي جدًا',
  GOOD: 'مرشح جيد',
  NEEDS_REVIEW: 'يحتاج مراجعة',
  UNCLEAR: 'غير واضح',
  NOT_SUITABLE: 'غير مناسب'
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: 'عالية',
  MEDIUM: 'متوسطة',
  LOW: 'منخفضة'
};

export const FORM_SECTIONS = ['البيانات الأساسية', 'بيانات اللعبة', 'الخبرة والتفرغ', 'المواقف العملية', 'خطة العمل', 'الإقرارات'];

export const FACTION_META: Record<string, { title: string; icon: string; accent: string }> = {
  police: { title: 'الشرطة', icon: 'Badge', accent: 'from-sky-400/20 to-white/[.04]' },
  army: { title: 'الجيش', icon: 'Shield', accent: 'from-emerald-400/20 to-white/[.04]' },
  medical: { title: 'التحالف الطبي', icon: 'Stethoscope', accent: 'from-red-400/20 to-white/[.04]' }
};
