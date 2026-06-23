export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  return NextResponse.json({ ok: true, settings: data || {} });
}
