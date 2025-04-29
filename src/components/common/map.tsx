'use client'

import {
  MapContainer,
  Marker,
  TileLayer,
  Popup
} from 'react-leaflet'
import type { LatLngExpression, Map, Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { minnesotaData } from '@/data/minnesota'
import { wisconsinData } from '@/data/wisconsin'
import { southDakotaData } from '@/data/south-dakota'
import { southBluffData } from '@/data/south-bluff'
import { westBluffSouthData } from '@/data/west-bluff-south'
import { westBluffCentralData } from '@/data/west-bluff-central'
import { westBluffNorthData } from '@/data/west-bluff-north'
import { eastBluffNorthData } from '@/data/east-bluff-north'
import { eastBluffSouthData } from '@/data/east-bluff-south'
import { eastBluffSouthFaceData } from '@/data/east-bluff-south-face'
import { useState, useEffect, useMemo } from 'react'
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
  icon: Icon
  zIndex: number
}

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

const markers: MarkerData[] = []

const combinedData = [
  ...eastBluffNorthData
  // ...eastBluffSouthData,
  // ...eastBluffSouthFaceData,
  // ...southBluffData,
  // ...westBluffSouthData,
  // ...westBluffCentralData,
  // ...westBluffNorthData
  // ...minnesotaData,
  // ...wisconsinData
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
    route: tempData.Route,
    icon: greenIcon,
    zIndex: 0
  })
})

const minneapolisLongLat: LatLngExpression = [
  43.41921, -89.728
]

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

  const f = useMemo(() => {
    const items = [...visibleMarkers]
    const item = visibleMarkers.findIndex(
      (visibleMarker) =>
        visibleMarker.url === hoveredMarker?.url
    )
    items[item] = {
      ...items[item],
      icon: redIcon,
      zIndex: 100
    }

    return items
  }, [hoveredMarker, visibleMarkers])

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
          zoom={15}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '900px' }}
          ref={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {f.map((data) => {
            return (
              <Marker
                key={data.url}
                position={[data.latitude, data.longitude]}
                icon={data.icon}
                zIndexOffset={data.zIndex}
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
            )
          })}
        </MapContainer>
        <MapList
          visibleMarkers={visibleMarkers}
          setHoveredMarker={setHoveredMarker}
        />
      </div>
    </div>
  )
}
