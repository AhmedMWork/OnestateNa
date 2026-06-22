import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createApplication } from '@/lib/applications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  applicationType: z.enum(['ADMIN', 'FACTION_LEADER', 'FACTION_MEMBER']),
  factionSlug: z.string().nullable().optional(),
  answers: z.record(z.unknown()),
  deviceHash: z.string().nullable().optional(),
  screen: z.string().nullable().optional(),
  timezone: z.string().nullable().optional()
});

function getIp(req: NextRequest) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]?.trim();
  return req.headers.get('x-real-ip') || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const result = await createApplication(body, { ip: getIp(req), userAgent: req.headers.get('user-agent') });
    return NextResponse.json({ ok: true, applicationNo: result.app.application_no, status: result.app.status, score: result.score });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error?.message || 'حدث خطأ أثناء إرسال الطلب' }, { status: 400 });
  }
}
