-- 001_initial_schema.sql
-- Run in Supabase SQL Editor

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''), 'viewer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Students (VSS program)
create table public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null,
  grade text not null,
  village text not null,
  region text not null,
  coordinator text not null default '',
  photo_url text,
  status text not null default 'active' check (status in ('active', 'inactive', 'graduated')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Donors
create table public.donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip text,
  country text default 'US',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sponsorships (links donors to students)
create table public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.donors(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active' check (status in ('active', 'ended')),
  notes text,
  unique(donor_id, student_id)
);

-- Donations
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.donors(id) on delete cascade,
  amount_cents integer not null,
  currency text not null default 'USD',
  purpose text,
  donation_date date not null default current_date,
  payment_method text,
  stripe_payment_id text,
  notes text,
  created_at timestamptz not null default now()
);

-- Articles (news/content)
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body jsonb not null default '{}',
  excerpt text,
  featured_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  author_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ministries (programs/initiatives)
create table public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  region text,
  featured_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger students_updated_at before update on public.students
  for each row execute function public.set_updated_at();
create trigger donors_updated_at before update on public.donors
  for each row execute function public.set_updated_at();
create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();
create trigger ministries_updated_at before update on public.ministries
  for each row execute function public.set_updated_at();
