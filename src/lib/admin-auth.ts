import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'onestaterp_admin_session';
const TTL_MS = 1000 * 60 * 60 * 12;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) return 'development-session-secret-change-this-value-now';
  return s;
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

export function verifyPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword === 'admin' || adminPassword.length < 8) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(adminPassword);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createAdminResponse() {
  const expires = Date.now() + TTL_MS;
  const payload = `admin.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: Math.floor(TTL_MS / 1000),
    path: '/'
  });
  return res;
}

export function clearAdminResponse() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

export function isAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  if (expected !== parts[2]) return false;
  const expires = Number(parts[1]);
  return Number.isFinite(expires) && expires > Date.now();
}

export function requireAdmin(req: NextRequest) {
  if (isAdmin(req)) return null;
  return NextResponse.json({ ok: false, message: 'غير مصرح' }, { status: 401 });
}
