import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createApplication } from '@/lib/applications';
import { getClientIp, tooManyApplicationSubmissions } from '@/lib/request-guards';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  applicationType: z.enum(['ADMIN', 'FACTION_LEADER', 'FACTION_MEMBER']),
  factionSlug: z.string().nullable().optional(),
  answers: z.record(z.unknown()),
  deviceHash: z.string().nullable().optional(),
  screen: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  website: z.string().max(0).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const ip = getClientIp(req);
    if (await tooManyApplicationSubmissions(ip, body.deviceHash)) {
      return NextResponse.json({ ok: false, message: 'تم إرسال عدد كبير من الطلبات من نفس الجهاز أو الشبكة. حاول لاحقًا.' }, { status: 429 });
    }
    const result = await createApplication(body, { ip, userAgent: req.headers.get('user-agent') });
    return NextResponse.json({ ok: true, applicationNo: result.app.application_no, status: result.app.status, score: result.score });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error?.message || 'حدث خطأ أثناء إرسال الطلب' }, { status: 400 });
  }
}
