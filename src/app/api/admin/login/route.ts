import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie } from '@/lib/admin-auth';
import { hashPII, safeEqual } from '@/lib/crypto';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getClientIp, tooManyAdminLoginAttempts } from '@/lib/request-guards';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function configuredAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === 'admin' || password === 'change-this-strong-password') {
    if (process.env.NODE_ENV === 'production') throw new Error('ADMIN_PASSWORD is not configured safely');
    return password || 'admin';
  }
  return password;
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  const ip = getClientIp(req);
  const supabase = getSupabaseAdmin();

  if (await tooManyAdminLoginAttempts(ip)) {
    await supabase.from('admin_login_attempts').insert({ ip_hash: hashPII(ip), success: false, user_agent: req.headers.get('user-agent') });
    return NextResponse.json({ ok: false, message: 'تم إيقاف المحاولات مؤقتًا. حاول مرة أخرى بعد 15 دقيقة.' }, { status: 429 });
  }

  let expected = '';
  try {
    expected = configuredAdminPassword();
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  const ok = typeof password === 'string' && safeEqual(password, expected);
  await supabase.from('admin_login_attempts').insert({ ip_hash: hashPII(ip), success: ok, user_agent: req.headers.get('user-agent') });
  if (!ok) return NextResponse.json({ ok: false, message: 'كلمة المرور غير صحيحة' }, { status: 401 });

  createSessionCookie();
  await supabase.from('audit_logs').insert({ action: 'ADMIN_LOGIN', entity_type: 'admin', metadata: { ipHash: hashPII(ip) } });
  return NextResponse.json({ ok: true });
}
