# HIS P0 Implementation Plan

## Plan: Complete All P0 Must-Have Features

### Goal
Complete the 4 remaining P0 items to finish core functionality: verify database setup, implement Donations CRUD, add password reset flow, and integrate ErrorBoundary.

### Acceptance Criteria
- [ ] Database setup verified (migrations run, admin user exists, images bucket created)
- [ ] Donations CRUD page fully functional (list, create, edit, delete)
- [ ] Password reset flow implemented (forgot password page + reset link handling)
- [ ] ErrorBoundary wired into router and catching errors globally
- [ ] All features tested end-to-end
- [ ] ESLint passes with 0 warnings
- [ ] Dev server runs without errors

---

## Task 1: Database Setup Verification

**Complexity:** Low
**Risk:** Minimal — just verification and documentation

### Steps

1. **Verify migrations are applied** (complexity: low)
   - Check Supabase dashboard → Database → Migrations
   - Confirm all 3 migrations present: `001_initial_schema.sql`, `002_rls_policies.sql`, `003_phase1_duplicate_detection.sql`
   - If not applied: run them in Supabase SQL Editor

2. **Verify/create admin user** (complexity: low)
   - Check if admin user exists in Supabase Auth
   - If not: create user via Supabase dashboard
   - Update `profiles.role = 'admin'` for admin access
   - Test login at `/login` → should redirect to `/admin`

3. **Verify/create images storage bucket** (complexity: low)
   - Check Supabase Storage → should see `images` bucket
   - If not: create bucket named `images`
   - Set policies: public read, authenticated write
   - Test upload via Students page photo field

4. **Document setup instructions** (complexity: low)
   - Create `docs/SETUP.md` with step-by-step setup guide
   - Include SQL commands for admin user creation
   - Add troubleshooting section

### Files
- Supabase dashboard (web interface)
- New file: `/docs/SETUP.md`

### Verification
- [ ] Login works with admin user
- [ ] Students page can upload photos to `images` bucket
- [ ] SETUP.md accurately documents the process

---

## Task 2: Donations CRUD Page

**Complexity:** Medium
**Risk:** Low — follows existing CRUD pattern exactly

### Schema Reference (from migration 001)
```sql
donations (
  id uuid PRIMARY KEY,
  donor_id uuid REFERENCES donors(id),
  amount numeric(10,2) NOT NULL,
  date date NOT NULL,
  purpose text,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
```

### Steps

1. **Add query functions** (complexity: low)
   - File: `src/lib/queries.ts`
   - Add `getDonations()` — fetch all with donor join
   - Add `getDonation(id)` — fetch single donation
   - Add `createDonation(donation)` — insert new
   - Add `updateDonation(id, updates)` — update existing
   - Add `deleteDonation(id)` — soft/hard delete
   - Add `getDonationsByDonor(donorId)` — for donor detail view
   - Pattern: Follow `getStudents()`, `createStudent()`, etc.

2. **Create DonationsPage component** (complexity: medium)
   - File: `src/pages/admin/DonationsPage.tsx`
   - useQuery to fetch donations
   - DataTable with columns: date, donor name, amount, purpose
   - Search by donor name or purpose
   - Filter by date range (optional, can defer to P1)
   - Sort by date (default: newest first)
   - Add donation modal: form with donor select, amount, date, purpose, notes
   - Edit donation modal: pre-populate form
   - Delete confirmation modal
   - Pattern: Follow `DonorsPage.tsx` structure

3. **Add to router** (complexity: low)
   - File: `src/router.tsx`
   - Add lazy route: `/admin/donations` → `DonationsPage`
   - Export pattern: `export { DonationsPage as Component }`

4. **Add to admin navigation** (complexity: low)
   - File: `src/components/layout/AdminLayout.tsx`
   - Add nav link: "Donations" with icon (DollarSign from lucide-react)
   - Position: after Sponsorships, before Articles

5. **Format currency properly** (complexity: low)
   - Use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`
   - Apply in table display and modals

### Files
- `src/lib/queries.ts` — add donation queries
- `src/pages/admin/DonationsPage.tsx` — new page
- `src/router.tsx` — add route
- `src/components/layout/AdminLayout.tsx` — add nav link

### Open Questions
- Should we add a "recurring donation" feature? → NO, defer to P2
- Should we track payment method (check, credit card, etc.)? → NO, keep it simple for P0

### Verification
- [ ] Can list all donations with donor names
- [ ] Can create new donation (amount, date, donor, purpose)
- [ ] Can edit existing donation
- [ ] Can delete donation (with confirmation)
- [ ] Currency displays correctly ($1,234.56)
- [ ] Nav link appears in admin sidebar
- [ ] Page is accessible at `/admin/donations`

---

## Task 3: Password Reset Flow

**Complexity:** Medium
**Risk:** Low — Supabase provides most of the functionality

### Steps

1. **Add "Forgot Password" link to LoginPage** (complexity: low)
   - File: `src/pages/public/LoginPage.tsx`
   - Add link below login form: "Forgot password?" → `/reset-password`
   - Style: text-sm, text-primary, hover underline

2. **Create ResetPasswordRequestPage** (complexity: low)
   - File: `src/pages/public/ResetPasswordRequestPage.tsx`
   - Form with email input
   - Button: "Send Reset Link"
   - On submit: call `supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://mattbayne83.github.io/HIS/reset-password/confirm' })`
   - Success: show message "Check your email for reset link"
   - Error: display error message

3. **Create ResetPasswordConfirmPage** (complexity: low)
   - File: `src/pages/public/ResetPasswordConfirmPage.tsx`
   - Form with new password + confirm password inputs
   - On mount: check for `#access_token` in URL (Supabase magic link format)
   - On submit: call `supabase.auth.updateUser({ password: newPassword })`
   - Success: redirect to `/login` with success message
   - Error: display error message
   - Validation: password min 8 chars, passwords match

4. **Add auth helper functions** (complexity: low)
   - File: `src/lib/auth.ts`
   - Add `resetPasswordForEmail(email, redirectTo)` → calls Supabase
   - Add `updatePassword(newPassword)` → calls Supabase

5. **Add routes** (complexity: low)
   - File: `src/router.tsx`
   - Add `/reset-password` → `ResetPasswordRequestPage`
   - Add `/reset-password/confirm` → `ResetPasswordConfirmPage`
   - Both under PublicLayout (not AuthGuard)

6. **Configure Supabase email templates** (complexity: low)
   - Go to Supabase dashboard → Authentication → Email Templates
   - Customize "Reset Password" email template (optional, can use default)
   - Ensure redirect URL is whitelisted in Supabase settings

### Files
- `src/pages/public/LoginPage.tsx` — add forgot password link
- `src/pages/public/ResetPasswordRequestPage.tsx` — new page
- `src/pages/public/ResetPasswordConfirmPage.tsx` — new page
- `src/lib/auth.ts` — add helper functions
- `src/router.tsx` — add routes

### Open Questions
- Should we add rate limiting on reset requests? → NO, Supabase handles it
- Should we expire reset links after X hours? → YES, Supabase default is 1 hour

### Verification
- [ ] Can request password reset from login page
- [ ] Email is sent with reset link (check Supabase email logs)
- [ ] Reset link redirects to confirm page
- [ ] Can set new password on confirm page
- [ ] Can login with new password
- [ ] Error handling works (invalid email, weak password, etc.)

---

## Task 4: ErrorBoundary Integration

**Complexity:** Low
**Risk:** Minimal — component already exists

### Steps

1. **Wrap router in ErrorBoundary** (complexity: low)
   - File: `src/main.tsx`
   - Import `ErrorBoundary` from `./components/ErrorBoundary`
   - Wrap `<RouterProvider>` in `<ErrorBoundary>`
   - Pattern:
     ```tsx
     <ErrorBoundary>
       <RouterProvider router={router} />
     </ErrorBoundary>
     ```

2. **Test error handling** (complexity: low)
   - Temporarily add `throw new Error('Test error')` in a component
   - Verify ErrorBoundary catches it and shows error UI
   - Verify "Reload Page" button works
   - Remove test error

3. **Add error logging (optional for P0)** (complexity: low)
   - File: `src/components/ErrorBoundary.tsx`
   - Add TODO comment for future Sentry integration
   - For now, console.error is sufficient

### Files
- `src/main.tsx` — wrap router
- `src/components/ErrorBoundary.tsx` — (already exists, no changes needed)

### Verification
- [ ] ErrorBoundary wraps entire app
- [ ] Errors are caught and displayed gracefully
- [ ] Reload button works
- [ ] Error details are visible in collapsible section

---

## Final Verification Checklist

After completing all tasks:

- [ ] Run `npm run dev` — no errors
- [ ] Run `npx eslint . --max-warnings 0` — passes
- [ ] Test database setup verification steps
- [ ] Test donations CRUD end-to-end (create, edit, delete)
- [ ] Test password reset flow end-to-end
- [ ] Test ErrorBoundary catches errors
- [ ] All P0 items marked complete in `tasks/backlog.md`
- [ ] Update `CLAUDE.md` or `TECHNICAL.md` if needed

---

## Implementation Order

1. **Database Setup Verification** (15 min) — do this first to unblock everything else
2. **ErrorBoundary Integration** (10 min) — quick win, improves DX immediately
3. **Password Reset Flow** (45 min) — user-facing, important for production
4. **Donations CRUD** (60 min) — most complex, do last when patterns are fresh

**Total Estimated Time:** ~2 hours

---

## Notes

- All tasks follow existing patterns in the codebase
- No new dependencies required
- No breaking changes to existing features
- Minimal risk — mostly additive changes
- ErrorBoundary and password reset are production-critical for launch
- Donations CRUD completes the core admin feature set
