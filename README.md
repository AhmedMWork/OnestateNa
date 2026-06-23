# OneState NA Recruitment Portal

بوابة تقديم مخصصة فقط لمسارين:

1. التقديم على الفريق الإداري.
2. التقديم على قائد فصيل: الشرطة / الجيش / الطبي.

الواجهة العامة لا تعرض أي معلومات تقنية ولا تعرض رابط لوحة التحكم. لوحة الإدارة على المسار:

```txt
/control
```

## التشغيل المحلي

```bash
yarn install --frozen-lockfile --non-interactive --network-timeout 1200000 --registry https://registry.npmjs.org/
yarn dev
```

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` محليًا، وأضف نفس القيم في Vercel Environment Variables:

```env
SUPABASE_URL=https://trbfdyohmwtlpjxbgjmk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ضع_المفتاح_السري_الجديد
ADMIN_PASSWORD=باسورد_قوي_لا_يقل_عن_8_أحرف
ADMIN_SESSION_SECRET=سر_طويل_64_حرف_أو_أكثر
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

> لا ترفع `.env.local` ولا أي Secret إلى GitHub.

## إعداد Supabase

افتح Supabase SQL Editor وشغّل بالترتيب:

```txt
supabase/migrations/001_init_schema.sql
supabase/migrations/002_indexes_and_rls.sql
supabase/seed.sql
```

## إعداد Vercel

```txt
Framework Preset: Next.js
Root Directory: .
Node.js Version: 20.x
Install Command: yarn install --frozen-lockfile --non-interactive --network-timeout 1200000 --registry https://registry.npmjs.org/
Build Command: NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_BUILD_WORKER=1 yarn build
```

بعد الرفع: استخدم `Redeploy without Build Cache`.

## المسارات العامة

```txt
/
/apply
/apply/admin
/apply/leader
/track
```

## مسار الإدارة

```txt
/control
```

لو ظهر عند الدخول إلى `/control` نص: "لوحة التحكم غير متاحة حاليًا"، فالمشكلة في متغيرات البيئة الخاصة بلوحة التحكم، خصوصًا `ADMIN_PASSWORD` أو `ADMIN_SESSION_SECRET`.

## فحص قبل النشر

```bash
node scripts/verify-locks.mjs
yarn typecheck
yarn build
```

