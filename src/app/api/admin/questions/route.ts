import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const { searchParams } = new URL(req.url);
  const supabase = getSupabaseAdmin();
  let query = supabase.from('questions').select('*').order('application_type').order('order_index');
  const type = searchParams.get('type');
  if (type) query = query.eq('application_type', type);
  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, questions: data || [] });
}

export async function POST(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('questions').insert({
    application_type: body.application_type || 'ADMIN',
    faction_slug: body.faction_slug || null,
    section: body.section || 'أسئلة عامة',
    question_key: body.question_key || `q_${Date.now()}`,
    title: body.title,
    description: body.description || null,
    input_type: body.input_type || 'TEXTAREA',
    options: body.options || [],
    required: body.required ?? true,
    order_index: body.order_index || 999,
    weight: body.weight || 5,
    correct_answer: body.correct_answer ?? null,
    rubric_keywords: body.rubric_keywords || [],
    is_active: body.is_active ?? true
  }).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('audit_logs').insert({ action: 'QUESTION_CREATED', entity_type: 'question', entity_id: data.id, metadata: data });
  return NextResponse.json({ ok: true, question: data });
}
