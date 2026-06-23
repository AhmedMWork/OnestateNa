# Nexora Method Applied to Onestaterp

فحصت ملف Nexora وظهر أن سبب ثباته في Vercel ليس كود الواجهة فقط، بل طريقة النشر:

- تحديد Registry العام صراحة في `.npmrc` و `vercel.json`.
- تثبيت إصدار Node عبر `.nvmrc` و `.node-version`.
- عدم ترك Vercel يختار Package Manager عشوائيًا.
- عدم وجود روابط Registry داخلية داخل lockfile.
- تنظيف Root Directory بحيث يكون ملف `package.json` في الجذر مباشرة.

## ما تم تطبيقه هنا

- أبقينا المشروع Full Next.js + Supabase، ولم نحوله إلى Static أو Vite.
- ثبتنا Node على `20.19.0` كما في Nexora.
- ثبتنا Yarn Classic كمدير حزم واحد فقط.
- حذفنا أي اعتماد على npm/pnpm lockfiles.
- فرضنا التحميل من `https://registry.npmjs.org/` فقط.
- أضفنا `scripts/verify-locks.mjs` لاكتشاف أي روابط داخلية أو lockfiles خاطئة قبل الرفع.

## إعدادات Vercel المطلوبة

Framework Preset: Next.js  
Root Directory: .  
Install Command:

```bash
yarn install --frozen-lockfile --non-interactive --network-timeout 1200000 --registry https://registry.npmjs.org/
```

Build Command:

```bash
NEXT_TELEMETRY_DISABLED=1 NEXT_PRIVATE_BUILD_WORKER=1 yarn build
```

Node.js Version: 20.x

## ممنوع وجود هذه الملفات في GitHub

- package-lock.json
- pnpm-lock.yaml
- bun.lock
- bun.lockb

## فحص قبل الرفع

```bash
node scripts/verify-locks.mjs
```

لو نجح الفحص، فالنسخة نظيفة من مشكلة Registry الداخلية.
