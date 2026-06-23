create extension if not exists pgcrypto;

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text default 'Onestaterp Recruitment Portal',
  hero_title text default 'بوابة التقديم الرسمية لإدارة وفصائل Onestaterp',
  hero_subtitle text default 'منصة عربية احترافية لاستقبال ومراجعة طلبات الإدارة وقادة الفصائل.',
  applications_open boolean not null default true,
  admin_applications_open boolean not null default true,
  leader_applications_open boolean not null default true,
  tracking_open boolean not null default true,
  maintenance_mode boolean not null default false,
  maintenance_message text default 'الموقع في وضع الصيانة الآن.',
  resubmit_cooldown_days integer not null default 14,
  success_message text default 'تم إرسال طلبك بنجاح. احتفظ برقم الطلب لمتابعة الحالة.',
  privacy_notice text default 'تستخدم البيانات لغرض مراجعة طلبات التقديم وكشف التكرار فقط.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists factions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  description_ar text,
  requirements_ar text,
  icon_name text default 'Shield',
  is_open boolean not null default true,
  is_visible boolean not null default true,
  order_index integer not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  application_type text not null default 'ALL' check (application_type in ('ALL','ADMIN','FACTION_LEADER')),
  faction_slug text references factions(slug) on update cascade on delete set null,
  section text not null,
  question_key text unique not null,
  title text not null,
  description text,
  input_type text not null default 'TEXT' check (input_type in ('TEXT','TEXTAREA','NUMBER','SELECT','RADIO','MULTISELECT','CHECKBOX','CONSENT')),
  options jsonb not null default '[]'::jsonb,
  required boolean not null default true,
  order_index integer not null default 999,
  is_active boolean not null default true,
  helper_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists rules (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  code text,
  title text not null,
  body text not null,
  penalty text,
  severity text not null default 'MEDIUM' check (severity in ('LOW','MEDIUM','HIGH','CRITICAL')),
  faction_slug text references factions(slug) on update cascade on delete set null,
  tags text[] not null default '{}',
  order_index integer not null default 999,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  application_no text unique not null,
  application_type text not null check (application_type in ('ADMIN','FACTION_LEADER')),
  faction_slug text references factions(slug) on update cascade on delete set null,
  status text not null default 'NEW' check (status in ('NEW','UNDER_REVIEW','INTERVIEW_REQUIRED','PRE_ACCEPTED','ACCEPTED','REJECTED','DEFERRED','DUPLICATE','BLOCKED')),
  priority text not null default 'MEDIUM' check (priority in ('HIGH','MEDIUM','LOW')),
  review_label text not null default 'NEEDS_REVIEW' check (review_label in ('VERY_STRONG','GOOD','NEEDS_REVIEW','UNCLEAR','NOT_SUITABLE')),
  duplicate_state text not null default 'NONE',
  candidate_summary text,
  decision_reason text,
  client_id text,
  discord_username text,
  rp_name text,
  server_name text,
  country text,
  contact text,
  age integer,
  hours_available numeric,
  client_hash text,
  discord_hash text,
  rp_hash text,
  ip_hash text,
  device_hash text,
  screen text,
  timezone text,
  user_agent text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists application_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  question_id uuid references questions(id) on delete set null,
  question_key text not null,
  question_title text not null,
  section text not null,
  answer_json jsonb,
  answer_text text,
  created_at timestamptz not null default now()
);

create table if not exists application_flags (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  flag_type text not null,
  severity text not null default 'MEDIUM',
  message text not null,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists application_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  note text not null,
  is_internal boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists application_reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  review_label text,
  priority text,
  summary text,
  decision_reason text,
  created_at timestamptz not null default now()
);

create table if not exists blacklist (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('CLIENT_ID','DISCORD','RP_NAME','IP_HASH','DEVICE_HASH')),
  value text not null,
  reason text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, value)
);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
