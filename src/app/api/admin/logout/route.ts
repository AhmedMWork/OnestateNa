import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/admin-auth';
export async function POST() { clearSessionCookie(); return NextResponse.json({ ok: true }); }
