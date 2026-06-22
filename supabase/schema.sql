-- OneState RP Recruitment Portal - Supabase schema
-- Run this file first in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists app_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text default 'OneState RP Recruitment Portal',
  applications_open boolean default true,
  admin_applications_open boolean default true,
  leader_applications_open boolean default true,
  maintenance_mode boolean default false,
  privacy_notice text default 'تستخدم البيانات للأغراض الداخلية الخاصة بمراجعة طلبك فقط.',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists factions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  description_ar text,
  min_hours numeric default 4,
  is_open boolean default true,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  application_type text not null check (application_type in ('ADMIN','FACTION_LEADER','FACTION_MEMBER')),
  faction_slug text references factions(slug) on delete set null,
  section text not null default 'عام',
  question_key text not null,
  title text not null,
  description text,
  input_type text not null default 'TEXTAREA',
  options jsonb not null default '[]'::jsonb,
  required boolean default true,
  order_index int default 0,
  weight numeric default 5,
  correct_answer jsonb,
  rubric_keywords jsonb not null default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_questions_lookup on questions(application_type, faction_slug, is_active, order_index);

create table if not exists rules (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  code text,
  title text not null,
  body text not null,
  penalty text,
  severity text default 'MEDIUM',
  tags jsonb not null default '[]'::jsonb,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_rules_category on rules(category, order_index);
create index if not exists idx_rules_code on rules(code);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  application_no text unique not null,
  application_type text not null,
  faction_slug text references factions(slug) on delete set null,
  status text not null default 'NEW',
  score numeric default 0,
  score_raw numeric default 0,
  score_level text,
  risk_level text default 'LOW',
  duplicate_score int default 0,
  recommendation text,
  client_id text,
  discord_username text,
  rp_name text,
  server_name text,
  country text,
  age int,
  hours_available numeric,
  answers_snapshot jsonb not null default '{}'::jsonb,
  score_breakdown jsonb not null default '{}'::jsonb,
  reviewer_note text,
  admin_decision_reason text,
  ip_hash text,
  device_hash text,
  user_agent text,
  timezone text,
  screen text,
  submitted_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_applications_status on applications(status, submitted_at desc);
create index if not exists idx_applications_type on applications(application_type, faction_slug);
create index if not exists idx_applications_identity on applications(client_id, discord_username, rp_name);
create index if not exists idx_applications_ip_device on applications(ip_hash, device_hash);

create table if not exists application_answers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  question_id uuid references questions(id) on delete set null,
  question_key text,
  question_title text,
  section text,
  answer_text text,
  answer_json jsonb,
  score numeric default 0,
  max_score numeric default 0,
  evaluation_note text,
  created_at timestamptz default now()
);
create index if not exists idx_answers_application on application_answers(application_id);

create table if not exists duplicate_flags (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  type text not null,
  severity text default 'MEDIUM',
  message text not null,
  matched_application_id uuid,
  created_at timestamptz default now()
);

create table if not exists status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists admin_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  note text not null,
  created_at timestamptz default now()
);

create table if not exists blacklist (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('CLIENT_ID','DISCORD','RP_NAME','IP_HASH','DEVICE_HASH')),
  value text not null,
  reason text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_blacklist_lookup on blacklist(type, value, is_active);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  ip_hash text,
  success boolean default false,
  user_agent text,
  created_at timestamptz default now()
);
create index if not exists idx_admin_login_attempts_ip_time on admin_login_attempts(ip_hash, created_at desc);
create index if not exists idx_applications_ip_time on applications(ip_hash, submitted_at desc);
create index if not exists idx_applications_device_time on applications(device_hash, submitted_at desc);

-- No anonymous table access. The Next.js server uses the Service Role Key.
alter table app_settings enable row level security;
alter table factions enable row level security;
alter table questions enable row level security;
alter table rules enable row level security;
alter table applications enable row level security;
alter table application_answers enable row level security;
alter table duplicate_flags enable row level security;
alter table status_history enable row level security;
alter table admin_notes enable row level security;
alter table blacklist enable row level security;
alter table audit_logs enable row level security;
alter table announcements enable row level security;
alter table admin_login_attempts enable row level security;
