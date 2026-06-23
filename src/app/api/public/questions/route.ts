export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'ADMIN';
  const faction = searchParams.get('faction') || '';
  const supabase = getSupabaseAdmin();
  let query = supabase.from('questions').select('id,application_type,faction_slug,section,question_key,title,description,input_type,options,required,order_index,is_active,helper_image').eq('is_active', true).or(`application_type.eq.ALL,application_type.eq.${type}`).order('order_index');
  if (faction) query = query.or(`faction_slug.is.null,faction_slug.eq.${faction}`); else query = query.is('faction_slug', null);
  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, questions: data || [] });
}
