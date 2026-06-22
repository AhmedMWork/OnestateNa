# Vercel Node Warning Fix

تم حل تحذير Vercel الخاص بـ `engines.node`.

## سبب التحذير
كانت القيمة السابقة في `package.json`:

```json
"engines": {
  "node": ">=20.0.0"
}
```

هذه الصيغة تسمح لـ Vercel بالترقية تلقائيًا إلى أي إصدار Node رئيسي جديد مستقبلًا.

## التصحيح المطبق
تم تثبيت الإصدار على Node 20 فقط:

```json
"engines": {
  "node": "20.x"
}
```

وتم ترك `.nvmrc` على:

```txt
20
```

## المطلوب في Vercel
لا تحتاج لتغيير Build Command.

- Install Command: `npm ci`
- Build Command: `NEXT_PRIVATE_BUILD_WORKER=1 npm run build`
- Framework: Next.js
- Root Directory: جذر المشروع

## متغيرات البيئة المطلوبة
يجب إضافة المتغيرات التالية في Vercel قبل البناء النهائي:

```env
SUPABASE_URL=https://trbfdyohmwtlpjxbgjmk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ضع المفتاح السري الجديد بعد تدويره
ADMIN_PASSWORD=ضع باسورد قوي للوحة الأدمن
ADMIN_SESSION_SECRET=ضع سر طويل 64 حرف أو أكثر
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

لا تضع أي Secret داخل GitHub.

## ملاحظة عن outputFileTracing

تم إبقاء `outputFileTracing: false` في `next.config.mjs` لأن النسخة الحالية تبني بسرعة أكبر بهذا الإعداد على بيئات Serverless. قد يظهر تحذير من Next.js أنه لن يكون خيارًا دائمًا في إصدار رئيسي لاحق، لكنه لا يمنع النشر الحالي.
