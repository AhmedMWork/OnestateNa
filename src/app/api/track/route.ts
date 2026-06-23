export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeHandle } from '@/lib/crypto';
const schema = z.object({ applicationNo: z.string().min(4), verifier: z.string().min(2) });
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ ok: false, message: 'بيانات غير مكتملة' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { applicationNo, verifier } = parsed.data;
  const { data, error } = await supabase.from('applications').select('application_no,status,application_type,faction_slug,submitted_at,discord_username,client_id,rp_name').eq('application_no', applicationNo.trim().toUpperCase()).maybeSingle();
  if (error || !data) return NextResponse.json({ ok: false, message: 'لم يتم العثور على الطلب' }, { status: 404 });
  const v = normalizeHandle(verifier);
  const ok = normalizeHandle(data.discord_username) === v || String(data.client_id || '').toLowerCase() === v || String(data.rp_name || '').trim().toLowerCase() === v;
  if (!ok) return NextResponse.json({ ok: false, message: 'بيانات التحقق لا تطابق الطلب' }, { status: 403 });
  return NextResponse.json({ ok: true, application: { application_no: data.application_no, status: data.status, application_type: data.application_type, faction_slug: data.faction_slug, submitted_at: data.submitted_at } });
}
