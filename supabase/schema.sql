-- RewardFit schema
-- Run this in the Supabase SQL Editor

-- Workouts table
create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  performed_at timestamptz not null default now(),
  type text not null,
  duration_min integer not null,
  intensity text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Milestones table
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  rule_type text not null check (rule_type in ('TOTAL_WORKOUTS', 'WORKOUTS_PER_WEEK')),
  target_value integer not null,
  window_weeks integer,
  start_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'unlocked')),
  unlocked_at timestamptz,
  created_at timestamptz not null default now()
);

-- Rewards table
create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  milestone_id uuid not null references milestones(id) on delete cascade,
  title text not null,
  status text not null default 'locked' check (status in ('locked', 'unlocked', 'claimed')),
  unlocked_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable Realtime for all tables
alter publication supabase_realtime add table workouts;
alter publication supabase_realtime add table milestones;
alter publication supabase_realtime add table rewards;
