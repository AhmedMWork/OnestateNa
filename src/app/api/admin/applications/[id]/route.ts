import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const [{ data: application, error }, { data: answers }, { data: flags }, { data: history }, { data: notes }] = await Promise.all([
    supabase.from('applications').select('*').eq('id', ctx.params.id).single(),
    supabase.from('application_answers').select('*').eq('application_id', ctx.params.id).order('created_at'),
    supabase.from('duplicate_flags').select('*').eq('application_id', ctx.params.id),
    supabase.from('status_history').select('*').eq('application_id', ctx.params.id).order('created_at', { ascending: false }),
    supabase.from('admin_notes').select('*').eq('application_id', ctx.params.id).order('created_at', { ascending: false })
  ]);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 404 });
  return NextResponse.json({ ok: true, application, answers: answers || [], flags: flags || [], history: history || [], notes: notes || [] });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json();
  const supabase = getSupabaseAdmin();
  const { data: before } = await supabase.from('applications').select('status').eq('id', ctx.params.id).single();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ['status', 'reviewer_note', 'admin_decision_reason', 'score', 'risk_level']) if (key in body) update[key] = body[key];
  const { data, error } = await supabase.from('applications').update(update).eq('id', ctx.params.id).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  if (body.status && body.status !== before?.status) {
    await supabase.from('status_history').insert({ application_id: ctx.params.id, from_status: before?.status || null, to_status: body.status, note: body.admin_decision_reason || 'تغيير حالة من لوحة الإدارة' });
  }
  if (body.note) await supabase.from('admin_notes').insert({ application_id: ctx.params.id, note: body.note });
  await supabase.from('audit_logs').insert({ action: 'APPLICATION_UPDATED', entity_type: 'application', entity_id: ctx.params.id, metadata: update });
  return NextResponse.json({ ok: true, application: data });
}
