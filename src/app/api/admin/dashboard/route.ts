export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const [{ data: apps }, { data: latest }, { data: flags }, { data: audit }] = await Promise.all([
    supabase.from('applications').select('id,status,application_type,faction_slug,priority,review_label,submitted_at'),
    supabase.from('applications').select('id,application_no,status,application_type,faction_slug,priority,review_label,rp_name,discord_username,client_id,submitted_at').order('submitted_at', { ascending: false }).limit(8),
    supabase.from('application_flags').select('id,severity'),
    supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(8)
  ]);
  const list = apps || [];
  const today = new Date(); today.setHours(0,0,0,0);
  const countBy = (key: string) => list.reduce((acc: any, r: any) => { const v = r[key] || 'none'; acc[v] = (acc[v] || 0) + 1; return acc; }, {});
  return NextResponse.json({ ok: true, dashboard: { total: list.length, today: list.filter((a: any) => new Date(a.submitted_at) >= today).length, flags: flags?.length || 0, byStatus: countBy('status'), byType: countBy('application_type'), byFaction: countBy('faction_slug'), latest: latest || [], audit: audit || [] } });
}
