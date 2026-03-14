# VSS Features — Implementation Plan

## Overview
Four interconnected features to enhance Village School System (VSS) student data management:
1. Bulk upload of photos and child information
2. Email to submit new / changes
3. Duplicate detection and merge logic
4. Bulk select and export

**Epic Goal**: Enable field coordinators to efficiently submit student data, while giving admins powerful tools to maintain clean data and generate reports.

---

## Feature 1: Bulk Upload of Photos & Child Information

### User Story
**As a** VSS admin
**I want** to upload multiple students and their photos at once
**So that** I can onboard an entire village cohort in one session instead of manually entering each child

### Requirements

#### CSV/Excel Import
- Accept `.csv` or `.xlsx` file with student data
- Required columns: `name`, `age`, `grade`, `village`, `region`
- Optional columns: `coordinator`, `status`, `notes`, `photo_filename`
- Validate on parse:
  - Age is integer 4-18
  - Grade is non-empty string
  - Status matches enum (`active` / `inactive` / `graduated`), default to `active`
- Show row-by-row validation errors before commit
- Support ~200 rows per file (typical village cohort)

#### Photo Batch Upload
- Accept drag-and-drop or file picker (multiple files)
- Match photos to CSV rows via `photo_filename` column (e.g., `ramesh_kumar.jpg`)
- Fallback: manual matching UI (student name dropdown per photo)
- Upload to Supabase Storage `images` bucket with UUID filename
- Store final URL in `students.photo_url`

#### Preview & Commit
- Two-step flow:
  1. **Preview**: Show DataTable of parsed rows with validation status (✓ valid, ⚠ warning, ✗ error)
  2. **Commit**: Insert valid rows to `students` table, show summary (X added, Y skipped)
- Allow fixing errors inline before commit (edit name, age, etc.)
- Optionally skip invalid rows and commit valid ones

### Technical Design

#### Components
- `BulkUploadPage.tsx` — new admin route `/admin/students/bulk-upload`
- `CsvUploadStep.tsx` — file picker + parser + validation table
- `PhotoMatchingStep.tsx` — photo upload + matching UI
- `BulkPreviewStep.tsx` — final review before commit

#### Libraries
- **CSV parsing**: `papaparse` (25KB, handles Excel via SheetJS plugin or use `xlsx` directly)
- **Excel parsing**: `xlsx` (SheetJS) — already mature, MIT licensed
- **File upload**: Built-in `<input type="file" multiple>` + Supabase Storage API

#### Data Flow
```
CSV Upload → Parse → Validate → Photo Matching → Preview → Batch Insert
                ↓                      ↓             ↓          ↓
          validationErrors      photoUrls[]    finalRows[]  Supabase
```

#### New Query Functions (`lib/queries.ts`)
```ts
export async function bulkCreateStudents(students: Omit<Student, 'id' | 'created_at' | 'updated_at'>[]) {
  const { data, error } = await supabase
    .from('students')
    .insert(students)
    .select()
  // Returns inserted students with IDs
}
```

#### Edge Cases
- Duplicate filename in photo batch → suffix with (1), (2)
- CSV missing required columns → show error immediately
- Photo with no matching row → show in "unmatched photos" section for manual assignment
- Network failure mid-upload → retry logic or save progress to localStorage

### Complexity: **Medium**
**Estimate**: 2-3 days (CSV parsing: 0.5d, Photo matching: 1d, Preview/commit: 0.5d, Testing: 1d)

---

## Feature 2: Email to Submit New / Changes

### User Story
**As a** field coordinator in a remote village
**I want** to email student info and photos to a dedicated address
**So that** I can submit updates without needing direct database access or internet speed for web uploads

### Requirements

#### Inbound Email Processing
- Dedicated email address: `students@his-serve.org` (or `vss-intake@...`)
- Parse email body for structured data:
  - Plain text format (coordinator-friendly):
    ```
    Name: Ramesh Kumar
    Age: 10
    Grade: 5
    Village: Ghandruk
    Region: Annapurna
    Coordinator: Sita Sharma
    Notes: New student, needs sponsorship
    ```
  - OR CSV attachment (fallback to Feature 1 logic)
- Parse email attachments for photos (`.jpg`, `.png`, `.heic`)
- Store submission in `pending_students` table for admin review

#### Admin Review Queue
- New admin page: `/admin/students/queue`
- List pending submissions with:
  - Coordinator email (from sender)
  - Parsed student data
  - Photo preview
  - Duplicate warnings (see Feature 3)
  - Actions: Approve (insert to `students`), Edit & Approve, Reject (with email reply)
- Approval triggers:
  - Insert to `students` table
  - Upload photo to Storage
  - Send confirmation email to coordinator

#### Email Template for Coordinators
- Provide downloadable template (PDF or plain text) with field structure
- Validation feedback via reply email if parse fails

### Technical Design

#### Supabase Edge Function (Deno)
- **Trigger**: Webhook from email provider (SendGrid Inbound Parse, Mailgun Routes, or Cloudflare Email Workers)
- **Function**: `handle-student-email`
  - Parse email body with regex or structured parser
  - Download attachments to temp storage
  - Insert to `pending_students` table
  - Return 200 OK to email provider

#### Email Provider Options
| Provider | Inbound Webhook | Cost | Notes |
|----------|----------------|------|-------|
| SendGrid Inbound Parse | Yes | Free tier: 100/day | Easy setup, POST to Edge Function |
| Mailgun Routes | Yes | $0.50/1000 emails | More powerful parsing |
| Cloudflare Email Workers | Yes | Free tier: 100k/day | Tightly integrated, beta |

**Recommendation**: Start with **SendGrid Inbound Parse** (free, mature, easy webhook setup)

#### New Table: `pending_students`
```sql
CREATE TABLE pending_students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  coordinator_email text NOT NULL,
  raw_email_body text,
  parsed_data jsonb, -- { name, age, grade, village, ... }
  photo_urls text[], -- temp URLs from attachments
  status text DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  notes text, -- admin notes on rejection
  created_at timestamptz DEFAULT now()
);
```

#### RLS Policy
- Only admins can read/update `pending_students`

#### Components
- `StudentQueuePage.tsx` — list pending submissions
- `QueueReviewModal.tsx` — full-screen modal for review/edit/approve

### Complexity: **High**
**Estimate**: 4-5 days (Edge function: 1d, Email provider setup: 1d, Queue UI: 2d, Testing/iteration: 1d)

---

## Feature 3: Duplicate Detection & Merge Logic

### User Story
**As a** VSS admin
**I want** to see potential duplicate students when adding or importing
**So that** I don't create multiple records for the same child (e.g., name misspellings, re-enrollment)

### Requirements

#### Duplicate Detection Algorithm
- **Trigger points**:
  1. On manual student create (real-time check before insert)
  2. On CSV bulk upload (preview step shows duplicates)
  3. On email submission approval (queue UI shows warnings)
  4. Manual scan: "Find All Duplicates" tool
- **Matching criteria** (fuzzy):
  - Name similarity: Levenshtein distance < 3 OR exact first/last name match
  - Same village AND region
  - Age within ±1 year
  - Grade within ±1 level (e.g., "4" vs "5")
- **Score calculation**:
  - Exact name + same village + same age = 95% match (almost certain duplicate)
  - Similar name + same village + age ±1 = 70% match (likely duplicate)
  - Similar name + different village = 30% match (probably different person)
- **Threshold**: Flag anything ≥60% as potential duplicate

#### Duplicate Warning UI
- Show inline warning in create/edit form:
  ```
  ⚠ Potential duplicate found:
  Ramesh Kumar, age 10, Grade 5, Ghandruk (85% match)
  [View Record] [Ignore] [Merge Instead]
  ```
- In bulk upload preview: highlight rows with duplicates, allow skip or force insert

#### Merge Interface
- New modal: `MergeStudentsModal.tsx`
- Two-column comparison:
  ```
  Field         | Record A (Keep)  | Record B (Discard)
  ------------- | ---------------- | ------------------
  Name          | ● Ramesh Kumar   | ○ Ramesh Kuwar
  Age           | ○ 10             | ● 11
  Grade         | ● 5              | ○ 4
  Photo         | ● [image]        | ○ [image]
  Notes         | Merge both ↓     |
  ```
- Select which value to keep per field (radio buttons)
- Notes: concat both with separator
- Merge action:
  1. Update kept record with selected values
  2. Re-assign sponsorships/donations from discarded record
  3. Soft-delete discarded record (set `status = 'merged'`, add `merged_into_id` column)
  4. Log merge event in audit trail

#### Audit Trail
- New table: `student_merge_log`
  ```sql
  CREATE TABLE student_merge_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    kept_student_id uuid NOT NULL,
    merged_student_id uuid NOT NULL,
    merged_by uuid REFERENCES profiles(id),
    merged_at timestamptz DEFAULT now(),
    field_selections jsonb -- { name: 'A', age: 'B', ... }
  );
  ```

### Technical Design

#### Libraries
- **Fuzzy matching**: `fuse.js` (16KB, client-side) OR `fuzzysort` (6KB, faster)
- **String distance**: `js-levenshtein` (1KB) for exact Levenshtein

#### New Query Functions
```ts
export async function findDuplicateStudents(student: Partial<Student>) {
  // Fetch all active students, run fuzzy match client-side
  // Return array of { student, matchScore } sorted by score desc
}

export async function mergeStudents(keptId: string, mergedId: string, fieldSelections: Record<string, string>) {
  // 1. Update kept student
  // 2. UPDATE sponsorships SET student_id = keptId WHERE student_id = mergedId
  // 3. UPDATE students SET status = 'merged', merged_into_id = keptId WHERE id = mergedId
  // 4. INSERT merge_log
}
```

#### Schema Changes
```sql
-- Add merged status to student_status enum
ALTER TYPE student_status ADD VALUE 'merged';

-- Add merged_into_id column
ALTER TABLE students ADD COLUMN merged_into_id uuid REFERENCES students(id);
```

### Complexity: **Medium-High**
**Estimate**: 3-4 days (Algorithm: 1d, Merge UI: 1.5d, Testing edge cases: 1.5d)

---

## Feature 4: Bulk Select & Export

### User Story
**As a** VSS admin
**I want** to select multiple students and export them to CSV or PDF
**So that** I can generate reports for donors, coordinators, or board meetings

### Requirements

#### Bulk Selection
- Enhance existing `DataTable` component with:
  - Checkbox column (select all / select individual)
  - Sticky selection count badge: "12 students selected"
  - Actions toolbar appears when ≥1 selected:
    - Export CSV
    - Export PDF (profile cards)
    - Download Photos (ZIP)
    - Bulk Edit (future: change coordinator, region)
    - Bulk Delete (with confirmation)
- Persist selection across pagination (use Set<id>)
- Filters apply BEFORE selection (e.g., select all active students in Annapurna region)

#### CSV Export
- Columns: all student fields + sponsor name (if any)
- Filename: `students_export_YYYY-MM-DD.csv`
- Library: `papaparse` (same as import)

#### PDF Export (Profile Cards)
- Layout: 2-column grid of student cards
  ```
  [Photo]  Name: Ramesh Kumar
           Age: 10 | Grade: 5
           Village: Ghandruk, Annapurna
           Coordinator: Sita Sharma
           Sponsor: John Doe (if applicable)
  ```
- Library: `jsPDF` + `html2canvas` OR `@react-pdf/renderer` (more control)
- Filename: `student_profiles_YYYY-MM-DD.pdf`

#### Photo Package Download
- Collect all `photo_url` for selected students
- Download as ZIP file
- Filename structure inside ZIP: `{student_name}_{id}.jpg`
- Library: `jszip` (client-side ZIP generation)

### Technical Design

#### DataTable Enhancement
- Add `selectable` prop to DataTable component
- Emit `onSelectionChange(selectedIds: Set<string>)` callback
- Parent component manages selection state

#### Export Functions (`lib/export.ts`)
```ts
export async function exportStudentsToCsv(students: Student[]) {
  // Use papaparse to generate CSV string
  // Trigger download via <a> element
}

export async function exportStudentsToPdf(students: Student[]) {
  // Use @react-pdf/renderer to generate PDF document
  // Trigger download
}

export async function downloadStudentPhotos(students: Student[]) {
  // Fetch photo blobs from Supabase Storage
  // Use jszip to create ZIP
  // Trigger download
}
```

#### Libraries
| Library | Size | Purpose |
|---------|------|---------|
| `papaparse` | 25KB | CSV generation |
| `@react-pdf/renderer` | ~200KB | PDF generation (declarative React components) |
| `jszip` | 120KB | ZIP file creation |

**Alternative for PDF**: Use `jsPDF` + `html2canvas` if smaller bundle preferred (~80KB total)

#### UI Components
- `BulkActionsToolbar.tsx` — floating toolbar with action buttons
- Enhance `StudentsPage.tsx` with selection state

### Complexity: **Medium**
**Estimate**: 2-3 days (DataTable enhancement: 0.5d, CSV export: 0.5d, PDF export: 1d, Photo ZIP: 0.5d, Testing: 0.5d)

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
**Goal**: Core bulk operations without email

1. **Feature 1: Bulk Upload** (2-3 days)
   - CSV parser + validation
   - Photo batch upload
   - Preview & commit flow
   - **Deliverable**: Admins can onboard 50 students in 10 minutes

2. **Feature 3: Duplicate Detection** (3-4 days)
   - Fuzzy matching algorithm
   - Real-time warnings on create
   - Merge UI
   - **Deliverable**: Zero duplicate students in production

### Phase 2: Power Tools (Week 3)
**Goal**: Export and bulk operations

3. **Feature 4: Bulk Select & Export** (2-3 days)
   - Multi-select DataTable
   - CSV + PDF export
   - Photo package download
   - **Deliverable**: Board reports generated in 1 click

### Phase 3: Field Integration (Week 4-5)
**Goal**: Enable remote coordinators

4. **Feature 2: Email Submission** (4-5 days)
   - Supabase Edge Function
   - SendGrid inbound webhook
   - Admin review queue
   - Coordinator email template
   - **Deliverable**: Coordinators submit students via email from feature phones

---

## Dependencies & Risks

### Technical Dependencies
| Dependency | Impact | Mitigation |
|------------|--------|------------|
| Supabase Storage quota | Photo uploads may hit free tier limit (1GB) | Monitor usage, upgrade to Pro ($25/mo) if needed |
| Edge Functions cold start | Email processing may be slow (~2s) | Acceptable for async email workflow |
| Client-side ZIP generation | Large photo sets (100+) may crash browser | Add size check, warn if >500MB total |

### UX Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Coordinators don't follow email format | High parse failure rate | Provide clear template, iterate on parser with real examples |
| False positive duplicates | Admins ignore warnings | Tune matching threshold based on production data (start conservative at 70%) |
| Bulk upload errors mid-way | Lost work, frustration | Save progress to localStorage, allow resume |

### Data Integrity Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidental bulk delete | Catastrophic data loss | Require explicit confirmation, add soft-delete + restore UI |
| Merge wrong students | Unrecoverable data loss | Show side-by-side preview, log all merges, add "undo merge" feature |

---

## Testing Strategy

### Unit Tests
- CSV parser with malformed input
- Fuzzy matching algorithm with edge cases (1-letter names, accented characters)
- Export functions (CSV output format, PDF generation)

### Integration Tests
- Full bulk upload flow: CSV → photos → commit
- Email webhook → Edge Function → `pending_students` table
- Merge students with existing sponsorships

### Manual Testing Checklist
- [ ] Upload 100-row CSV with mixed valid/invalid data
- [ ] Match 50 photos to students via filename
- [ ] Send test email to inbound address, verify parse
- [ ] Merge two students with sponsorships, verify reassignment
- [ ] Export 200 students to PDF, check formatting
- [ ] Download photo ZIP for 50 students, verify filenames

---

## Open Questions

1. **Email format**: Should we support structured formats (JSON, YAML) in addition to plain text? Or keep it simple?
   - **Recommendation**: Start with plain text, iterate based on coordinator feedback

2. **Duplicate threshold**: What match score should trigger a warning? (60%? 70%?)
   - **Recommendation**: Start at 70%, log all scores in production, tune down if too many false negatives

3. **Merge undo**: How long should we allow "undo merge"? (24 hours? Indefinitely?)
   - **Recommendation**: 7 days with soft-delete, then hard-delete in cleanup job

4. **Photo compression**: Should we auto-compress photos on upload to save storage?
   - **Recommendation**: Yes, resize to max 800px width, 85% JPEG quality (use `browser-image-compression` lib)

5. **Bulk edit**: Should Feature 4 include bulk field updates (e.g., change coordinator for 20 students)?
   - **Recommendation**: Phase 2 add-on, not P0

---

## Success Metrics

### Adoption
- 80% of new students added via bulk upload (not manual entry) within 3 months
- 50% of coordinators use email submission within 6 months

### Efficiency
- Average time to onboard 50 students: **from 2 hours → 15 minutes**
- Duplicate student rate: **from ~5% → <0.5%**

### Data Quality
- Zero unintentional duplicate students after 3 months
- 95%+ of email submissions successfully parsed on first try

---

## Future Enhancements (Post-MVP)

1. **Mobile app for coordinators** — offline-first photo capture + sync
2. **Automated duplicate cleanup** — ML model to auto-merge high-confidence duplicates
3. **Bulk SMS notifications** — send sponsor updates for selected students
4. **Student data change log** — audit trail for all field edits (not just merges)
5. **Advanced filters** — "Students without sponsors in Annapurna region, age 8-10"
6. **Scheduled exports** — auto-email CSV to Bob every Monday

---

## Appendix: Email Template for Coordinators

```
Subject: New Student Submission - [Village Name]

To: students@his-serve.org

Please submit student information in this format (one student per email):

---
Name: Ramesh Kumar
Age: 10
Grade: 5
Village: Ghandruk
Region: Annapurna
Coordinator: Sita Sharma
Notes: New student for 2026 school year. Family recently moved to village.
---

Attach photo as JPG or PNG (max 5MB).

You will receive a confirmation email within 24 hours once reviewed.

Questions? Contact: admin@his-serve.org
```
