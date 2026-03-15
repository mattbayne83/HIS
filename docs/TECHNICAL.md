# HIS Technical Reference

## System Architecture

```
┌────────────────────────────────────────────────┐
│                   Browser                       │
│  ┌──────────┐  ┌───────────┐  ┌─────────────┐ │
│  │ Public   │  │ Admin     │  │ Auth        │ │
│  │ Pages    │  │ Pages     │  │ (Login)     │ │
│  └────┬─────┘  └─────┬─────┘  └──────┬──────┘ │
│       │               │               │        │
│       ▼               ▼               ▼        │
│  ┌─────────────────────────────────────────┐   │
│  │        React Router 7 (BrowserRouter)   │   │
│  └─────────────────┬───────────────────────┘   │
│                    │                            │
│  ┌─────────┬───────┴───────┬────────────┐      │
│  │ Zustand │  useQuery     │ UI Library │      │
│  │ Store   │  Hook         │ Components │      │
│  └────┬────┘  └─────┬──────┘ └──────────┘      │
│       │             │                           │
│       ▼             ▼                           │
│  ┌─────────────────────────────────────────┐   │
│  │        Supabase Client (lib/)           │   │
│  │   auth.ts │ queries.ts │ storage.ts     │   │
│  └─────────────────┬───────────────────────┘   │
└────────────────────┼───────────────────────────┘
                     │ HTTPS
┌────────────────────┼───────────────────────────┐
│           Supabase Cloud                        │
│  ┌──────────┐ ┌────────────┐ ┌──────────────┐ │
│  │ Postgres │ │ Auth       │ │ Storage      │ │
│  │ (RLS)    │ │ (email/pw) │ │ (images)     │ │
│  └──────────┘ └────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────┘
```

## Database Schema

### Tables

**profiles** — extends `auth.users`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | References auth.users(id), cascade delete |
| display_name | text | |
| role | text | `admin` / `editor` / `viewer` |
| created_at | timestamptz | |

Auto-created via trigger `on_auth_user_created` → `handle_new_user()`.

**students** — VSS program participants
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Required |
| age | integer | Required |
| grade | text | Required |
| village | text | Required |
| region | text | Required |
| coordinator | text | |
| photo_url | text | Nullable |
| status | text | `active` / `inactive` / `graduated` / `merged` |
| merged_into_id | uuid (FK) | References students(id), nullable. Points to student this record was merged into. |
| notes | text | Nullable |
| created_at, updated_at | timestamptz | Auto-managed |

**donors** — Financial supporters
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| name | text | Required |
| email, phone | text | Nullable |
| address_line1, address_line2, city, state, zip, country | text | Nullable, country defaults `US` |
| notes | text | Nullable |
| created_at, updated_at | timestamptz | Auto-managed |

**sponsorships** — Links donors to students
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| donor_id | uuid (FK) | References donors, cascade |
| student_id | uuid (FK) | References students, cascade |
| start_date | date | Defaults to today |
| end_date | date | Nullable |
| status | text | `active` / `ended` |
| notes | text | Nullable |
| | | Unique constraint on (donor_id, student_id) |

**donations** — Financial contributions
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| donor_id | uuid (FK) | References donors, cascade |
| amount_cents | integer | Stored in cents |
| currency | text | Defaults `USD` |
| purpose | text | Nullable |
| donation_date | date | Defaults to today |
| payment_method | text | Nullable |
| stripe_payment_id | text | Nullable (future) |
| notes | text | Nullable |
| created_at | timestamptz | |

**articles** — News and content
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| title | text | Required |
| slug | text | Unique |
| body | jsonb | Currently `{ text: string }` |
| excerpt | text | Nullable |
| featured_image_url | text | Nullable |
| status | text | `draft` / `published` |
| published_at | timestamptz | Nullable |
| author_id | uuid (FK) | References profiles |
| created_at, updated_at | timestamptz | Auto-managed |

**ministries** — Programs and initiatives
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| name | text | Required |
| slug | text | Unique |
| description | text | |
| region | text | Nullable |
| featured_image_url | text | Nullable |
| status | text | `draft` / `published` |
| sort_order | integer | For display ordering |
| created_at, updated_at | timestamptz | Auto-managed |

### Row-Level Security

| Table | Public Access | Auth Access |
|-------|--------------|-------------|
| profiles | Own profile only | Admins read/manage all |
| students | None | Admin only |
| donors | None | Admin only |
| sponsorships | None | Admin only |
| donations | None | Admin only |
| articles | Read published | Admin manage all |
| ministries | Read published | Admin manage all |

Helper function: `is_admin()` checks if current user's profile role = `admin`.

## Routing

### Public Routes (eager loaded)
| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Landing page |
| `/about` | AboutPage | Organization info |
| `/programs` | ProgramsPage | Ministry programs |
| `/vss` | VssPage | Village School System |
| `/news` | NewsPage | Published articles |
| `/news/:slug` | ArticlePage | Single article |
| `/donate` | DonatePage | Donation info |
| `/contact` | ContactPage | Contact form |
| `/login` | LoginPage | Admin login |

### Admin Routes (lazy loaded, auth-guarded)
| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | DashboardPage | Stats overview |
| `/admin/students` | StudentsPage | Student list + CRUD |
| `/admin/students/:id` | StudentDetailPage | Student profile + edit |
| `/admin/donors` | DonorsPage | Donor list + CRUD |
| `/admin/sponsorships` | SponsorshipsPage | Link donors to students |
| `/admin/donations` | DonationsPage | Record donations |
| `/admin/articles` | ArticlesPage | Article list + publish |
| `/admin/articles/new` | ArticleEditorPage | Create article |
| `/admin/articles/:id/edit` | ArticleEditorPage | Edit article |
| `/admin/ministries` | MinistriesPage | Ministry CRUD |
| `/admin/pdf` | PdfExportPage | PDF generation (planned) |

## Component Inventory

### Layout Components
| Component | File | Purpose |
|-----------|------|---------|
| PublicLayout | `components/layout/PublicLayout.tsx` | Header + nav + footer + Outlet |
| AdminLayout | `components/layout/AdminLayout.tsx` | Sidebar + top bar + Outlet |
| AuthGuard | `components/layout/AuthGuard.tsx` | Auth + admin role check |
| ErrorBoundary | `components/ErrorBoundary.tsx` | React error boundary |

### UI Components (`components/ui/`)
| Component | Props | Notes |
|-----------|-------|-------|
| Button | variant, size, loading, fullWidth | primary/secondary/danger |
| Input | label, error, required | Forwarded ref |
| Select | label, error, options, placeholder | `{value, label}[]` |
| Textarea | label, error, required, rows | Forwarded ref |
| Card | padding (sm/md/lg) | Surface bg, rounded border |
| Modal | open, onClose, title, size | Backdrop + escape key |
| Badge | variant, **label** | Uses `label` prop, NOT children |
| DataTable | columns, data, onRowClick, emptyMessage, selectable, selectedIds, onSelectionChange | Generic, sortable, optional multi-select |
| LoadingSpinner | size (sm/md/lg) | Centered Loader2 animation |
| Pagination | (available but unused) | |

### Student-Specific Components (`components/students/`)
| Component | File | Purpose |
|-----------|------|---------|
| DuplicateWarningCard | DuplicateWarningCard.tsx | Inline warning when duplicates detected |
| MergeStudentsModal | MergeStudentsModal.tsx | Two-column merge UI with field selection |
| MergeHistoryCard | MergeHistoryCard.tsx | Audit trail of merge operations |
| BulkActionsToolbar | BulkActionsToolbar.tsx | Floating toolbar for bulk select/export/delete |
| ExportProgressModal | ExportProgressModal.tsx | Progress bar for photo ZIP exports |
| BulkDeleteConfirmModal | BulkDeleteConfirmModal.tsx | Two-step confirmation for bulk delete |

### Hooks
| Hook | Signature | Purpose |
|------|-----------|---------|
| useQuery | `useQuery<T>(queryFn, deps)` | Returns `{data, loading, error, refetch}` |

### Utilities
| Function | File | Purpose |
|----------|------|---------|
| formatCents | utils/format.ts | `1234` → `$12.34` |
| formatDate | utils/format.ts | ISO → "March 13, 2026" |
| formatDateShort | utils/format.ts | ISO → "Mar 13, 2026" |
| slugify | utils/slug.ts | "Hello World" → "hello-world" |
| exportStudentsToCSV | utils/exportUtils.ts | Export students to CSV (papaparse) |
| exportStudentsToPDF | utils/exportUtils.ts | Generate branded PDF profile cards (jspdf). Crimson Red header, square-cropped photos via canvas, dynamic footer. |
| exportStudentPhotos | utils/exportUtils.ts | Bundle photos into ZIP (jszip) with progress callback |
| downloadBlob | utils/exportUtils.ts | Browser download helper |
| cropImageToSquare | utils/exportUtils.ts | Canvas-based image cropping (object-fit: cover) |
| levenshteinDistance | utils/fuzzyMatch.ts | Edit distance algorithm |
| calculateMatchScore | utils/fuzzyMatch.ts | 0-100 similarity score |
| rankDuplicates | utils/fuzzyMatch.ts | Filter & sort duplicate candidates |

## Query Functions (`lib/queries.ts`)

### Students
- `getStudents(status?)` — list, optionally filtered
- `getStudent(id)` — single by ID
- `createStudent(data)` — insert
- `updateStudent(id, updates)` — partial update
- `deleteStudent(id)` — delete
- `bulkCreateStudents(data[])` — batch insert from CSV import
- `findPotentialDuplicates(name, village, region, age, excludeId?)` — Returns full Student[] objects (fetches complete records after DB function call) for fuzzy matching
- `mergeStudents(keptId, mergedId, selections, updates, mergedBy)` — Combine two student records. Selections type: `Record<string, 'A' | 'B' | 'combine'>` (combine used for notes merging)
- `getStudentMergeLog(studentId)` — audit trail of merge operations

### Donors
- `getDonors()` — list all
- `getDonor(id)` — single
- `createDonor(data)` / `updateDonor(id, updates)` / `deleteDonor(id)`

### Sponsorships
- `getSponsorships(status?)` — with joined donor/student names
- `getStudentSponsorships(studentId)` — for student detail
- `createSponsorship(data)` / `updateSponsorship(id, updates)`

### Donations
- `getDonations()` — with joined donor name
- `createDonation(data)`

### Articles
- `getArticles(status?)` — with author display name
- `getPublishedArticles(limit?)` — public feed
- `getArticleBySlug(slug)` — public single
- `getArticle(id)` — admin edit
- `createArticle(data)` / `updateArticle(id, updates)` / `deleteArticle(id)`

### Ministries
- `getMinistries(status?)` — ordered by sort_order
- `getPublishedMinistries(limit?)` — public
- `getMinistry(id)` — single
- `createMinistry(data)` / `updateMinistry(id, updates)` / `deleteMinistry(id)`

### Dashboard
- `getDashboardStats()` — active students, donors, sponsorships, monthly donations

## Auth Flow

1. User visits `/login`, enters email/password
2. `signInWithEmail()` calls `supabase.auth.signInWithPassword()`
3. `onAuthStateChange` in `main.tsx` fires → `useAppStore.setAuth(user, session)`
4. `AuthGuard` checks:
   - Is user authenticated? (redirect to `/login` if not)
   - Does user's profile have `role = 'admin'`? (show unauthorized if not)
5. On logout: `signOut()` → `clearAuth()` → navigate to `/login`

## Deployment

### GitHub Pages
- **Live URL**: https://mattbayne83.github.io/HIS/
- **Workflow**: `.github/workflows/deploy.yml`
  - Triggers on push to `main` branch
  - Uses GitHub Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - Builds with `npm ci && npm run build`
  - Deploys to `gh-pages` via GitHub Actions
- **Configuration**:
  - `vite.config.ts`: `base: '/HIS/'` (GitHub Pages path)
  - `src/router.tsx`: `basename: import.meta.env.BASE_URL`

### Supabase
- **Project**: `hkaidlwfnbzswejlhbhl.supabase.co`
- **Migrations**: Run manually in Supabase SQL Editor (files in `supabase/migrations/`)
- **RLS**: Enabled on all tables (see `002_rls_policies.sql`)
- **Storage bucket**: `images` — must be created manually in Supabase dashboard
- **Admin setup**: After creating first user, manually promote: `UPDATE profiles SET role = 'admin' WHERE id = '<uuid>'`

### Security Notes
- **Supabase anon key** is public (by design) — protected by RLS
- **Students table**: Admin-only access (public reads blocked for privacy)
- **HomePage**: Does NOT fetch student data — uses empty locations array for map
