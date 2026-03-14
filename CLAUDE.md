# HIS — Himalayan Indigenous Services

## What This Is
Web application for Himalayan Indigenous Services, a US-based 501(c)(3) non-profit
focused on facilitating transformation in Nepal through local partnerships.
Managed by Bob Bayne. Existing site: https://www.his-serve.org/

## Tech Stack
- **Frontend**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4
- **State**: Zustand 5 (persist middleware)
- **Icons**: Lucide React
- **Backend**: Supabase (Postgres DB, Auth, Storage)
- **Routing**: React Router 7 (BrowserRouter)
- **Fonts**: Inter (body `font-sans`), DM Serif Display (headings `font-display`)

## Architecture

### Routing
- `src/router.tsx` — `createBrowserRouter` with two route groups:
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
- **Primary**: Deep Mountain Blue `#1B3A5C` / Light: `#2A5580`
- **Secondary**: Temple Gold `#C4922A`
- **Accent**: Saffron Orange `#E07B2E`
- **Success**: Highland Green `#2D6A4F`
- **Danger**: Brick Red `#B91C1C`
- **Background**: Warm White `#FAF8F5`
- **Surface**: Soft Sand `#F0ECE4` / Alt: `#E8E3D9`
- **Text High**: `#1E293B` / **Text Muted**: `#6B7280`
- **Border**: `#D6D0C4`
- All tokens in `@theme` block in `src/index.css`
- Use semantic classes: `bg-primary`, `text-secondary`, `border-border`, etc.

## Key Files
- `src/router.tsx` — Route definitions
- `src/main.tsx` — App entry + auth listener
- `src/lib/queries.ts` — All Supabase CRUD operations
- `src/hooks/useQuery.ts` — Generic data fetching hook
- `src/store/useAppStore.ts` — Global Zustand store
- `src/types/database.ts` — TS types matching DB schema
- `src/index.css` — Design tokens
- `src/utils/format.ts` — formatCents, formatDate, formatDateShort
- `src/utils/slug.ts` — slugify

## UI Component API
- **Button**: `variant` (primary/secondary/danger), `size` (sm/md/lg), `loading`, `fullWidth`
- **Badge**: `variant` (success/warning/danger/neutral), `label` prop (NOT children)
- **Modal**: `open`, `onClose`, `title`, `size` (sm/md/lg)
- **DataTable**: `columns`, `data`, `onRowClick`, `emptyMessage`
- **Input/Select/Textarea**: `label`, `error`, `required`, forwarded ref
- **Select**: `options` array of `{value, label}`, `placeholder`
- **Card**: `padding` (sm/md/lg)

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Type-check + build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Gotchas
- `.env.local` required for Supabase — see `.env.local.example`
- Auth state is NOT persisted in localStorage — rehydrated from Supabase session
- `his-storage` is the localStorage key — don't change
- Image storage bucket `images` — must be created in Supabase dashboard
- Admin pages must export `{ XPage as Component }` for lazy loading
- DataTable generic uses `Record<string, any>` — TS interfaces satisfy this
- Badge uses `label` prop, NOT children
- Article body stored as JSONB `{ text: string }` — plain text for now
- Public pages are mostly skeleton/placeholder — admin pages are fully built
- SQL migrations must be run manually in Supabase SQL Editor
- After creating a user, manually set `role = 'admin'` in profiles table
