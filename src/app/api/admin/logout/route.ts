export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { clearAdminResponse } from '@/lib/admin-auth';
export async function POST() { return clearAdminResponse(); }
