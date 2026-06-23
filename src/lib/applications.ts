import { getSupabaseAdmin } from './supabase';
import { hashValue, makeApplicationNo, normalizeHandle, safeText } from './crypto';
import { ApplicationStatus, SubmitPayload } from './types';
import { getFallbackQuestions } from './fallback-data';

function pickString(answers: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const val = answers[key];
    if (val !== undefined && val !== null && String(val).trim()) return String(val).trim();
  }
  return '';
}

function pickNumber(answers: Record<string, unknown>, keys: string[]) {
  const raw = pickString(answers, keys);
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function createApplication(payload: SubmitPayload, ctx: { ip: string; userAgent: string | null }) {
  const supabase = getSupabaseAdmin();
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  if (settings?.maintenance_mode) throw new Error(settings.maintenance_message || 'الموقع في وضع الصيانة الآن.');
  if (settings && settings.applications_open === false) throw new Error('التقديم مغلق حاليًا.');
  if (payload.applicationType === 'ADMIN' && settings?.admin_applications_open === false) throw new Error('تقديم الإدارة مغلق حاليًا.');
  if (payload.applicationType === 'FACTION_LEADER' && settings?.leader_applications_open === false) throw new Error('تقديم قادة الفصائل مغلق حاليًا.');

  if (payload.applicationType === 'FACTION_LEADER') {
    if (!payload.factionSlug) throw new Error('يجب اختيار الفصيل.');
    const { data: faction } = await supabase.from('factions').select('*').eq('slug', payload.factionSlug).maybeSingle();
    if (!faction || !faction.is_open || !faction.is_visible) throw new Error('التقديم على هذا الفصيل مغلق حاليًا.');
  }

  if (payload.website) throw new Error('تم رفض الطلب.');

  const answers = payload.answers || {};
  const clientId = pickString(answers, ['client_id', 'clientId', 'CLIENT_ID']);
  const discord = normalizeHandle(pickString(answers, ['discord_username', 'discord', 'DISCORD']));
  const rpName = pickString(answers, ['rp_name', 'character_name', 'name_rp', 'RP_NAME']);
  const serverName = pickString(answers, ['server_name', 'server', 'SERVER']);
  const country = pickString(answers, ['country', 'COUNTRY']);
  const contact = pickString(answers, ['contact', 'CONTACT']);
  const age = pickNumber(answers, ['age', 'AGE']);
  const hoursAvailable = pickNumber(answers, ['hours_available', 'daily_hours', 'HOURS']);

  if (!clientId || !discord || !rpName) throw new Error('Client ID وDiscord واسم RP حقول أساسية.');

  const ipHash = hashValue(ctx.ip);
  const deviceHash = hashValue(payload.deviceHash || '');
  const clientHash = hashValue(clientId);
  const discordHash = hashValue(discord);
  const rpHash = hashValue(rpName);

  const blacklistChecks = [
    ['CLIENT_ID', clientId], ['DISCORD', discord], ['RP_NAME', rpName], ['IP_HASH', ipHash], ['DEVICE_HASH', deviceHash]
  ].filter(([, value]) => Boolean(value));

  for (const [type, value] of blacklistChecks) {
    const { data: block } = await supabase.from('blacklist').select('*').eq('type', type).eq('value', value).eq('is_active', true).maybeSingle();
    if (block) {
      const { data: app } = await supabase.from('applications').insert({
        application_no: makeApplicationNo(), application_type: payload.applicationType, faction_slug: payload.factionSlug || null,
        status: 'BLOCKED', priority: 'HIGH', review_label: 'NOT_SUITABLE', duplicate_state: 'BLACKLIST',
        client_id: clientId, discord_username: discord, rp_name: rpName, server_name: serverName, country, contact, age, hours_available: hoursAvailable,
        ip_hash: ipHash, device_hash: deviceHash, client_hash: clientHash, discord_hash: discordHash, rp_hash: rpHash, user_agent: ctx.userAgent
      }).select('*').single();
      if (app) await supabase.from('application_flags').insert({ application_id: app.id, flag_type: 'BLACKLIST', severity: 'CRITICAL', message: `القيمة موجودة في القائمة السوداء: ${type}` });
      throw new Error('لا يمكن قبول هذا الطلب. يرجى التواصل مع الإدارة.');
    }
  }

  const duplicateFlags: { flag_type: string; severity: string; message: string }[] = [];
  const { data: previous } = await supabase
    .from('applications')
    .select('id,application_no,client_hash,discord_hash,rp_hash,device_hash,submitted_at')
    .or(`client_hash.eq.${clientHash},discord_hash.eq.${discordHash},rp_hash.eq.${rpHash}${deviceHash ? `,device_hash.eq.${deviceHash}` : ''}`)
    .order('submitted_at', { ascending: false })
    .limit(10);

  for (const row of previous || []) {
    if (row.client_hash === clientHash) duplicateFlags.push({ flag_type: 'CLIENT_ID_DUPLICATE', severity: 'HIGH', message: `نفس Client ID ظهر في طلب سابق: ${row.application_no}` });
    if (row.discord_hash === discordHash) duplicateFlags.push({ flag_type: 'DISCORD_DUPLICATE', severity: 'MEDIUM', message: `نفس Discord ظهر في طلب سابق: ${row.application_no}` });
    if (row.rp_hash === rpHash) duplicateFlags.push({ flag_type: 'RP_NAME_DUPLICATE', severity: 'MEDIUM', message: `نفس اسم RP ظهر في طلب سابق: ${row.application_no}` });
    if (deviceHash && row.device_hash === deviceHash) duplicateFlags.push({ flag_type: 'DEVICE_DUPLICATE', severity: 'LOW', message: `نفس الجهاز قدّم طلبًا سابقًا: ${row.application_no}` });
  }

  const shortAnswers = Object.entries(answers).filter(([k, v]) => !['client_id','discord_username','rp_name'].includes(k) && safeText(v).trim().length > 0 && safeText(v).trim().length < 8);
  if (shortAnswers.length >= 3) duplicateFlags.push({ flag_type: 'SHORT_ANSWERS', severity: 'LOW', message: 'توجد عدة إجابات قصيرة جدًا وتحتاج مراجعة يدوية.' });

  let status: ApplicationStatus = 'NEW';
  let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  let reviewLabel = 'NEEDS_REVIEW';
  let duplicateState = 'NONE';
  if (duplicateFlags.some(f => f.severity === 'HIGH')) { status = 'DUPLICATE'; priority = 'HIGH'; reviewLabel = 'UNCLEAR'; duplicateState = 'POSSIBLE'; }
  else if (duplicateFlags.length) { priority = 'MEDIUM'; duplicateState = 'POSSIBLE'; }
  if (age !== null && age < 16) { priority = 'HIGH'; reviewLabel = 'NOT_SUITABLE'; duplicateFlags.push({ flag_type: 'AGE_UNDER_LIMIT', severity: 'HIGH', message: 'العمر أقل من الحد المقترح للتقديم.' }); }
  if (hoursAvailable !== null && hoursAvailable < 2) { duplicateFlags.push({ flag_type: 'LOW_AVAILABILITY', severity: 'MEDIUM', message: 'ساعات التفرغ اليومية منخفضة وتحتاج مراجعة.' }); }

  const { data: app, error } = await supabase.from('applications').insert({
    application_no: makeApplicationNo(), application_type: payload.applicationType, faction_slug: payload.factionSlug || null,
    status, priority, review_label: reviewLabel, duplicate_state: duplicateState,
    client_id: clientId, discord_username: discord, rp_name: rpName, server_name: serverName, country, contact, age, hours_available: hoursAvailable,
    ip_hash: ipHash, device_hash: deviceHash, client_hash: clientHash, discord_hash: discordHash, rp_hash: rpHash,
    screen: payload.screen || null, timezone: payload.timezone || null, user_agent: ctx.userAgent
  }).select('*').single();
  if (error) throw new Error(error.message);

  const { data: dbQuestions } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .or(`application_type.eq.ALL,application_type.eq.${payload.applicationType}`)
    .order('order_index');

  const questions = dbQuestions?.length ? dbQuestions : getFallbackQuestions(payload.applicationType, payload.factionSlug || null);
  const answerRows = Object.entries(answers).map(([key, value]) => {
    const q = (questions || []).find((item: any) => item.question_key === key);
    return {
      application_id: app.id,
      question_id: q?.id || null,
      question_key: key,
      question_title: q?.title || key,
      section: q?.section || 'غير مصنف',
      answer_json: value,
      answer_text: safeText(value)
    };
  });
  if (answerRows.length) await supabase.from('application_answers').insert(answerRows);
  if (duplicateFlags.length) await supabase.from('application_flags').insert(duplicateFlags.map(f => ({ application_id: app.id, ...f })));
  await supabase.from('application_status_history').insert({ application_id: app.id, from_status: null, to_status: status, note: 'تم إنشاء الطلب' });
  await supabase.from('admin_audit_logs').insert({ action: 'APPLICATION_CREATED', entity_type: 'application', entity_id: app.id, metadata: { application_no: app.application_no, status, duplicateFlags: duplicateFlags.length } });

  return { app, flags: duplicateFlags };
}
