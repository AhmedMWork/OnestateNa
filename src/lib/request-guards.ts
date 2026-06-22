import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from './supabase';
import { hashPII } from './crypto';

export function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

export function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

export async function tooManyAdminLoginAttempts(ip: string) {
  const supabase = getSupabaseAdmin();
  const ipHash = hashPII(ip);
  const { count, error } = await supabase
    .from('admin_login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('success', false)
    .gt('created_at', minutesAgo(15));
  if (error) return false;
  return (count || 0) >= 8;
}

export async function tooManyApplicationSubmissions(ip: string, deviceHash?: string | null) {
  const supabase = getSupabaseAdmin();
  const ipHash = hashPII(ip);
  const deviceHashServer = deviceHash ? hashPII(deviceHash) : null;
  const { count: byIp } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gt('submitted_at', minutesAgo(60));
  if ((byIp || 0) >= 5) return true;
  if (deviceHashServer) {
    const { count: byDevice } = await supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('device_hash', deviceHashServer)
      .gt('submitted_at', minutesAgo(60));
    if ((byDevice || 0) >= 3) return true;
  }
  return false;
}
