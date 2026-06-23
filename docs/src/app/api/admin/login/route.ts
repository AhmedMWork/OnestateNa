export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminResponse, verifyPassword } from '@/lib/admin-auth';
import { getClientIp, tooManyAdminAttempts } from '@/lib/request-guards';
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (tooManyAdminAttempts(ip)) return NextResponse.json({ ok: false, message: 'محاولات كثيرة. حاول لاحقًا.' }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: '' }));
  const result = verifyPassword(String(password || ''));
  if (!result.ok && result.misconfigured) {
    console.error(`Control panel env missing or invalid: ${result.reason}`);
    return NextResponse.json({ ok: false, message: 'لوحة التحكم غير متاحة حاليًا.' }, { status: 503 });
  }
  if (!result.ok) return NextResponse.json({ ok: false, message: 'بيانات الدخول غير صحيحة.' }, { status: 401 });
  return createAdminResponse();
}
