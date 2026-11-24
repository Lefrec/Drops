'use client'

import { DropPage } from '@/lib/api/types'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

const NORMAL = { radius: 8, color: '#3CB371', weight: 2 }
const ACTIVE = { radius: 12, color: '#00FA9A', weight: 3 }

interface Props {
    drops: DropPage
    activeId: number
    onSelect: any
}

export default function DropsMapView({ drops, activeId, onSelect }: Props) {
    const container = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)
    const layer = useRef<L.LayerGroup | null>(null)
    const markers = useRef(new Map<number, L.CircleMarker>())
    const onSelectRef = useRef(onSelect)

    useEffect(() => {
        onSelectRef.current = onSelect
    })

    useEffect(() => {
        const map = L.map(container.current!).setView([47.49, 6.80], 10)
        L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.png', {
	        minZoom: 0,
	        maxZoom: 20,
	        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)
        mapRef.current = map
        layer.current = L.layerGroup().addTo(map)

        return () => {
            map.remove()
            mapRef.current = null
            layer.current = null
        }
    }, [])

    useEffect(() => {
        const map = mapRef.current
        const group = layer.current
        if (!map || !group) return

        group.clearLayers()
        markers.current.clear()

        for (const d of drops.items) {
            const m = L.circleMarker([d.location.lat, d.location.lng], NORMAL)
                .bindTooltip(d.title)
                .on('click', () => onSelectRef.current(d.id))
                .addTo(group)
            markers.current.set(d.id, m)
        }

        if (drops.items.length > 0) {
            const pts: LatLngExpression[] = drops.items.map((d) => [d.location.lat, d.location.lng])
            map.fitBounds(L.latLngBounds(pts), { padding: [32, 32], maxZoom:16})
        }
    }, [drops])

    useEffect(() => {
        if (activeId === null) return

        const m = markers.current.get(activeId)
        m?.setStyle(ACTIVE).bringToFront()
        return () => {
            m?.setStyle(NORMAL)
        }
    }, [activeId, drops])

    return (
        <div ref={container} className='h-full w-full' />
    )
}