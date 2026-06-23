# Onestaterp Enterprise Stable

منصة عربية كاملة لتقديمات إدارة وفصائل OneState RP، مبنية بـ Next.js وSupabase، وجاهزة للنشر على GitHub + Vercel باستخدام Yarn Classic لتجنب مشاكل npm/pnpm التي ظهرت سابقًا في مرحلة install.

## المزايا الأساسية

- واجهة عربية RTL بتصميم Dark / Gold / Silver.
- صفحات عامة: الرئيسية، التقديم، القوانين، متابعة الطلب، الأسئلة الشائعة، الخصوصية، الشروط.
- Form Wizard للتقديم على الإدارة أو قائد فصيل.
- اختيار فصائل: الشرطة، الجيش، التحالف الطبي.
- صور توضيحية لـ Client ID وDiscord داخل نموذج التقديم.
- لوحة أدمن كاملة محمية بباسورد فقط.
- إدارة الطلبات والحالات والملاحظات والقرارات.
- إدارة الأسئلة إضافة وتعديل وحذف وتفعيل وتعطيل.
- إدارة القوانين إضافة وتعديل وحذف وتفعيل وتعطيل.
- إدارة الفصائل وفتح/غلق التقديم لكل فصيل.
- إعدادات الموقع العامة من لوحة الأدمن.
- Blacklist حسب Client ID أو Discord أو RP Name أو IP Hash أو Device Hash.
- Audit Logs لحركات الأدمن.
- لا يوجد Discord Webhook أو أي ربط خارجي.
- لا يوجد نظام نقاط رقمي؛ النظام يعتمد على مراجعة إدارية نوعية.

## لماذا Yarn؟

تم اعتماد Yarn Classic 1.22.22 لأن مشاكل Vercel السابقة حدثت قبل مرحلة Build أثناء npm/pnpm install. هذه النسخة تحتوي على `yarn.lock` فقط، ولا تحتوي على `package-lock.json` أو `pnpm-lock.yaml`.

## التشغيل المحلي

```bash
yarn install --frozen-lockfile --non-interactive
yarn dev
```

## اختبار الإنتاج محليًا

```bash
yarn typecheck
NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_BUILD_WORKER=1 yarn build
```

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` محليًا، وأضف نفس القيم في Vercel Environment Variables.

```env
SUPABASE_URL=https://trbfdyohmwtlpjxbgjmk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ضع_المفتاح_السري_الجديد_هنا
ADMIN_PASSWORD=ضع_باسورد_قوي
ADMIN_SESSION_SECRET=ضع_سر_طويل_64_حرف_أو_أكثر
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

لا ترفع `.env.local` إلى GitHub.

## إعداد Supabase

افتح Supabase SQL Editor وشغل بالترتيب:

1. `supabase/migrations/001_init_schema.sql`
2. `supabase/migrations/002_indexes_and_rls.sql`
3. `supabase/seed.sql`

## إعداد Vercel النهائي

في Vercel:

- Framework Preset: `Next.js`
- Root Directory: `.`
- Node.js Version: `20.x` أو اتركه على إعداد المشروع، مع تفضيل 20.x.
- Install Command: اتركه فارغًا ليقرأ من `vercel.json` أو اجعله:

```bash
yarn install --frozen-lockfile --non-interactive
```

- Build Command: اتركه فارغًا ليقرأ من `vercel.json` أو اجعله:

```bash
yarn build
```

ثم استخدم: `Redeploy without Build Cache`.

## مهم جدًا

لو ظهر في Vercel أي أمر `npm install` أو `pnpm install`، فهذا يعني أن إعدادات Vercel القديمة ما زالت مفروضة من Dashboard أو أن الريبو لا يحتوي على النسخة الجديدة. امسح Install Command يدويًا أو اجعله Yarn كما في الأعلى.

## مسارات مهمة

- الموقع: `/`
- التقديم: `/apply`
- القوانين: `/rules`
- متابعة الطلب: `/track`
- الأدمن: `/admin`

## مصادر المشروع

- `docs/OneState_RP_Rules.xlsx`
- `docs/onestate-rules-source.docx`
- `public/images/client-id-guide.jpg`
- `public/images/discord-guide.jpg`
