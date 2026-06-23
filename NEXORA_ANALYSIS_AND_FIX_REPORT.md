# تقرير فحص Nexora وتطبيق طريقة النشر على Onestaterp

## نتيجة الفحص

ملف Nexora يستخدم طريقة نشر مستقرة على Vercel تعتمد على:

1. Registry عام ثابت داخل `.npmrc`.
2. إصدار Node محدد عبر `.nvmrc` و `.node-version`.
3. أمر تثبيت صريح داخل `vercel.json`.
4. ملف lock نظيف لا يحتوي على روابط داخلية.
5. جذر مشروع واضح يحتوي على `package.json` مباشرة.

## سبب المشكلة في Onestaterp

كان `yarn.lock` في إحدى النسخ السابقة يحتوي على روابط تحميل داخلية من بيئة البناء، مثل:

`packages.applied-caas-gateway...`

وهذه الروابط لا يستطيع Vercel الوصول إليها، لذلك كان يفشل في مرحلة تثبيت الحزم قبل أن يبدأ Build.

## ما تم تطبيقه

- الحفاظ على المشروع كـ Full Next.js + Supabase.
- تثبيت Yarn Classic كمدير حزم واحد.
- تثبيت Node على 20.19.0.
- إجبار Vercel على التحميل من registry.npmjs.org فقط.
- إضافة `.npmrc` و `.yarnrc` على طريقة Nexora.
- إضافة فحص تلقائي `scripts/verify-locks.mjs`.
- حذف أي package-lock أو pnpm-lock أو bun lock.
- تحديث `vercel.json` بأوامر نشر مستقرة.

## أمر الفحص قبل الرفع

```bash
node scripts/verify-locks.mjs
```

## إعدادات Vercel النهائية

Install Command:

```bash
yarn install --frozen-lockfile --non-interactive --network-timeout 1200000 --registry https://registry.npmjs.org/
```

Build Command:

```bash
NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_BUILD_WORKER=1 yarn build
```

Node.js Version: 20.x
