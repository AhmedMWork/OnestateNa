import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const category = searchParams.get('category') || '';
  const supabase = getSupabaseAdmin();
  let query = supabase.from('rules').select('*').order('category').order('order_index');
  if (category) query = query.eq('category', category);
  if (q) query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%,code.ilike.%${q}%`);
  const { data, error } = await query.limit(250);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rules: data || [] });
}
