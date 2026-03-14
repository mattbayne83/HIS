import type { NepalRegion } from '../types/map'

/**
 * Static coordinate lookup for Nepal villages and regions.
 * Coordinates sourced from OpenStreetMap.
 * Expand this file as new villages/programs are added.
 */

export const NEPAL_CENTER: [number, number] = [28.3949, 84.124]
export const NEPAL_BOUNDS: [[number, number], [number, number]] = [
  [26.3, 80.0],
  [30.5, 88.2],
]

export const REGIONS: Record<string, NepalRegion> = {
  'Kathmandu Valley': {
    name: 'Kathmandu Valley',
    center: [27.7172, 85.324],
    villages: {
      Kathmandu: [27.7172, 85.324],
      Bhaktapur: [27.671, 85.4298],
      Patan: [27.6768, 85.318],
      Kirtipur: [27.6783, 85.2781],
    },
  },
  'Pokhara Region': {
    name: 'Pokhara Region',
    center: [28.2096, 83.9856],
    villages: {
      Pokhara: [28.2096, 83.9856],
      Ghandruk: [28.3719, 83.8078],
      Sarangkot: [28.2446, 83.9465],
    },
  },
  Chitwan: {
    name: 'Chitwan',
    center: [27.5291, 84.3542],
    villages: {
      Bharatpur: [27.6833, 84.4333],
      Sauraha: [27.5875, 84.4953],
    },
  },
  Lumbini: {
    name: 'Lumbini',
    center: [27.4833, 83.2763],
    villages: {
      Lumbini: [27.4833, 83.2763],
      Butwal: [27.7006, 83.4483],
      Siddharthanagar: [27.5057, 83.4486],
    },
  },
  Mustang: {
    name: 'Mustang',
    center: [28.9985, 83.8473],
    villages: {
      Jomsom: [28.7804, 83.7347],
      Kagbeni: [28.8375, 83.7839],
      Muktinath: [28.8167, 83.8667],
    },
  },
  Solukhumbu: {
    name: 'Solukhumbu',
    center: [27.7909, 86.7156],
    villages: {
      Namche: [27.8069, 86.7142],
      Lukla: [27.6872, 86.7311],
    },
  },
  Dolakha: {
    name: 'Dolakha',
    center: [27.7875, 86.0678],
    villages: {
      Charikot: [27.6667, 86.05],
    },
  },
  Gorkha: {
    name: 'Gorkha',
    center: [28.0, 84.6333],
    villages: {
      Gorkha: [28.0, 84.6333],
      Manaslu: [28.5497, 84.5597],
    },
  },
  Dhading: {
    name: 'Dhading',
    center: [27.8667, 84.9333],
    villages: {
      Dhading: [27.8667, 84.9333],
    },
  },
  Nuwakot: {
    name: 'Nuwakot',
    center: [27.9097, 85.1644],
    villages: {
      Bidur: [27.9097, 85.1644],
      Trisuli: [27.9547, 85.0153],
    },
  },
  Sindhupalchok: {
    name: 'Sindhupalchok',
    center: [27.95, 85.7],
    villages: {
      Chautara: [27.7833, 85.7167],
      Melamchi: [27.8567, 85.5667],
    },
  },
  Kavre: {
    name: 'Kavre',
    center: [27.5333, 85.5667],
    villages: {
      Dhulikhel: [27.6222, 85.5611],
      Banepa: [27.6292, 85.5228],
    },
  },
}

/**
 * Lookup coordinates for a village/region string.
 * Tries: exact village in given region → village across all regions → region center.
 * Returns null if nothing matches.
 */
export function getCoordinates(
  village: string,
  region?: string,
): [number, number] | null {
  // Exact match in specified region
  if (region && REGIONS[region]) {
    const coords = REGIONS[region].villages[village]
    if (coords) return coords
  }

  // Search all regions for village
  for (const r of Object.values(REGIONS)) {
    if (r.villages[village]) return r.villages[village]
  }

  // Fall back to region center
  if (region && REGIONS[region]) {
    return REGIONS[region].center
  }

  return null
}
