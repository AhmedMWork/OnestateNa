import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('factions').select('*').eq('is_visible', true).order('order_index');
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, factions: data || [] });
}
