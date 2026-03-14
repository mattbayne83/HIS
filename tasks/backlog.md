# HIS Backlog

## P0 — Must Have (Core Functionality)

### Database Setup
- [ ] Run SQL migrations in Supabase SQL Editor
- [ ] Create admin user and set profile role
- [ ] Create `images` storage bucket in Supabase dashboard
- [ ] Verify end-to-end: login → dashboard → CRUD operations

### Admin — Donations
- [ ] Donations CRUD page (list, record new, edit, delete)
- [ ] Donation query functions in `queries.ts`
- [ ] Wire into admin router + sidebar nav

### Auth & Security
- [ ] Password reset flow (Supabase built-in)

### Error Handling
- [ ] Wire ErrorBoundary into router (component exists, not integrated)

## P1 — Should Have (Polish & Usability)

### VSS Epic — Field Data Management
**See detailed plan**: [tasks/vss-features-plan.md](vss-features-plan.md)
**Schema implementation**: ✅ [Complete](phase1-implementation-complete.md) (March 14, 2026)

**Phase 1: Foundation (Week 1-2)**
- [ ] Feature 1: Bulk upload of photos and child information (CSV/Excel + photo batch)
- [ ] Feature 3: Duplicate detection and merge logic (fuzzy matching + merge UI)

**Phase 2: Power Tools (Week 3)**
- [ ] Feature 4: Bulk select and export (CSV, PDF, photo ZIP)

**Phase 3: Field Integration (Week 4-5)**
- [ ] Feature 2: Email to submit new/changes (Supabase Edge Function + review queue)

### Admin Enhancements
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
