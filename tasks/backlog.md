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

### Admin Enhancements
- [ ] Student photo upload (Supabase Storage integration)
- [ ] PdfExportPage — student profile PDF generation (skeleton exists)
- [ ] Article rich text editor (replace plain textarea with markdown or WYSIWYG)
- [ ] Article featured image upload
- [ ] Ministry featured image upload
- [ ] Donation summary/reporting (totals by month, by donor, by purpose)
- [ ] Sponsorship: show unsponsored students for quick matching
- [ ] Bulk student import (CSV upload)

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
- [ ] Deployment to Cloudflare Pages or Vercel
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing (Vitest + React Testing Library)
- [ ] Supabase Edge Functions for server-side logic
- [ ] Image optimization (WebP conversion, thumbnails)

## Completed

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
