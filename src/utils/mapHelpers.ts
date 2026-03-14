import type { Student, Ministry } from '../types/database'
import type { MapLocation } from '../types/map'
import { getCoordinates } from '../data/nepal-locations'

/**
 * Group students by village and produce one MapLocation per village.
 * Students whose village/region can't be geocoded are silently skipped.
 */
export function studentsToGroupedLocations(students: Student[]): MapLocation[] {
  const grouped = new Map<
    string,
    { coords: [number, number]; region: string; count: number }
  >()

  for (const s of students) {
    const coords = getCoordinates(s.village, s.region)
    if (!coords) continue

    const key = `${s.village}|${s.region}`
    const existing = grouped.get(key)
    if (existing) {
      existing.count += 1
    } else {
      grouped.set(key, { coords, region: s.region, count: 1 })
    }
  }

  return Array.from(grouped.entries()).map(([key, { coords, region, count }]) => ({
    id: key,
    lat: coords[0],
    lng: coords[1],
    label: key.split('|')[0],
    type: 'student',
    details: {
      region,
      count,
      description: `${count} sponsored student${count === 1 ? '' : 's'}`,
    },
  }))
}

/**
 * One MapLocation per student (not grouped).
 */
export function studentsToMapLocations(students: Student[]): MapLocation[] {
  const locations: MapLocation[] = []

  for (const s of students) {
    const coords = getCoordinates(s.village, s.region)
    if (!coords) continue

    locations.push({
      id: s.id,
      lat: coords[0],
      lng: coords[1],
      label: s.village,
      type: 'student',
      details: {
        region: s.region,
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
