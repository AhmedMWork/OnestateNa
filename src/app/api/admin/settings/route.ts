import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const [{ data: settings }, { data: factions }] = await Promise.all([supabase.from('site_settings').select('*').limit(1).maybeSingle(), supabase.from('factions').select('*').order('order_index')]);
  return NextResponse.json({ ok: true, settings: settings || {}, factions: factions || [] });
}
export async function PATCH(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json(); const allowed = ['site_title','hero_title','hero_subtitle','applications_open','admin_applications_open','leader_applications_open','maintenance_mode','maintenance_message','tracking_open','resubmit_cooldown_days','success_message','privacy_notice'];
  const payload = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const supabase = getSupabaseAdmin(); const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
  const result = existing?.id ? await supabase.from('site_settings').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', existing.id).select('*').single() : await supabase.from('site_settings').insert(payload).select('*').single();
  if (result.error) return NextResponse.json({ ok: false, message: result.error.message }, { status: 400 });
  await supabase.from('admin_audit_logs').insert({ action: 'SETTINGS_UPDATED', entity_type: 'settings', metadata: payload });
  return NextResponse.json({ ok: true, settings: result.data });
}
