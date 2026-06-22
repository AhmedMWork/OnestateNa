# Vercel Setup

## Settings

- Framework Preset: Next.js
- Root Directory: project root
- Install Command: npm ci
- Build Command: npm run build

## Environment Variables

ضع القيم التالية في Project Settings > Environment Variables:

```env
SUPABASE_URL=https://trbfdyohmwtlpjxbgjmk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ضع المفتاح السري هنا
ADMIN_PASSWORD=باسورد قوي
ADMIN_SESSION_SECRET=سر عشوائي طويل
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

لا تضع المفاتيح السرية في GitHub.
