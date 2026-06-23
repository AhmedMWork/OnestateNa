# Supabase Setup - Onestaterp

Project Name: OnestateNa  
Project ID: trbfdyohmwtlpjxbgjmk  
SUPABASE_URL: https://trbfdyohmwtlpjxbgjmk.supabase.co

## خطوات التشغيل

1. افتح Supabase Dashboard.
2. ادخل SQL Editor.
3. شغل الملفات بالترتيب:
   - `supabase/migrations/001_init_schema.sql`
   - `supabase/migrations/002_indexes_and_rls.sql`
   - `supabase/seed.sql`
4. ضع `SUPABASE_SERVICE_ROLE_KEY` في `.env.local` محليًا وفي Vercel Environment Variables فقط.

لا ترفع أي Secret Key إلى GitHub.
