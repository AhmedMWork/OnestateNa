import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'onestate_control_session';
const TTL_MS = 1000 * 60 * 60 * 12;

export function adminConfigStatus() {
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!password || password === 'admin' || password.length < 8) return { ok: false, reason: 'ADMIN_PASSWORD' as const };
  if (!sessionSecret || sessionSecret.length < 32) return { ok: false, reason: 'ADMIN_SESSION_SECRET' as const };
  return { ok: true, reason: null };
}

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) return 'development-session-secret-change-this-value-now';
  return s;
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex');
}

export function verifyPassword(password: string) {
  const status = adminConfigStatus();
  if (!status.ok) return { ok: false, misconfigured: true, reason: status.reason };
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const a = Buffer.from(password);
  const b = Buffer.from(adminPassword);
  if (a.length !== b.length) return { ok: false, misconfigured: false, reason: 'INVALID' as const };
  return { ok: crypto.timingSafeEqual(a, b), misconfigured: false, reason: 'INVALID' as const };
}

export function createAdminResponse() {
  const expires = Date.now() + TTL_MS;
  const payload = `control.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: Math.floor(TTL_MS / 1000), path: '/' });
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
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))) return false;
  const expires = Number(parts[1]);
  return Number.isFinite(expires) && expires > Date.now();
}

export function requireAdmin(req: NextRequest) {
  if (isAdmin(req)) return null;
  return NextResponse.json({ ok: false, message: 'غير مصرح' }, { status: 401 });
}
