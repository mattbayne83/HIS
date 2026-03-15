# HIS — Himali Indigenous Services

## What This Is
Web application for Himali Indigenous Services, a US-based 501(c)(3) non-profit
focused on facilitating transformation in Nepal through local partnerships.
Managed by Bob Bayne. Existing site: https://www.his-serve.org/

## Tech Stack
- **Frontend**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4
- **State**: Zustand 5 (persist middleware)
- **Icons**: Lucide React
- **Backend**: Supabase (Postgres DB, Auth, Storage)
- **Routing**: React Router 7 (BrowserRouter)
- **Fonts**: Inter (body `font-sans`), DM Serif Display (headings `font-display`)
- **Export**: papaparse (CSV), jspdf (PDF), jszip (ZIP)

## Architecture

### Routing
- `src/router.tsx` — `createBrowserRouter` with `basename: import.meta.env.BASE_URL` for GitHub Pages
- Two route groups:
  - `/` — PublicLayout wrapping public pages (eagerly loaded)
  - `/admin` — AuthGuard → AdminLayout wrapping admin pages (lazy loaded via `lazy()`)
- Admin pages export `{ XPage as Component }` for react-router lazy loading

### Supabase Integration
- **Client**: `src/lib/supabase.ts` — singleton, reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **Auth**: `src/lib/auth.ts` — signInWithEmail, signUp, signOut, getSession
- **Storage**: `src/lib/storage.ts` — uploadImage, deleteImage, listImages (bucket: `images`)
- **Queries**: `src/lib/queries.ts` — all CRUD functions for every entity
- **Config**: `.env.local` (gitignored via `*.local`)

### State Management
- `src/store/useAppStore.ts` — Zustand with persist
- Auth state (user, session) set via `onAuthStateChange` in `main.tsx`
- Only UI prefs persisted to localStorage (`his-storage` key)
- Auth state comes from Supabase session, NOT localStorage

### Data Fetching Pattern
- `src/hooks/useQuery.ts` — generic hook: `useQuery(queryFn, deps)` → `{data, loading, error, refetch}`
- Admin pages use this hook with query functions from `src/lib/queries.ts`

### Admin Page Pattern
Each admin CRUD page follows this structure:
1. `useQuery` for data fetching with loading/error states
2. DataTable for list view (sortable columns, row click)
3. Modal for add/edit forms
4. Delete confirmation modal
5. Search/filter controls where applicable
6. Badge for status display

### Design System — Nepal-Inspired
- **Primary**: Crimson Red `#DC143C` / Light: `#E85472` / Dark: `#A01028`
- **Secondary**: Mountain Bronze `#A67C52` / Light: `#BF9976` / Dark: `#8B6741`
- **Accent**: Temple Gold `#D4A574` / Dark: `#B8895E`
- **Success**: Highland Green `#2D6A4F`
- **Danger**: Brick Red `#B91C1C`
- **Background**: Warm Cream `#F5F1EB`
- **Surface**: Soft Sand `#E8E3D9`
- **Text High**: `#1F1812` / **Text Muted**: `#6B7280`
- **Border**: `#D6D0C4`
- All tokens in `@theme` block in `src/index.css`
- Use semantic classes: `bg-primary`, `text-secondary`, `border-border`, etc.
- **Glassmorphism**: Three variants — `glass-light` (subtle, 0.7 opacity), `glass-medium` (balanced, variable opacity), `glass-heavy` (prominent, heavy blur)

### Typography Hierarchy
- **Page Title (h1)**: `text-4xl font-display font-bold` (36px, bold) — Admin page titles
- **Section Heading (h2)**: `text-2xl font-display font-semibold` (24px, semibold) — Major sections
- **Subsection (h3)**: `text-xl font-display font-medium` (20px, medium) — Subsections
- **Card Header**: `text-base font-sans font-semibold` (16px, semibold) — Component headers
- **Fonts**: Cormorant Garamond (display), Inter (body)

### Spacing Scale (Base-8 Grid)
- Use only these spacing values: 2, 4, 6, 8, 12, 16, 20, 24, 32, 48, 64
- **Never use** arbitrary values like mb-3 (12px) — use mb-4 (16px) instead
- **Section padding**: `py-16 md:py-24` (standard), `py-20 md:py-32` (emphasis/final CTA)
- **Card padding**: `lg` (p-8) for prominence, `md` (p-6) for compact layouts

## Key Files
- `src/router.tsx` — Route definitions
- `src/main.tsx` — App entry + auth listener
- `src/lib/queries.ts` — All Supabase CRUD operations (includes findPotentialDuplicates, mergeStudents)
- `src/hooks/useQuery.ts` — Generic data fetching hook
- `src/store/useAppStore.ts` — Global Zustand store
- `src/types/database.ts` — TS types matching DB schema
- `src/index.css` — Design tokens
- `src/utils/format.ts` — formatCents, formatDate, formatDateShort
- `src/utils/slug.ts` — slugify
- `src/utils/exportUtils.ts` — CSV/PDF/ZIP export (papaparse, jspdf, jszip), branded student profile PDFs
- `src/utils/fuzzyMatch.ts` — Levenshtein distance, duplicate detection, rankDuplicates()
- `src/components/students/` — DuplicateWarningCard, MergeStudentsModal, MergeHistoryCard

## UI Component API
- **Button**: `variant` (primary/secondary/accent/ghost/outline/danger/glass-primary), `size` (sm/md/lg), `loading`, `fullWidth` — always shows `cursor-pointer` on hover. All variants have colored hover shadows for depth.
- **Badge**: `variant` (success/warning/danger/neutral), `label` prop (NOT children)
- **Modal**: `open`, `onClose`, `title`, `size` (sm/md/lg)
- **DataTable**: `columns`, `data`, `onRowClick`, `emptyMessage`, optional: `selectable`, `selectedIds` (Set<string>), `onSelectionChange`
- **Input/Select/Textarea**: `label`, `error`, `required`, forwarded ref
- **Select**: `options` array of `{value, label}`, `placeholder`
- **Card**: `variant` (solid/glass-light/glass-medium/glass-heavy), `padding` (sm/md/lg), `interactive` (visual hover effects only, no cursor change), `shimmer` (optional loading state)

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Type-check + build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Deployment

### GitHub Pages
- **URL**: https://mattbayne83.github.io/HIS/
- **Workflow**: `.github/workflows/deploy.yml` — auto-deploy on push to `main`
- **Config**: `vite.config.ts` has `base: '/HIS/'` for GitHub Pages path
- **Secrets**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured in GitHub repo secrets

## Gotchas
- `.env.local` required for Supabase locally — see `.env.local.example`
- Auth state is NOT persisted in localStorage — rehydrated from Supabase session
- `his-storage` is the localStorage key — don't change
- Image storage bucket `images` — must be created in Supabase dashboard
- Admin pages must export `{ XPage as Component }` for react-router lazy loading
- DataTable generic uses `Record<string, any>` — TS interfaces satisfy this
- **DataTable selection requires `id` field** — uses `Set<string>` for tracking, row key is `row.id`
- **DataTable onRowClick works WITH selectable** — checkbox click uses `stopPropagation()` to prevent row click
- Badge uses `label` prop, NOT children
- Article body stored as JSONB `{ text: string }` — plain text for now
- **HomePage does NOT fetch student data** — uses empty locations array for map (security/privacy)
- **RLS blocks public student access** — students table requires admin role for all operations
- SQL migrations must be run manually in Supabase SQL Editor
- After creating a user, manually set `role = 'admin'` in profiles table
- **GitHub Pages deployment**: basename configured in router, base path in vite.config.ts
- **Storage bucket security**: `images` bucket uses authenticated-only access — only logged-in users can view/upload photos (privacy protection for student data)
- **Export utilities**: PDF/ZIP generation happens client-side while admin is authenticated, so photo access works
- **PDF generation is client-side** — jsPDF creates PDFs in browser, no server needed. Branded layout with HIS colors (Crimson Red header, Mountain Bronze borders, Warm Sand dividers). Photos cropped to square using canvas API (object-fit: cover behavior).
- **Hidden nav items**: Donations, Articles, Ministries are hidden from sidebar nav but routes still exist and work
- **Merge functionality**: Selection type is `Record<string, 'A' | 'B' | 'combine'>` — 'combine' is used for notes merging. Must update interface, component state, and query function types together.
- **findPotentialDuplicates**: Returns full `Student[]` objects (fetches complete records after database function call) to work with rankDuplicates fuzzy matching
- **Search pattern**: SponsorshipsPage and StudentsPage both use same search pattern — relative div with absolute-positioned Search icon, filters by donor name, student name, and village
- **Student detail photos**: 320px (w-80) on view page, 256px (w-64) on edit form
- **AdminLayout**: "Return to HIS Site" link is at bottom of left sidebar (NOT in top header) — uses flexbox layout with footer section
- **Card interactive prop**: Only adds visual hover effects (shadow, translate, border) — does NOT change cursor to pointer
- **Button cursor**: All buttons explicitly show `cursor-pointer` on hover for consistent UX across browsers
- **Spacing discipline**: All public pages follow base-8 grid. NO arbitrary spacing values (mb-3, py-19, etc.)
- **Glassmorphism variants**: `glass-light` is subtle (0.7 opacity), `glass-medium` is balanced, `glass-heavy` is prominent with heavy blur. Semantic naming prevents confusion.
- **Accessibility**: Skip-to-content link present, focus-visible states on all interactive elements (WCAG 2.1 SC 2.4.1, 2.4.7 compliant)
- **Button shadows**: All variants use colored shadows on hover (lg for primary/secondary/danger, md for ghost/outline) for visual consistency
- **Hero CTA hierarchy**: Primary button uses `size="lg"` with explicit price, secondary uses `size="md"` with `variant="ghost"` for clear visual dominance
- **Footer design**: py-12 padding, text-2xl org name, separate email from address, visual divider before copyright for proper hierarchy
