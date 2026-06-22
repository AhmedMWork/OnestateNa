import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const [{ data: apps }, { data: latest }, { data: flags }] = await Promise.all([
    supabase.from('applications').select('id,status,application_type,faction_slug,score,risk_level,submitted_at'),
    supabase.from('applications').select('id,application_no,status,application_type,faction_slug,score,risk_level,rp_name,discord_username,submitted_at').order('submitted_at', { ascending: false }).limit(10),
    supabase.from('duplicate_flags').select('id,severity')
  ]);
  const applications = apps || [];
  const byStatus = applications.reduce((acc: Record<string, number>, item: any) => { acc[item.status] = (acc[item.status] || 0) + 1; return acc; }, {});
  const byType = applications.reduce((acc: Record<string, number>, item: any) => { acc[item.application_type] = (acc[item.application_type] || 0) + 1; return acc; }, {});
  const byFaction = applications.reduce((acc: Record<string, number>, item: any) => { const key = item.faction_slug || 'admin'; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const today = new Date(); today.setHours(0,0,0,0);
  const todayCount = applications.filter((a: any) => new Date(a.submitted_at) >= today).length;
  const avgScore = applications.length ? Math.round(applications.reduce((s: number, a: any) => s + Number(a.score || 0), 0) / applications.length) : 0;
  return NextResponse.json({ ok: true, dashboard: { total: applications.length, today: todayCount, avgScore, duplicateFlags: flags?.length || 0, byStatus, byType, byFaction, latest: latest || [] } });
}
