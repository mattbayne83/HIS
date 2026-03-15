# HIS — Himali Indigenous Services

Web application for [Himali Indigenous Services](https://www.his-serve.org/), a US-based 501(c)(3) non-profit facilitating transformation in Nepal through local partnerships, education, and community development. Managed by Bob Bayne.

## Features

**Public Site**
- Home, About, Programs, Village Schools (VSS), News, Donate, Contact pages
- Article/news feed with slug-based routing
- Responsive nav with mobile hamburger menu

**Admin Portal** (`/admin` — auth-guarded)
- Dashboard with live stats (students, sponsorships, donors, donations)
- Student CRUD with search, status filter, and detail view
- Donor management with full contact info
- Sponsorship tracking (link donors to students, start/end)
- Donation recording with payment method and purpose
- Article editor with draft/publish workflow
- Ministry/program management with sort ordering
- PDF export (planned)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.9, Vite 7 |
| Styling | Tailwind CSS 4, Inter + DM Serif Display fonts |
| State | Zustand 5 (persist middleware) |
| Icons | Lucide React |
| Backend | Supabase (Postgres, Auth, Storage) |
| Routing | React Router 7 |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase project URL and anon key

# Run database migrations (in Supabase SQL Editor)
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_rls_policies.sql

# Start dev server
npm run dev
```

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Project Structure

```
src/
  components/
    layout/       PublicLayout, AdminLayout, AuthGuard
    ui/           Button, Input, Select, Textarea, Card, Modal,
                  Badge, DataTable, LoadingSpinner, Pagination
  hooks/          useQuery (generic async data fetching)
  lib/            supabase client, auth, storage, queries
  pages/
    public/       Home, About, Programs, VSS, News, Article,
                  Donate, Contact, Login
    admin/        Dashboard, Students, StudentDetail, Donors,
                  Sponsorships, Donations, Articles, ArticleEditor,
                  Ministries, PdfExport
  store/          Zustand store (useAppStore)
  types/          TypeScript type definitions
  utils/          format (currency/dates), slug
supabase/
  migrations/     SQL migration files
```

## Database Setup

Two SQL migration files must be run in order in the Supabase SQL Editor:

1. `001_initial_schema.sql` — Tables: profiles, students, donors, sponsorships, donations, articles, ministries
2. `002_rls_policies.sql` — Row-level security: admin-only for data, public read for published content

After running migrations, create a user via Supabase Auth and set their profile role to `admin`:

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

## Design System

Nepal-inspired color palette defined as CSS custom properties in `src/index.css`:

| Token | Color | Usage |
|-------|-------|-------|
| `primary` | Deep Mountain Blue `#1B3A5C` | Headers, buttons, sidebar |
| `secondary` | Temple Gold `#C4922A` | Accents, active nav |
| `accent` | Saffron Orange `#E07B2E` | Highlights, CTAs |
| `success` | Highland Green `#2D6A4F` | Active status, positive |
| `background` | Warm White `#FAF8F5` | Page background |
| `surface` | Soft Sand `#F0ECE4` | Cards, panels |

Use semantic Tailwind classes: `bg-primary`, `text-secondary`, `border-border`, etc.

## Documentation

- [CLAUDE.md](CLAUDE.md) — AI assistant instructions and project conventions
- [docs/TECHNICAL.md](docs/TECHNICAL.md) — Full technical reference
- [tasks/backlog.md](tasks/backlog.md) — Prioritized feature backlog
