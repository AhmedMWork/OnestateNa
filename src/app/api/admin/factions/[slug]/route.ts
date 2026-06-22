import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
type Ctx = { params: { slug: string } };
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json(); const allowed = ['name_ar','description_ar','requirements_ar','icon_name','is_open','is_visible','order_index'];
  const payload = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('factions').update({ ...payload, updated_at: new Date().toISOString() }).eq('slug', ctx.params.slug).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('admin_audit_logs').insert({ action: 'FACTION_UPDATED', entity_type: 'faction', entity_id: data.id, metadata: payload });
  return NextResponse.json({ ok: true, faction: data });
}
