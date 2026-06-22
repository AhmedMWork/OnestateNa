import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const [{ data: settings }, { data: factions }, { data: announcements }] = await Promise.all([
    supabase.from('app_settings').select('*').limit(1).maybeSingle(),
    supabase.from('factions').select('*').order('order_index'),
    supabase.from('announcements').select('*').order('created_at', { ascending: false })
  ]);
  return NextResponse.json({ ok: true, settings, factions: factions || [], announcements: announcements || [] });
}

export async function PATCH(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json();
  const allowed = ['site_title', 'applications_open', 'admin_applications_open', 'leader_applications_open', 'maintenance_mode', 'privacy_notice'];
  const payload = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  const supabase = getSupabaseAdmin();
  const { data: settings } = await supabase.from('app_settings').select('id').limit(1).maybeSingle();
  const updatePayload = { ...payload, updated_at: new Date().toISOString() };
  const { data, error } = settings?.id
    ? await supabase.from('app_settings').update(updatePayload).eq('id', settings.id).select('*').single()
    : await supabase.from('app_settings').insert(updatePayload).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('audit_logs').insert({ action: 'SETTINGS_UPDATED', entity_type: 'settings', metadata: updatePayload });
  return NextResponse.json({ ok: true, settings: data });
}
