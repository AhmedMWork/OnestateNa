# Vercel Stable Yarn Deploy

هذه النسخة صُممت خصيصًا لتجاوز مشاكل npm وpnpm التي ظهرت سابقًا على Vercel.

## قاعدة النشر

لا تستخدم npm أو pnpm مع هذه النسخة.

يجب أن يحتوي جذر الريبو على:

```txt
package.json
yarn.lock
vercel.json
src/
supabase/
public/
```

ويجب ألا يحتوي على:

```txt
package-lock.json
pnpm-lock.yaml
bun.lock
```

## إعدادات Vercel

Project Settings > Build & Development Settings:

```txt
Framework Preset: Next.js
Root Directory: .
Install Command: yarn install --frozen-lockfile --non-interactive
Build Command: yarn build
Output Directory: فارغ
```

Project Settings > General:

```txt
Node.js Version: 20.x
```

## علامات النجاح في Log

يجب أن يظهر:

```txt
Running "install" command: `yarn install --frozen-lockfile --non-interactive`
```

ثم:

```txt
Running "build" command: `yarn build`
```

إذا ظهر `npm install` أو `pnpm install` فالمشكلة ليست من الكود؛ المشكلة أن Vercel يستخدم إعداد قديم أو ريبو قديم.
