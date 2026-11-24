'use client'

import { useRealtimeEvent } from "@/hooks/user-realtime-event"
import { toast } from "@/components/ui/toast"
import type { Notification } from "@/lib/api/types"

export function Notification() {
  useRealtimeEvent<Notification>('notification', (data) => {
    toast.add({
                title: `${(data.kind === "drop_liked") ? 'Nouveau like' : ''}${(data.kind === "drop_commented") ? 'Nouveau Commentaire' : ''}`,
                description: `${data.by.displayName} ${(data.kind === "drop_liked") ? 'a liké' : ''} ${(data.kind === "drop_commented") ? 'a commenté' : ''} votre drop ${data.dropTitle}`,
                type: "info",
            })
  })

  return (
    <></>
  )
}