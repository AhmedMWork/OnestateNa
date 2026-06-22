import crypto from 'crypto';

const HASH_SECRET = process.env.ADMIN_SESSION_SECRET || 'development-only-secret-change-me';

export function hashValue(value?: string | null) {
  if (!value) return null;
  return crypto.createHmac('sha256', HASH_SECRET).update(String(value).trim().toLowerCase()).digest('hex');
}

export function normalizeHandle(value?: string | null) {
  return String(value || '').trim().toLowerCase().replace(/^@/, '');
}

export function makeApplicationNo() {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `OS-${year}-${random}`;
}

export function safeText(value: unknown) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
