'use client'

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  useMap
} from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { minnesotaData } from '@/data/minnesota'
import { wisconsinData } from '@/data/wisconsin'
import { southDakotaData } from '@/data/south-dakota'
import { useState, useEffect } from 'react'

interface MarkerData {
  latitude: number
  longitude: number
  url: string
  location: string
  rating: string
  stars: number
  route: string | number
}

const markers: MarkerData[] = []

const combinedData = [
  ...minnesotaData,
  ...wisconsinData,
  ...southDakotaData
]
combinedData.forEach((data) => {
  const tempData = structuredClone(data)
  while (
    markers.find(
      (marker) =>
        marker.latitude === tempData['Area Latitude'] &&
        marker.longitude === tempData['Area Longitude']
    )
  ) {
    const isPositive = Math.random() >= 0.5
    const direction =
      Math.random() >= 0.5
        ? 'Area Latitude'
        : 'Area Longitude'
    if (isPositive) {
      tempData[direction] += 0.0001
    } else {
      tempData[direction] -= 0.0001
    }
  }
  markers.push({
    latitude: tempData['Area Latitude'],
    longitude: tempData['Area Longitude'],
    url: tempData.URL,
    location: tempData.Location,
    rating: tempData.Rating,
    stars: tempData['Avg Stars'],
    route: tempData.Route
  })
})

const minneapolisLongLat: LatLngExpression = [
  44.9778, -93.265
]

function Test({ setNorthEast, setSouthWest }) {
  const map = useMap()

  useEffect(() => {
    setNorthEast(map.getBounds().getNorthEast())
    setSouthWest(map.getBounds().getSouthWest())
  }, [])
  const mapEvents = useMapEvents({
    zoomend: () => {
      setNorthEast(mapEvents.getBounds().getNorthEast())
      setSouthWest(mapEvents.getBounds().getSouthWest())
    },
    drag: () => {
      setNorthEast(mapEvents.getBounds().getNorthEast())
      setSouthWest(mapEvents.getBounds().getSouthWest())
    }
  })

  return null
}

export default function MyMap() {
  const [northEast, setNorthEast] = useState(null)
  const [southWest, setSouthWest] = useState(null)
  const [visibleMarkers, setVisibleMarkers] = useState<
    MarkerData[]
  >([])

  console.log('visibleMarkers :>> ', visibleMarkers)

  useEffect(() => {
    if (northEast && southWest) {
      const tempVisibleMarkers = markers.filter(
        (marker) => {
          return (
            marker.latitude <= northEast.lat &&
            marker.latitude >= southWest.lat &&
            marker.longitude <= northEast.lng &&
            marker.longitude >= southWest.lng
          )
        }
      )

      setVisibleMarkers(tempVisibleMarkers)
    }
  }, [northEast, southWest])

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'row',
        width: '100%'
      }}
    >
      <MapContainer
        center={minneapolisLongLat}
        zoom={10}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '1000px' }}
      >
        <Test
          setNorthEast={setNorthEast}
          setSouthWest={setSouthWest}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((data) => (
          <Marker
            key={data.url}
            position={[data.latitude, data.longitude]}
          >
            <Popup>
              <>
                {data.route}
                <br />
                {data.location}
                <br />
                {data.rating}
                <br />
                <a href={data.url}>Link</a>
              </>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div
        style={{
          backgroundColor: 'white',
          width: '30%'
        }}
      >
        {visibleMarkers.map((visibleMarker) => (
          <div
            key={visibleMarker.url}
            style={{
              border: '1px solid black',
              color: 'black'
            }}
          >
            {visibleMarker.route}
            <br />
            {visibleMarker.location}
            <br />
            {visibleMarker.rating}
            <br />
            <a href={visibleMarker.url}>Link</a>
          </div>
        ))}
      </div>
    </div>
  )
}
