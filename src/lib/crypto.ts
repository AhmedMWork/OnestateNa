import crypto from 'node:crypto';

const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dev-secret-change-me';

export function hmac(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function hashPII(value: string | null | undefined) {
  if (!value) return null;
  return hmac(value.trim().toLowerCase()).slice(0, 64);
}

export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export function randomCode(bytes = 8) {
  return crypto.randomBytes(bytes).toString('hex').toUpperCase();
}

export function canonicalText(value: unknown) {
  if (Array.isArray(value)) return value.map(String).join(', ').trim();
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value).trim();
}

export function normalizeHandle(value: string) {
  return value.trim().replace(/^@/, '').toLowerCase();
}
