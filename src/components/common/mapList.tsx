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
  visibleMarkers: MarkerData[]
}

interface TabButtonProps {
  visibleMarker: MarkerData
}

export default function MapList({
  visibleMarkers
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
          color: 'black'
        }}
        onClick={() => {
          openInNewTab(visibleMarker.url)
        }}
        onMouseEnter={() => {
          setHover(true)
        }}
        onMouseLeave={() => {
          setHover(false)
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
        overflowY: 'scroll',
        cursor: 'pointer'
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
