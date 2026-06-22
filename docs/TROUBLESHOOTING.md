# Troubleshooting

## Vercel يتوقف عند Installing dependencies

هذا ليس خطأ وحده. انتظر حتى يظهر الخطأ النهائي. أكثر الأسباب شيوعًا:

- Root Directory غير صحيح.
- Environment Variables ناقصة.
- package-lock.json غير متوافق.
- أمر install غير مضبوط.

## Missing SUPABASE_URL

أضف هذه القيم في Vercel Environment Variables:

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

## الأدمن لا يدخل

تأكد من:

- ADMIN_PASSWORD موجود وليس قصيرًا.
- ADMIN_SESSION_SECRET موجود وطويل.
- لا تستخدم كلمة admin في الإنتاج.

## الجداول غير موجودة

شغل ملفات SQL من Supabase بالترتيب.
