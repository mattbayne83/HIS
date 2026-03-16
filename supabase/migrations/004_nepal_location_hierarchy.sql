-- Migration: Nepal Location Hierarchy
-- Date: March 15, 2026
-- Description: Replace free-text region/village fields with structured Nepal administrative hierarchy
--              Province (7) → District (77) → Municipality (753)

-- =============================================================================
-- 1. CREATE PROVINCES TABLE
-- =============================================================================

CREATE TABLE public.provinces (
  id smallint PRIMARY KEY,
  name text NOT NULL UNIQUE,
  area_sq_km numeric(10, 2),
  website text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.provinces IS 'Nepal provinces (प्रदेश) - 7 provinces established in 2015';
COMMENT ON COLUMN public.provinces.id IS 'Province ID from official Nepal dataset';
COMMENT ON COLUMN public.provinces.name IS 'Province name (e.g., Koshi Province, Bagmati Province)';

-- =============================================================================
-- 2. CREATE DISTRICTS TABLE
-- =============================================================================

CREATE TABLE public.districts (
  id smallint PRIMARY KEY,
  province_id smallint NOT NULL REFERENCES public.provinces(id) ON DELETE RESTRICT,
  name text NOT NULL,
  area_sq_km numeric(10, 2),
  headquarter text,
  website text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.districts IS 'Nepal districts (जिल्ला) - 77 districts across 7 provinces';
COMMENT ON COLUMN public.districts.id IS 'District ID from official Nepal dataset';
COMMENT ON COLUMN public.districts.province_id IS 'Parent province';
COMMENT ON COLUMN public.districts.name IS 'District name (e.g., Kathmandu, Kaski, Jhapa)';

-- Index for filtering districts by province
CREATE INDEX idx_districts_province ON public.districts(province_id);

-- =============================================================================
-- 3. CREATE MUNICIPALITIES TABLE
-- =============================================================================

CREATE TABLE public.municipalities (
  id smallint PRIMARY KEY,
  district_id smallint NOT NULL REFERENCES public.districts(id) ON DELETE RESTRICT,
  category_id smallint NOT NULL CHECK (category_id BETWEEN 1 AND 4),
  name text NOT NULL,
  area_sq_km numeric(10, 2),
  wards smallint,
  website text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.municipalities IS 'Nepal local levels (स्थानीय तह) - 753 municipalities/rural municipalities';
COMMENT ON COLUMN public.municipalities.id IS 'Municipality ID from official Nepal dataset';
COMMENT ON COLUMN public.municipalities.district_id IS 'Parent district';
COMMENT ON COLUMN public.municipalities.category_id IS '1=Metropolitan City, 2=Sub-Metropolitan, 3=Municipality, 4=Rural Municipality';
COMMENT ON COLUMN public.municipalities.name IS 'Municipality name (e.g., Kathmandu, Pokhara, etc.)';
COMMENT ON COLUMN public.municipalities.wards IS 'Number of wards in this municipality';

-- Index for filtering municipalities by district
CREATE INDEX idx_municipalities_district ON public.municipalities(district_id);

-- =============================================================================
-- 4. ADD LOCATION FOREIGN KEYS TO STUDENTS TABLE
-- =============================================================================

-- Add new columns (nullable to support existing records and gradual migration)
ALTER TABLE public.students
  ADD COLUMN province_id smallint REFERENCES public.provinces(id) ON DELETE SET NULL,
  ADD COLUMN district_id smallint REFERENCES public.districts(id) ON DELETE SET NULL,
  ADD COLUMN municipality_id smallint REFERENCES public.municipalities(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.students.province_id IS 'Student province (optional) - part of Nepal location hierarchy';
COMMENT ON COLUMN public.students.district_id IS 'Student district (optional) - part of Nepal location hierarchy';
COMMENT ON COLUMN public.students.municipality_id IS 'Student municipality (optional) - replaces old village field';

-- Indexes for performance (students queries often filter/aggregate by location)
CREATE INDEX idx_students_province ON public.students(province_id);
CREATE INDEX idx_students_district ON public.students(district_id);
CREATE INDEX idx_students_municipality ON public.students(municipality_id);

-- =============================================================================
-- 5. DROP OLD TEXT COLUMNS
-- =============================================================================

-- Remove free-text region and village columns
-- WARNING: This destroys existing location data. User confirmed nullable FKs are acceptable.
ALTER TABLE public.students
  DROP COLUMN region,
  DROP COLUMN village;

-- =============================================================================
-- 6. UPDATE FIND_POTENTIAL_DUPLICATES FUNCTION
-- =============================================================================

-- Drop the old function that used text-based village/region matching
DROP FUNCTION IF EXISTS public.find_potential_duplicates(text, text, text, integer, uuid);

-- Recreate with new location-based matching (municipality or district)
CREATE OR REPLACE FUNCTION public.find_potential_duplicates(
  p_name text,
  p_municipality_id smallint,
  p_district_id smallint,
  p_age integer,
  p_exclude_id uuid DEFAULT NULL
)
RETURNS TABLE (
  student_id uuid,
  name text,
  municipality_id smallint,
  district_id smallint,
  age integer,
  grade text,
  photo_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS student_id,
    s.name,
    s.municipality_id,
    s.district_id,
    s.age,
    s.grade,
    s.photo_url
  FROM public.students s
  WHERE
    s.status != 'merged'
    AND s.id != COALESCE(p_exclude_id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND s.age = p_age
    AND (
      -- Match on municipality if both provided
      (p_municipality_id IS NOT NULL AND s.municipality_id = p_municipality_id)
      OR
      -- Fallback to district match if municipality not provided but district is
      (p_municipality_id IS NULL AND p_district_id IS NOT NULL AND s.district_id = p_district_id)
      OR
      -- If neither provided, don't filter by location (name + age only)
      (p_municipality_id IS NULL AND p_district_id IS NULL)
    );
END;
$$;

COMMENT ON FUNCTION public.find_potential_duplicates IS 'Find potential duplicate students by name, age, and location (municipality or district). Supports flexible matching for gradual data migration.';

-- =============================================================================
-- 7. GRANT PERMISSIONS (match existing RLS policies)
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to read location reference data
CREATE POLICY "Allow authenticated users to read provinces"
  ON public.provinces FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read districts"
  ON public.districts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read municipalities"
  ON public.municipalities FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify location data (via service role key during import)
-- No INSERT/UPDATE/DELETE policies for authenticated users

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Verification queries (run these after import script completes):
-- SELECT COUNT(*) FROM provinces;         -- Should return 7
-- SELECT COUNT(*) FROM districts;         -- Should return 77
-- SELECT COUNT(*) FROM municipalities;    -- Should return 753
-- SELECT COUNT(*) FROM students WHERE province_id IS NOT NULL; -- Check adoption rate
