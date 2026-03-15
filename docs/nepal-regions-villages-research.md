# Nepal Regions & Villages Research

**Date**: March 14, 2026
**Status**: Research Complete — Awaiting Implementation Decision

## Executive Summary

This document contains research findings and feasibility analysis for replacing free-text `village` and `region` fields in the students table with structured dropdown selections based on Nepal's official administrative divisions.

**Key Finding**: Highly feasible — comprehensive JSON datasets exist for all levels of Nepal's administrative hierarchy, ready for import.

## Current State

### Database Schema
```sql
-- From 001_initial_schema.sql (lines 32-33)
village text not null,
region text not null,
```

Both fields are free-text, allowing users to type anything. This leads to:
- Inconsistent spelling and formatting
- Difficulty filtering and analyzing by location
- Potential data quality issues

### User Interface
[StudentsPage.tsx:466-485](../src/pages/admin/StudentsPage.tsx#L466-L485) — Simple text inputs for both fields.

## Nepal's Administrative Structure

Nepal uses a hierarchical administrative system established in 2015:

### Hierarchy Levels

1. **7 Provinces** (प्रदेश)
   - Koshi Province
   - Madhesh Province
   - Bagmati Province
   - Gandaki Province
   - Lumbini Province
   - Karnali Province
   - Sudurpaschim Province

2. **77 Districts** (जिल्ला)
   - Each province contains 7-13 districts
   - Example: Kathmandu, Kaski, Jhapa, Dolpa

3. **753 Local Levels** (स्थानीय तह)
   - 6 Metropolitan Cities (महानगरपालिका)
   - 11 Sub-Metropolitan Cities (उपमहानगरपालिका)
   - 276 Municipalities (नगरपालिका)
   - 460 Rural Municipalities/Gaunpalikas (गाउँपालिका)

4. **6,743 Wards** (वडा)
   - Too granular for our use case

### Historical Context
- Pre-2015: Nepal had 3,900+ Village Development Committees (VDCs)
- March 10, 2017: VDC system dissolved, replaced by 753 municipalities/rural municipalities
- Current system reflects federalization of Nepal's governance

## Available Data Sources

### High-Quality Datasets (GitHub)

All datasets below are complete, actively maintained, and available in JSON format:

1. **[local-states-nepal](https://github.com/sagautam5/local-states-nepal)** ⭐ Recommended
   - **Provinces**: 7 entries with names, area, website
   - **Districts**: 77 entries with province relationships
   - **Municipalities**: 753 entries with district relationships
   - **Format**: Clean JSON, English names, includes metadata (area, wards, websites)
   - **Example structure**:
     ```json
     {
       "id": 307,
       "district_id": 27,
       "category_id": 1,
       "name": "Kathmandu",
       "area_sq_km": "49.45",
       "website": "http://www.kathmandu.gov.np/",
       "wards": "32"
     }
     ```

2. **[Municipalities-data-of-Nepal](https://github.com/ajaya-man/Municipalities-data-of-Nepal)**
   - Similar structure, includes municipality type classification
   - Province → District → Municipality hierarchy preserved

3. **[Nepal-Local-Level-Database](https://github.com/ashokbasnet/Nepal-Local-Level-Database)**
   - Multiple formats: JSON, CSV, SQL
   - Ready for direct database import

### GeoJSON Resources (for future map features)
- **[geoJSON-Nepal](https://github.com/mesaugat/geoJSON-Nepal)** — Province, district, municipality boundaries
- **[Local Boundaries - Open Knowledge Nepal](https://localboundries.oknp.org/)** — TopoJSON format

## Implementation Options

### Option A: Province + Municipality ⭐ Recommended

**Structure:**
- `region` → Province (7 options, dropdown)
- `village` → Municipality/Rural Municipality (753 options, searchable dropdown)

**Implementation:**
```sql
-- Migration: 004_locations_lookup.sql
CREATE TABLE provinces (
  id int primary key,
  name text not null unique,
  area_sq_km numeric,
  website text
);

CREATE TABLE districts (
  id int primary key,
  province_id int not null references provinces(id),
  name text not null,
  area_sq_km numeric,
  headquarter text,
  website text
);

CREATE TABLE municipalities (
  id int primary key,
  district_id int not null references districts(id),
  category_id int not null, -- 1=metro, 2=sub-metro, 3=muni, 4=rural
  name text not null,
  area_sq_km numeric,
  wards int,
  website text
);

-- Update students table (preserve existing data)
ALTER TABLE students ADD COLUMN province_id int references provinces(id);
ALTER TABLE students ADD COLUMN municipality_id int references municipalities(id);
-- Keep old fields for backward compatibility during migration
```

**UI Changes:**
- Province dropdown (7 options)
- Municipality searchable dropdown (753 options, grouped by district)
- Cascading selection: province → district → municipality
- Auto-populate legacy `region` and `village` fields for backward compatibility

**Pros:**
- Most accurate to Nepal's current administrative structure
- Enables powerful filtering and analytics
- Future-proof for map features (GeoJSON available)
- Structured data improves reporting

**Cons:**
- 753 municipalities is substantial (but manageable with search)
- Requires migration of existing data
- More complex UI (cascading dropdowns)

### Option B: District + Free-text Village

**Structure:**
- `region` → District (77 options, dropdown)
- `village` → Free-text (keep current behavior)

**Pros:**
- Simpler implementation
- Flexible for small villages not in official lists
- Easier migration (fewer options)

**Cons:**
- Less structured data for `village` field
- Harder to analyze/aggregate by village
- Doesn't leverage Nepal's official municipality system

### Option C: Province + District

**Structure:**
- `region` → Province (7 options)
- `village` → District (77 options, filtered by selected province)

**Pros:**
- Clean two-tier hierarchy
- Manageable dropdown sizes
- Easy cascading selection

**Cons:**
- Districts aren't really "villages"
- Less granular than municipality level
- Doesn't match how Nepalis describe locations

## Recommended Approach

**Start with Option B**, then migrate to Option A after field testing:

### Phase 1: Low-Risk Implementation (2-3 days)
1. Create `districts` lookup table (77 rows)
2. Add `district_id` foreign key to students table
3. Update StudentsPage form: replace `region` text input with district dropdown
4. Keep `village` as free-text
5. Preserve legacy `region` field for backward compatibility

### Phase 2: Full Structure (1-2 weeks, after Phase 1 validation)
1. Create `provinces` and `municipalities` lookup tables
2. Add `province_id` and `municipality_id` to students table
3. Implement cascading province → district → municipality UI
4. Data migration tool for existing records
5. Analytics dashboard by location

## Data Import Script (Ready to Use)

```javascript
// scripts/import-nepal-locations.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Need service key for admin operations
)

async function importProvinces() {
  const response = await fetch(
    'https://raw.githubusercontent.com/sagautam5/local-states-nepal/master/dataset/provinces/en.json'
  )
  const provinces = await response.json()

  const { error } = await supabase.from('provinces').insert(provinces)
  if (error) throw error
  console.log(`✓ Imported ${provinces.length} provinces`)
}

async function importDistricts() {
  const response = await fetch(
    'https://raw.githubusercontent.com/sagautam5/local-states-nepal/master/dataset/districts/en.json'
  )
  const districts = await response.json()

  const { error } = await supabase.from('districts').insert(districts)
  if (error) throw error
  console.log(`✓ Imported ${districts.length} districts`)
}

async function importMunicipalities() {
  const response = await fetch(
    'https://raw.githubusercontent.com/sagautam5/local-states-nepal/master/dataset/municipalities/en.json'
  )
  const municipalities = await response.json()

  // Batch insert (Supabase has 1000 row limit per request)
  const batches = []
  for (let i = 0; i < municipalities.length; i += 500) {
    batches.push(municipalities.slice(i, i + 500))
  }

  for (const batch of batches) {
    const { error } = await supabase.from('municipalities').insert(batch)
    if (error) throw error
  }
  console.log(`✓ Imported ${municipalities.length} municipalities`)
}

// Run: node scripts/import-nepal-locations.js
await importProvinces()
await importDistricts()
await importMunicipalities()
console.log('✓ All Nepal location data imported')
```

## Migration Strategy for Existing Data

If students table already has data:

1. **Manual review**: Export existing distinct `region` and `village` values
2. **Fuzzy matching**: Use Levenshtein distance (already in codebase at `utils/fuzzyMatch.ts`) to map to official names
3. **Admin review UI**: Show unmapped values, let admin manually select correct district/municipality
4. **Null handling**: Allow `district_id` and `municipality_id` to be nullable initially

## Analytics Opportunities

Once structured location data is in place:

- **Dashboard map**: Aggregate students by district/municipality (currently blocked — see [tasks/backlog.md:47](../tasks/backlog.md#L47))
- **Reports**: Students per province, sponsorship coverage by region
- **Trends**: Growth in specific districts over time
- **Donor targeting**: Match donors to students in specific regions

## References & Sources

- [Administrative divisions of Nepal - Wikipedia](https://en.wikipedia.org/wiki/Administrative_divisions_of_Nepal)
- [List of districts of Nepal - Wikipedia](https://en.wikipedia.org/wiki/List_of_districts_of_Nepal)
- [Provinces of Nepal - Wikipedia](https://en.wikipedia.org/wiki/Provinces_of_Nepal)
- [Nepal location data in JSON format - Medium](https://medium.com/@abhirimal009/nepal-location-data-in-json-format-provinces-districts-and-municipalities-5a0022a48839)
- [local-states-nepal GitHub Repository](https://github.com/sagautam5/local-states-nepal) ⭐
- [Municipalities-data-of-Nepal GitHub Repository](https://github.com/ajaya-man/Municipalities-data-of-Nepal)
- [Nepal-Local-Level-Database GitHub Repository](https://github.com/ashokbasnet/Nepal-Local-Level-Database)
- [GeoJSON-Nepal GitHub Repository](https://github.com/mesaugat/geoJSON-Nepal) (for map features)
- [Local Boundaries - Open Knowledge Nepal](https://localboundries.oknp.org/) (TopoJSON geodata)

## Next Steps

If you decide to proceed:

1. **Choose implementation option** (A, B, or C)
2. **Review migration approach** for existing student data
3. **Create database migration** (004_locations_lookup.sql)
4. **Import location data** (run import script)
5. **Update UI components** (replace text inputs with dropdowns)
6. **Test with sample data** before production rollout

---

**Questions? Concerns?**

- Will VSS coordinators in the field know official municipality names, or do they use informal village names?
- Should we support both (official + local name alias)?
- Do existing student records have consistent region/village naming that we can migrate programmatically?
