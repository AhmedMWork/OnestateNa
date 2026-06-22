import { getSupabaseAdmin } from './supabase';
import { Question, SubmitPayload } from './types';
import { canonicalText, hashPII, normalizeHandle, randomCode } from './crypto';
import { evaluateAnswers } from './scoring';

export function extractCoreFields(questions: Question[], answers: Record<string, unknown>) {
  const byKey = (key: string) => {
    const q = questions.find((item) => item.question_key === key);
    return q ? canonicalText(answers[q.id] ?? answers[q.question_key]) : '';
  };
  return {
    client_id: byKey('client_id'),
    discord_username: normalizeHandle(byKey('discord_username')),
    rp_name: byKey('rp_name'),
    server_name: byKey('server_name'),
    country: byKey('country'),
    age: Number(byKey('age') || 0) || null,
    hours_available: Number((byKey('hours_available') || '').replace(/[^0-9.]/g, '')) || null
  };
}

export async function loadQuestionsFor(type: string, factionSlug?: string | null) {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('questions')
    .select('*')
    .eq('application_type', type)
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  query = factionSlug ? query.or(`faction_slug.is.null,faction_slug.eq.${factionSlug}`) : query.is('faction_slug', null);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Question[];
}

export async function checkBlacklist(core: ReturnType<typeof extractCoreFields>, ipHash: string | null, deviceHash?: string | null) {
  const supabase = getSupabaseAdmin();
  const candidates = [
    { type: 'CLIENT_ID', value: core.client_id },
    { type: 'DISCORD', value: core.discord_username },
    { type: 'RP_NAME', value: core.rp_name },
    { type: 'IP_HASH', value: ipHash },
    { type: 'DEVICE_HASH', value: deviceHash }
  ].filter((item) => item.value);
  const hits: any[] = [];
  for (const item of candidates) {
    const { data } = await supabase.from('blacklist').select('*').eq('type', item.type).eq('value', item.value).eq('is_active', true).limit(5);
    if (data?.length) hits.push(...data);
  }
  return hits;
}

export async function detectDuplicates(core: ReturnType<typeof extractCoreFields>, ipHash: string | null, deviceHash?: string | null) {
  const supabase = getSupabaseAdmin();
  const flags: { type: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; message: string; matched_application_id?: string }[] = [];
  const checks: { field: string; value: string | null | undefined; severity: 'LOW' | 'MEDIUM' | 'HIGH'; label: string }[] = [
    { field: 'client_id', value: core.client_id, severity: 'HIGH', label: 'نفس Client ID' },
    { field: 'discord_username', value: core.discord_username, severity: 'HIGH', label: 'نفس حساب Discord' },
    { field: 'rp_name', value: core.rp_name, severity: 'MEDIUM', label: 'نفس اسم RP' },
    { field: 'ip_hash', value: ipHash, severity: 'MEDIUM', label: 'نفس IP Hash' },
    { field: 'device_hash', value: deviceHash, severity: 'MEDIUM', label: 'نفس بصمة الجهاز' }
  ];

  for (const check of checks) {
    if (!check.value) continue;
    const { data } = await supabase
      .from('applications')
      .select('id, application_no, submitted_at, status')
      .eq(check.field, check.value)
      .limit(3);
    if (data && data.length) {
      for (const item of data) {
        flags.push({ type: check.field, severity: check.severity, message: `${check.label} موجود في طلب سابق: ${item.application_no}`, matched_application_id: item.id });
      }
    }
  }

  const score = flags.reduce((acc, f) => acc + (f.severity === 'HIGH' ? 35 : f.severity === 'MEDIUM' ? 20 : 10), 0);
  const risk = score >= 55 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';
  return { flags, score: Math.min(100, score), risk };
}

export async function createApplication(payload: SubmitPayload, requestInfo: { ip?: string | null; userAgent?: string | null }) {
  const supabase = getSupabaseAdmin();
  const questions = await loadQuestionsFor(payload.applicationType, payload.factionSlug || null);
  if (!questions.length) throw new Error('لا توجد أسئلة نشطة لهذا النوع من التقديم');

  const core = extractCoreFields(questions, payload.answers);
  const ipHash = hashPII(requestInfo.ip || '');
  const deviceHash = payload.deviceHash ? hashPII(payload.deviceHash) : null;
  const blacklistHits = await checkBlacklist(core, ipHash, deviceHash);
  const duplicate = await detectDuplicates(core, ipHash, deviceHash);
  const score = evaluateAnswers(questions, payload.answers);
  const adjusted = blacklistHits.length ? 0 : Math.max(0, score.percentage - Math.round(duplicate.score * 0.35));
  const applicationNo = `OS-${new Date().getFullYear()}-${randomCode(4)}`;
  const status = blacklistHits.length || score.hardReject ? 'REJECTED' : 'NEW';

  const { data: app, error } = await supabase
    .from('applications')
    .insert({
      application_no: applicationNo,
      application_type: payload.applicationType,
      faction_slug: payload.factionSlug || null,
      status,
      score: adjusted,
      score_raw: score.percentage,
      score_level: score.level,
      risk_level: blacklistHits.length ? 'HIGH' : duplicate.risk,
      duplicate_score: blacklistHits.length ? 100 : duplicate.score,
      recommendation: blacklistHits.length ? 'رفض تلقائي بسبب وجود بيانات المتقدم في القائمة السوداء.' : score.recommendation,
      client_id: core.client_id || null,
      discord_username: core.discord_username || null,
      rp_name: core.rp_name || null,
      server_name: core.server_name || null,
      country: core.country || null,
      age: core.age,
      hours_available: core.hours_available,
      answers_snapshot: payload.answers,
      score_breakdown: score.breakdown,
      ip_hash: ipHash,
      device_hash: deviceHash,
      user_agent: requestInfo.userAgent || null,
      timezone: payload.timezone || null,
      screen: payload.screen || null
    })
    .select('*')
    .single();
  if (error) throw error;

  const answerRows = score.evaluations.map((e) => {
    const q = questions.find((item) => item.id === e.questionId)!;
    return {
      application_id: app.id,
      question_id: e.questionId,
      question_key: e.questionKey,
      question_title: q.title,
      answer_text: e.answerText,
      answer_json: payload.answers[e.questionId] ?? payload.answers[e.questionKey] ?? null,
      score: e.score,
      max_score: e.maxScore,
      evaluation_note: e.note,
      section: q.section
    };
  });
  const { error: answersError } = await supabase.from('application_answers').insert(answerRows);
  if (answersError) throw answersError;

  const allFlags = [
    ...duplicate.flags,
    ...blacklistHits.map((b) => ({ type: 'BLACKLIST', severity: 'HIGH' as const, message: `قائمة سوداء: ${b.type} - ${b.reason || 'بدون سبب مسجل'}` }))
  ];
  if (allFlags.length) {
    const { error: flagsError } = await supabase.from('duplicate_flags').insert(
      allFlags.map((f) => ({ application_id: app.id, ...f }))
    );
    if (flagsError) throw flagsError;
  }

  await supabase.from('status_history').insert({ application_id: app.id, from_status: null, to_status: status, note: 'تم إنشاء الطلب تلقائيًا' });
  await supabase.from('audit_logs').insert({ action: 'APPLICATION_CREATED', entity_type: 'application', entity_id: app.id, metadata: { applicationNo } });

  if (process.env.DISCORD_WEBHOOK_URL) {
    fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content: `طلب جديد ${applicationNo} — ${payload.applicationType} — score ${adjusted}%` })
    }).catch(() => null);
  }

  return { app, score: adjusted, duplicate };
}
