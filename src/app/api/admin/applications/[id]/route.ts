export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
type Ctx = { params: { id: string } };
export async function GET(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const id = ctx.params.id;
  const [{ data: application, error }, { data: answers }, { data: flags }, { data: history }, { data: notes }, { data: reviews }] = await Promise.all([
    supabase.from('applications').select('*').eq('id', id).single(),
    supabase.from('application_answers').select('*').eq('application_id', id).order('created_at'),
    supabase.from('application_flags').select('*').eq('application_id', id).order('created_at', { ascending: false }),
    supabase.from('application_status_history').select('*').eq('application_id', id).order('created_at', { ascending: false }),
    supabase.from('application_notes').select('*').eq('application_id', id).order('created_at', { ascending: false }),
    supabase.from('application_reviews').select('*').eq('application_id', id).order('created_at', { ascending: false })
  ]);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 404 });
  return NextResponse.json({ ok: true, application, answers: answers || [], flags: flags || [], history: history || [], notes: notes || [], reviews: reviews || [] });
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json(); const supabase = getSupabaseAdmin(); const id = ctx.params.id;
  const { data: before } = await supabase.from('applications').select('status').eq('id', id).maybeSingle();
  const allowed = ['status','priority','review_label','candidate_summary','decision_reason','duplicate_state'];
  const payload = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const { data, error } = await supabase.from('applications').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  if (body.status && body.status !== before?.status) await supabase.from('application_status_history').insert({ application_id: id, from_status: before?.status || null, to_status: body.status, note: body.decision_reason || 'تغيير حالة من لوحة الأدمن' });
  if (body.note) await supabase.from('application_notes').insert({ application_id: id, note: body.note, is_internal: true });
  await supabase.from('application_reviews').insert({ application_id: id, review_label: body.review_label || data.review_label, priority: body.priority || data.priority, summary: body.candidate_summary || null, decision_reason: body.decision_reason || null });
  await supabase.from('admin_audit_logs').insert({ action: 'APPLICATION_UPDATED', entity_type: 'application', entity_id: id, metadata: payload });
  return NextResponse.json({ ok: true, application: data });
}
