export type UserRole = 'admin' | 'editor' | 'viewer'
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'merged'
export type SponsorshipStatus = 'active' | 'ended'
export type ContentStatus = 'draft' | 'published'

export interface Profile {
  id: string
  display_name: string
  role: UserRole
  created_at: string
}

// Nepal Location Hierarchy
export interface Province {
  id: number
  name: string
  area_sq_km: number | null
  website: string | null
  created_at: string
}

export interface District {
  id: number
  province_id: number
  name: string
  area_sq_km: number | null
  headquarter: string | null
  website: string | null
  created_at: string
}

export interface Municipality {
  id: number
  district_id: number
  category_id: number
  name: string
  area_sq_km: number | null
  wards: number | null
  website: string | null
  created_at: string
}

export interface Student {
  id: string
  name: string
  age: number
  grade: string
  province_id: number | null
  district_id: number | null
  municipality_id: number | null
  coordinator: string
  photo_url: string | null
  status: StudentStatus
  notes: string | null
  merged_into_id: string | null
  created_at: string
  updated_at: string
}

// Student with location names joined from location tables
export interface StudentWithLocation extends Student {
  province?: Province | null
  district?: District | null
  municipality?: Municipality | null
}

export interface Donor {
  id: string
  name: string
  email: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Sponsorship {
  id: string
  donor_id: string
  student_id: string
  start_date: string
  end_date: string | null
  status: SponsorshipStatus
  notes: string | null
  donor?: Donor
  student?: Student
}

export interface Donation {
  id: string
  donor_id: string
  amount_cents: number
  currency: string
  purpose: string | null
  donation_date: string
  payment_method: string | null
  stripe_payment_id: string | null
  notes: string | null
  created_at: string
  donor?: Donor
}

export interface Article {
  id: string
  title: string
  slug: string
  body: Record<string, unknown>
  excerpt: string | null
  featured_image_url: string | null
  status: ContentStatus
  published_at: string | null
  author_id: string
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Ministry {
  id: string
  name: string
  slug: string
  description: string
  region: string | null
  featured_image_url: string | null
  status: ContentStatus
  sort_order: number
  created_at: string
  updated_at: string
}

// Phase 1: Duplicate Detection & Merge Support

export interface StudentMergeLog {
  id: string
  kept_student_id: string
  merged_student_id: string
  field_selections: Record<string, 'A' | 'B'>
  merged_by: string
  merged_at: string
}

export interface DuplicateCandidate {
  student: Student
  matchScore: number
  reasons: string[]
}
