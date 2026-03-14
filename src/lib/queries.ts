import { supabase } from './supabase'
import type {
  Student,
  StudentStatus,
  Donor,
  Sponsorship,
  SponsorshipStatus,
  Article,
  ContentStatus,
  Ministry,
  Profile,
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
