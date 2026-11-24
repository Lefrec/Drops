'use client'

import { useEffect } from 'react';
import { retain, subscribe } from '@/lib/realtime';
import { toast } from "@/components/ui/toast"

export function useNotification() {
    useEffect(() => {
        const stopNotif = subscribe("notification", (data) => {
            console.log(data)

            toast.add({
                title: `${(data.kind === "drop_liked") ? 'Nouveau like' : ''}${(data.kind === "drop_commented") ? 'Nouveau Commentaire' : ''}`,
                description: `${data.by.username} ${(data.kind === "drop_liked") ? 'a liké' : ''} ${(data.kind === "drop_commented") ? 'a commenté' : ''} votre drop ${data.dropTitle}`,
                type: "info",
            })
        })

        const release = retain()

        return () => {
            stopNotif()
            release()
        }
    }, [])
}