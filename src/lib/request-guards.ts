import { NextRequest } from 'next/server';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const item = buckets.get(key);
  if (!item || item.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  item.count += 1;
  return item.count > limit;
}

export function tooManyAdminAttempts(ip: string) {
  return rateLimit(`admin:${ip}`, 8, 10 * 60 * 1000);
}

export function tooManyApplicationSubmissions(ip: string, device?: string | null) {
  return rateLimit(`apply:${ip}:${device || 'none'}`, 5, 60 * 60 * 1000);
}
