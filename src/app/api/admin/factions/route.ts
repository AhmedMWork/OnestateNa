export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('factions').select('*').order('order_index');
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 }); return NextResponse.json({ ok: true, factions: data || [] });
}
export async function POST(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const body = await req.json(); const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('factions').insert({ slug: body.slug, name_ar: body.name_ar, description_ar: body.description_ar || null, requirements_ar: body.requirements_ar || null, icon_name: body.icon_name || 'Shield', is_open: body.is_open ?? true, is_visible: body.is_visible ?? true, order_index: body.order_index || 999 }).select('*').single();
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 400 }); return NextResponse.json({ ok: true, faction: data });
}
