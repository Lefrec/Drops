'use client'

import { useGeolocation } from "@/lib/use_geoloc"
import { useEffect, useState } from "react"

export function LocationField() {
    const { status, coords, locate } = useGeolocation()
    const [lat, setLat] = useState("47.49561")
    const [lng, setLng] = useState("6.80544")

    useEffect(() => {
        if (coords) {
            setLat(coords.lat.toFixed(6))
            setLng(coords.lng.toFixed(6))
        }
    }, [coords])

    return (
        <div className="flex flex-col gap-2">
            <label>
                Latitude
                <input
                    name="lat"
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />
            </label>
            <label>
                Longitude
                <input
                    name="lng"
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                />
            </label>
            <button type="button" onClick={locate} disabled={status === "loading"}>
                {status === "loading" ? "Localisation..." : "Utiliser ma position"}
            </button>
            {status === "denied" && (
                <p role="status">L’accès à votre position a été refusé.</p>
            )}
            {status === "unavailable" && (
                <p role="status">La géolocalisation n’est pas disponible sur ce navigateur.</p>
            )}
            {status === "error" && (
                <p role="status">Impossible de récupérer votre position.</p>
            )}
            {status === "success" && (
                <p role="status">Position récupérée.</p>
            )}
        </div>
    )
}