export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('questions').select('*').order('order_index');
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, questions: data || [] });
}
export async function POST(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json(); const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('questions').insert({
    application_type: body.application_type || 'ALL', faction_slug: body.faction_slug || null, section: body.section || 'البيانات الأساسية', question_key: body.question_key, title: body.title, description: body.description || null, input_type: body.input_type || 'TEXT', options: body.options || [], required: body.required ?? true, order_index: body.order_index || 999, is_active: body.is_active ?? true, helper_image: body.helper_image || null
  }).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('admin_audit_logs').insert({ action: 'QUESTION_CREATED', entity_type: 'question', entity_id: data.id, metadata: data });
  return NextResponse.json({ ok: true, question: data });
}
