-- 002_rls_policies.sql
-- Run in Supabase SQL Editor AFTER 001_initial_schema.sql

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.donors enable row level security;
alter table public.sponsorships enable row level security;
alter table public.donations enable row level security;
alter table public.articles enable row level security;
alter table public.ministries enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Profiles: users read own, admins read/manage all
create policy "Users read own profile" on public.profiles
  for select using (id = auth.uid());
create policy "Admins read all profiles" on public.profiles
  for select using (public.is_admin());
create policy "Admins manage profiles" on public.profiles
  for update using (public.is_admin());

-- Students: admin only
create policy "Admins manage students" on public.students
  for all using (public.is_admin());

-- Donors: admin only
create policy "Admins manage donors" on public.donors
  for all using (public.is_admin());

-- Sponsorships: admin only
create policy "Admins manage sponsorships" on public.sponsorships
  for all using (public.is_admin());

-- Donations: admin only
create policy "Admins manage donations" on public.donations
  for all using (public.is_admin());

-- Articles: public read published, admin manage all
create policy "Public read published articles" on public.articles
  for select using (status = 'published');
create policy "Admins manage articles" on public.articles
  for all using (public.is_admin());

-- Ministries: public read published, admin manage all
create policy "Public read published ministries" on public.ministries
  for select using (status = 'published');
create policy "Admins manage ministries" on public.ministries
  for all using (public.is_admin());
