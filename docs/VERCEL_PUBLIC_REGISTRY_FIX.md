# Vercel Public Registry Fix

تم إصلاح سبب فشل التثبيت على Vercel.

## سبب المشكلة

كان ملف `yarn.lock` يحتوي على روابط tarball داخلية من بيئة البناء السابقة، وهذه الروابط لا يمكن لـ Vercel الوصول إليها، لذلك ظهر خطأ `ETIMEDOUT` أثناء تحميل الحزم.

## الإصلاح

- تم استبدال كل روابط الـ resolved داخل `yarn.lock` إلى `https://registry.npmjs.org/`.
- تمت إضافة `.yarnrc` لتثبيت registry العام.
- تمت إضافة `.npmrc` كضمان إضافي للـ registry العام.
- تم تحديث `vercel.json` ليستخدم Yarn مع registry عام وnetwork timeout أطول.

## أمر التثبيت المتوقع على Vercel

```bash
yarn install --frozen-lockfile --non-interactive --network-timeout 900000 --registry https://registry.npmjs.org/
```

إذا ظهر في Log رابط داخلي غير `registry.npmjs.org` فهذا يعني أن GitHub لم يستقبل النسخة المصححة أو أن Vercel يبني Commit قديم.
