#!/usr/bin/env node

/**
 * Import Nepal Location Data
 *
 * Fetches province, district, and municipality data from GitHub
 * and imports into Supabase database.
 *
 * Data source: https://github.com/sagautam5/local-states-nepal
 *
 * Usage:
 *   1. Ensure .env.local exists with SUPABASE_SERVICE_KEY
 *   2. Run: npm run import:locations
 *
 * WARNING: Never commit SUPABASE_SERVICE_KEY to git!
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY // Service role key required for admin operations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables')
  console.error('   Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY')
  console.error('   Add SUPABASE_SERVICE_KEY to .env.local (do NOT commit to git)')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// GitHub raw URLs for Nepal location data
const DATA_SOURCES = {
  provinces: 'https://raw.githubusercontent.com/sagautam5/local-states-nepal/master/dataset/provinces/en.json',
  districts: 'https://raw.githubusercontent.com/sagautam5/local-states-nepal/master/dataset/districts/en.json',
  municipalities: 'https://raw.githubusercontent.com/sagautam5/local-states-nepal/master/dataset/municipalities/en.json',
}

/**
 * Fetch JSON data from GitHub
 */
async function fetchData(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Transform province data to match our schema
 */
function transformProvinces(data) {
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    area_sq_km: p.area_sq_km ? parseFloat(p.area_sq_km) : null,
    website: p.website || null,
  }))
}

/**
 * Transform district data to match our schema
 */
function transformDistricts(data) {
  return data.map((d) => ({
    id: d.id,
    province_id: d.province_id,
    name: d.name,
    area_sq_km: d.area_sq_km ? parseFloat(d.area_sq_km) : null,
    headquarter: d.headquarter || null,
    website: d.website || null,
  }))
}

/**
 * Transform municipality data to match our schema
 */
function transformMunicipalities(data) {
  return data.map((m) => ({
    id: m.id,
    district_id: m.district_id,
    category_id: m.category_id,
    name: m.name,
    area_sq_km: m.area_sq_km ? parseFloat(m.area_sq_km) : null,
    wards: m.wards ? parseInt(m.wards, 10) : null,
    website: m.website || null,
  }))
}

/**
 * Insert data in batches (Supabase has 1000 row limit per request)
 */
async function batchInsert(table, data, batchSize = 500) {
  const batches = []
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize))
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`   Inserting batch ${i + 1}/${batches.length} (${batch.length} rows)...`)

    const { error } = await supabase.from(table).insert(batch)

    if (error) {
      throw new Error(`Failed to insert into ${table}: ${error.message}`)
    }
  }
}

/**
 * Main import function
 */
async function importLocations() {
  console.log('🇳🇵 Importing Nepal Location Data\n')

  try {
    // 1. Import Provinces
    console.log('📍 Fetching provinces...')
    const provincesData = await fetchData(DATA_SOURCES.provinces)
    const provinces = transformProvinces(provincesData)
    console.log(`   Found ${provinces.length} provinces`)

    console.log('   Inserting into database...')
    await batchInsert('provinces', provinces)
    console.log(`   ✓ Imported ${provinces.length} provinces\n`)

    // 2. Import Districts
    console.log('📍 Fetching districts...')
    const districtsData = await fetchData(DATA_SOURCES.districts)
    const districts = transformDistricts(districtsData)
    console.log(`   Found ${districts.length} districts`)

    console.log('   Inserting into database...')
    await batchInsert('districts', districts)
    console.log(`   ✓ Imported ${districts.length} districts\n`)

    // 3. Import Municipalities
    console.log('📍 Fetching municipalities...')
    const municipalitiesData = await fetchData(DATA_SOURCES.municipalities)
    const municipalities = transformMunicipalities(municipalitiesData)
    console.log(`   Found ${municipalities.length} municipalities`)

    console.log('   Inserting into database (batched)...')
    await batchInsert('municipalities', municipalities, 500) // Batch size 500 for safety
    console.log(`   ✓ Imported ${municipalities.length} municipalities\n`)

    // 4. Verification
    console.log('🔍 Verifying import...')
    const { count: provinceCount } = await supabase
      .from('provinces')
      .select('*', { count: 'exact', head: true })

    const { count: districtCount } = await supabase
      .from('districts')
      .select('*', { count: 'exact', head: true })

    const { count: municipalityCount } = await supabase
      .from('municipalities')
      .select('*', { count: 'exact', head: true })

    console.log(`   Provinces: ${provinceCount}`)
    console.log(`   Districts: ${districtCount}`)
    console.log(`   Municipalities: ${municipalityCount}`)

    if (provinceCount === 7 && districtCount === 77 && municipalityCount === 753) {
      console.log('\n✅ Import complete! All location data verified.')
    } else {
      console.log('\n⚠️  Import complete, but counts are unexpected.')
      console.log('   Expected: 7 provinces, 77 districts, 753 municipalities')
    }

  } catch (error) {
    console.error('\n❌ Import failed:', error.message)
    process.exit(1)
  }
}

// Run import
importLocations()
