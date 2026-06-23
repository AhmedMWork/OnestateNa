export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) {
  const blocked = requireAdmin(req); if (blocked) return blocked;
  const { searchParams } = new URL(req.url);
  const supabase = getSupabaseAdmin();
  let query = supabase.from('applications').select('*', { count: 'exact' }).order('submitted_at', { ascending: false });
  const status = searchParams.get('status'); const type = searchParams.get('type'); const faction = searchParams.get('faction'); const priority = searchParams.get('priority'); const q = searchParams.get('q');
  if (status) query = query.eq('status', status); if (type) query = query.eq('application_type', type); if (faction) query = query.eq('faction_slug', faction); if (priority) query = query.eq('priority', priority);
  if (q) query = query.or(`application_no.ilike.%${q}%,rp_name.ilike.%${q}%,discord_username.ilike.%${q}%,client_id.ilike.%${q}%`);
  const { data, error, count } = await query.limit(200);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, applications: data || [], count });
}
