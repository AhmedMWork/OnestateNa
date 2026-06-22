import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
export async function GET(req: NextRequest) { return NextResponse.json({ ok: isAdmin(req) }); }
