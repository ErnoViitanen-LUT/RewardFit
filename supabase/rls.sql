-- RewardFit Row Level Security policies
-- Run this AFTER schema.sql in the Supabase SQL Editor

-- Enable RLS on all tables
alter table workouts enable row level security;
alter table milestones enable row level security;
alter table rewards enable row level security;

-- Workouts: users can only see/modify their own rows
create policy "Users can view own workouts"
  on workouts for select
  using (auth.uid() = user_id);

create policy "Users can insert own workouts"
  on workouts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own workouts"
  on workouts for delete
  using (auth.uid() = user_id);

-- Milestones: users can only see/modify their own rows
create policy "Users can view own milestones"
  on milestones for select
  using (auth.uid() = user_id);

create policy "Users can insert own milestones"
  on milestones for insert
  with check (auth.uid() = user_id);

create policy "Users can update own milestones"
  on milestones for update
  using (auth.uid() = user_id);

-- Rewards: users can only see/modify their own rows
create policy "Users can view own rewards"
  on rewards for select
  using (auth.uid() = user_id);

create policy "Users can insert own rewards"
  on rewards for insert
  with check (auth.uid() = user_id);

create policy "Users can update own rewards"
  on rewards for update
  using (auth.uid() = user_id);
