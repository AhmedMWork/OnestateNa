import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getSupabaseAdmin();
  const [{ data: settings }, { data: announcements }] = await Promise.all([
    supabase.from('app_settings').select('*').limit(1).single(),
    supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(3)
  ]);
  return NextResponse.json({ ok: true, settings: settings || {}, announcements: announcements || [] });
}
