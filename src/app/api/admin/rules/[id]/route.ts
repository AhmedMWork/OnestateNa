export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
type Ctx = { params: { id: string } };
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json(); const supabase = getSupabaseAdmin();
  const allowed = ['category','code','title','body','penalty','severity','faction_slug','tags','order_index','is_active'];
  const payload = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const { data, error } = await supabase.from('rules').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', ctx.params.id).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('admin_audit_logs').insert({ action: 'RULE_UPDATED', entity_type: 'rule', entity_id: ctx.params.id, metadata: payload });
  return NextResponse.json({ ok: true, rule: data });
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin(); const { error } = await supabase.from('rules').delete().eq('id', ctx.params.id);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('admin_audit_logs').insert({ action: 'RULE_DELETED', entity_type: 'rule', entity_id: ctx.params.id });
  return NextResponse.json({ ok: true });
}
