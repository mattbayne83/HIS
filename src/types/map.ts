export interface MapLocation {
  id: string
  lat: number
  lng: number
  label: string
  type: 'student' | 'ministry' | 'village' | 'other'
  details?: {
    region?: string
    count?: number
    description?: string
  }
}

export interface NepalRegion {
  name: string
  center: [number, number]
  villages: Record<string, [number, number]>
}
