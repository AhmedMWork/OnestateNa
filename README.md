# OneState RP Recruitment Portal

منصة عربية كاملة للتقديم على إدارة OneState RP وقادة الفصائل، مع لوحة أدمن، تقييم تلقائي، كشف تكرار، وإدارة أسئلة وقوانين.

## المميزات المنفذة

- واجهة عربية RTL بالكامل بتصميم Gaming Dark / Gold / Silver.
- شاشة تحميل أولية مشابهة لروح الموقع الأساسي.
- صفحة رئيسية، صفحة تقديم، صفحة متابعة طلب، صفحة قوانين، ولوحة أدمن.
- تقديم بدون تسجيل دخول للمستخدمين.
- اختيار نوع التقديم: إدارة أو قائد فصيل.
- عند اختيار قائد فصيل: تحديد الشرطة أو الجيش أو التحالف الطبي.
- توضيح Client ID وDiscord بصورتين داخل نموذج التقديم.
- بنك أسئلة ديناميكي من Supabase.
- الأدمن يستطيع إضافة وتعديل وحذف الأسئلة.
- الأدمن يستطيع مراجعة الطلبات، تغيير الحالة، إضافة ملاحظات وسبب القرار.
- تقييم تلقائي للأسئلة المغلقة والمفتوحة باستخدام Rubric Keywords.
- كشف تكرار باستخدام Client ID وDiscord واسم RP وIP Hash وبصمة الجهاز.
- مكتبة قوانين قابلة للبحث مبنية من ملف القوانين المرفق.
- تصدير الطلبات CSV.
- حماية الأدمن بكلمة مرور فقط عبر Session Cookie موقعة.

## التشغيل المحلي

1. انسخ الملف `.env.example` إلى `.env.local`.
2. ضع بيانات Supabase:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. ضع كلمة مرور قوية في `ADMIN_PASSWORD`.
4. ضع سر طويل في `ADMIN_SESSION_SECRET`.
5. افتح Supabase SQL Editor وشغل:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
6. ثبّت الحزم وشغّل المشروع:

```bash
npm install
npm run dev
```

## النشر على Vercel

1. ارفع المشروع على GitHub.
2. اربطه بـ Vercel.
3. أضف Environment Variables نفسها الموجودة في `.env.example`.
4. شغّل ملفات SQL في Supabase قبل فتح الموقع.
5. Deploy.

## الصفحات

- `/` الصفحة الرئيسية.
- `/apply` التقديم.
- `/rules` القوانين.
- `/track` متابعة الطلب.
- `/admin` لوحة الإدارة.

## ملاحظات أمنية مهمة

- لا تستخدم `SUPABASE_SERVICE_ROLE_KEY` في أي كود Client. المشروع الحالي يستخدمه فقط داخل Route Handlers على السيرفر.
- غيّر `ADMIN_PASSWORD` و `ADMIN_SESSION_SECRET` قبل النشر.
- لا تترك كلمة المرور الافتراضية.
- يفضل إضافة Cloudflare Turnstile لاحقًا إذا زاد الـ Spam.

## الملفات المصدرية المرفقة

- `docs/onestate-rules-source.docx`
- `docs/OneState_RP_Rules.xlsx`

هذه الملفات محفوظة داخل المشروع كمرجع للإدارة ويمكن حذفها من النسخة العامة إذا رغبت الشركة.


## Vercel Final Fix

هذه النسخة لا تستخدم `npm ci` ولا تحتوي على `package-lock.json` لتجنب خطأ npm على Vercel.

إعدادات Vercel المطلوبة:

- Root Directory: `.`
- Framework: Next.js
- Install Command: من `vercel.json`
- Build Command: من `vercel.json`
- Node.js Version: استخدم إعدادات Vercel Project Settings، ولا يوجد `engines` داخل `package.json`.

لو رفعت المشروع داخل مجلد اسمه `Onestaterp` داخل GitHub، اجعل Root Directory في Vercel = `Onestaterp`. الأفضل أن يكون `package.json` في جذر الريبو مباشرة.

راجع: `docs/VERCEL_FINAL_FIX.md`.
