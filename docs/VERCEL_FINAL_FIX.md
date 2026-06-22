# Vercel Final Fix

هذه النسخة صُممت لحل أخطاء النشر التالية نهائيًا:

1. تحذير `engines` المتعلق بإصدار Node.
2. خطأ `npm error Exit handler never called` أثناء `npm ci`.
3. خطأ `No Next.js version detected`.

## ما تم تغييره

- حذف `engines` من `package.json` حتى يعتمد Vercel على Project Settings بدل التعارض.
- حذف `.nvmrc` حتى لا يحدث تضارب مع إعدادات Vercel.
- حذف `package-lock.json` لأن النسخة السابقة كانت تحتوي روابط Registry داخلية من بيئة البناء، وهذا قد يسبب فشل Vercel.
- استبدال `npm ci` بـ:

```bash
npm install --no-audit --no-fund --legacy-peer-deps
```

- تثبيت `vercel.json` على Framework Next.js.
- تثبيت `.npmrc` لاستخدام Registry الرسمي:

```txt
https://registry.npmjs.org/
```

## إعدادات Vercel المطلوبة

- Root Directory: `.`
- Framework Preset: Next.js
- Node.js Version: 24.x أو 20.x من Project Settings
- Install Command: اتركه كما في `vercel.json`
- Build Command: اتركه كما في `vercel.json`

## مهم جدًا

لو كنت تستخدم Repository قديم على GitHub:

1. احذف `package-lock.json` القديم من GitHub.
2. ارفع هذه النسخة من جذر المشروع مباشرة، بحيث يكون `package.json` في أول مستوى من الريبو.
3. لا ترفع مجلد يحتوي المشروع بداخله، وإلا سيظهر خطأ Root Directory.

البنية الصحيحة:

```txt
repo-root/
  package.json
  vercel.json
  src/
  public/
  supabase/
  docs/
```

البنية الخاطئة:

```txt
repo-root/
  Onestaterp/
    package.json
```

إلا إذا جعلت Root Directory في Vercel = `Onestaterp`.
