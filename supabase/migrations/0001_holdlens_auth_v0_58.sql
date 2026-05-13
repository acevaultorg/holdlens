-- HoldLens v0.58 auth + cross-device watchlist schema
-- Paste this into Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent: safe to re-run.
-- One-time setup. After this runs, your watchlist syncs across devices,
-- alert preferences persist, and the /account page works for logged-in users.

-- ─────────────────────────────────────────────────────────────────────
-- profiles — one row per authenticated user (mirrors auth.users)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─────────────────────────────────────────────────────────────────────
-- watchlists — cross-device watchlist sync
-- One row per user; tickers stored as a text[] for atomic add/remove.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.watchlists (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tickers text[] default '{}' not null,
  updated_at timestamptz default now() not null
);

-- ─────────────────────────────────────────────────────────────────────
-- alert_preferences — what triggers an email + how often
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.alert_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  -- Cadence buckets — operator can flip these via /account UI
  digest_weekly boolean default true not null,
  digest_filing_event boolean default false not null,  -- alert on every 13F filing
  digest_watchlist_change boolean default true not null,  -- alert on watchlist conviction change
  -- Pro-tier knobs (free tier capped at 5 tickers in watchlist for alerts)
  alerts_unlimited boolean default false not null,
  updated_at timestamptz default now() not null
);

-- ─────────────────────────────────────────────────────────────────────
-- subscriptions — Stripe webhook target; mirrors active subscription state
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  tier text default 'free' check (tier in ('free', 'founders', 'pro', 'power')),
  status text default 'inactive' check (status in ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
  current_period_end timestamptz,
  founders_locked_rate boolean default false not null,  -- true for first-100 €9-for-life subscribers
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ─────────────────────────────────────────────────────────────────────
-- Row Level Security — users can only read/write their own data
-- ─────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.watchlists enable row level security;
alter table public.alert_preferences enable row level security;
alter table public.subscriptions enable row level security;

-- profiles: each user reads + updates own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- watchlists: each user reads + writes own row
drop policy if exists "watchlists_select_own" on public.watchlists;
create policy "watchlists_select_own" on public.watchlists
  for select using (auth.uid() = user_id);

drop policy if exists "watchlists_insert_own" on public.watchlists;
create policy "watchlists_insert_own" on public.watchlists
  for insert with check (auth.uid() = user_id);

drop policy if exists "watchlists_update_own" on public.watchlists;
create policy "watchlists_update_own" on public.watchlists
  for update using (auth.uid() = user_id);

-- alert_preferences: each user reads + writes own row
drop policy if exists "alert_prefs_select_own" on public.alert_preferences;
create policy "alert_prefs_select_own" on public.alert_preferences
  for select using (auth.uid() = user_id);

drop policy if exists "alert_prefs_insert_own" on public.alert_preferences;
create policy "alert_prefs_insert_own" on public.alert_preferences
  for insert with check (auth.uid() = user_id);

drop policy if exists "alert_prefs_update_own" on public.alert_preferences;
create policy "alert_prefs_update_own" on public.alert_preferences
  for update using (auth.uid() = user_id);

-- subscriptions: each user reads own row (writes happen via Stripe webhook
-- which uses service_role, bypassing RLS)
drop policy if exists "subs_select_own" on public.subscriptions;
create policy "subs_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────
-- Auto-create profile + default watchlist + default alert_preferences
-- when a new user signs up
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.watchlists (user_id, tickers) values (new.id, '{}');
  insert into public.alert_preferences (user_id) values (new.id);
  insert into public.subscriptions (user_id, tier, status) values (new.id, 'free', 'inactive');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────
-- updated_at auto-touch trigger
-- ─────────────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_watchlists_updated_at on public.watchlists;
create trigger touch_watchlists_updated_at before update on public.watchlists
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_alert_prefs_updated_at on public.alert_preferences;
create trigger touch_alert_prefs_updated_at before update on public.alert_preferences
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_subs_updated_at on public.subscriptions;
create trigger touch_subs_updated_at before update on public.subscriptions
  for each row execute procedure public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- Done. Verify with:
--   select * from public.profiles;
-- (empty until first signup)
-- ─────────────────────────────────────────────────────────────────────
