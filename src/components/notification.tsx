'use client'

import { useRealtimeEvent } from "@/hooks/user-realtime-event"
import { toast } from "@/components/ui/toast"
import type { Notification } from "@/lib/api/types"

export function Notification() {
  useRealtimeEvent<Notification>('notification', (data) => {
    if (data.kind !== "drop_liked" && data.kind !== "drop_commented") return

    toast.add({
      title: data.kind === "drop_liked" ? "Nouveau like" : "Nouveau commentaire",
      description: data.kind === "drop_liked"
        ? `${data.by.displayName} a aimé votre drop « ${data.dropTitle} ».`
        : `${data.by.displayName} a ajouté un commentaire sur votre drop « ${data.dropTitle} ».`,
      type: "info",
    })
  })

  return (
    <></>
  )
}