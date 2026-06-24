-- Run this in Supabase → SQL Editor → New query → Run

-- Table: rule progress per user
create table if not exists rule_progress (
  user_id uuid references auth.users(id) on delete cascade not null,
  rule_id integer not null,
  status text check (status in ('unseen', 'seen', 'confident', 'revise')) not null default 'unseen',
  updated_at timestamptz default now(),
  primary key (user_id, rule_id)
);

-- Table: quiz scores per user
create table if not exists quiz_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  rule_id integer not null,
  score integer not null,
  passed boolean not null,
  taken_at timestamptz default now()
);

-- Enable Row Level Security (users only see their own data)
alter table rule_progress enable row level security;
alter table quiz_scores enable row level security;

-- Policies
create policy "Users manage own progress"
  on rule_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own quiz scores"
  on quiz_scores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
