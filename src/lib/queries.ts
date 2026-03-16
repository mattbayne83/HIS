import { supabase } from './supabase'
import type {
  Student,
  StudentStatus,
  Donor,
  Donation,
  Sponsorship,
  SponsorshipStatus,
  Article,
  ContentStatus,
  Ministry,
  Profile,
  StudentMergeLog,
  Province,
  District,
  Municipality,
} from '../types/database'

// ── Students ──

export async function getStudents(status?: StudentStatus) {
  let query = supabase.from('students').select('*').order('name')
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data as Student[]
}

export async function getStudent(id: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Student
}

export async function createStudent(
  student: Omit<Student, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single()
  if (error) throw error
  return data as Student
}

export async function updateStudent(id: string, updates: Partial<Student>) {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Student
}

export async function deleteStudent(id: string) {
  const { error } = await supabase.from('students').delete().eq('id', id)
  if (error) throw error
}

// ── Nepal Location Hierarchy ──

export async function getProvinces() {
  const { data, error } = await supabase
    .from('provinces')
    .select('*')
    .order('name')
  if (error) throw error
  return data as Province[]
}

export async function getDistricts(provinceId?: number) {
  let query = supabase.from('districts').select('*').order('name')
  if (provinceId) {
    query = query.eq('province_id', provinceId)
  }
  const { data, error } = await query
  if (error) throw error
  return data as District[]
}

export async function getMunicipalities(districtId?: number) {
  let query = supabase.from('municipalities').select('*').order('name')
  if (districtId) {
    query = query.eq('district_id', districtId)
  }
  const { data, error } = await query
  if (error) throw error
  return data as Municipality[]
}

// ── Donors ──

export async function getDonors() {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .order('name')
  if (error) throw error
  return data as Donor[]
}

export async function getDonor(id: string) {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Donor
}

export async function createDonor(
  donor: Omit<Donor, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('donors')
    .insert(donor)
    .select()
    .single()
  if (error) throw error
  return data as Donor
}

export async function updateDonor(id: string, updates: Partial<Donor>) {
  const { data, error } = await supabase
    .from('donors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Donor
}

export async function deleteDonor(id: string) {
  const { error } = await supabase.from('donors').delete().eq('id', id)
  if (error) throw error
}

// ── Sponsorships ──

export async function getSponsorships(status?: SponsorshipStatus) {
  let query = supabase
    .from('sponsorships')
    .select('*, donor:donors(name, email), student:students(name, village)')
    .order('start_date', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data as Sponsorship[]
}

export async function getStudentSponsorships(studentId: string) {
  const { data, error } = await supabase
    .from('sponsorships')
    .select('*, donor:donors(name, email)')
    .eq('student_id', studentId)
    .order('start_date', { ascending: false })
  if (error) throw error
  return data as Sponsorship[]
}

export async function createSponsorship(
  sponsorship: Omit<Sponsorship, 'id' | 'donor' | 'student'>
) {
  const { data, error } = await supabase
    .from('sponsorships')
    .insert(sponsorship)
    .select()
    .single()
  if (error) throw error
  return data as Sponsorship
}

export async function updateSponsorship(
  id: string,
  updates: Partial<Sponsorship>
) {
  const { data, error } = await supabase
    .from('sponsorships')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Sponsorship
}

// ── Donations ──

export async function getDonations() {
  const { data, error } = await supabase
    .from('donations')
    .select('*, donor:donors(name, email)')
    .order('donation_date', { ascending: false })
  if (error) throw error
  return data as Donation[]
}

export async function getDonation(id: string) {
  const { data, error } = await supabase
    .from('donations')
    .select('*, donor:donors(name, email)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Donation
}

export async function getDonationsByDonor(donorId: string) {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('donor_id', donorId)
    .order('donation_date', { ascending: false })
  if (error) throw error
  return data as Donation[]
}

export async function createDonation(
  donation: Omit<Donation, 'id' | 'created_at' | 'donor'>
) {
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select()
    .single()
  if (error) throw error
  return data as Donation
}

export async function updateDonation(id: string, updates: Partial<Donation>) {
  const { data, error } = await supabase
    .from('donations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Donation
}

export async function deleteDonation(id: string) {
  const { error } = await supabase.from('donations').delete().eq('id', id)
  if (error) throw error
}

// ── Articles ──

export async function getArticles(status?: ContentStatus) {
  let query = supabase
    .from('articles')
    .select('*, author:profiles(display_name)')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data as Article[]
}

export async function getPublishedArticles(limit?: number) {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw error
  return data as Article[]
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:profiles(display_name)')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data as Article
}

export async function getArticle(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Article
}

export async function createArticle(
  article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'author'>
) {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .single()
  if (error) throw error
  return data as Article
}

export async function updateArticle(id: string, updates: Partial<Article>) {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Article
}

export async function deleteArticle(id: string) {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}

// ── Ministries ──

export async function getMinistries(status?: ContentStatus) {
  let query = supabase.from('ministries').select('*').order('sort_order')
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data as Ministry[]
}

export async function getPublishedMinistries(limit?: number) {
  let query = supabase
    .from('ministries')
    .select('*')
    .eq('status', 'published')
    .order('sort_order')
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw error
  return data as Ministry[]
}

export async function getMinistry(id: string) {
  const { data, error } = await supabase
    .from('ministries')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Ministry
}

export async function createMinistry(
  ministry: Omit<Ministry, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('ministries')
    .insert(ministry)
    .select()
    .single()
  if (error) throw error
  return data as Ministry
}

export async function updateMinistry(id: string, updates: Partial<Ministry>) {
  const { data, error } = await supabase
    .from('ministries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Ministry
}

export async function deleteMinistry(id: string) {
  const { error } = await supabase.from('ministries').delete().eq('id', id)
  if (error) throw error
}

// ── Profiles ──

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Profile
}

// ── Dashboard Stats ──

export async function getDashboardStats() {
  const [students, donors, sponsorships] = await Promise.all([
    supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase.from('donors').select('*', { count: 'exact', head: true }),
    supabase
      .from('sponsorships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
  ])

  return {
    activeStudents: students.count ?? 0,
    totalDonors: donors.count ?? 0,
    activeSponsorships: sponsorships.count ?? 0,
  }
}

// ── Phase 1: Bulk Upload & Duplicate Detection ──

/**
 * Bulk insert students (for CSV/Excel import)
 * Returns inserted students with generated IDs
 */
export async function bulkCreateStudents(
  students: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'merged_into_id'>[]
) {
  const { data, error } = await supabase
    .from('students')
    .insert(students)
    .select()

  if (error) throw error
  return data as Student[]
}

/**
 * Find potential duplicate students using the database function
 * Returns candidates for client-side fuzzy name matching
 * Matches on municipality if provided, else district (flexible for migration)
 */
export async function findPotentialDuplicates(
  name: string,
  municipalityId: number | null,
  districtId: number | null,
  age: number,
  excludeId?: string
): Promise<Student[]> {
  const { data, error } = await supabase.rpc('find_potential_duplicates', {
    p_name: name,
    p_municipality_id: municipalityId,
    p_district_id: districtId,
    p_age: age,
    p_exclude_id: excludeId || null,
  })

  if (error) throw error

  // Transform the database result to full Student objects
  const candidates = data as Array<{
    student_id: string
    name: string
    municipality_id: number | null
    district_id: number | null
    age: number
    grade: string
    photo_url: string | null
  }>

  // Fetch full student records for the candidate IDs
  const studentIds = candidates.map((c) => c.student_id)
  if (studentIds.length === 0) return []

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('*')
    .in('id', studentIds)

  if (studentsError) throw studentsError
  return students as Student[]
}

/**
 * Merge two student records
 * 1. Update kept student with selected field values
 * 2. Reassign sponsorships from merged student to kept student
 * 3. Mark merged student as 'merged' with merged_into_id
 * 4. Log the merge operation
 */
export async function mergeStudents(
  keptId: string,
  mergedId: string,
  fieldSelections: Record<string, 'A' | 'B' | 'combine'>,
  keptStudentUpdates: Partial<Student>,
  mergedBy: string
) {
  // Step 1: Update kept student with selected field values
  const { error: updateError } = await supabase
    .from('students')
    .update(keptStudentUpdates)
    .eq('id', keptId)

  if (updateError) throw updateError

  // Step 2: Reassign sponsorships from merged student to kept student
  const { error: sponsorshipError } = await supabase
    .from('sponsorships')
    .update({ student_id: keptId })
    .eq('student_id', mergedId)

  if (sponsorshipError) throw sponsorshipError

  // Step 3: Mark merged student as merged
  const { error: mergeError } = await supabase
    .from('students')
    .update({
      status: 'merged',
      merged_into_id: keptId,
    })
    .eq('id', mergedId)

  if (mergeError) throw mergeError

  // Step 4: Log the merge operation
  const { error: logError } = await supabase
    .from('student_merge_log')
    .insert({
      kept_student_id: keptId,
      merged_student_id: mergedId,
      field_selections: fieldSelections,
      merged_by: mergedBy,
    })

  if (logError) throw logError
}

/**
 * Get merge log for a student (useful for audit trail)
 */
export async function getStudentMergeLog(studentId: string) {
  const { data, error } = await supabase
    .from('student_merge_log')
    .select('*')
    .or(`kept_student_id.eq.${studentId},merged_student_id.eq.${studentId}`)
    .order('merged_at', { ascending: false })

  if (error) throw error
  return data as StudentMergeLog[]
}
