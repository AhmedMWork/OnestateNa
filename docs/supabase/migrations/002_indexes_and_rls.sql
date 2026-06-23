create index if not exists idx_applications_status on applications(status);
create index if not exists idx_applications_type on applications(application_type);
create index if not exists idx_applications_faction on applications(faction_slug);
create index if not exists idx_applications_priority on applications(priority);
create index if not exists idx_applications_submitted_at on applications(submitted_at desc);
create index if not exists idx_applications_client_hash on applications(client_hash);
create index if not exists idx_applications_discord_hash on applications(discord_hash);
create index if not exists idx_applications_rp_hash on applications(rp_hash);
create index if not exists idx_applications_device_hash on applications(device_hash);
create index if not exists idx_answers_application on application_answers(application_id);
create index if not exists idx_flags_application on application_flags(application_id);
create index if not exists idx_questions_active on questions(is_active, application_type, faction_slug);
create index if not exists idx_rules_active on rules(is_active, category);
create index if not exists idx_blacklist_type_value on blacklist(type, value, is_active);

alter table site_settings enable row level security;
alter table factions enable row level security;
alter table questions enable row level security;
alter table rules enable row level security;
alter table applications enable row level security;
alter table application_answers enable row level security;
alter table application_flags enable row level security;
alter table application_status_history enable row level security;
alter table application_notes enable row level security;
alter table application_reviews enable row level security;
alter table blacklist enable row level security;
alter table admin_audit_logs enable row level security;

-- All application writes are done through Next.js server using service role.
-- No public anon write policies are needed for this project.
