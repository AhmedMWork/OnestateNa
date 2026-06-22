# Onestaterp Recruitment Portal V2 Enterprise

منصة عربية احترافية للتقديم على الإدارة وقادة الفصائل في OneState RP، مبنية باستخدام:

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Supabase PostgreSQL
- Vercel Deployment

## أهم المميزات

- واجهة عربية RTL فاخرة بمستوى Gaming/Cinematic.
- Loading screen وanimations وicons حقيقية بدون emojis.
- تقديم بدون تسجيل دخول.
- اختيار التقديم على الإدارة أو قائد فصيل.
- اختيار فصيل الشرطة أو الجيش أو التحالف الطبي.
- صور توضيحية لـ Client ID وDiscord داخل النموذج.
- حفظ مؤقت للنموذج أثناء الكتابة.
- متابعة حالة الطلب برقم الطلب.
- لوحة أدمن محمية بباسورد فقط.
- إدارة كاملة للطلبات.
- إدارة الأسئلة إضافة وتعديل وحذف وتفعيل وتعطيل.
- إدارة القوانين إضافة وتعديل وحذف وتفعيل وتعطيل.
- إدارة الفصائل وفتح/غلق التقديم.
- إعدادات الموقع.
- Blacklist.
- Audit logs.
- إلغاء نظام النقاط بالكامل واستبداله بمراجعة إدارية وFlags.
- لا يوجد Discord webhook أو ربط خارجي.

## التشغيل المحلي

```bash
npm ci
cp .env.example .env.local
npm run dev
```

افتح:

```txt
http://localhost:3000
```

لوحة الأدمن:

```txt
http://localhost:3000/admin
```

## Environment Variables

```env
SUPABASE_URL="https://trbfdyohmwtlpjxbgjmk.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="ضع المفتاح في Vercel فقط ولا ترفعه إلى GitHub"
ADMIN_PASSWORD="باسورد قوي"
ADMIN_SESSION_SECRET="سر طويل عشوائي 64 حرف أو أكثر"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Supabase

اتبع ملف:

```txt
supabase/README_SUPABASE.md
```

وشغل:

1. `supabase/migrations/001_init_schema.sql`
2. `supabase/migrations/002_indexes_and_rls.sql`
3. `supabase/seed.sql`

## Vercel

- Framework: Next.js
- Install Command: `npm ci`
- Build Command: `npm run build`
- Root Directory: جذر المشروع
- أضف Environment Variables من لوحة Vercel

## GitHub

الملف جاهز للرفع مباشرة. لا ترفع `.env.local` أو أي secret key.
