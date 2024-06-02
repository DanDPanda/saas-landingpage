'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import Checkbox from '@mui/material/Checkbox'

interface MarkerData {
  latitude: number
  longitude: number
  url: string
  location: string
  rating: string
  stars: number
  route: string | number
}

interface Props {
  visibleMarkers: MarkerData[]
  isStarFilterOn: boolean
  setIsStarFilterOn: (bool: boolean) => void
  markers: MarkerData[]
  setCurrentMarkers: (markers: MarkerData[]) => void
}

export default function MapHeader({
  visibleMarkers,
  isStarFilterOn,
  setIsStarFilterOn,
  markers,
  setCurrentMarkers
}: Props) {
  return (
    <div
      style={{
        width: '100%'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid black',
          color: 'black',
          width: '100%'
        }}
      >
        Visible Markers: {visibleMarkers.length} | 3.5+
        Filter:
        <Checkbox
          value={'3.5+'}
          onChange={() => {
            if (isStarFilterOn) {
              setIsStarFilterOn(false)
              setCurrentMarkers(markers)
            } else {
              setIsStarFilterOn(true)
              setCurrentMarkers(
                markers.filter(
                  (marker) => marker.stars >= 3.5
                )
              )
            }
          }}
        />
      </div>
    </div>
  )
}
