import type { StudentWithLocation } from '../types/database'

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format student location as "Municipality, District, Province"
 * Returns empty string if no location data available
 */
export function formatStudentLocation(student: StudentWithLocation): string {
  const parts: string[] = []

  if (student.municipality?.name) parts.push(student.municipality.name)
  if (student.district?.name) parts.push(student.district.name)
  if (student.province?.name) parts.push(student.province.name)

  return parts.join(', ')
}

/**
 * Format student location (short form) - just municipality
 * Falls back to district, then province if municipality unavailable
 */
export function formatStudentLocationShort(student: StudentWithLocation): string {
  return student.municipality?.name || student.district?.name || student.province?.name || ''
}
