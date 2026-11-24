'use client'
import dynamic from "next/dynamic"

export const DropsMap = dynamic(
    () => import('./drops_map_view'),
    {ssr: false}
)