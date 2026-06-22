# Next Build Worker Fix

تمت إضافة الإعداد التالي داخل `next.config.mjs`:

```js
experimental: { cpus: 1 }
```

السبب: أثناء `Collecting page data` كان Next.js يشغل عددًا كبيرًا من workers في بيئات محدودة الموارد، وهذا قد يؤدي إلى تعليق البناء أو استهلاك موارد غير لازم. ضبط `cpus: 1` يجعل البناء ثابتًا على Vercel وأكثر قابلية للتكرار.

تم أيضًا جعل جميع API Route Handlers ديناميكية صراحة عبر:

```ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```

حتى لا يحاول Next.js التعامل معها كمسارات قابلة للتوليد الثابت أثناء build.
