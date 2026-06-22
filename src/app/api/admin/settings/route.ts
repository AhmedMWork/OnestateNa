import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const [{ data: settings }, { data: factions }, { data: announcements }] = await Promise.all([
    supabase.from('app_settings').select('*').limit(1).single(),
    supabase.from('factions').select('*').order('order_index'),
    supabase.from('announcements').select('*').order('created_at', { ascending: false })
  ]);
  return NextResponse.json({ ok: true, settings, factions: factions || [], announcements: announcements || [] });
}
export async function PATCH(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json();
  const supabase = getSupabaseAdmin();
  const { data: settings } = await supabase.from('app_settings').select('id').limit(1).single();
  const payload = { ...body, updated_at: new Date().toISOString() };
  const { data, error } = settings?.id
    ? await supabase.from('app_settings').update(payload).eq('id', settings.id).select('*').single()
    : await supabase.from('app_settings').insert(payload).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('audit_logs').insert({ action: 'SETTINGS_UPDATED', entity_type: 'settings', metadata: payload });
  return NextResponse.json({ ok: true, settings: data });
}
