import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('applications').select('application_no,application_type,faction_slug,status,score,risk_level,client_id,discord_username,rp_name,server_name,country,age,hours_available,submitted_at').order('submitted_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  const headers = ['application_no','application_type','faction_slug','status','score','risk_level','client_id','discord_username','rp_name','server_name','country','age','hours_available','submitted_at'];
  const csv = [headers.join(','), ...(data || []).map((row: any) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  return new NextResponse(csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="applications.csv"' } });
}
