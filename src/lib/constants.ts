export const APPLICATION_TYPE_LABELS: Record<string, string> = {
  ADMIN: 'التقديم على الإدارة',
  FACTION_LEADER: 'التقديم على قائد فصيل',
  FACTION_MEMBER: 'التقديم على عضو فصيل'
};

export const STATUS_LABELS: Record<string, string> = {
  NEW: 'جديد',
  UNDER_REVIEW: 'قيد المراجعة',
  INTERVIEW: 'مقابلة',
  ACCEPTED: 'مقبول',
  REJECTED: 'مرفوض',
  WAITLIST: 'قائمة انتظار',
  NEEDS_RESUBMIT: 'إعادة تقديم'
};

export const STATUS_CLASSES: Record<string, string> = {
  NEW: 'bg-blue-500/15 text-blue-200 border-blue-400/20',
  UNDER_REVIEW: 'bg-yellow-500/15 text-yellow-200 border-yellow-400/20',
  INTERVIEW: 'bg-purple-500/15 text-purple-200 border-purple-400/20',
  ACCEPTED: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
  REJECTED: 'bg-red-500/15 text-red-200 border-red-400/20',
  WAITLIST: 'bg-zinc-500/15 text-zinc-200 border-zinc-400/20',
  NEEDS_RESUBMIT: 'bg-orange-500/15 text-orange-200 border-orange-400/20'
};
