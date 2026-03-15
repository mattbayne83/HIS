# HIS Backlog

## P0 — Must Have (Core Functionality) ✅ COMPLETE (March 14, 2026)

### Database Setup ✅
- [x] Run SQL migrations in Supabase SQL Editor
- [x] Create admin user and set profile role
- [x] Create `images` storage bucket in Supabase dashboard
- [x] Verify end-to-end: login → dashboard → CRUD operations
- [x] Created verification script (`scripts/verify-setup.js`)
- [x] Created setup documentation (`docs/SETUP.md`)

### Admin — Donations ✅
- [x] Donations CRUD page (list, record new, edit, delete)
- [x] Donation query functions in `queries.ts`
- [x] Wire into admin router + sidebar nav
- [x] Currency formatting (USD with proper cents conversion)
- [x] Donor dropdown selection

### Auth & Security ✅
- [x] Password reset flow (Supabase built-in)
- [x] Reset password request page (`/reset-password`)
- [x] Reset password confirmation page (`/reset-password/confirm`)
- [x] Added auth helper functions (`resetPasswordForEmail`, `updatePassword`)
- [x] Added "Forgot password?" link to login page

### Error Handling ✅
- [x] Wire ErrorBoundary into router (wraps entire app in `main.tsx`)

## P1 — Should Have (Polish & Usability)

### VSS Epic — Field Data Management
**See detailed plan**: [tasks/vss-features-plan.md](vss-features-plan.md)
**Schema implementation**: ✅ [Complete](phase1-implementation-complete.md) (March 14, 2026)

**Phase 1: Foundation (Week 1-2)** — ✅ Complete
- [x] Feature 1: Bulk upload of photos and child information (CSV/Excel + photo batch)
- [x] Feature 3: Duplicate detection and merge logic (fuzzy matching + merge UI)

**Phase 2: Power Tools (Week 3)** — ✅ Complete (March 14, 2026)
- [x] Feature 4: Bulk select and export (CSV, PDF, photo ZIP)

**Phase 3: Field Integration (Week 4-5)**
- [ ] Feature 2: Email to submit new/changes (Supabase Edge Function + review queue)

### Admin Enhancements
- [ ] Dashboard map: populate with student locations by district (aggregate by region/village)
- [ ] PdfExportPage — student profile PDF generation (skeleton exists)
- [ ] Article rich text editor (replace plain textarea with markdown or WYSIWYG)
- [ ] Article featured image upload
- [ ] Ministry featured image upload
- [ ] Donation summary/reporting (totals by month, by donor, by purpose)
- [ ] Sponsorship: show unsponsored students for quick matching

### Public Site Polish
- [ ] SEO meta tags (title, description, og:image per page)
- [ ] Social sharing image
- [ ] 404 page
- [ ] Loading skeleton states for public pages
- [ ] Mobile-optimized image sizing

### Developer Experience
- [ ] Supabase CLI integration (`supabase init`, `supabase db push`)
- [ ] Seed data script for development
- [ ] Toast notifications (replace `alert()` calls)

## P2 — Nice to Have (Future)

### Features
- [ ] Stripe integration for online donations
- [ ] Email notifications (new donation, sponsorship matched)
- [ ] Dashboard charts (donation trends, student growth)
- [ ] Multi-language support (English + Nepali)
- [ ] Public student profiles (privacy-controlled)
- [ ] Donor portal (view their sponsorships, donation history)
- [ ] Blog/newsletter subscription

### Infrastructure
- [ ] Automated testing (Vitest + React Testing Library)
- [ ] Supabase Edge Functions for server-side logic
- [ ] Image optimization (WebP conversion, thumbnails)

## Completed

**UI/UX Improvements (March 14, 2026)**
- [x] Typography hierarchy upgrade: h1 text-4xl bold, h2 text-2xl semibold across all admin pages
- [x] Dashboard stat cards made clickable with navigation to respective sections
- [x] Dashboard map component placeholder added (awaiting district data)
- [x] Admin sidebar menu reordered to match dashboard card sequence
- [x] Student detail page photo enlarged to 320px (w-80) on view, 256px (w-64) on edit form
- [x] Sponsorships page search added (matches Students page pattern — donor/student/village filtering)
- [x] PDF export branded design: Crimson Red header, Mountain Bronze borders, square-cropped photos, dynamic footer
- [x] Supabase storage bucket RLS policies configured (authenticated-only access)

**P0 Core Functionality (March 14, 2026)**
- [x] Database setup verification script and documentation
- [x] ErrorBoundary integrated into router for global error catching
- [x] Password reset flow (request + confirm pages, auth helpers)
- [x] Donations CRUD page with currency formatting and donor selection
- [x] All P0 features tested and verified
- [x] ESLint passing with zero warnings

**VSS Field Data Management (March 2026)**
- [x] Feature 1: Bulk CSV/photo upload with compression and validation
- [x] Feature 3: Duplicate detection (fuzzy matching) + merge workflow with audit trail
- [x] Feature 4: Bulk select + export (CSV, PDF profile cards, photo ZIP)
- [x] DataTable multi-select with Set-based tracking
- [x] BulkActionsToolbar (floating glass morphism toolbar)
- [x] Export utilities (papaparse, jspdf, jszip)
- [x] Fuzzy matching utilities (Levenshtein distance, ranking)

**Deployment & GitHub Pages (March 2026)**
- [x] GitHub Actions workflow for auto-deployment
- [x] GitHub Pages configuration (base path, router basename)
- [x] Supabase environment variables via GitHub Secrets
- [x] Fix HomePage: remove student data query (RLS/privacy issue)
- [x] Deploy to https://mattbayne83.github.io/HIS/

**Initial Build (March 2026)**
- [x] Project scaffold (React 19, TS, Vite 7, Tailwind 4, Supabase)
- [x] Design system (Nepal-inspired palette, tokens in index.css)
- [x] Supabase client, auth, storage utilities
- [x] Database schema + RLS policies (migration files)
- [x] Public layout (header, nav, footer, mobile menu)
- [x] Admin layout (sidebar, top bar, auth guard, responsive)
- [x] UI component library (Button, Input, Select, Textarea, Card, Modal, Badge, DataTable, LoadingSpinner)
- [x] Admin Dashboard (live stats from Supabase)
- [x] Students CRUD (list, search, filter, add, detail view, edit, delete)
- [x] Donors CRUD (list, search, add, edit, delete)
- [x] Sponsorships (list, filter, create, end)
- [x] Articles (list, publish/unpublish, delete, editor with draft/publish)
- [x] Ministries CRUD (list, add, edit, delete, sort order)
- [x] Login page (email/password auth)
- [x] Editor role support (type defined: admin | editor | viewer)
- [x] ErrorBoundary component
- [x] Google Fonts loading (Inter + DM Serif Display in index.html)
- [x] Favicon
- [x] HomePage (hero, stats, mission, programs, CTA)
- [x] AboutPage (mission, story, values, stats, ways to support)
- [x] VssPage (Village School System: overview, how it works, stats, CTA)
- [x] ArticlePage (full article render from JSONB body, author, date)
- [x] Git repo initialized

## Removed (Simplified Design)

- ~~ProgramsPage~~ — consolidated into HomePage
- ~~NewsPage~~ — removed
- ~~DonatePage~~ — removed
- ~~ContactPage~~ — removed
