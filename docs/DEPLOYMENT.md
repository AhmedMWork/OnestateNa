# Deployment Guide

## 1. GitHub

ارفع محتويات المشروع كما هي إلى repository جديد.

تأكد أن هذه الملفات موجودة في الجذر:

- package.json
- package-lock.json
- vercel.json
- .nvmrc
- .env.example
- README.md

## 2. Supabase

نفذ ملفات SQL من مجلد `supabase` بالترتيب.

## 3. Vercel

1. Import Project من GitHub.
2. Framework: Next.js.
3. Install Command: `npm ci`.
4. Build Command: `NEXT_PRIVATE_BUILD_WORKER=1 npm run build`.
5. Environment Variables:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - ADMIN_PASSWORD
   - ADMIN_SESSION_SECRET
   - NEXT_PUBLIC_SITE_URL

## 4. بعد النشر

افتح `/admin` وتأكد من دخول الأدمن.
