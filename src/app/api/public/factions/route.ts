export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { DEFAULT_FACTIONS } from '@/lib/fallback-data';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('factions').select('*').eq('is_visible', true).order('order_index');
    if (error) throw error;
    return NextResponse.json({ ok: true, factions: data?.length ? data : DEFAULT_FACTIONS });
  } catch {
    return NextResponse.json({ ok: true, fallback: true, factions: DEFAULT_FACTIONS });
  }
}
