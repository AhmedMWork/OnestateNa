import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('blacklist').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 }); return NextResponse.json({ ok: true, blacklist: data || [] });
}
export async function POST(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json(); const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('blacklist').insert({ type: body.type, value: body.value, reason: body.reason || null, is_active: body.is_active ?? true }).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 }); return NextResponse.json({ ok: true, item: data });
}
