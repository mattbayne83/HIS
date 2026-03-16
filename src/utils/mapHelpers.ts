import type { StudentWithLocation, Ministry } from '../types/database'
import type { MapLocation } from '../types/map'
import { getCoordinates } from '../data/nepal-locations'
import { formatStudentLocation } from './format'

/**
 * Group students by municipality and produce one MapLocation per municipality.
 * Students whose location can't be geocoded are silently skipped.
 */
export function studentsToGroupedLocations(students: StudentWithLocation[]): MapLocation[] {
  const grouped = new Map<
    string,
    { coords: [number, number]; locationName: string; count: number }
  >()

  for (const s of students) {
    // Skip students without location data
    if (!s.municipality?.name || !s.district?.name) continue

    // Try to get coordinates using municipality and district names
    const coords = getCoordinates(s.municipality.name, s.district.name)
    if (!coords) continue

    const key = `${s.municipality.name}|${s.district.name}|${s.province?.name || ''}`
    const existing = grouped.get(key)
    if (existing) {
      existing.count += 1
    } else {
      grouped.set(key, {
        coords,
        locationName: formatStudentLocation(s),
        count: 1
      })
    }
  }

  return Array.from(grouped.entries()).map(([key, { coords, locationName, count }]) => ({
    id: key,
    lat: coords[0],
    lng: coords[1],
    label: key.split('|')[0], // Municipality name
    type: 'student',
    details: {
      region: locationName,
      count,
      description: `${count} sponsored student${count === 1 ? '' : 's'}`,
    },
  }))
}

/**
 * One MapLocation per student (not grouped).
 */
export function studentsToMapLocations(students: StudentWithLocation[]): MapLocation[] {
  const locations: MapLocation[] = []

  for (const s of students) {
    // Skip students without location data
    if (!s.municipality?.name || !s.district?.name) continue

    const coords = getCoordinates(s.municipality.name, s.district.name)
    if (!coords) continue

    locations.push({
      id: s.id,
      lat: coords[0],
      lng: coords[1],
      label: s.municipality.name,
      type: 'student',
      details: {
        region: formatStudentLocation(s),
        description: `${s.name}, Grade ${s.grade}`,
      },
    })
  }

  return locations
}

/**
 * Convert ministries to map locations.
 */
export function ministriesToMapLocations(ministries: Ministry[]): MapLocation[] {
  const locations: MapLocation[] = []

  for (const m of ministries) {
    if (!m.region) continue
    const coords = getCoordinates(m.name, m.region)
    if (!coords) continue

    locations.push({
      id: m.id,
      lat: coords[0],
      lng: coords[1],
      label: m.name,
      type: 'ministry',
      details: {
        region: m.region,
        description: m.description,
      },
    })
  }

  return locations
}
