import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import { Layers } from 'lucide-react'
import type { MapLocation } from '../../types/map'
import { NEPAL_CENTER, NEPAL_BOUNDS } from '../../data/nepal-locations'

// ---------------------------------------------------------------------------
// Custom SVG marker icons — design system colors
// ---------------------------------------------------------------------------

function pinSvg(fill: string, stroke: string, size: 32 | 28 = 32): string {
  const r = size === 32 ? 6 : 5
  const cy = size === 32 ? 15 : 13
  const h = size === 32 ? 40 : 36
  const half = size / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${h}" viewBox="0 0 ${size} ${h}">
    <path fill="${fill}" stroke="${stroke}" stroke-width="2"
      d="M${half} 0C${half * 0.45} 0 0 ${half * 0.45} 0 ${half}c0 ${half * 0.75} ${half} ${h - half} ${half} ${h - half}s${half}-${h - half * 1.75} ${half}-${h - half}c0-${half * 0.55}-${half * 0.45}-${half}-${half}-${half}z"/>
    <circle cx="${half}" cy="${cy}" r="${r}" fill="white"/>
  </svg>`
}

const MARKER_ICONS: Record<MapLocation['type'], L.Icon> = {
  student: new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(pinSvg('#1B3A5C', '#C4922A'))}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  }),
  ministry: new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(pinSvg('#C4922A', '#1B3A5C'))}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  }),
  village: new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(pinSvg('#2D6A4F', '#E8E3D9', 28))}`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  }),
  other: new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(pinSvg('#6B7280', '#D6D0C4', 28))}`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  }),
}

// ---------------------------------------------------------------------------
// Tile layers
// ---------------------------------------------------------------------------

const TILE_LAYERS = {
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const

type TileLayerKey = keyof typeof TILE_LAYERS

// ---------------------------------------------------------------------------
// Internal helper components
// ---------------------------------------------------------------------------

function FitBounds({
  locations,
  geoJsonData,
}: {
  locations: MapLocation[]
  geoJsonData?: GeoJSON.Feature | GeoJSON.FeatureCollection
}) {
  const map = useMap()

  useEffect(() => {
    if (locations.length > 1) {
      const bounds = locations.map(
        (loc) => [loc.lat, loc.lng] as [number, number],
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    } else if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 10)
    } else if (geoJsonData) {
      // Fit to GeoJSON polygon extents
      const geoLayer = L.geoJSON(geoJsonData)
      map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] })
    } else {
      map.fitBounds(NEPAL_BOUNDS)
    }
  }, [locations, geoJsonData, map])

  return null
}

function TileToggle({
  active,
  onToggle,
}: {
  active: TileLayerKey
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-3 right-3 z-[1000] bg-card border border-border rounded-lg p-2 shadow-sm hover:bg-surface transition-colors"
      title={active === 'topo' ? 'Switch to street view' : 'Switch to topo view'}
    >
      <Layers className="w-5 h-5 text-primary" />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Cluster icon factory
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount() as number
  return L.divIcon({
    html: `<span>${count}</span>`,
    className: 'his-cluster',
    iconSize: L.point(40, 40),
  })
}

// ---------------------------------------------------------------------------
// MapWidget
// ---------------------------------------------------------------------------

const DEFAULT_OVERLAY_STYLE: L.PathOptions = {
  fillColor: '#1B3A5C',
  fillOpacity: 0.08,
  color: '#C4922A',
  weight: 3,
  opacity: 0.8,
}

export interface MapWidgetProps {
  locations: MapLocation[]
  /** CSS height value. Default '500px'. */
  height?: string
  /** Show tile layer toggle. Default true. */
  showControls?: boolean
  /** Enable marker clustering. Default true. */
  cluster?: boolean
  /** GeoJSON overlay (e.g. country boundary). Renders under markers. */
  geoJsonOverlay?: {
    data: GeoJSON.Feature | GeoJSON.FeatureCollection
    style?: L.PathOptions
  }
  /** Called when a marker is clicked. */
  onLocationClick?: (location: MapLocation) => void
  className?: string
}

function MarkerList({
  locations,
  onLocationClick,
}: {
  locations: MapLocation[]
  onLocationClick?: (location: MapLocation) => void
}) {
  return (
    <>
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={MARKER_ICONS[loc.type]}
          eventHandlers={{
            click: () => onLocationClick?.(loc),
          }}
        >
          <Popup>
            <div className="px-3 py-2 min-w-[180px]">
              <p className="font-semibold text-sm text-text-high">{loc.label}</p>
              {loc.details?.region && (
                <p className="text-xs text-text-muted mt-0.5">{loc.details.region}</p>
              )}
              {loc.details?.count != null && (
                <p className="text-xs text-text-muted mt-0.5">
                  {loc.details.count} student{loc.details.count === 1 ? '' : 's'}
                </p>
              )}
              {loc.details?.description && (
                <p className="text-xs text-text-muted mt-1">{loc.details.description}</p>
              )}
              <p className="text-[10px] text-text-disabled mt-1.5 uppercase tracking-wider">
                {loc.type}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default function MapWidget({
  locations,
  height = '500px',
  showControls = true,
  cluster = true,
  geoJsonOverlay,
  onLocationClick,
  className = '',
}: MapWidgetProps) {
  const [tileKey, setTileKey] = useState<TileLayerKey>('street')
  const layer = TILE_LAYERS[tileKey]

  return (
    <div
      className={`relative z-0 rounded-2xl overflow-hidden shadow-sm border border-border ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={NEPAL_CENTER}
        zoom={7}
        className="w-full h-full"
        scrollWheelZoom
        zoomControl
      >
        <TileLayer url={layer.url} attribution={layer.attribution} />
        {geoJsonOverlay && (
          <GeoJSON
            data={geoJsonOverlay.data}
            style={() => geoJsonOverlay.style ?? DEFAULT_OVERLAY_STYLE}
            onEachFeature={(feature, layer) => {
              const name = feature.properties?.name
              if (name) {
                layer.bindTooltip(name, {
                  permanent: true,
                  direction: 'center',
                  className: 'his-country-label',
                })
              }
            }}
          />
        )}
        <FitBounds locations={locations} geoJsonData={geoJsonOverlay?.data} />

        {cluster ? (
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterIcon}
          >
            <MarkerList
              locations={locations}
              onLocationClick={onLocationClick}
            />
          </MarkerClusterGroup>
        ) : (
          <MarkerList
            locations={locations}
            onLocationClick={onLocationClick}
          />
        )}
      </MapContainer>

      {showControls && (
        <TileToggle
          active={tileKey}
          onToggle={() =>
            setTileKey((k) => (k === 'topo' ? 'street' : 'topo'))
          }
        />
      )}
    </div>
  )
}
