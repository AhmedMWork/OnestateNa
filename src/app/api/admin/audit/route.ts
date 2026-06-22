import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase';
export async function GET(req: NextRequest) { const blocked = requireAdmin(req); if (blocked) return blocked; const supabase = getSupabaseAdmin(); const { data, error } = await supabase.from('admin_audit_logs').select('*').order('created_at', { ascending: false }).limit(150); if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 }); return NextResponse.json({ ok: true, audit: data || [] }); }
