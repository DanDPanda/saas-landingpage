'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { useState } from 'react'

interface MarkerData {
  latitude: number
  longitude: number
  url: string
  location: string
  rating: string
  stars: number
  route: string | number
}

interface MapListProps {
  setHoveredMarker: (marker: MarkerData | null) => void
  visibleMarkers: MarkerData[]
}

interface TabButtonProps {
  visibleMarker: MarkerData
}

export default function MapList({
  visibleMarkers,
  setHoveredMarker
}: MapListProps) {
  const openInNewTab = (url: string) => {
    const newWindow = window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    )
    if (newWindow) newWindow.opener = null
  }

  const TabButton = ({ visibleMarker }: TabButtonProps) => {
    const [hover, setHover] = useState(false)

    return (
      <div
        key={visibleMarker.url}
        style={{
          border: `1px solid ${hover ? 'red' : 'black'}`,
          color: 'black',
          cursor: 'pointer'
        }}
        onClick={() => {
          openInNewTab(visibleMarker.url)
        }}
        onMouseOver={() => {
          setHover(true)
          setHoveredMarker(visibleMarker)
        }}
        onMouseOut={() => {
          setHover(false)
          setHoveredMarker(null)
        }}
      >
        {visibleMarker.route} ({visibleMarker.stars} stars)
        <br />
        {visibleMarker.location}
        <br />
        {visibleMarker.rating}
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        width: '30%',
        maxHeight: '900px',
        overflowY: 'scroll'
      }}
    >
      {visibleMarkers
        .sort((a, b) => (a.stars > b.stars ? -1 : 1))
        .map((visibleMarker) => (
        <TabButton
          key={visibleMarker.url}
          visibleMarker={visibleMarker}
        />
      ))}
    </div>
  )
}
