"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { DropCard } from "@/components/drops/drop_card"
import { useRealtimeEvent } from "@/hooks/user-realtime-event"
import type { Drop } from "@/lib/api/types"

export function LiveDropList({
  initialDrops,
  pageSize,
  query,
  category,
}: {
  initialDrops: Drop[]
  pageSize: number
  query: string
  category?: string
}) {
  const [drops, setDrops] = useState(initialDrops)
  const router = useRouter()
  const initialStateKey = JSON.stringify({ initialDrops, pageSize, query, category })
  const appliedInitialStateKey = useRef(initialStateKey)

  useEffect(() => {
    if (appliedInitialStateKey.current === initialStateKey) return
    appliedInitialStateKey.current = initialStateKey
    setDrops(initialDrops)
  }, [initialDrops, initialStateKey])

  useRealtimeEvent<{ drop: Drop }>("drop:created", ({ drop }) => {
    if (drop.hidden || (category && drop.category !== category)) return

    if (query) {
      router.refresh()
      return
    }

    setDrops((current) => {
      if (current.some((item) => item.id === drop.id)) return current
      return [drop, ...current].slice(0, pageSize)
    })
  })

  useRealtimeEvent<{ dropId: number }>("drop:deleted", ({ dropId }) => {
    if (!drops.some((drop) => drop.id === dropId)) return

    setDrops((current) => current.filter((drop) => drop.id !== dropId))
  })

  if (drops.length === 0) {
    return <p>Aucun drop trouvé.</p>
  }

  return (
    <ul>
      {drops.map((drop) => (
        <li key={drop.id}>
          <DropCard drop={drop} />
        </li>
      ))}
    </ul>
  )
}
