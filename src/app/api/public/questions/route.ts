import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'ADMIN';
  const faction = searchParams.get('faction') || '';
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('questions')
    .select('id, application_type, faction_slug, section, question_key, title, description, input_type, options, required, order_index, weight, is_active')
    .eq('application_type', type)
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  if (faction) query = query.or(`faction_slug.is.null,faction_slug.eq.${faction}`);
  else query = query.is('faction_slug', null);
  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, questions: data || [] });
}
