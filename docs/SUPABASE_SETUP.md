# Supabase Setup

Project Name: OnestateNa  
Project ID: trbfdyohmwtlpjxbgjmk  
SUPABASE_URL: https://trbfdyohmwtlpjxbgjmk.supabase.co

## لا تحفظ المفتاح السري داخل GitHub

ضع `SUPABASE_SERVICE_ROLE_KEY` فقط في:

- `.env.local` محليًا
- Vercel Environment Variables

## SQL order

شغّل الملفات بالترتيب داخل SQL Editor:

1. `supabase/migrations/001_init_schema.sql`
2. `supabase/migrations/002_indexes_and_rls.sql`
3. `supabase/seed.sql`

## الجداول الأساسية

- site_settings
- factions
- questions
- question_options
- rules
- applications
- application_answers
- application_flags
- application_notes
- application_status_history
- blacklist
- admin_audit_logs
