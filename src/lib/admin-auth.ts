import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { hmac, safeEqual } from './crypto';

const COOKIE_NAME = 'os_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 12;

type AdminSession = { role: 'admin'; iat: number; exp: number };

function b64(data: string) {
  return Buffer.from(data).toString('base64url');
}
function unb64(data: string) {
  return Buffer.from(data, 'base64url').toString('utf8');
}

export function signSession(payload: AdminSession) {
  const body = b64(JSON.stringify(payload));
  const sig = hmac(body);
  return `${body}.${sig}`;
}

export function verifySessionToken(token?: string | null): AdminSession | null {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig || !safeEqual(hmac(body), sig)) return null;
  try {
    const payload = JSON.parse(unb64(body)) as AdminSession;
    if (payload.role !== 'admin') return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionCookie() {
  const now = Date.now();
  const token = signSession({ role: 'admin', iat: now, exp: now + MAX_AGE_SECONDS * 1000 });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export function isAdminRequest(req?: NextRequest) {
  const token = req ? req.cookies.get(COOKIE_NAME)?.value : cookies().get(COOKIE_NAME)?.value;
  return Boolean(verifySessionToken(token));
}

export function requireAdmin(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, message: 'غير مصرح بالدخول' }, { status: 401 });
  }
  return null;
}
