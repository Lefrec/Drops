"use client"

import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useRef } from "react"
import type { Drop } from "@/lib/api/types"

type MapLocation = Pick<Drop["location"], "lat" | "lng">

interface Props {
  location: MapLocation
  interactive?: boolean
  onLocationChange?: (location: MapLocation) => void
  className?: string
}

const MARKER_STYLE = { radius: 8, color: "#3CB371", weight: 2 }

export default function LocationMapView({
  location,
  interactive = false,
  onLocationChange,
  className,
}: Props) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.CircleMarker | null>(null)
  const onLocationChangeRef = useRef(onLocationChange)

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange
  }, [onLocationChange])

  useEffect(() => {
    const element = container.current
    if (!element) return

    const map = L.map(element, {
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      touchZoom: interactive,
    }).setView([47.49561, 6.80544], 17)

    L.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.png", {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const marker = L.circleMarker([location.lat, location.lng], MARKER_STYLE).addTo(map)
    if (interactive) {
      map.on("click", (event) => {
        const nextLocation = { lat: event.latlng.lat, lng: event.latlng.lng }
        marker.setLatLng(event.latlng)
        onLocationChangeRef.current?.(nextLocation)
      })
    }

    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(element)
    mapRef.current = map
    markerRef.current = marker

    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [interactive])

  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker) return

    const point: L.LatLngExpression = [location.lat, location.lng]
    marker.setLatLng(point)
    map.setView(point, map.getZoom())
  }, [location])

  return (
    <div
      ref={container}
      className={`relative z-0 isolate ${className ?? ""}`}
      role="img"
      aria-label="Carte indiquant l’emplacement du drop"
    />
  )
}
