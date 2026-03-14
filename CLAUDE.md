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
- **Fonts**: Inter (body), DM Serif Display (headings/display)

## Architecture

### Supabase Integration
- **Database**: Postgres via Supabase client (`src/lib/supabase.ts`)
- **Auth**: Email/password auth (`src/lib/auth.ts`), session managed in Zustand store
- **Image Storage**: Supabase Storage bucket `images` (`src/lib/storage.ts`)
- **Config**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`

### State Management
- `src/store/useAppStore.ts` — global store with auth state + UI prefs
- Only UI prefs are persisted to localStorage (`his-storage` key)
- Auth state comes from Supabase session (not localStorage)

### Design System — Nepal-Inspired
- **Primary**: Deep Mountain Blue `#1B3A5C`
- **Secondary**: Temple Gold `#C4922A`
- **Accent**: Saffron Orange `#E07B2E`
- **Success**: Highland Green `#2D6A4F`
- **Background**: Warm White `#FAF8F5`
- **Surface**: Soft Sand `#F0ECE4`
- All tokens defined in `@theme` block in `src/index.css`
- Use semantic classes: `bg-primary`, `text-secondary`, `border-border`, etc.

## Key Files
- `src/lib/supabase.ts` — Supabase client singleton
- `src/lib/auth.ts` — Auth helper functions
- `src/lib/storage.ts` — Image upload/delete/list utilities
- `src/store/useAppStore.ts` — Global Zustand store
- `src/index.css` — Design tokens and global styles

## Directories
```
src/
  components/   — React components
  store/        — Zustand stores
  lib/          — Supabase client, auth, storage utilities
  types/        — TypeScript type definitions
  utils/        — Pure utility functions
```

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Type-check + build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Gotchas
- `.env.local` required for Supabase — see `.env.local.example`
- Auth state is NOT persisted in localStorage — only rehydrated from Supabase session
- `his-storage` is the localStorage key — don't change
- Image storage bucket name is `images` — must be created in Supabase dashboard
