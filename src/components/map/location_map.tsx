"use client"

import dynamic from "next/dynamic"
import type { Drop } from "@/lib/api/types"

type MapLocation = Pick<Drop["location"], "lat" | "lng">

interface Props {
  location: MapLocation
  interactive?: boolean
  onLocationChange?: (location: MapLocation) => void
  className?: string
}

export const LocationMap = dynamic<Props>(
  () => import("./location_map_view"),
  { ssr: false },
)
