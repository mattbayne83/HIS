# Phase 1 Schema Review — Bulk Upload & Duplicate Detection

## Current Schema (Production)

### Students Table
```sql
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
```

**Status values**: `active`, `inactive`, `graduated`

**Indexes**: Primary key on `id` only

**Triggers**: `students_updated_at` (auto-updates `updated_at` on row change)

---

## Phase 1 Requirements

### Feature 1: Bulk Upload
**Schema changes needed**: ✅ **NONE**

The bulk upload feature will:
- Parse CSV/Excel into student objects
- Validate fields client-side
- Use existing `bulkCreateStudents()` function with Supabase `.insert(students)`
- Upload photos to Supabase Storage `images` bucket
- Store photo URLs in `students.photo_url`

**No database schema changes required** — we're just batch inserting existing columns.

---

### Feature 3: Duplicate Detection & Merge
**Schema changes needed**: ✅ **YES**

#### Changes Required

**1. Add 'merged' status to students**
- Merged students should be soft-deleted, not hard-deleted
- Allows audit trail and potential undo

**2. Add `merged_into_id` column**
- Track which student this record was merged into
- Foreign key to `students(id)`
- Nullable (only populated for merged records)

**3. Create `student_merge_log` table**
- Audit trail for all merge operations
- Track who merged, when, and field selections

**4. Add indexes for duplicate detection**
- Speed up fuzzy matching queries
- Index on `name`, `village`, `region` for frequent lookups

---

## Migration: 003_phase1_duplicate_detection.sql

```sql
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
```

---

## Data Integrity Checks

### Before Running Migration

**1. Check for existing data issues**
```sql
-- Are there any students with suspicious duplicates already?
select name, village, age, count(*) as dupe_count
from public.students
where status != 'merged'
group by name, village, age
having count(*) > 1
order by dupe_count desc;
```

**2. Verify no circular references possible**
```sql
-- After migration, ensure merged_into_id doesn't create cycles
-- This is prevented by the foreign key, but good to document
```

### After Running Migration

**1. Verify new column**
```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_name = 'students' and column_name = 'merged_into_id';
-- Should return: merged_into_id | uuid | YES
```

**2. Verify merge log table**
```sql
select table_name, column_name, data_type
from information_schema.columns
where table_name = 'student_merge_log'
order by ordinal_position;
```

**3. Verify indexes created**
```sql
select indexname, indexdef
from pg_indexes
where tablename = 'students'
order by indexname;
```

**4. Test duplicate detection function**
```sql
-- Insert test duplicate
insert into public.students (name, age, grade, village, region, coordinator)
values
  ('Ramesh Kumar', 10, '5', 'Ghandruk', 'Annapurna', 'Sita Sharma'),
  ('Ramesh Kunar', 11, '5', 'Ghandruk', 'Annapurna', 'Sita Sharma'); -- intentional typo

-- Should return both as potential duplicates
select * from public.find_potential_duplicates('Ramesh Kumar', 'Ghandruk', 'Annapurna', 10);

-- Clean up test data
delete from public.students where name like 'Ramesh K%';
```

---

## TypeScript Type Updates

### Update `src/types/database.ts`

```ts
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'merged'

export interface Student {
  id: string
  name: string
  age: number
  grade: string
  village: string
  region: string
  coordinator: string
  photo_url: string | null
  status: StudentStatus
  notes: string | null
  merged_into_id: string | null // NEW
  created_at: string
  updated_at: string
}

// NEW: Merge log entry
export interface StudentMergeLog {
  id: string
  kept_student_id: string
  merged_student_id: string
  field_selections: Record<string, 'A' | 'B'> // which record each field came from
  merged_by: string
  merged_at: string
}

// NEW: Duplicate detection result
export interface DuplicateCandidate {
  student: Student
  matchScore: number // 0-100, calculated client-side
  reasons: string[] // e.g., ["Same village", "Similar name (85%)", "Age ±1"]
}
```

---

## Query Functions to Add

### `lib/queries.ts`

```ts
// Bulk insert students (for bulk upload feature)
export async function bulkCreateStudents(
  students: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'merged_into_id'>[]
): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .insert(students)
    .select()

  if (error) throw error
  return data
}

// Find potential duplicates (calls Postgres function)
export async function findPotentialDuplicates(
  name: string,
  village: string,
  region: string,
  age: number,
  excludeId?: string
): Promise<Student[]> {
  const { data, error } = await supabase
    .rpc('find_potential_duplicates', {
      p_name: name,
      p_village: village,
      p_region: region,
      p_age: age,
      p_exclude_id: excludeId || null
    })

  if (error) throw error
  return data
}

// Merge two students
export async function mergeStudents(
  keptId: string,
  mergedId: string,
  fieldSelections: Record<string, 'A' | 'B'>,
  mergedBy: string
): Promise<void> {
  // This will be a transaction with multiple operations
  // 1. Update kept student with selected fields
  // 2. Reassign sponsorships
  // 3. Mark merged student as merged
  // 4. Log merge operation

  // Will implement in Phase 1 code
}
```

---

## Storage Bucket Configuration

### Supabase Storage: `images` bucket

**Already exists** (per backlog P0 setup), but verify configuration:

```sql
-- Check bucket exists and is configured correctly
select * from storage.buckets where name = 'images';
```

**Expected configuration**:
- **Name**: `images`
- **Public**: `true` (students photos are public for sponsor pages)
- **File size limit**: 5MB per file
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/heic`

**RLS Policies** (if not already set):
```sql
-- Allow admins to upload
create policy "Admins upload images" on storage.objects
  for insert with check (
    bucket_id = 'images'
    and public.is_admin()
  );

-- Allow admins to delete
create policy "Admins delete images" on storage.objects
  for delete using (
    bucket_id = 'images'
    and public.is_admin()
  );

-- Allow public read (for public student profile pages in future)
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'images');
```

---

## Performance Considerations

### Index Analysis

**Before Phase 1 goes live**, analyze query performance:

```sql
-- Enable query timing
\timing on

-- Test duplicate detection query performance
explain analyze
select * from public.find_potential_duplicates('Ramesh Kumar', 'Ghandruk', 'Annapurna', 10);

-- Expected: Index scan on idx_students_village_region, then filter
-- Should return in < 10ms for 1000 students
```

### Estimated Table Sizes (1 year, 200 students/month)

| Table | Rows | Size Estimate |
|-------|------|---------------|
| `students` | ~2,400 | 500 KB |
| `student_merge_log` | ~50 (2% merge rate) | 20 KB |

**Conclusion**: No performance concerns with current scale. Indexes will remain efficient up to ~50k students.

---

## Rollback Plan

If migration fails or causes issues:

```sql
-- Rollback 003_phase1_duplicate_detection.sql

-- 1. Drop helper function
drop function if exists public.find_potential_duplicates;

-- 2. Drop merge log table
drop table if exists public.student_merge_log;

-- 3. Drop indexes
drop index if exists idx_students_name;
drop index if exists idx_students_village_region;
drop index if exists idx_students_age;

-- 4. Remove merged_into_id column
alter table public.students drop column if exists merged_into_id;

-- 5. Revert status constraint to original
alter table public.students drop constraint students_status_check;
alter table public.students add constraint students_status_check
  check (status in ('active', 'inactive', 'graduated'));
```

**Impact**: Safe to rollback. No data loss if no merges have occurred yet.

---

## Next Steps (Implementation Order)

1. ✅ **Review this schema plan** (you are here)
2. **Run migration** `003_phase1_duplicate_detection.sql` in Supabase SQL Editor
3. **Verify migration** using data integrity checks above
4. **Update TypeScript types** in `src/types/database.ts`
5. **Add query functions** to `src/lib/queries.ts`
6. **Verify storage bucket** configuration
7. **Begin Feature 1 implementation** (bulk upload UI)
8. **Begin Feature 3 implementation** (duplicate detection + merge UI)

Ready to proceed? 🚀
