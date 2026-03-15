# HIS Database Setup Guide

This guide walks through setting up the Supabase database for the HIS (Himalayan Indigenous Services) application.

## Prerequisites

- Supabase project created at [supabase.com](https://supabase.com)
- Project reference: `hkaidlwfnbzswejlhbhl`
- Project URL: `https://hkaidlwfnbzswejlhbhl.supabase.co`

## Step 1: Apply Database Migrations

All migrations are in the `supabase/migrations/` directory. Apply them in order using the Supabase SQL Editor.

### Apply Migrations via SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/hkaidlwfnbzswejlhbhl) → **SQL Editor**
2. Create a new query
3. Copy and paste each migration file in order:

#### Migration 001: Initial Schema

```bash
# Copy contents of: supabase/migrations/001_initial_schema.sql
```

This creates tables: `students`, `donors`, `sponsorships`, `articles`, `ministries`, `donations`, `profiles`

#### Migration 002: RLS Policies

```bash
# Copy contents of: supabase/migrations/002_rls_policies.sql
```

This sets up Row Level Security policies for all tables.

#### Migration 003: Phase 1 Duplicate Detection

```bash
# Copy contents of: supabase/migrations/003_phase1_duplicate_detection.sql
```

This adds:
- `merged_into_id` column to students table
- `student_merge_log` table for audit trail
- `find_potential_duplicates()` Postgres function

### Verify Migrations

Run the verification script:

```bash
node scripts/verify-setup.js
```

You should see all tables exist and the duplicate detection function works.

---

## Step 2: Create Storage Bucket

The app stores student photos in a Supabase storage bucket.

### Create 'images' Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `images`
4. **Public bucket**: ✅ Check this (allows public read access)
5. Click **Create bucket**

### Set Bucket Policies

After creating the bucket, set these policies:

**Policy 1: Public Read Access**
- Policy name: `Public Read`
- Allowed operation: `SELECT`
- Target roles: `public`
- Policy definition: `true`

**Policy 2: Authenticated Upload**
- Policy name: `Authenticated Upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- Policy definition: `true`

### Verify Storage

Run the verification script again:

```bash
node scripts/verify-setup.js
```

You should see: `✅ 'images' bucket exists (public: true)`

---

## Step 3: Create Admin User

### Sign Up First User

1. Go to deployed app: [https://mattbayne83.github.io/HIS/login](https://mattbayne83.github.io/HIS/login)
2. Sign up with email and password (use your admin email)
3. This creates a user in `auth.users` and auto-creates a profile in `profiles` table (via trigger)

### Grant Admin Role

By default, new users have `role = 'viewer'`. To grant admin access:

1. Go to Supabase Dashboard → **Table Editor** → `profiles` table
2. Find your user's row (match by email or user ID)
3. Edit the row
4. Change `role` from `'viewer'` to `'admin'`
5. Save

**SQL Method:**

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'your-email@example.com'
);
```

### Verify Admin Access

1. Log out and log back in at `/login`
2. You should be redirected to `/admin` (admin dashboard)
3. Try accessing admin pages like `/admin/students`

If you see the admin sidebar and can access admin pages, you're all set!

---

## Step 4: Verify End-to-End

Run through these flows to confirm everything works:

### Test CRUD Operations

1. **Students**
   - Go to `/admin/students`
   - Add a new student (with photo upload)
   - Edit the student
   - Delete the student
   - ✅ All operations should work

2. **Donors**
   - Go to `/admin/donors`
   - Add a new donor
   - Edit the donor
   - ✅ All operations should work

3. **Sponsorships**
   - Go to `/admin/sponsorships`
   - Create a sponsorship (requires at least 1 donor and 1 student)
   - End the sponsorship
   - ✅ All operations should work

4. **Articles**
   - Go to `/admin/articles`
   - Create a new article (draft)
   - Publish the article
   - View on public site at `/news/:slug`
   - ✅ All operations should work

5. **Ministries**
   - Go to `/admin/ministries`
   - Add a new ministry
   - Reorder ministries (drag handles)
   - ✅ All operations should work

### Test Phase 1 Features

1. **Bulk Upload**
   - Go to `/admin/students/bulk-upload`
   - Upload a CSV with student data
   - Upload photos as ZIP
   - ✅ Should create multiple students

2. **Duplicate Detection**
   - Create two students with similar names
   - Edit one student
   - ✅ Should see duplicate warning card
   - ✅ Can merge duplicates via modal

3. **Bulk Export**
   - Go to `/admin/students`
   - Select multiple students (checkboxes)
   - Click bulk export (CSV, PDF, or Photos ZIP)
   - ✅ Should download file(s)

---

## Troubleshooting

### Can't log in after signing up

**Issue:** User created but can't access admin pages

**Solution:** Make sure you updated the `profiles.role` to `'admin'` (see Step 3)

### Photo uploads fail

**Issue:** Error when uploading student photos

**Solution:** Check that `images` bucket exists and has correct policies (see Step 2)

### Duplicate detection doesn't work

**Issue:** No duplicate warnings shown or merge function errors

**Solution:** Make sure migration 003 is applied (see Step 1)

### "Permission denied" errors

**Issue:** Can't read/write data even as admin

**Solution:** Check RLS policies are applied (migration 002). Admin users should bypass RLS due to policies.

---

## Quick Verification Script

To quickly check all setup steps, run:

```bash
node scripts/verify-setup.js
```

Expected output when fully set up:

```
✅ Table 'students' exists
✅ Table 'donors' exists
✅ Table 'sponsorships' exists
✅ Table 'articles' exists
✅ Table 'ministries' exists
✅ Table 'donations' exists
✅ Table 'profiles' exists
✅ Table 'student_merge_log' exists
✅ 'images' bucket exists (public: true)
✅ Found 1 admin user(s)
✅ Function 'find_potential_duplicates' exists and works
```

---

## Next Steps

After completing setup:

1. Configure email templates in Supabase Dashboard → Authentication → Email Templates
2. (Optional) Set up custom domain for the app
3. (Optional) Enable social auth providers (Google, Facebook, etc.)
4. Start using the app! Create students, donors, and sponsorships.
