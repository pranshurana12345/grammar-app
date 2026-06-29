-- Grammy cross-device sync — run in Supabase → SQL Editor → New query → Run.
--
-- The app uses 5 local PIN "accounts" (s1..s5), NOT Supabase Auth. So we key by
-- a plain text student_id. Each student's state is stored as one JSON blob per
-- key (e.g. 'progress', 'quiz').

create table if not exists app_state (
  student_id text not null,
  key        text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (student_id, key)
);

-- Row Level Security is ON, with an open policy: the public anon key (which ships
-- in the app) may read/write. This is acceptable for a small private group of
-- known users sharing 5 PIN accounts — it is NOT private between those accounts.
alter table app_state enable row level security;

drop policy if exists "anon can read/write app_state" on app_state;
create policy "anon can read/write app_state"
  on app_state for all
  to anon
  using (true)
  with check (true);
