'use server'

import { apiDelete, apiPost } from "@/lib/api/client"
import { requireSession } from "@/lib/session"
import { refresh } from "next/cache"
import { ApiError } from "next/dist/server/api-utils"

export async function toggleLike(dropId: number, liked: boolean) {
    await requireSession()

    try {
        if (liked) await apiDelete(`/drops/${dropId}/like`, await requireSession())
        else await apiPost(`/drops/${dropId}/like`, await requireSession())
    } catch (e) {
        if (e instanceof ApiError) return {error: e.message}
        throw e
    }

    refresh()
    return {}
}

export async function addComment(dropId: number, formData: FormData): Promise<{ error?: string }> {
    const content = formData.get("content")
    if (typeof content !== "string" || !content.trim()) {
        return { error: "Écrivez un commentaire avant de l’envoyer." }
    }

    try {
        await apiPost(`/drops/${dropId}/comments`, await requireSession(), { content: content.trim() })
    } catch (e) {
        if (e instanceof ApiError) return { error: e.message }
        throw e
    }

    refresh()
    return {}
}