# Implementation Plan: Nepal Location Hierarchy

**Date**: March 15, 2026
**Status**: Planning Complete — Awaiting Approval

---

## Goal

Replace free-text `region` and `village` fields in the students table with structured Nepal administrative hierarchy (Province → District → Municipality), making all location fields optional to support gradual data migration.

---

## Acceptance Criteria

- [ ] Database schema includes `provinces`, `districts`, `municipalities` lookup tables with proper foreign keys
- [ ] Students table references location hierarchy via foreign keys (nullable)
- [ ] Location data imported from GitHub JSON sources (7 provinces, 77 districts, 753 municipalities)
- [ ] Student add/edit form shows cascading Province → District → Municipality dropdowns
- [ ] Legacy `region` and `village` text fields removed from schema and forms
- [ ] Bulk CSV upload supports optional location columns
- [ ] Existing students without location data remain valid (nullable foreign keys)
- [ ] Dashboard map can aggregate students by province/district
- [ ] All TypeScript types updated to reflect new schema
- [ ] ESLint passes with zero warnings

---

## Steps

### 1. Create Database Migration (Complexity: Medium)

**Files**:
- `supabase/migrations/004_nepal_location_hierarchy.sql` (new)

**Actions**:
1. Create `provinces` table:
   - `id` (smallint PK) — matches JSON dataset IDs
   - `name` (text, unique, not null)
   - `area_sq_km` (numeric, nullable)
   - `website` (text, nullable)

2. Create `districts` table:
   - `id` (smallint PK)
   - `province_id` (smallint FK → provinces.id, not null)
   - `name` (text, not null)
   - `area_sq_km` (numeric, nullable)
   - `headquarter` (text, nullable)
   - `website` (text, nullable)

3. Create `municipalities` table:
   - `id` (smallint PK)
   - `district_id` (smallint FK → districts.id, not null)
   - `category_id` (smallint, not null) — 1=metro, 2=sub-metro, 3=muni, 4=rural
   - `name` (text, not null)
   - `area_sq_km` (numeric, nullable)
   - `wards` (smallint, nullable)
   - `website` (text, nullable)

4. Add new columns to `students` table:
   - `province_id` (smallint FK → provinces.id, **nullable**)
   - `district_id` (smallint FK → districts.id, **nullable**)
   - `municipality_id` (smallint FK → municipalities.id, **nullable**)

5. Drop old text columns:
   - `ALTER TABLE students DROP COLUMN region;`
   - `ALTER TABLE students DROP COLUMN village;`

6. Add indexes for performance:
   - `CREATE INDEX idx_students_province ON students(province_id);`
   - `CREATE INDEX idx_students_district ON students(district_id);`
   - `CREATE INDEX idx_students_municipality ON students(municipality_id);`

**Risk**: Dropping `region` and `village` columns destroys existing location data.
**Mitigation**:
- Make foreign keys nullable so existing students remain valid
- User confirmed "replace the existing region and village fields" — no backup needed
- Location hierarchy is optional, not required

---

### 2. Create Data Import Script (Complexity: Low)

**Files**:
- `scripts/import-nepal-locations.js` (new)

**Actions**:
1. Fetch JSON from GitHub (sagautam5/local-states-nepal):
   - `dataset/provinces/en.json` → 7 provinces
   - `dataset/districts/en.json` → 77 districts
   - `dataset/municipalities/en.json` → 753 municipalities

2. Transform data to match table schema (map JSON fields to DB columns)

3. Batch insert into Supabase:
   - Use service role key (admin permissions required)
   - Handle 1000-row Supabase limit (batch municipalities in chunks of 500)
   - Log progress and handle errors

4. Add to `package.json` scripts:
   ```json
   "import:locations": "node scripts/import-nepal-locations.js"
   ```

**Risk**: Service role key exposure if committed to git.
**Mitigation**:
- Use `.env.local` for `SUPABASE_SERVICE_KEY` (already gitignored)
- Document in script comments: "Never commit service key"

---

### 3. Update TypeScript Types (Complexity: Low)

**Files**:
- `src/types/database.ts`

**Actions**:
1. Add new interfaces:
   ```typescript
   export interface Province {
     id: number
     name: string
     area_sq_km: number | null
     website: string | null
   }

   export interface District {
     id: number
     province_id: number
     name: string
     area_sq_km: number | null
     headquarter: string | null
     website: string | null
   }

   export interface Municipality {
     id: number
     district_id: number
     category_id: number
     name: string
     area_sq_km: number | null
     wards: number | null
     website: string | null
   }
   ```

2. Update `Student` interface:
   ```typescript
   export interface Student {
     id: string
     name: string
     age: number
     grade: string
     province_id: number | null      // NEW - replaces region
     district_id: number | null      // NEW
     municipality_id: number | null  // NEW - replaces village
     coordinator: string
     photo_url: string | null
     status: StudentStatus
     notes: string | null
     merged_into_id: string | null
     created_at: string
     updated_at: string
   }
   ```

**Risk**: Breaking changes across codebase.
**Mitigation**: TypeScript compiler will catch all usages of removed `region`/`village` fields.

---

### 4. Add Location Query Functions (Complexity: Low)

**Files**:
- `src/lib/queries.ts`

**Actions**:
1. Add query functions:
   ```typescript
   export async function getProvinces(): Promise<Province[]>
   export async function getDistricts(provinceId?: number): Promise<District[]>
   export async function getMunicipalities(districtId?: number): Promise<Municipality[]>
   ```

2. Each function:
   - Queries Supabase table
   - Orders by `name` ascending
   - Filters by parent ID if provided (e.g., `getDistricts(3)` returns only Bagmati districts)
   - Returns typed array

**Risk**: None — simple SELECT queries.

---

### 5. Update StudentsPage Form (Complexity: High)

**Files**:
- `src/pages/admin/StudentsPage.tsx`

**Actions**:
1. Update `StudentFormData` type:
   - Remove `village: string` and `region: string`
   - Add `province_id: string`, `district_id: string`, `municipality_id: string` (string for form state, converted to number on submit)

2. Add `useQuery` hooks for location data:
   ```typescript
   const { data: provinces } = useQuery(getProvinces)
   const { data: districts } = useQuery(
     () => form.province_id ? getDistricts(Number(form.province_id)) : Promise.resolve([]),
     [form.province_id]
   )
   const { data: municipalities } = useQuery(
     () => form.district_id ? getMunicipalities(Number(form.district_id)) : Promise.resolve([]),
     [form.district_id]
   )
   ```

3. Add cascading dropdown logic:
   - Province select: always enabled, onChange resets district + municipality
   - District select: disabled until province selected, onChange resets municipality
   - Municipality select: disabled until district selected

4. Replace old text inputs with Select dropdowns:
   ```tsx
   <Select
     label="Province (Optional)"
     placeholder="Select province"
     options={(provinces ?? []).map(p => ({ value: String(p.id), label: p.name }))}
     value={form.province_id}
     onChange={(e) => {
       setField('province_id', e.target.value)
       setField('district_id', '')
       setField('municipality_id', '')
     }}
   />
   ```

5. Update form submission:
   - Convert string IDs to numbers: `province_id: form.province_id ? Number(form.province_id) : null`
   - Handle empty strings as null (optional fields)

6. Update DataTable columns:
   - Replace "Region" column with "Province" (show name via join or client-side lookup)
   - Replace "Village" column with "Municipality"
   - Handle null values: display "—" or empty string

7. Update search/filter logic:
   - Remove `region` and `village` substring filters
   - Add province/district/municipality dropdown filters (optional enhancement for future)

**Risk**: Complex state management with cascading resets.
**Mitigation**:
- Follow existing SponsorshipsPage pattern for foreign key selects
- Test cascade resets thoroughly
- Use TypeScript to prevent invalid state

---

### 6. Update Duplicate Detection (Complexity: Medium)

**Files**:
- `supabase/migrations/003_phase1_duplicate_detection.sql` (existing)
- `src/lib/queries.ts` (existing)
- `src/pages/admin/StudentsPage.tsx` (existing)

**Actions**:
1. Update `find_potential_duplicates()` RPC function:
   - Change parameters: remove `p_village text`, `p_region text`
   - Add parameters: `p_municipality_id smallint`, `p_district_id smallint` (nullable)
   - Update WHERE clause to match on municipality_id OR district_id (if provided)
   - **Decision**: Match on municipality if provided, else district (flexible for migration)

2. Update `findPotentialDuplicates()` TypeScript function:
   - Change signature: `(name, municipalityId, districtId, age, excludeId)`
   - Pass new parameters to RPC call

3. Update duplicate detection trigger in StudentsPage:
   - Watch `form.municipality_id` and `form.district_id` instead of village/region
   - Debounce logic remains the same

**Risk**: Breaking existing duplicate detection until all 3 files updated together.
**Mitigation**: Update all files in single commit, test before merging.

---

### 7. Update Bulk Upload (Complexity: Medium)

**Files**:
- `src/pages/admin/BulkUploadPage.tsx`
- `src/utils/validation.ts`

**Actions**:
1. Update `StudentRow` interface:
   - Remove `village` and `region`
   - Add optional `province`, `district`, `municipality` (text names, not IDs)

2. Update CSV column validation:
   - Remove `village` and `region` from `requiredColumns` array
   - Make location columns optional

3. Add location name → ID lookup logic:
   - Fetch all provinces/districts/municipalities once on upload
   - Map CSV text values to IDs (case-insensitive match)
   - Warn if name not found in reference data
   - Allow null if not provided

4. Update `validateStudentRow()`:
   - Remove village/region validation
   - Add optional province/district/municipality validation (warn if invalid, don't block)

5. Update preview table columns:
   - Show province/district/municipality names
   - Show warning icon if location name not recognized

**Risk**: CSV with old `village`/`region` columns will fail.
**Mitigation**:
- Document CSV format change in upload instructions
- Show clear error message if old columns detected
- Provide migration guide (manual mapping)

---

### 8. Update Export Utilities (Complexity: Low)

**Files**:
- `src/utils/exportUtils.ts`

**Actions**:
1. Update CSV export (`exportStudentsToCSV()`):
   - Replace `village` and `region` columns with `province`, `district`, `municipality` (names, not IDs)
   - Fetch location data to map IDs → names
   - Handle null values (empty string in CSV)

2. Update PDF export (`exportStudentProfilePDF()`):
   - Replace "Village" and "Region" labels with "Municipality" and "District"
   - Show province in header or skip if not critical
   - Handle null values gracefully

**Risk**: None — output only.

---

### 9. Update Dashboard Map (Complexity: Low)

**Files**:
- `src/pages/admin/DashboardPage.tsx`

**Actions**:
1. Fetch students with location data:
   ```typescript
   const studentsWithLocation = students.filter(s => s.district_id !== null)
   ```

2. Aggregate by district:
   ```typescript
   const byDistrict = studentsWithLocation.reduce((acc, s) => {
     acc[s.district_id!] = (acc[s.district_id!] || 0) + 1
     return acc
   }, {} as Record<number, number>)
   ```

3. Pass aggregated data to map component (placeholder for now)

**Note**: Full map implementation with GeoJSON is P2 — this step just unblocks data prep.

---

### 10. Run Migration & Import Data (Complexity: Low)

**Actions**:
1. Run migration in Supabase SQL Editor:
   ```bash
   # Copy contents of 004_nepal_location_hierarchy.sql
   # Paste into Supabase dashboard → SQL Editor → Run
   ```

2. Run import script:
   ```bash
   npm run import:locations
   ```

3. Verify data:
   ```sql
   SELECT COUNT(*) FROM provinces;    -- Should be 7
   SELECT COUNT(*) FROM districts;    -- Should be 77
   SELECT COUNT(*) FROM municipalities; -- Should be 753
   ```

**Risk**: Migration fails mid-way, leaving partial schema.
**Mitigation**: Test migration in staging/local Supabase first, then apply to production.

---

### 11. Update All Affected Components (Complexity: Low)

**Files** (search for `student.village` and `student.region`):
- `src/pages/admin/SponsorshipsPage.tsx` — Student display in dropdown
- `src/components/students/DuplicateWarningCard.tsx` — Duplicate preview
- `src/components/students/MergeStudentsModal.tsx` — Merge preview

**Actions**:
1. Search codebase for `.village` and `.region` property access
2. Replace with `.municipality_id` / `.district_id` lookups
3. Fetch location names via query functions and display
4. Handle null values with fallback "—" or empty string

**Risk**: Missing a usage breaks UI at runtime.
**Mitigation**: TypeScript compiler errors will catch most; manual testing catches rest.

---

### 12. Testing & Verification (Complexity: Medium)

**Manual Test Checklist**:
- [ ] Create new student with all location fields filled → saves correctly
- [ ] Create new student with NO location fields → saves as null (optional)
- [ ] Edit existing student, change district → municipality dropdown resets
- [ ] Search students by name → works (location not in search yet)
- [ ] Bulk upload CSV with location columns → maps to IDs correctly
- [ ] Bulk upload CSV WITHOUT location columns → accepts nulls
- [ ] Export students to CSV → shows location names
- [ ] Export student PDF → shows location names
- [ ] Duplicate detection triggers when municipality matches
- [ ] Dashboard shows student count (location stats TBD)

**Automated Testing**:
- [ ] Run `npm run lint` → zero warnings
- [ ] TypeScript compiler → zero errors

---

## Open Questions

### 1. Duplicate Detection Matching Strategy ✅ RESOLVED
Should duplicates match on:
- ~~Option A: Exact municipality only (most strict)~~
- ~~Option B: District-level (broader, catches more potential duplicates)~~
- **Option C: Municipality if provided, else district (flexible)** ← **SELECTED**

**Decision**: Use flexible matching to support gradual data migration.

### 2. CSV Bulk Upload Column Names ✅ RESOLVED
Should CSV use:
- ~~Option A: ID columns (`province_id`, `district_id`, `municipality_id`)~~
- **Option B: Name columns (`province`, `district`, `municipality`) → mapped to IDs** ← **SELECTED**
- ~~Option C: Both supported~~

**Decision**: Name columns are more user-friendly for field coordinators.

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Breaking existing student data | **High** | Nullable foreign keys, optional fields in forms |
| TypeScript errors across codebase | **Medium** | Compiler catches all `.village`/`.region` access |
| CSV upload format change | **Medium** | Clear documentation, helpful error messages |
| Complex cascading dropdown bugs | **Medium** | Follow proven SponsorshipsPage pattern, thorough testing |
| Service key exposure | **Low** | `.env.local` gitignored, script comments warn user |
| Migration rollback difficulty | **Low** | Can re-add `region`/`village` columns if needed |

---

## Verification

After implementation, verify:
1. **Database**: 7 provinces, 77 districts, 753 municipalities imported
2. **Forms**: Cascading dropdowns work, all optional
3. **Data integrity**: Existing students still load (location fields null)
4. **Bulk import**: CSV with location names maps correctly
5. **Export**: CSV/PDF show location names
6. **TypeScript**: Zero compiler errors
7. **ESLint**: Zero warnings
8. **Dashboard**: Map data prep works (aggregation by district)

---

## Estimated Complexity

- **Database work**: 4 hours (migration + import script)
- **TypeScript updates**: 2 hours (types + queries)
- **Form components**: 6 hours (StudentsPage cascading logic + testing)
- **Bulk upload**: 3 hours (CSV mapping + validation)
- **Export/other**: 2 hours (PDF, CSV, affected components)
- **Testing**: 3 hours (manual + edge cases)

**Total**: ~20 hours (2-3 days)

---

## Implementation Order

1. Database migration (step 1)
2. Data import script (step 2)
3. Run migration + import (step 10) — **checkpoint: verify data**
4. TypeScript types (step 3)
5. Query functions (step 4)
6. StudentsPage form (step 5) — **largest change**
7. Duplicate detection (step 6)
8. Bulk upload (step 7)
9. Export utilities (step 8)
10. Affected components (step 11)
11. Dashboard map prep (step 9)
12. Testing (step 12)

Each step is independently testable. Can commit/deploy incrementally if needed.
