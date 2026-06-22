import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie } from '@/lib/admin-auth';
import { hashPII, safeEqual } from '@/lib/crypto';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
  const supabase = getSupabaseAdmin();
  const expected = process.env.ADMIN_PASSWORD || 'admin';
  const ok = typeof password === 'string' && safeEqual(password, expected);
  await supabase.from('admin_login_attempts').insert({ ip_hash: hashPII(ip), success: ok, user_agent: req.headers.get('user-agent') });
  if (!ok) return NextResponse.json({ ok: false, message: 'كلمة المرور غير صحيحة' }, { status: 401 });
  createSessionCookie();
  await supabase.from('audit_logs').insert({ action: 'ADMIN_LOGIN', entity_type: 'admin', metadata: { ipHash: hashPII(ip) } });
  return NextResponse.json({ ok: true });
}
