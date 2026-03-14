-- 003_phase1_duplicate_detection.sql
-- Phase 1: Duplicate Detection & Merge Support
-- Run in Supabase SQL Editor after 002_rls_policies.sql

-- 1. Add 'merged' to student status enum
-- NOTE: Cannot ALTER TYPE with CHECK constraint, must drop/recreate
alter table public.students drop constraint students_status_check;
alter table public.students add constraint students_status_check
  check (status in ('active', 'inactive', 'graduated', 'merged'));

-- 2. Add merged_into_id column to track merge target
alter table public.students
  add column merged_into_id uuid references public.students(id) on delete set null;

comment on column public.students.merged_into_id is
  'ID of the student this record was merged into. Only populated when status = merged.';

-- 3. Create student_merge_log table
create table public.student_merge_log (
  id uuid primary key default gen_random_uuid(),
  kept_student_id uuid not null references public.students(id) on delete cascade,
  merged_student_id uuid not null references public.students(id) on delete cascade,
  field_selections jsonb not null default '{}',
  merged_by uuid not null references public.profiles(id),
  merged_at timestamptz not null default now(),

  -- Ensure a student can't be merged multiple times
  unique(merged_student_id)
);

comment on table public.student_merge_log is
  'Audit trail for student merge operations. Tracks which fields were selected from which record.';

comment on column public.student_merge_log.field_selections is
  'JSON object mapping field names to source record (A = kept, B = merged). Example: {"name": "A", "age": "B", "photo_url": "A"}';

-- 4. Add indexes for duplicate detection performance
create index idx_students_name on public.students(name)
  where status != 'merged'; -- exclude merged records from search

create index idx_students_village_region on public.students(village, region)
  where status != 'merged';

create index idx_students_age on public.students(age)
  where status != 'merged';

comment on index idx_students_name is
  'Speeds up fuzzy name matching for duplicate detection';

comment on index idx_students_village_region is
  'Speeds up location-based duplicate queries';

-- 5. Enable RLS on merge log
alter table public.student_merge_log enable row level security;

create policy "Admins manage merge log" on public.student_merge_log
  for all using (public.is_admin());

-- 6. Create helper function to find potential duplicates
create or replace function public.find_potential_duplicates(
  p_name text,
  p_village text,
  p_region text,
  p_age integer,
  p_exclude_id uuid default null
)
returns table (
  student_id uuid,
  name text,
  village text,
  region text,
  age integer,
  grade text,
  photo_url text
) as $$
begin
  return query
  select
    s.id,
    s.name,
    s.village,
    s.region,
    s.age,
    s.grade,
    s.photo_url
  from public.students s
  where
    s.status != 'merged' -- exclude already merged students
    and (p_exclude_id is null or s.id != p_exclude_id) -- exclude self when editing
    and s.village = p_village -- exact village match required
    and s.region = p_region -- exact region match required
    and abs(s.age - p_age) <= 1 -- age within ±1 year
    and (
      -- Name similarity (basic Levenshtein will be done client-side)
      -- For now, just return candidates and let JS do fuzzy matching
      s.name ilike '%' || split_part(p_name, ' ', 1) || '%' -- contains first word of name
      or p_name ilike '%' || split_part(s.name, ' ', 1) || '%' -- vice versa
    )
  order by s.name
  limit 20; -- max candidates for client-side fuzzy matching
end;
$$ language plpgsql security definer;

comment on function public.find_potential_duplicates is
  'Returns candidate duplicate students for client-side fuzzy name matching. Filters by exact village/region and age ±1.';
