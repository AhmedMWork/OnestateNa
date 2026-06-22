import { NextRequest, NextResponse } from 'next/server';
import { createAdminResponse, verifyPassword } from '@/lib/admin-auth';
import { getClientIp, tooManyAdminAttempts } from '@/lib/request-guards';
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (tooManyAdminAttempts(ip)) return NextResponse.json({ ok: false, message: 'محاولات كثيرة. حاول لاحقًا.' }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!verifyPassword(String(password || ''))) return NextResponse.json({ ok: false, message: 'كلمة المرور غير صحيحة أو غير مضبوطة في Environment Variables.' }, { status: 401 });
  return createAdminResponse();
}
