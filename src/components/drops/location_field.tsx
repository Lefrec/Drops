'use client'

import { useGeolocation } from "@/lib/use_geoloc"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

export function LocationField({ errors = {} }: { errors?: Record<string, string[]> }) {
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
        <FieldGroup>
            <Field>
                <FieldLabel htmlFor="drop-latitude">Latitude</FieldLabel>
                <input
                    id="drop-latitude"
                    name="lat"
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                    aria-invalid={Boolean(errors.lat || errors.location)}
                />
                <FieldError>{errors.lat?.join(" ") || errors.location?.join(" ")}</FieldError>
            </Field>
            <Field>
                <FieldLabel htmlFor="drop-longitude">Longitude</FieldLabel>
                <input
                    id="drop-longitude"
                    name="lng"
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                    aria-invalid={Boolean(errors.lng || errors.location)}
                />
                <FieldError>{errors.lng?.join(" ")}</FieldError>
            </Field>
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
        </FieldGroup>
    )
}