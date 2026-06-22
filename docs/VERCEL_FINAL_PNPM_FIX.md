# Vercel Final PNPM Fix

هذه النسخة ألغت الاعتماد على npm نهائيًا في Vercel بسبب خطأ npm:

`npm error Exit handler never called!`

الحل المعتمد:

- Node.js مثبت على 20.x داخل package.json.
- Package manager مثبت على pnpm@9.15.9.
- vercel.json يجبر Vercel على استخدام Corepack + pnpm وليس npm.
- لا يوجد package-lock.json.
- لا يوجد .npmrc.

## إعدادات Vercel المطلوبة

في Project Settings > General:

- Root Directory: `.`
- Framework Preset: Next.js
- Node.js Version: 20.x
- Install Command: اتركها فارغة أو اجعلها نفس الآتي:

```bash
corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm install --no-frozen-lockfile
```

- Build Command: اتركها فارغة أو اجعلها نفس الآتي:

```bash
corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm run build
```

## علامة نجاح الإصلاح

في أول اللوج يجب أن ترى pnpm وليس npm:

```txt
Running "install" command: `corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm install --no-frozen-lockfile`...
```

لو ظهر npm مرة أخرى، فهذا يعني أن Vercel لم يستقبل النسخة الجديدة أو أن Install Command القديم مكتوب يدويًا في Dashboard ويجب حذفه أو تغييره.
