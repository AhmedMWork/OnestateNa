import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('rules').select('*').order('category').order('order_index').limit(1000);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rules: data || [] });
}

export async function POST(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('rules').insert({
    category: body.category || 'عام', code: body.code || null, title: body.title, body: body.body || '', penalty: body.penalty || null, severity: body.severity || 'MEDIUM', tags: body.tags || [], order_index: body.order_index || 999
  }).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  await supabase.from('audit_logs').insert({ action: 'RULE_CREATED', entity_type: 'rule', entity_id: data.id, metadata: data });
  return NextResponse.json({ ok: true, rule: data });
}
