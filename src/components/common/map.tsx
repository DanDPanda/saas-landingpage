'use client'

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup
} from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { minnesotaData } from '@/data/minnesota'
import { wisconsinData } from '@/data/wisconsin'
import { southDakotaData } from '@/data/south-dakota'

interface MarkerData {
  latitude: number
  longitude: number
  url: string
  location: string
  rating: string
  stars: number
  route: string | number
}

export default function MyMap() {
  const markers: MarkerData[] = []
  const combined = [
    ...minnesotaData,
    ...wisconsinData,
    ...southDakotaData
  ]
  combined.forEach((data) => {
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

  return (
    <MapContainer
      center={minneapolisLongLat}
      zoom={10}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '1000px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((data) => (
        <Marker
          key={data.route}
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
  )
}
