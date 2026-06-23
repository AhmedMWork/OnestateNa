import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ضع القيم في .env.local أو Vercel Environment Variables.');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'onestaterp-enterprise-recruitment' } }
  });
}
