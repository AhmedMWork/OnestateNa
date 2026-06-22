import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const [factions, questions, rules] = await Promise.all([
    supabase.from('factions').select('id', { count: 'exact', head: true }),
    supabase.from('questions').select('id', { count: 'exact', head: true }),
    supabase.from('rules').select('id', { count: 'exact', head: true })
  ]);
  return NextResponse.json({ ok: true, counts: { factions: factions.count || 0, questions: questions.count || 0, rules: rules.count || 0 } });
}
