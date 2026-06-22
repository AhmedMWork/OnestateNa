import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json();
  const supabase = getSupabaseAdmin();
  const allowed = ['application_type','faction_slug','section','question_key','title','description','input_type','options','required','order_index','weight','correct_answer','rubric_keywords','is_active'];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) if (key in body) update[key] = body[key];
  const { data, error } = await supabase.from('questions').update(update).eq('id', ctx.params.id).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('audit_logs').insert({ action: 'QUESTION_UPDATED', entity_type: 'question', entity_id: ctx.params.id, metadata: update });
  return NextResponse.json({ ok: true, question: data });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('questions').delete().eq('id', ctx.params.id);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('audit_logs').insert({ action: 'QUESTION_DELETED', entity_type: 'question', entity_id: ctx.params.id });
  return NextResponse.json({ ok: true });
}
