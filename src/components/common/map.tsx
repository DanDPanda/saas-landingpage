'use client'

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup
} from 'react-leaflet'
import type { LatLngExpression, Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { minnesotaData } from '@/data/minnesota'
import { wisconsinData } from '@/data/wisconsin'
import { southDakotaData } from '@/data/south-dakota'
import { useState, useEffect } from 'react'
import MapList from './mapList'
import MapHeader from './mapHeader'
import * as L from 'leaflet'

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

const greenIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function MapComponent() {
  const [map, setMap] = useState<Map | null>(null)
  const [hoveredMarker, setHoveredMarker] =
    useState<MarkerData | null>(null)
  const [currentMarkers, setCurrentMarkers] =
    useState(markers)
  const [visibleMarkers, setVisibleMarkers] = useState<
    MarkerData[]
  >([])

  const recalculateMarkers = (m: Map) => {
    const mapBounds = m.getBounds()
    const northEast = mapBounds.getNorthEast()
    const southWest = mapBounds.getSouthWest()
    const tempVisibleMarkers = currentMarkers.filter(
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

  map?.on('zoom', () => {
    recalculateMarkers(map)
  })
  map?.on('resize', () => {
    recalculateMarkers(map)
  })
  map?.on('drag', () => {
    recalculateMarkers(map)
  })

  useEffect(() => {
    if (map) {
      recalculateMarkers(map)
    }
  }, [map, currentMarkers])

  return (
    <div
      style={{
        width: '100%'
      }}
    >
      <MapHeader
        visibleMarkers={visibleMarkers}
        markers={markers}
        setCurrentMarkers={setCurrentMarkers}
      />
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
          scrollWheelZoom={true}
          style={{ width: '100%', height: '900px' }}
          ref={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {currentMarkers.map((data) =>
            data.url !== hoveredMarker?.url ? (
              <Marker
                key={data.url}
                position={[data.latitude, data.longitude]}
                icon={greenIcon}
              >
                <Popup>
                  <>
                    {data.route} ({data.stars})
                    <br />
                    {data.location}
                    <br />
                    {data.rating}
                    <br />
                    <a href={data.url}>Link</a>
                  </>
                </Popup>
              </Marker>
            ) : null
          )}
          {hoveredMarker && (
            <Marker
              key={hoveredMarker.url}
              position={[
                hoveredMarker.latitude,
                hoveredMarker.longitude
              ]}
              icon={redIcon}
            >
              <Popup>
                <>
                  {hoveredMarker.route} (
                  {hoveredMarker.stars}
                  )
                  <br />
                  {hoveredMarker.location}
                  <br />
                  {hoveredMarker.rating}
                  <br />
                  <a href={hoveredMarker.url}>Link</a>
                </>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        <MapList
          visibleMarkers={visibleMarkers}
          setHoveredMarker={setHoveredMarker}
        />
      </div>
    </div>
  )
}
