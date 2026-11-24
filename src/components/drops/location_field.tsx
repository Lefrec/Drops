'use client'

import { useGeolocation } from "@/lib/use_geoloc"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { LocationMap } from "@/components/map/location_map"

interface Props {
    errors?: Record<string, string[]>
    initialLocation?: { lat: number; lng: number }
    idPrefix?: string
    mapClassName?: string
    showLocateButton?: boolean
}

export function LocationField({
    errors = {},
    initialLocation = { lat: 47.49561, lng: 6.80544 },
    idPrefix = "drop",
    mapClassName = "h-64 w-full overflow-hidden rounded-md border border-border",
    showLocateButton = true,
}: Props) {
    const { status, coords, locate } = useGeolocation()
    const [lat, setLat] = useState(initialLocation.lat.toString())
    const [lng, setLng] = useState(initialLocation.lng.toString())
    const [location, setLocation] = useState(initialLocation)

    const selectLocation = useCallback((nextLocation: { lat: number; lng: number }) => {
        setLocation(nextLocation)
        setLat(nextLocation.lat.toFixed(6))
        setLng(nextLocation.lng.toFixed(6))
    }, [])

    function updateCoordinate(axis: "lat" | "lng", value: string) {
        if (axis === "lat") setLat(value)
        else setLng(value)

        if (!value.trim()) return
        const coordinate = Number(value)
        const limit = axis === "lat" ? 90 : 180
        if (!Number.isFinite(coordinate) || Math.abs(coordinate) > limit) return

        setLocation((current) => ({ ...current, [axis]: coordinate }))
    }

    useEffect(() => {
        if (coords) {
            selectLocation(coords)
        }
    }, [coords, selectLocation])

    return (
        <FieldGroup>
            <Field>
                <FieldLabel>Emplacement</FieldLabel>
                <LocationMap
                    location={location}
                    interactive
                    onLocationChange={selectLocation}
                    className={mapClassName}
                />
                <FieldDescription>Cliquez sur la carte pour placer le drop.</FieldDescription>
            </Field>
            <Field>
                <FieldLabel htmlFor={`${idPrefix}-latitude`}>Latitude</FieldLabel>
                <input
                    id={`${idPrefix}-latitude`}
                    name="lat"
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => updateCoordinate("lat", e.target.value)}
                    required
                    aria-invalid={Boolean(errors.lat || errors.location)}
                />
                <FieldError>{errors.lat?.join(" ") || errors.location?.join(" ")}</FieldError>
            </Field>
            <Field>
                <FieldLabel htmlFor={`${idPrefix}-longitude`}>Longitude</FieldLabel>
                <input
                    id={`${idPrefix}-longitude`}
                    name="lng"
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => updateCoordinate("lng", e.target.value)}
                    required
                    aria-invalid={Boolean(errors.lng || errors.location)}
                />
                <FieldError>{errors.lng?.join(" ")}</FieldError>
            </Field>
            {showLocateButton && (
                <>
                    <Button type="button" onClick={locate} disabled={status === "loading"}>
                        {status === "loading" ? "Localisation..." : "Utiliser ma position"}
                    </Button>
                    {status === "denied" && (
                        <FieldDescription role="status">L’accès à votre position a été refusé.</FieldDescription>
                    )}
                    {status === "unavailable" && (
                        <FieldDescription role="status">La géolocalisation n’est pas disponible sur ce navigateur.</FieldDescription>
                    )}
                    {status === "error" && (
                        <FieldDescription role="status">Impossible de récupérer votre position.</FieldDescription>
                    )}
                    {status === "success" && (
                        <FieldDescription role="status">Position récupérée.</FieldDescription>
                    )}
                </>
            )}
        </FieldGroup>
    )
}